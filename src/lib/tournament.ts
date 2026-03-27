"use server"

import { createServerClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { calculateTournamentPoints } from "@/lib/utils"
import { unstable_noStore as noStore } from "next/cache"


export interface LeaderboardEntry {
  id: string
  name: string
  points: number
  profile_image?: string
  specialization?: string
  isCurrentUser?: boolean
}

export interface UserTournamentStats {
  username: string
  profileImage?: string
  specialization?: string
  rank: number
  totalPoints: number
  totalQuizzes: number
  averageScore: number
  bestScore: number
  accuracy: number
  level: number
  totalParticipants: number
}

interface QuizDataEntry {
  quiz_id: number
  auth_id: string
  score: number | null
  quiz_level: number
  duration_selected: string | null
  answering_mode: string | null
  how_finished: string | null
  total_questions: number | null
  solved_at: string
}

export async function getLeaderboardData(level: 1 | 2 | 3): Promise<{
  leaderboard: LeaderboardEntry[]
  currentUserEntry?: LeaderboardEntry
}> {
  noStore()
  try {
    const supabase = await createServerClient()

    // Get current user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    let currentAuthId: string | null = null
    let currentUsername: string | null = null

    if (!authError && user && user.email) {
      // Get user profile from chameleons table using email (this is how the auth system links users)
      const { data: userProfile, error: profileError } = await supabase
        .from("chameleons")
        .select("auth_id, username, profile_image")
        .eq("email", user.email)
        .single()

      if (!profileError && userProfile) {
        currentAuthId = userProfile.auth_id
        currentUsername = userProfile.username
      }
    }

    // DEBUG: Log the date range we're querying
    const tournamentStart = new Date('2025-10-11T00:00:00.000Z') // Changed to October 11, 2025
    const tournamentEnd = new Date('2026-06-30T23:59:59.999Z') // End of June 30th, 2026
    
    console.log(`Querying level ${level} from ${tournamentStart.toISOString()} to ${tournamentEnd.toISOString()}`)

    console.log(`Tournament date range: ${tournamentStart.toISOString()} to ${tournamentEnd.toISOString()}`)
    console.log(`Looking for level ${level} quizzes with non-null scores in this date range`)
    
    // Fetch ALL data using pagination to bypass Supabase's 1000 row limit
    // This ensures we get all tournament data even if there are more than 1000 quiz entries
    let allQuizData: QuizDataEntry[] = []
    let page = 0
    const pageSize = 1000
    const maxPages = 100 // Safety limit: max 100,000 rows (increase if needed)
    let hasMore = true
    
    while (hasMore && page < maxPages) {
      const { data: pageData, error: pageError } = await supabase
        .from("quiz_data")
        .select(`
          quiz_id,
          auth_id,
          score,
          quiz_level,
          duration_selected,
          answering_mode,
          how_finished,
          total_questions,
          solved_at
        `)
        .eq("quiz_level", level)
        .not("score", "is", null)
        .gte("solved_at", tournamentStart.toISOString())
        .lte("solved_at", tournamentEnd.toISOString())
        .order("solved_at", { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1)
      
      if (pageError) {
        console.error(`Error fetching page ${page}:`, pageError)
        break
      }
      
      if (!pageData || pageData.length === 0) {
        hasMore = false
      } else {
        allQuizData = [...allQuizData, ...pageData]
        console.log(`Fetched page ${page + 1}: ${pageData.length} rows (total so far: ${allQuizData.length})`)
        
        if (pageData.length < pageSize) {
          hasMore = false
        }
        page++
      }
    }
    
    if (page >= maxPages) {
      console.warn(`⚠️ Reached maximum page limit (${maxPages} pages). Some data might be missing. Consider using RPC function for better performance.`)
    }
    
    const quizData = allQuizData
    console.log(`Total quiz entries fetched for level ${level}: ${quizData.length}`)

    if (!quizData || quizData.length === 0) {
      console.log("No quiz data found for the specified date range and level")
      return { leaderboard: [] }
    }

    // Get unique auth IDs from quiz data
    const authIds = [...new Set(quizData.map(entry => entry.auth_id))]
    
    console.log(`DEBUG: Found ${authIds.length} unique auth_ids in quiz data for level ${level}:`, authIds.slice(0, 5))

    // Fetch user profiles in batches to avoid URL-too-long errors and timeouts
    // The .in() query can fail with 700+ IDs, so we batch in groups of 50
    const adminSupabase = createAdminClient()
    const BATCH_SIZE = 50
    const allProfiles: { auth_id: string; username: string; profile_image?: string | null; specialization?: string | null }[] = []
    
    console.log(`DEBUG: Fetching user profiles in batches of ${BATCH_SIZE}...`)
    
    for (let i = 0; i < authIds.length; i += BATCH_SIZE) {
      const batchIds = authIds.slice(i, i + BATCH_SIZE)
      try {
        const { data: batchProfiles, error: batchError } = await adminSupabase
          .from("chameleons")
          .select("auth_id, username, profile_image, specialization")
          .in("auth_id", batchIds)
        
        if (batchError) {
          console.error(`DEBUG: Error fetching batch ${i / BATCH_SIZE + 1}:`, batchError.message)
        } else if (batchProfiles) {
          allProfiles.push(...batchProfiles)
        }
      } catch (err) {
        console.error(`DEBUG: Exception in batch ${i / BATCH_SIZE + 1}:`, err)
      }
    }
    
    const userProfiles = allProfiles
    console.log(`DEBUG: Fetched ${userProfiles.length} user profiles from chameleons table in ${Math.ceil(authIds.length / BATCH_SIZE)} batches`)
    
    if (userProfiles.length > 0) {
      console.log(`DEBUG: Sample user profile:`, userProfiles[0])
    }

    // Create a map of auth_id to user profile
    const userProfileMap = new Map<string, { username: string; profile_image?: string; specialization?: string }>()
    if (userProfiles) {
      userProfiles.forEach(profile => {
        userProfileMap.set(profile.auth_id, {
          username: profile.username,
          profile_image: profile.profile_image || undefined,
          specialization: profile.specialization || undefined
        })
      })
    }

    
    console.log(`DEBUG: Created userProfileMap with ${userProfileMap.size} entries`)


    // Group by user and calculate total points from all quizzes
    const userTotalScores = new Map<string, {
      authId: string
      username: string
      profile_image?: string
      specialization?: string
      totalPoints: number
      quizCount: number
      earliestQuizTime: Date
    }>()

    // Track first attempt for each quiz per user
    const userQuizFirstAttempt = new Map<string, QuizDataEntry>()

    // First pass: identify first attempt for each quiz_id per auth_id
    quizData.forEach((entry: QuizDataEntry) => {
      const key = `${entry.auth_id}_${entry.quiz_id}`
      const existing = userQuizFirstAttempt.get(key)
      
      // Keep the earliest attempt (oldest solved_at timestamp)
      if (!existing || new Date(entry.solved_at) < new Date(existing.solved_at)) {
        userQuizFirstAttempt.set(key, entry)
      }
    })

    console.log(`First attempts found: ${userQuizFirstAttempt.size} unique quiz attempts`)

    // Second pass: calculate points only for first attempts
    userQuizFirstAttempt.forEach((entry: QuizDataEntry) => {
      const authId = entry.auth_id
      const userProfile = userProfileMap.get(authId)
      
      // NOTE: We already filter by quiz_level in the query (line 99)
      // So all entries here are for the correct level - no need to check current_level
      // This allows users who changed levels to still appear in their historical quiz data
      
      // Get user info from profile if available, otherwise use defaults
      const username = userProfile?.username || `User ${authId.substring(0, 8)}`
      const profile_image = userProfile?.profile_image
      const specialization = userProfile?.specialization


      
      const rawPoints = calculateTournamentPoints(
        entry.score || 0,
        entry.duration_selected || "15 minutes",
        entry.answering_mode || "traditional",
        entry.how_finished || "completed",
        entry.total_questions || 10
      )

      // Reduce points by dividing by 10 and rounding
      const points = Math.round(rawPoints / 10)

      console.log(`Adding points for ${username}: quiz_id=${entry.quiz_id}, quiz_level=${entry.quiz_level}, score=${entry.score}, duration=${entry.duration_selected}, mode=${entry.answering_mode}, finished=${entry.how_finished} => ${rawPoints} raw points / 10 = ${points} points (FIRST ATTEMPT)`)

      const quizTime = new Date(entry.solved_at)

      if (!userTotalScores.has(authId)) {
        userTotalScores.set(authId, {
          authId,
          username,
          profile_image,
          specialization,
          totalPoints: points,
          quizCount: 1,
          earliestQuizTime: quizTime
        })
      } else {
        const existing = userTotalScores.get(authId)!
        existing.totalPoints += points
        existing.quizCount += 1
        // Track the earliest quiz time for tiebreaker
        if (quizTime < existing.earliestQuizTime) {
          existing.earliestQuizTime = quizTime
        }
      }
    })

    console.log(`Processed ${userTotalScores.size} unique users for level ${level}`)

    // Convert to array and sort by total points descending, with earliestQuizTime as tiebreaker
    // First come, first served: if points are equal, earlier quiz time wins
    const sortedUsers = Array.from(userTotalScores.values())
      .sort((a, b) => {
        // Primary sort: by points (descending)
        if (b.totalPoints !== a.totalPoints) {
          return b.totalPoints - a.totalPoints
        }
        // Secondary sort (tiebreaker): by earliest quiz time (ascending - earlier is better)
        return a.earliestQuizTime.getTime() - b.earliestQuizTime.getTime()
      })
      .slice(0, 10)
      .map((user) => ({
        id: user.authId,
        name: user.username,
        profile_image: user.profile_image,
        specialization: user.specialization,
        points: user.totalPoints,
        isCurrentUser: user.authId === currentAuthId
      }))

    // Always find and return the current user's entry if they have participated
    // This ensures the frontend always has access to the current user's data
    let currentUserEntry: LeaderboardEntry | undefined
    if (currentAuthId && currentUsername) {
      // First check if user is in the top 10
      const userInTop10 = sortedUsers.find(u => u.isCurrentUser)
      if (userInTop10) {
        currentUserEntry = userInTop10
      } else {
        // User not in top 10, but may have participated
        const currentUserData = userTotalScores.get(currentAuthId)
        if (currentUserData) {
          currentUserEntry = {
            id: currentUserData.authId,
            name: currentUserData.username,
            profile_image: currentUserData.profile_image,
            specialization: currentUserData.specialization,
            points: currentUserData.totalPoints,
            isCurrentUser: true
          }
        }
      }
    }

    return {
      leaderboard: sortedUsers,
      currentUserEntry
    }
  } catch (error) {
    console.error("Error in getLeaderboardData:", error)
    return { leaderboard: [] }
  }
}

async function getPublicLeaderboardData(supabase: Awaited<ReturnType<typeof createServerClient>>, level: 1 | 2 | 3): Promise<{
  leaderboard: LeaderboardEntry[]
  currentUserEntry?: LeaderboardEntry
}> {
  noStore()
  // Use the same date range - Updated to October 11, 2025
  const tournamentStart = new Date('2025-10-11T00:00:00.000Z')
  const tournamentEnd = new Date('2026-06-30T23:59:59.999Z')

  // Fetch ALL data using pagination
  let allQuizData: QuizDataEntry[] = []
  let page = 0
  const pageSize = 1000
  let hasMore = true
  
  while (hasMore) {
    const { data: pageData, error: pageError } = await supabase
      .from("quiz_data")
      .select(`
        quiz_id,
        auth_id,
        score,
        quiz_level,
        duration_selected,
        answering_mode,
        how_finished,
        total_questions,
        solved_at
      `)
      .eq("quiz_level", level)
      .not("score", "is", null)
      .gte("solved_at", tournamentStart.toISOString())
      .lte("solved_at", tournamentEnd.toISOString())
      .order("solved_at", { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1)
    
    if (pageError) {
      console.error(`Error fetching page ${page}:`, pageError)
      break
    }
    
    if (!pageData || pageData.length === 0) {
      hasMore = false
    } else {
      allQuizData = [...allQuizData, ...pageData]
      
      if (pageData.length < pageSize) {
        hasMore = false
      }
      page++
    }
  }
  
  const quizData = allQuizData

  if (!quizData || quizData.length === 0) {
    return { leaderboard: [] }
  }

  // Get unique auth IDs from quiz data
  const authIds = [...new Set(quizData.map(entry => entry.auth_id))]

  // Fetch user profiles for all users in the quiz data
  const { data: userProfiles } = await supabase
    .from("chameleons")
    .select("auth_id, username, profile_image, current_level, specialization")
    .in("auth_id", authIds)

  // Create a map of auth_id to user profile
  const userProfileMap = new Map<string, { username: string; profile_image?: string; current_level: number; specialization?: string }>()
  if (userProfiles) {
    userProfiles.forEach(profile => {
      userProfileMap.set(profile.auth_id, {
        username: profile.username,
        profile_image: profile.profile_image,
        current_level: profile.current_level,
        specialization: profile.specialization
      })
    })
  }

  // Group by user and calculate total points from all quizzes
  const userTotalScores = new Map<string, {
    authId: string
    username: string
    profile_image?: string
    specialization?: string
    totalPoints: number
    earliestQuizTime: Date
  }>()

  // Track first attempt for each quiz per user
  const userQuizFirstAttempt = new Map<string, QuizDataEntry>()

  // First pass: identify first attempt for each quiz_id per auth_id
  quizData.forEach((entry: QuizDataEntry) => {
    const key = `${entry.auth_id}_${entry.quiz_id}`
    const existing = userQuizFirstAttempt.get(key)
    
    // Keep the earliest attempt (oldest solved_at timestamp)
    if (!existing || new Date(entry.solved_at) < new Date(existing.solved_at)) {
      userQuizFirstAttempt.set(key, entry)
    }
  })

  // Second pass: calculate points only for first attempts
  userQuizFirstAttempt.forEach((entry: QuizDataEntry) => {
    const authId = entry.auth_id
    const userProfile = userProfileMap.get(authId)
    
    // Only count quizzes where the quiz level matches the user's current level
    if (!userProfile || userProfile.current_level !== entry.quiz_level) {
      return // Skip this quiz entry
    }
    
    const username = userProfile?.username || `User ${authId}`
    const profile_image = userProfile?.profile_image
    const specialization = userProfile?.specialization
    const rawPoints = calculateTournamentPoints(
      entry.score || 0,
      entry.duration_selected || "15 minutes",
      entry.answering_mode || "traditional",
      entry.how_finished || "completed",
      entry.total_questions || 10
    )

    // Reduce points by dividing by 10 and rounding
    const points = Math.round(rawPoints / 10)

    const quizTime = new Date(entry.solved_at)

    if (!userTotalScores.has(authId)) {
      userTotalScores.set(authId, {
        authId,
        username,
        profile_image,
        specialization,
        totalPoints: points,
        earliestQuizTime: quizTime
      })
    } else {
      const existing = userTotalScores.get(authId)!
      existing.totalPoints += points
      // Track the earliest quiz time for tiebreaker
      if (quizTime < existing.earliestQuizTime) {
        existing.earliestQuizTime = quizTime
      }
    }
  })

  // Convert to array and sort by total points descending, with earliestQuizTime as tiebreaker
  // First come, first served: if points are equal, earlier quiz time wins
  const sortedUsers = Array.from(userTotalScores.values())
    .sort((a, b) => {
      // Primary sort: by points (descending)
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints
      }
      // Secondary sort (tiebreaker): by earliest quiz time (ascending - earlier is better)
      return a.earliestQuizTime.getTime() - b.earliestQuizTime.getTime()
    })
    .slice(0, 10)
    .map((user) => ({
      id: user.authId,
      name: user.username,
      profile_image: user.profile_image,
      specialization: user.specialization,
      points: user.totalPoints,
      isCurrentUser: false
    }))

  return {
    leaderboard: sortedUsers
  }
}

export async function getUserTournamentStats(authId: string, level: 1 | 2 | 3): Promise<UserTournamentStats | null> {
  noStore()
  try {
    const supabase = await createServerClient()

    // Tournament date range
    const tournamentStart = new Date('2025-10-11T00:00:00.000Z')
    const tournamentEnd = new Date('2026-06-30T23:59:59.999Z')

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from("chameleons")
      .select("username, profile_image, specialization")
      .eq("auth_id", authId)
      .single()

    if (profileError || !userProfile) {
      console.error("Error fetching user profile:", profileError)
      return null
    }

    // Fetch user's quiz data
    const { data: userQuizData, error: quizError } = await supabase
      .from("quiz_data")
      .select(`
        quiz_id,
        score,
        duration_selected,
        answering_mode,
        how_finished,
        total_questions,
        solved_at
      `)
      .eq("auth_id", authId)
      .eq("quiz_level", level)
      .not("score", "is", null)
      .gte("solved_at", tournamentStart.toISOString())
      .lte("solved_at", tournamentEnd.toISOString())
      .order("solved_at", { ascending: true })

    if (quizError) {
      console.error("Error fetching user quiz data:", quizError)
      return null
    }

    // Get first attempt for each quiz
    const firstAttempts = new Map<number, typeof userQuizData[0]>()
    userQuizData?.forEach((quiz) => {
      const existing = firstAttempts.get(quiz.quiz_id)
      if (!existing || new Date(quiz.solved_at) < new Date(existing.solved_at)) {
        firstAttempts.set(quiz.quiz_id, quiz)
      }
    })

    // Calculate stats from first attempts
    const quizzes = Array.from(firstAttempts.values())
    const totalQuizzes = quizzes.length
    
    if (totalQuizzes === 0) {
      return {
        username: userProfile.username,
        profileImage: userProfile.profile_image,
        specialization: userProfile.specialization,
        rank: 0,
        totalPoints: 0,
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        accuracy: 0,
        level,
        totalParticipants: 0
      }
    }

    // Calculate total points
    let totalPoints = 0
    let totalScore = 0
    let bestScore = 0
    let totalCorrect = 0
    let totalQuestions = 0

    quizzes.forEach((quiz) => {
      const rawPoints = calculateTournamentPoints(
        quiz.score || 0,
        quiz.duration_selected || "15 minutes",
        quiz.answering_mode || "traditional",
        quiz.how_finished || "completed",
        quiz.total_questions || 10
      )
      totalPoints += Math.round(rawPoints / 10)
      
      const score = quiz.score || 0
      totalScore += score
      bestScore = Math.max(bestScore, score)
      
      // Calculate correct answers
      const questions = quiz.total_questions || 0
      const correct = Math.round((score / 100) * questions)
      totalCorrect += correct
      totalQuestions += questions
    })

    const averageScore = Math.round(totalScore / totalQuizzes)
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

    // Get all users' data to determine rank
    const { leaderboard } = await getLeaderboardData(level)
    const allUsers = [...leaderboard]
    
    // Find user's rank
    const userRank = allUsers.findIndex(u => u.id === authId) + 1
    const totalParticipants = allUsers.length

    return {
      username: userProfile.username,
      profileImage: userProfile.profile_image,
      specialization: userProfile.specialization,
      rank: userRank || totalParticipants + 1,
      totalPoints,
      totalQuizzes,
      averageScore,
      bestScore,
      accuracy,
      level,
      totalParticipants
    }
  } catch (error) {
    console.error("Error in getUserTournamentStats:", error)
    return null
  }
}
