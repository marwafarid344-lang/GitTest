"use server"

import { createServerClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { calculateTournamentPoints } from "@/lib/utils"
import { unstable_noStore as noStore, unstable_cache } from "next/cache"

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

// 1. Create a helper function `getCachedGlobalLeaderboard(level: 1 | 2 | 3)`
export const getCachedGlobalLeaderboard = async (level: 1 | 2 | 3) => {
  const fetchLeaderboard = unstable_cache(
    async () => {
      // 2. Wrapped in `unstable_cache`. Inside it, use `createAdminClient()`
      const adminSupabase = createAdminClient()
      
      // Tournament date range
      const tournamentStart = new Date('2025-10-11T00:00:00.000Z') 
      const tournamentEnd = new Date('2026-06-30T23:59:59.999Z') 

      console.log(`[Cache Miss] Fetching fresh leaderboard data for level ${level}`)

    // Fetch ALL data using pagination
    let allQuizData: QuizDataEntry[] = []
    let page = 0
    const pageSize = 1000
    const maxPages = 100
    let hasMore = true

    while (hasMore && page < maxPages) {
      const { data: pageData, error: pageError } = await adminSupabase
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

    if (allQuizData.length === 0) {
      return []
    }

    // Get unique auth IDs from quiz data
    const authIds = [...new Set(allQuizData.map(entry => entry.auth_id))]

    // Fetch user profiles in batches
    const BATCH_SIZE = 50
    const allProfiles: { auth_id: string; username: string; profile_image?: string | null; specialization?: string | null }[] = []

    for (let i = 0; i < authIds.length; i += BATCH_SIZE) {
      const batchIds = authIds.slice(i, i + BATCH_SIZE)
      try {
        const { data: batchProfiles, error: batchError } = await adminSupabase
          .from("chameleons")
          .select("auth_id, username, profile_image, specialization")
          .in("auth_id", batchIds)

        if (!batchError && batchProfiles) {
          allProfiles.push(...batchProfiles)
        }
      } catch (err) {
        console.error(`Error fetching profiles batch ${i / BATCH_SIZE + 1}:`, err)
      }
    }

    const userProfileMap = new Map<string, { username: string; profile_image?: string; specialization?: string }>()
    allProfiles.forEach(profile => {
      userProfileMap.set(profile.auth_id, {
        username: profile.username,
        profile_image: profile.profile_image || undefined,
        specialization: profile.specialization || undefined
      })
    })

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

    allQuizData.forEach(entry => {
      const key = `${entry.auth_id}_${entry.quiz_id}`
      const existing = userQuizFirstAttempt.get(key)
      if (!existing || new Date(entry.solved_at) < new Date(existing.solved_at)) {
        userQuizFirstAttempt.set(key, entry)
      }
    })

    userQuizFirstAttempt.forEach(entry => {
      const authId = entry.auth_id
      const userProfile = userProfileMap.get(authId)
      
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
        if (quizTime < existing.earliestQuizTime) {
          existing.earliestQuizTime = quizTime
        }
      }
    })

    // Compute the sortedUsers array (all of them)
    const allSortedUsers: LeaderboardEntry[] = Array.from(userTotalScores.values())
      .sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) {
          return b.totalPoints - a.totalPoints
        }
        return a.earliestQuizTime.getTime() - b.earliestQuizTime.getTime()
      })
      .map(user => ({
        id: user.authId,
        name: user.username,
        profile_image: user.profile_image,
        specialization: user.specialization,
        points: user.totalPoints,
        isCurrentUser: false // Default to false in the cached payload
      }))

    return allSortedUsers
    },
    ['tournament-leaderboard', String(level)],
    {
      tags: ['tournament-leaderboard', String(level)],
      revalidate: 300 // 5 minutes
    }
  )

  return fetchLeaderboard()
}

export async function getLeaderboardData(level: 1 | 2 | 3): Promise<{
  leaderboard: LeaderboardEntry[]
  currentUserEntry?: LeaderboardEntry
}> {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    let currentAuthId: string | null = null
    let currentUsername: string | null = null

    if (!authError && user && user.email) {
      const { data: userProfile, error: profileError } = await supabase
        .from("chameleons")
        .select("auth_id, username")
        .eq("email", user.email)
        .single()

      if (!profileError && userProfile) {
        currentAuthId = userProfile.auth_id
        currentUsername = userProfile.username
      }
    }

    // Call the cached global leaderboard
    const allSortedUsersUncached = await getCachedGlobalLeaderboard(level)
    
    // Create a new array so we don't mutate cached objects
    let allSortedUsers = allSortedUsersUncached.map(entry => ({ ...entry }))
    
    // Identify current user
    let currentUserEntry: LeaderboardEntry | undefined
    if (currentAuthId && currentUsername) {
      const userIndex = allSortedUsers.findIndex(u => u.id === currentAuthId)
      if (userIndex !== -1) {
        allSortedUsers[userIndex].isCurrentUser = true
        currentUserEntry = allSortedUsers[userIndex]
      }
    }

    // Slice for top 10
    const leaderboard = allSortedUsers.slice(0, 10)

    return {
      leaderboard,
      currentUserEntry
    }
  } catch (error) {
    console.error("Error in getLeaderboardData:", error)
    return { leaderboard: [] }
  }
}

export async function getPublicLeaderboardData(supabase: any, level: 1 | 2 | 3): Promise<{
  leaderboard: LeaderboardEntry[]
  currentUserEntry?: LeaderboardEntry
}> {
  try {
    // We ignore the passed supabase client and use our cached method
    // which uses admin internal connection. No need to reconstruct.
    const allSortedUsersUncached = await getCachedGlobalLeaderboard(level)
    
    // Return early if no data
    if (!allSortedUsersUncached.length) return { leaderboard: [] }
    
    // Map to new objects
    const allSortedUsers = allSortedUsersUncached.map(entry => ({ ...entry }))
    
    return { leaderboard: allSortedUsers.slice(0, 10) }
  } catch (error) {
    return { leaderboard: [] }
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
