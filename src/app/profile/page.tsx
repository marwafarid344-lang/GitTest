"use client"

import { useEffect, useState } from "react"
import { getStudentSession } from "@/lib/auth"
import { createBrowserClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ArrowLeft, User, BookOpen, Star, Award, Calendar, GraduationCap, Shield, Edit3, LogOut, Save, X, TrendingUp, Mail, Phone, Video, FileText,Trophy } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast  } from "@/components/ToastProvider"
import Image from "next/image"
import { useAddNotification } from "@/components/notification"
import { DeleteAccountDialog } from "@/components/delete-account-dialog"
import { departmentData, departmentKeyMap, type Subject } from '@/lib/department-data'
import AdBanner from "@/components/AdBanner"


interface QuizQuestion {
  correct: boolean;
  question_text: string;
}

// Dot Plot with KDE Visualization Component
function ProgressDotPlot({ quizData }: { quizData: any[] }) {
  if (!quizData.length) return null;

  // Process quiz data for visualization
  const processData = () => {
    // Filter and sort by date
    const sortedData = [...quizData]
      .filter(attempt => attempt.score !== undefined && attempt.score !== null)
      .sort((a, b) => new Date(a.solved_at || a.created_at).getTime() - new Date(b.solved_at || b.created_at).getTime());
    
    if (sortedData.length === 0) return [];
    
    return sortedData.map((attempt, index) => {
      return {
        trial: index + 1,
        score: Math.round(Number(attempt.score)),
        date: new Date(attempt.solved_at || attempt.created_at).toLocaleDateString(),
        quizTitle: attempt.quiz_title || "Quiz",
        totalQuestions: attempt.total_questions || "N/A"
      };
    });
  };

  const data = processData();
  if (data.length === 0) return null;

  const maxTrial = data.length;

  return (
    <Card className="bg-black/40 border-white/20 shadow-2xl mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-outfit font-extrabold italic tracking-tight text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-400" />
          Progress Over <span className="bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">Attempts</span>
        </CardTitle>
        <CardDescription className="text-white/60 font-outfit">
          Your performance across quiz attempts with real-time trend visualization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-white/60 py-2">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>
          
          {/* Main chart area */}
          <div className="ml-8 h-full relative">
            {/* Horizontal grid lines */}
            {[0, 25, 50, 75, 100].map((score) => (
              <div 
                key={score}
                className="absolute left-0 right-0 border-t border-white/10"
                style={{ top: `${100 - score}%` }}
              />
            ))}
            
            {/* Connection lines between dots */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              {data.slice(0, -1).map((point, i) => {
                const nextPoint = data[i + 1];
                return (
                  <line
                    key={i}
                    x1={`${(point.trial / maxTrial) * 100}%`}
                    y1={`${100 - point.score}%`}
                    x2={`${(nextPoint.trial / maxTrial) * 100}%`}
                    y2={`${100 - nextPoint.score}%`}
                    stroke="rgba(129, 140, 248, 0.5)"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
            
            {/* Data points */}
            {data.map((point, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 border-2 border-white/70 shadow-[0_0_15px_rgba(67,59,134,0.5)] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                style={{
                  left: `${(point.trial / maxTrial) * 100}%`,
                  top: `${100 - point.score}%`
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/90 text-white text-xs p-2 rounded whitespace-nowrap shadow-xl z-20 font-outfit">
                  <div className="font-bold text-indigo-400">{point.quizTitle}</div>
                  <div>Trial {point.trial}: <span className="font-bold">{point.score}%</span></div>
                  <div className="text-white/60">Date: {point.date}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* X-axis labels */}
          <div className="ml-8 mt-2 flex justify-between text-xs text-white/60">
            <span>Trial 1</span>
            <span>Trial {Math.floor(maxTrial/2)}</span>
            <span>Trial {maxTrial}</span>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-white/60 font-outfit">
          <p style={{marginTop: "3rem"}}>This protocol visualization tracks your performance over sequential attempts.</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500"></span>
            <span>Identifier for each attempt</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="w-4 h-0.5 bg-indigo-500/50"></span>
            <span>Progress vector mapping performance trend</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get user's registered subjects based on level and department
function getUserSubjects(level: number, specialization: string, currentTerm: 'term1' | 'term2' = 'term1'): Subject[] {
  console.log('🔍 getUserSubjects called with:', { level, specialization, currentTerm })
  
  const departmentKey = departmentKeyMap[specialization] || departmentKeyMap[specialization?.toLowerCase()]
  console.log('✅ Mapped department key:', departmentKey, 'from specialization:', specialization)
  
  if (!departmentKey) {
    console.error('❌ No department key found for specialization:', specialization)
    console.log('Available mappings:', Object.keys(departmentKeyMap))
    return []
  }
  
  if (!departmentData[departmentKey]) {
    console.error('❌ Department not found in departmentData:', departmentKey)
    console.log('Available departments:', Object.keys(departmentData))
    return []
  }
  
  const department = departmentData[departmentKey]
  console.log('✅ Found department:', department.name)
  
  if (!department.levels[level]) {
    console.error('❌ Level not found:', level, 'Available levels:', Object.keys(department.levels))
    return []
  }
  
  const subjects = department.levels[level].subjects[currentTerm] || []
  console.log('✅ Found subjects:', subjects.length, 'subjects for level', level, currentTerm)
  
  if (subjects.length > 0) {
    console.log('📚 Subject names:', subjects.map(s => s.name))
  }
  
  return subjects
}

// Helper function to extract Google Drive folder ID from URL and create internal drive link
function createDriveLink(googleDriveUrl: string, driveId: string = 'ee201328c6b4'): string {
  if (!googleDriveUrl || googleDriveUrl === '' || googleDriveUrl === ' ') {
    return '#'
  }
  
  // Extract folder ID from Google Drive URL
  // Format: https://drive.google.com/drive/folders/{folderId}?usp=...
  const folderIdMatch = googleDriveUrl.match(/folders\/([a-zA-Z0-9_-]+)/)
  
  if (folderIdMatch && folderIdMatch[1]) {
    const folderId = folderIdMatch[1]
    return `/drive/${driveId}/${folderId}`
  }
  
  // If no match, return the original URL (fallback)
  console.warn('Could not extract folder ID from:', googleDriveUrl)
  return googleDriveUrl
}

// Helper function to determine current term based on date
function getCurrentTerm(): 'term1' | 'term2' {
  const now = new Date()
  const month = now.getMonth() + 1 // JavaScript months are 0-indexed
  
  // Term 2 starts on February 1st each year
  // Term 1: September 1 - January 31
  // Term 2: February 1 - August 31
  if (month >= 2 && month <= 8) {
    return 'term2'
  }
  return 'term1'
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null)
  const [quizData, setQuizData] = useState<any[]>([])
  const [paginatedData, setPaginatedData] = useState<any[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    username: "",
    age: ""
  })
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    age?: string;
    general?: string;
  }>({})
  const { addToast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const addNotification = useAddNotification()

  useEffect(() => {
    const loadProfileData = async () => {
      const session = await getStudentSession()
      if (!session) {
        setIsRedirecting(true)
        router.push("/auth")
        return
      }

      setUserData(session)
      // Initialize edit form with current data
      setEditForm({
        username: session.username || "",
        age: String(session.age || "")
      })

      const supabase = createBrowserClient()

      // Fetch fresh deletion status from database (not from session cache)
      const { data: freshUserData, error: userCheckError } = await supabase
        .from("chameleons")
        .select("deletion_scheduled_at")
        .eq("auth_id", session.auth_id)
        .single()

      // Check if user account was deleted (not found in database)
      if (!freshUserData || userCheckError?.code === 'PGRST116') {
        console.log("🗑️ User account has been deleted, clearing local storage...")
        // Clear all local storage
        localStorage.clear()
        // Clear session storage
        sessionStorage.clear()
        // Clear all cookies
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=")
          const name = eqPos > -1 ? c.substr(0, eqPos) : c
          document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        })
        // Redirect to auth page
        setIsRedirecting(true)
        router.push("/auth")
        return
      }

      // Update userData with fresh deletion_scheduled_at
      if (freshUserData) {
        setUserData((prev: any) => ({
          ...prev,
          deletion_scheduled_at: freshUserData.deletion_scheduled_at
        }))
      }

      // Get user's quiz attempts for stats (lightweight)
      const { data: statsData } = await supabase
        .from("quiz_data")
        .select(`id, auth_id, score, solved_at, created_at, quiz_title, total_questions, duration_selected, answering_mode`)
        .eq("auth_id", session.auth_id)
        .order("solved_at", { ascending: false })

      setQuizData(statsData || [])

      // Get user's paginated quiz list (detailed)
      const { data: pageData } = await supabase
        .from("quiz_data")
        .select(`*`)
        .eq("auth_id", session.auth_id)
        .order("solved_at", { ascending: false })
        .range(0, 4) // Fetch 5 items

      setPaginatedData(pageData || [])
      setHasMore(pageData && pageData.length === 5)
      setPage(0)
      setLoading(false)
    }

    loadProfileData()
  }, [router])

  const loadMoreQuizzes = async () => {
    if (!userData || !userData.auth_id || loadingMore || !hasMore) return
    setLoadingMore(true)
    
    const nextPage = page + 1
    const supabase = createBrowserClient()
    const { data: moreData, error } = await supabase
      .from("quiz_data")
      .select(`*`)
      .eq("auth_id", userData.auth_id)
      .order("solved_at", { ascending: false })
      .range(nextPage * 5, (nextPage + 1) * 5 - 1)
      
    if (moreData && moreData.length > 0) {
      setPaginatedData(prev => [...prev, ...moreData])
      setPage(nextPage)
      setHasMore(moreData.length === 5)
    } else {
      setHasMore(false)
    }
    setLoadingMore(false)
  }

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      // Clear all local storage
      localStorage.clear()
      
      // Clear session storage
      sessionStorage.clear()
      
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=")
        const name = eqPos > -1 ? c.substr(0, eqPos) : c
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`
      })
      
      // Clear Supabase session with global scope
      const supabase = createBrowserClient()
      await supabase.auth.signOut({ scope: 'global' })
      
      // Force reload to clear any cached state
      window.location.href = '/'
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditForm({
      username: userData.username,
      age: userData.age.toString()
    })
    setIsEditing(false)
    setValidationErrors({})
  }

  const validateForm = () => {
    const errors: { username?: string; age?: string; general?: string } = {}

    // Check if at least one field has been changed
    const hasUsernameChanged = editForm.username.trim() !== userData.username
    const hasAgeChanged = parseInt(editForm.age) !== userData.age

    if (!hasUsernameChanged && !hasAgeChanged) {
      errors.general = "At least one field must be changed to save"
    }

    // Username validation
    if (!editForm.username.trim()) {
      errors.username = "Username is required"
    } else if (editForm.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters long"
    }

    // Age validation
    const ageNum = parseInt(editForm.age)
    if (!editForm.age.trim()) {
      errors.age = "Age is required"
    } else if (isNaN(ageNum) || ageNum < 1) {
      errors.age = "Please enter a valid age"
    } else if (ageNum > 99) {
      errors.age = "Age cannot exceed 99 years"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveEdit = async () => {
    // Validate form before saving
    if (!validateForm()) {
      addToast("Please fix the validation errors before saving.", "error")
      return
    }

    setIsSaving(true)
    const supabase = createBrowserClient()
    
    try {
      // Update user data in the database
      const { data, error } = await supabase
        .from("chameleons")
        .update({
          username: editForm.username.trim(),
          age: parseInt(editForm.age)
        })
        .eq("auth_id", userData.auth_id)
        .select()

      if (error) {
        console.error("Error updating profile:", error)
        addToast("Failed to update profile. Please try again.", "error")
        return
      }

      if (data && data.length > 0) {
        // Update local state with new data
        const updatedUserData = { ...userData, ...data[0] }
        setUserData(updatedUserData)
        
        // Session is now managed by Supabase Auth, no need to update localStorage
        // The session will be automatically refreshed on next getStudentSession() call
        
        setIsEditing(false)
        setValidationErrors({})
        addToast("Profile updated successfully!", "success")
        // Add a notification about profile update
        addNotification(
          userData.auth_id,
          "Profile Updated",
          "System",
          "success",
          "Your profile information has been successfully updated, it may require re-login to reflect changes!",
          "false"
        )
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      addToast("Failed to update profile. Please try again.", "error")
      addNotification(
        userData.auth_id,
        "Profile Update Failed",
        "System",
        "failure",
        "There was an error updating your profile information. Please try again.",
        "false"
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  // Show loading while checking authentication or redirecting
  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">User not found</h2>
          <Button asChild>
            <Link href="/auth">Go to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen w-full overflow-x-hidden relative"
      style={{
        backgroundImage: 'url(/images/Background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          onClick={() => window.history.back()}
          variant="ghost"
          className="h-10 px-6 rounded-full text-white/90 hover:text-white hover:bg-indigo-500/20 border border-white/10 bg-black/30 backdrop-blur-md transition-all duration-300 font-outfit"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
      </div>

      {/* Logout Button */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="h-10 px-6 rounded-full text-white/90 hover:text-white hover:bg-red-500/20 border border-white/10 bg-black/30 backdrop-blur-md transition-all duration-300 font-outfit"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Main content - Fixed centering */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-20 overflow-visible">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in duration-800">
          <div className="relative inline-block mb-6 group">
            {/* Spinning Border for Admin */}
            {userData.is_admin && (
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, #ef4444 0%, #eab308 25%, #22c55e 50%, #3b82f6 75%, #ef4444 100%)',
                  animation: 'spin 3s linear infinite'
                }}
              />
            )}
            
            {/* Profile Image Container */}
            <div 
              className={`relative rounded-full shadow-2xl transition-all duration-500 hover:scale-110 ${
                userData.is_admin 
                  ? 'w-28 h-28' 
                  : 'w-24 h-24'
              }`}
              style={{
                background: 'linear-gradient(135deg, #433b86 0%, #6c63ff 50%, #818cf8 100%)',
                padding: '3px',
                margin: userData.is_admin ? '3px' : '0'
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                {userData.profile_image ? (
                  <Image
                    src={userData.profile_image}
                    alt="Profile"
                    width={userData.is_admin ? 106 : 96}
                    height={userData.is_admin ? 106 : 96}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className={`${userData.is_admin ? 'w-14 h-14' : 'w-12 h-12'} text-white`} />
                )}
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-outfit font-extrabold italic tracking-tight text-white mb-2">
            Your <span className="bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">Profile</span>
          </h1>
          <p className="text-white/60 font-outfit">Core Synchronization & Identity Matrix</p>
          
          {/* Deletion Countdown Warning */}
          {userData.deletion_scheduled_at && (
            <div className="mt-6 animate-pulse">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-red-500/20 to-amber-500/20 border border-red-500/50 shadow-lg shadow-red-500/20">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <div className="text-center">
                  <p className="text-red-400 font-bold text-sm">
                    Account Deletion Scheduled
                  </p>
                  <p className="text-white/80 text-lg font-bold">
                    {(() => {
                      const deletionDate = new Date(userData.deletion_scheduled_at)
                      const now = new Date()
                      const diffTime = deletionDate.getTime() - now.getTime()
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                      return diffDays > 0 ? `${diffDays} days remaining` : "Deletion imminent"
                    })()}
                  </p>
                  <p className="text-white/50 text-xs mt-1">
                    You can cancel this in the danger zone below
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              </div>
            </div>
          )}
          
          {/* Enhanced Animations */}
          <style jsx>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="md:col-span-1 animate-in slide-in-from-left duration-500 delay-100">
            <Card className="bg-black/40 border-white/20 shadow-2xl h-full">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-outfit font-extrabold italic tracking-tight text-white">
                  Identity <span className="text-indigo-400">Attributes</span>
                </CardTitle>
                <CardDescription className="text-white/60 font-outfit">User credentials and attributes</CardDescription>
                {validationErrors.general && (
                  <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-red-400 text-sm text-center">{validationErrors.general}</p>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="flex items-center gap-4 p-4 rounded-lg bg-[#433b86]/5 border border-[#433b86]/10 transition-all hover:bg-[#433b86]/10">
                  <div className="p-3 rounded-full bg-[#433b86]/20">
                    <Mail className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-indigo-400/60 font-outfit">Access Endpoint</p>
                    <p className="text-white font-medium font-outfit">{userData.email || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-lg bg-[#433b86]/5 border border-[#433b86]/10 transition-all hover:bg-[#433b86]/10">
                  <div className="p-3 rounded-full bg-[#433b86]/20">
                    <Phone className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-indigo-400/60 font-outfit">Secure Comms</p>
                    <p className="text-white font-medium font-outfit">{userData.phone_number || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-lg bg-[#433b86]/5 border border-[#433b86]/10 transition-all hover:bg-[#433b86]/10">
                  <div className="p-3 rounded-full bg-[#433b86]/20">
                    <User className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="username" className="text-[10px] uppercase tracking-wider text-indigo-400/60 block mb-1 font-outfit">Designation</Label>
                    {isEditing ? (
                      <>
                        <Input
                          id="username"
                          name="username"
                          value={editForm.username}
                          onChange={handleInputChange}
                          className={`bg-black/40 border-2 border-[#433b86]/30 text-white focus:border-indigo-400 focus:ring-indigo-500/20 font-outfit ${validationErrors.username ? 'border-red-500' : ''}`}
                        />
                        {validationErrors.username && (
                          <p className="text-red-400 text-xs mt-1 font-outfit">{validationErrors.username}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-white font-medium font-outfit">{userData.username}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-[#433b86]/5 border border-[#433b86]/10 transition-all hover:bg-[#433b86]/10">
                  <div className="p-3 rounded-full bg-[#433b86]/20">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="age" className="text-[10px] uppercase tracking-wider text-indigo-400/60 block mb-1 font-outfit">Cycle Count</Label>
                    {isEditing ? (
                      <>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={editForm.age}
                          onChange={handleInputChange}
                          className={`bg-black/40 border-2 border-[#433b86]/30 text-white focus:border-indigo-400 focus:ring-indigo-500/20 font-outfit ${validationErrors.age ? 'border-red-500' : ''}`}
                        />
                        {validationErrors.age && (
                          <p className="text-red-400 text-xs mt-1 font-outfit">{validationErrors.age}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-white font-medium font-outfit">{userData.age}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-[#433b86]/5 border border-[#433b86]/10 transition-all hover:bg-[#433b86]/10">
                  <div className="p-3 rounded-full bg-[#433b86]/20">
                    <GraduationCap className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-indigo-400/60 font-outfit">Authority Level</p>
                    <p className="text-white font-medium font-outfit">Level {userData.current_level}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-[#433b86]/5 border border-[#433b86]/10 transition-all hover:bg-[#433b86]/10">
                  <div className="p-3 rounded-full bg-[#433b86]/20">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-indigo-400/60 font-outfit">Core Class</p>
                    <p className="text-white font-medium font-outfit">{userData.specialization}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-[#433b86]/5 border border-[#433b86]/10 transition-all hover:bg-[#433b86]/10">
                  <div className="p-3 rounded-full bg-[#433b86]/20">
                    <Shield className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-indigo-400/60 font-outfit">Account Status</p>
                    <p className="text-white font-medium font-outfit">
                      {userData.email === "tokyo9900777@gmail.com"?"Owner":userData.is_admin 
                        ? "Administrator" 
                        : userData.is_banned 
                          ? "Offline" 
                          : "Synchronized"
                      }
                    </p>
                  </div>
                </div>



                {isEditing ? (
                  <div className="flex gap-2 font-outfit">
                    <Button 
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                      className="flex-1 h-12 rounded-full bg-white text-black hover:bg-indigo-50 font-bold border-0 shadow-lg shadow-indigo-500/10 transition-all duration-300"
                    >
                      {isSaving ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Sync
                    </Button>
                    <Button 
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex-1 h-12 rounded-full text-red-400 bg-black/40 border-2 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300 hover:text-red-500"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Abort
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleEdit}
                    className="w-full h-12 rounded-full bg-white text-black hover:bg-indigo-50 font-outfit font-bold border-0 shadow-lg shadow-indigo-500/10 transition-all duration-300 group"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Initialize Reconfig
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quiz History Card */}
          <div className="md:col-span-2 animate-in slide-in-from-right duration-500 delay-200">
            <Card className="bg-black/40 border-white/20 shadow-2xl h-full">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-outfit font-extrabold italic tracking-tight text-white">
                  Network <span className="text-indigo-400">Activity</span>
                </CardTitle>
                <CardDescription className="text-white/60 font-outfit">
                  Recent synchronization logs and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent style={{height: "47rem"}} className="overflow-y-auto custom-scrollbar">
                {paginatedData.length > 0 ? (
                  <div className="space-y-4 flex-1">
                    {paginatedData.map((attempt, index) => {
                    // Default indigo theme
                    let themeColor = '#433b86'; 
                    let themeShadow = 'rgba(67, 59, 134, 0.3)';
                    
                    // Map theme name to color if available
                    if (attempt.chosen_theme) {
                    switch(attempt.chosen_theme) {
                      case "Ocean":
                      themeColor = '#0066cc';
                      themeShadow = 'rgba(0, 102, 204, 0.3)';
                      break;
                      case "Forest": 
                      themeColor = '#228B22';
                      themeShadow = 'rgba(34, 139, 34, 0.3)';
                      break;
                      case "Sunset":
                      themeColor = '#FF6B35';
                      themeShadow = 'rgba(255, 107, 53, 0.3)';
                      break;
                      case "Purple":
                      themeColor = '#8A2BE2';
                      themeShadow = 'rgba(138, 43, 226, 0.3)';
                      break;
                      case "Rose":
                      themeColor = '#E91E63';
                      themeShadow = 'rgba(233, 30, 99, 0.3)';
                      break;
                      case "Teal":
                      themeColor = '#009688';
                      themeShadow = 'rgba(0, 150, 136, 0.3)';
                      break;
                    }
                    }
                    
                    return (
                    <div
                      key={attempt.id || index}
                      className="p-4 rounded-lg border border-white/10 overflow-hidden relative h-full animate-in fade-in duration-300"
                      style={{
                      background: `linear-gradient(90deg, ${themeColor}20 0%, ${themeColor}10 ${attempt.score || 0}%, rgba(0,0,0,0.2) ${attempt.score || 0}%)`,
                      animationDelay: `${index * 100}ms`
                      }}
                    >
                      {/* Background progress indicator */}
                      <div 
                      className="absolute inset-0 z-0"
                      style={{
                        background: `linear-gradient(90deg, ${themeColor}30 0%, transparent ${attempt.score || 0}%)`,
                        boxShadow: `inset 0 0 15px ${themeShadow}`,
                      }}
                      />
                      
                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-outfit font-bold italic">Quiz #{attempt.quiz_id}</h3>
                        <div 
                        className="flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm" 
                        style={{
                          backgroundColor: `${themeColor}20`,
                          border: `1px solid ${themeColor}40`
                        }}
                        >
                        <Star className="w-3 h-3" style={{ color: themeColor }} />
                        <span className="text-xs font-outfit font-bold" style={{ color: themeColor }}>
                          {attempt.score !== undefined ? `${Math.round(attempt.score)}%` : "N/A"}
                        </span>
                        </div>
                      </div>
                      
                      <p className="text-white/60 text-sm mb-3 font-outfit">
                        {attempt.total_questions 
                        ? `Synchronized ${Math.round(attempt.score / 100 * attempt.total_questions)} / ${attempt.total_questions} data points`
                        : "Security protocol execution record"
                        }
                      </p>
                      
                      {/* Fill space with questions section if available */}
                      {attempt.questions_data && attempt.questions_data.length > 0 && (
                        <div className="mb-4 p-3 rounded-md bg-black/20 border border-white/5 flex-1">
                        <div className="text-sm text-white/80 mb-2">Questions:</div>
                        <div className="space-y-2">
                          {attempt.questions_data.slice(0, 3).map((q: QuizQuestion, i: number) => (
                          <div key={i} className="flex items-start gap-2">
                            <div 
                            className={`min-w-4 h-4 rounded-full mt-1`}
                            style={{ backgroundColor: q.correct ? '#22c55e' : '#ef4444' }}
                            ></div>
                            <div className="flex-1 text-xs text-white/70">{q.question_text || `Question ${i+1}`}</div>
                          </div>
                          ))}
                          {attempt.questions_data.length > 3 && (
                          <div className="text-xs text-white/50 italic">
                            +{attempt.questions_data.length - 3} more questions
                          </div>
                          )}
                        </div>
                        </div>
                      )}
                      
                      {/* Adding answering_mode and duration badges */}
                      <div className="flex flex-wrap gap-2 mb-3 mt-auto">
                        {attempt.answering_mode && (
                        <span 
                          className="text-xs px-2 py-1 rounded-full inline-flex items-center"
                          style={{
                          backgroundColor: `${themeColor}20`,
                          color: themeColor
                          }}
                        >
                          <span 
                          className="w-2 h-2 rounded-full mr-1.5"
                          style={{ backgroundColor: themeColor }}
                          ></span>
                          {attempt.answering_mode}
                        </span>
                        )}
                        {attempt.duration_selected && (
                        <span 
                          className="text-xs px-2 py-1 rounded-full inline-flex items-center"
                          style={{
                          backgroundColor: `${themeColor}15`,
                          color: themeColor
                          }}
                        >
                          <span 
                          className="w-2 h-2 rounded-full mr-1.5"
                          style={{ backgroundColor: themeColor }}
                          ></span>
                          {attempt.duration_selected}
                        </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center font-outfit">
                        <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Award 
                          className="w-4 h-4" 
                          style={{ color: themeColor }}
                          />
                          <span className="text-[10px] uppercase tracking-wider text-white/60">
                          {attempt.how_finished === "in-progress" ? "Terminated" : "Resolved"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar 
                          className="w-4 h-4" 
                          style={{ color: themeColor }}
                          />
                          <span className="text-[10px] uppercase tracking-wider text-white/60">
                          {new Date(attempt.created_at || attempt.solved_at).toLocaleDateString()}
                          </span>
                        </div>
                        </div>
                      </div>
                      </div>
                    </div>
                    );
                  })}
                  {hasMore && (
                    <div className="flex justify-center pt-6 pb-2">
                      <Button 
                        variant="outline" 
                        onClick={loadMoreQuizzes} 
                        disabled={loadingMore}
                        className="w-full md:w-auto min-w-[200px] border-white/20 hover:bg-white/10 text-white font-outfit"
                      >
                        {loadingMore ? (
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                            Loading...
                          </div>
                        ) : 'Load More Options'}
                      </Button>
                    </div>
                  )}
                  </div>
                ) : (
                  <div className="text-center py-12 h-full flex flex-col items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No quiz attempts yet</h3>
                    <p className="text-white/60 mb-4">Start your learning journey by taking a quiz!</p>
                    <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500">
                      <Link href="/">Explore Quizzes</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mt-12 animate-in fade-in duration-500 delay-300">
          <Card className="bg-black/40 border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-outfit font-extrabold italic tracking-tight text-white">
                Learning <span className="text-indigo-400">Statistics</span>
              </CardTitle>
              <CardDescription className="text-white/60 font-outfit">Aggregate performance and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 rounded-lg bg-[#433b86]/5 border border-[#433b86]/10 transition-all hover:bg-[#433b86]/10">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#433b86]/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-3xl font-outfit font-extrabold italic text-white mb-1">{quizData.length}</h3>
                  <p className="text-[10px] uppercase tracking-wider text-indigo-400/60 font-outfit">Protocols Ran</p>
                </div>

                <div className="text-center p-6 rounded-lg bg-[#433b86]/5 border border-[#433b86]/10 transition-all hover:bg-[#433b86]/10">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#433b86]/20 flex items-center justify-center">
                    <Star className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-3xl font-outfit font-extrabold italic text-white mb-1">
                    {quizData.length > 0 
                      ? Math.round(quizData.reduce((sum, attempt) => sum + (Number(attempt.score) || 0), 0) / quizData.length) 
                      : 0
                    }%
                  </h3>
                  <p className="text-[10px] uppercase tracking-wider text-indigo-400/60 font-outfit">Success Rate</p>
                </div>

                <div className="text-center p-6 rounded-lg bg-[#433b86]/5 border border-[#433b86]/10 transition-all hover:bg-[#433b86]/10">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#433b86]/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-3xl font-outfit font-extrabold italic text-white mb-1">
                    {quizData.filter(attempt => attempt.score >= 80).length}
                  </h3>
                  <p className="text-[10px] uppercase tracking-wider text-indigo-400/60 font-outfit">Master Quizzes</p>
                </div>

                <div className="text-center p-6 rounded-lg bg-[#433b86]/5 border border-[#433b86]/10 transition-all hover:bg-[#433b86]/10">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#433b86]/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-3xl font-outfit font-extrabold italic text-white mb-1">
                    {new Date(userData.created_at).toLocaleDateString()}
                  </h3>
                  <p className="text-[10px] uppercase tracking-wider text-indigo-400/60 font-outfit">Cycle Start</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registered Subjects Section - NEW SEPARATE SECTION */}
        <div className="mt-12 animate-in fade-in duration-500 delay-400">
          <Card className="bg-black/40 border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-outfit font-extrabold italic tracking-tight text-white flex items-center justify-center gap-3">
                <BookOpen className="w-8 h-8 text-indigo-400" />
                Registered <span className="bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">Subjects</span>
              </CardTitle>
              <CardDescription className="text-white/60 font-outfit">
                {getCurrentTerm() === 'term1' ? 'Sector 1' : 'Sector 2'} modules • Authority Level {userData.current_level} • {userData.specialization}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const currentTerm = getCurrentTerm()
                const subjects = getUserSubjects(userData.current_level, userData.specialization, currentTerm)
                
                // Get department key for URL construction
                const departmentKey = departmentKeyMap[userData.specialization] || departmentKeyMap[userData.specialization?.toLowerCase()] || 'computing-data-sciences'
                
                if (subjects.length === 0) {
                  return (
                    <div className="text-center py-12 text-white/60">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-bold mb-4">No subjects found for your level and department</p>
                      
                      {/* Debug Information */}
                      <div className="mt-6 p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-left max-w-2xl mx-auto">
                        <p className="text-red-400 font-bold mb-3 text-center">🔍 Debug Information:</p>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-white font-semibold">Level:</span> <span className="text-yellow-400">{userData.current_level}</span></p>
                          <p><span className="text-white font-semibold">Specialization:</span> <span className="text-yellow-400">&quot;{userData.specialization}&quot;</span></p>
                          <p><span className="text-white font-semibold">User ID:</span> <span className="text-yellow-400">{userData.user_id}</span></p>
                          <p className="text-xs text-white/50 mt-4 pt-4 border-t border-white/20">
                            Expected specialization values: &ldquo;Data Science&rdquo;, &ldquo;Computing and Data Sciences&rdquo;, or &ldquo;Business Analytics&rdquo;
                          </p>
                          <p className="text-xs text-white/50 mt-2">
                            Check browser console (F12) for detailed logs
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm mt-6">Contact your administrator if this seems wrong</p>
                    </div>
                  )
                }
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject, index) => (
                      <div 
                        key={subject.id}
                        className="p-6 rounded-2xl bg-black/40 border-2 border-[#433b86]/10 hover:border-[#433b86]/40 hover:shadow-[0_0_30px_rgba(67,59,134,0.15)] transition-all duration-500 group relative overflow-hidden"
                        style={{ 
                          animationDelay: `${index * 75}ms`,
                          animation: 'fadeInUp 0.5s ease-out forwards',
                          opacity: 0
                        }}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#433b86]/5 rounded-full -mr-12 -mt-12 transition-all group-hover:bg-[#433b86]/10" />
                        {/* Subject Header */}
                        <div className="mb-4 relative z-10">
                          <h3 className="text-white font-outfit font-extrabold italic text-xl mb-2 group-hover:text-indigo-400 transition-colors">
                            {subject.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] uppercase tracking-widest text-white/40 font-outfit">{subject.code}</p>
                            <div className="flex gap-2">
                              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#433b86]/10 text-indigo-400 border border-[#433b86]/20 font-outfit font-bold">
                                {subject.creditHours} CR
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Subject Description */}
                        <p className="text-sm text-white/60 mb-6 line-clamp-2 min-h-[40px] font-outfit">
                          {subject.description}
                        </p>
                        
                        {/* Material Links Grid */}
                        <div className="space-y-2 relative z-10">
                          <div className="grid grid-cols-2 gap-2">
                            {subject.materials.lectures && subject.materials.lectures !== '' && subject.materials.lectures !== ' ' && (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-9 rounded-full bg-white text-black hover:bg-indigo-50 border-0 font-outfit font-bold text-[11px] transition-all"
                              >
                                <Link href={createDriveLink(subject.materials.lectures)}>
                                  <BookOpen className="w-3 h-3 mr-1" />
                                  LECTURES
                                </Link>
                              </Button>
                            )}
                            
                            {subject.materials.sections && subject.materials.sections !== '' && subject.materials.sections !== ' ' && (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-9 rounded-full bg-[#433b86]/10 border-2 border-[#433b86]/30 text-indigo-400 hover:bg-[#433b86]/20 hover:border-[#433b86]/50 font-outfit font-bold text-[11px] transition-all hover:text-indigo-400"
                              >
                                <Link href={createDriveLink(subject.materials.sections)}>
                                  <FileText className="w-3 h-3 mr-1" />
                                  SECTIONS
                                </Link>
                              </Button>
                            )}
                            
                            {subject.materials.quizzes && subject.materials.quizzes.length > 0 && (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-9 rounded-full bg-[#433b86]/10 border-2 border-[#433b86]/30 text-indigo-400 hover:bg-[#433b86]/20 hover:border-[#433b86]/50 font-outfit font-bold text-[11px] transition-all hover:text-indigo-400"
                              >
                                <Link href={`/specialization/${departmentKey}/${userData.current_level}/${subject.id}?tab=quizzes`}>
                                  <Trophy className="w-3 h-3 mr-1" />
                                  QUIZZES
                                </Link>
                              </Button>
                            )}
                            
                            {subject.materials.videos && (
                              (Array.isArray(subject.materials.videos) && subject.materials.videos.length > 0 && subject.materials.videos[0] !== '' && subject.materials.videos[0] !== ' ') ||
                              (typeof subject.materials.videos === 'string' && subject.materials.videos !== '' && subject.materials.videos !== ' ')
                            ) && (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-9 rounded-full bg-white text-black hover:bg-indigo-50 border-0 font-outfit font-bold text-[11px] transition-all"
                              >
                                <a 
                                  href={Array.isArray(subject.materials.videos) ? subject.materials.videos[0] : subject.materials.videos} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  <Video className="w-3 h-3 mr-1" />
                                  VIDEOS
                                </a>
                              </Button>
                            )}
                            
                            {subject.materials.summaries && subject.materials.summaries !== '' && subject.materials.summaries !== ' ' && (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-9 rounded-full bg-[#433b86]/10 border-2 border-[#433b86]/30 text-indigo-400 hover:bg-[#433b86]/20 hover:border-[#433b86]/50 font-outfit font-bold text-[11px] transition-all hover:text-indigo-400"
                              >
                                <Link href={createDriveLink(subject.materials.summaries)}>
                                  <FileText className="w-3 h-3 mr-1" />
                                  SUMMARIES
                                </Link>
                              </Button>
                            )}
                            
                            {subject.materials.exams && subject.materials.exams !== '' && subject.materials.exams !== ' ' && (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-9 rounded-full bg-white text-black hover:bg-indigo-50 border-0 font-outfit font-bold text-[11px] transition-all"
                              >
                                <Link href={createDriveLink(subject.materials.exams)}>
                                  <GraduationCap className="w-3 h-3 mr-1" />
                                  EXAMS
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>

        {/* Progress Visualization */}
        <ProgressDotPlot quizData={quizData} />

        <div className="mt-12">
          <AdBanner dataAdSlot="8021269551" />
        </div>

        {/* Danger Zone - Delete Account */}
        <div className="mt-12 animate-in fade-in duration-500 delay-500">
          <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/30 shadow-2xl shadow-red-500/10">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-outfit font-extrabold italic tracking-tight text-red-400 flex items-center justify-center gap-2">
                Protocol <span className="text-red-600">Termination</span>
              </CardTitle>
              <CardDescription className="text-white/60 font-outfit uppercase text-[10px] tracking-[0.2em]">
                Secure identity deletion node
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 font-outfit">
                <p className="text-white/70 text-sm mb-4">
                  ⚠️ <span className="italic font-bold text-red-400">"SOMETIMES WE NEED TO INITIALIZE A SYSTEM WIPE."</span> 
                </p>
                <p className="text-white/60 text-[11px] leading-relaxed">
                  Executing account termination will purge all synchronized attempt data, encrypted notifications, and identity footprints. 
                  A 14-day protocol window allows for manual restoration if necessary.
                </p>
              </div>
              
              <DeleteAccountDialog
                userId={userData.user_id}
                username={userData.username}
                quizCount={quizData.length}
                deletionScheduledAt={userData.deletion_scheduled_at}
                onDeletionScheduled={() => {
                  // Refresh the page to update the UI
                  window.location.reload()
                }}
                onDeletionCancelled={() => {
                  // Refresh the page to update the UI
                  window.location.reload()
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

