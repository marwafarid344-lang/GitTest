"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import bcrypt from "bcryptjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Shield,
  Lock,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ToastProvider"

// Password hashing function
async function hashPassword(plainPassword: string) {
  const saltRounds = 12
  const hash = await bcrypt.hash(plainPassword, saltRounds)
  return hash
}

// Custom dropdown component
function CustomDropdown({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <Label className="text-[#818cf8] text-xs font-semibold tracking-widest uppercase">
        {label}
      </Label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 text-left text-white text-sm hover:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[#433b86]/30 transition-all"
        >
          <span>{selectedOption?.label || `Select ${label.toLowerCase()}`}</span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-white/40" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 mt-2 w-full rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl"
            >
              <div className="py-1 max-h-60 overflow-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value)
                      setIsOpen(false)
                    }}
                    className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                      value === option.value
                        ? "bg-[#433b86]/10 text-[#818cf8]"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

type AuthStep = "google" | "otp" | "name" | "specialization" | "password" | "complete"
type GoogleUserData = {
  email: string
  name: string
  picture: string
  sub: string
}

export default function AuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [level, setLevel] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [previousPath, setPreviousPath] = useState("/")
  const { addToast } = useToast()

  const [authStep, setAuthStep] = useState<AuthStep>("google")
  const [googleUserData, setGoogleUserData] = useState<GoogleUserData | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [oauthProvider, setOauthProvider] = useState<"google" | "github" | null>(null)
  const [otpCode, setOtpCode] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const otpSentRef = useRef(false)
  const [otpVerificationAttempted, setOtpVerificationAttempted] = useState(false)

  const [loginData, setLoginData] = useState({ studentId: "", password: "" })
  const [signupData, setSignupData] = useState({
    username: "",
    phoneNumber: "",
    age: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const modeParam = searchParams.get("mode")
    const stepParam = searchParams.get("step")
    if (modeParam === "signup") {
      setMode("signup")
      if (stepParam === "name" || stepParam === "name-phone") {
        setAuthStep("name")
      }
    } else {
      setMode("login")
    }
  }, [searchParams])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const remembered = localStorage.getItem("remembered_login")
      if (remembered) {
        try {
          const { studentId, password } = JSON.parse(remembered)
          setLoginData({ studentId: studentId || "", password: password || "" })
          setRememberMe(true)
        } catch {}
      }
    }
  }, [])

  useEffect(() => {
    const referrer = document.referrer
    const returnToParam = searchParams.get("returnTo")
    if (returnToParam) {
      setPreviousPath(returnToParam)
    } else if (referrer && referrer.startsWith(window.location.origin)) {
      const path = new URL(referrer).pathname
      setPreviousPath(path === "/auth" ? "/" : path)
    }
  }, [searchParams])

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [resendTimer])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: loginData.studentId, password: loginData.password }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429 && data.lockoutRemaining) {
          setError(`Too many failed attempts. Try again in ${data.lockoutRemaining} minutes.`)
        } else {
          setError(data.error || 'Login failed')
        }
        setIsLoading(false)
        return
      }

      const userData = data.user
      const authEmail = data.authEmail

      const supabase = createBrowserClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: loginData.password,
      })

      if (signInError) {
        setError('Authentication error. Please try again.')
        setIsLoading(false)
        return
      }

      if (rememberMe) {
        localStorage.setItem("remembered_login", JSON.stringify({ studentId: loginData.studentId, password: loginData.password }))
      } else {
        localStorage.removeItem("remembered_login")
      }

      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: { userId: userData.user_id } }))
      router.push(previousPath)
      addToast(`Welcome back, ${userData.username}!`, "info")
    } catch (err) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError("")
    setOauthProvider("google")

    try {
      const supabase = createBrowserClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?mode=signup&step=name`,
          queryParams: { access_type: "offline", prompt: "select_account" },
          scopes: "openid email profile",
        },
      })

      if (error) {
        setError("Failed to sign in with Google: " + error.message)
        setIsGoogleLoading(false)
      }
    } catch (err) {
      setError("An error occurred during Google sign-in")
      setIsGoogleLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    setIsGoogleLoading(true)
    setError("")
    setOauthProvider("github")

    try {
      const supabase = createBrowserClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?mode=signup&step=name`,
          scopes: "read:user user:email",
        },
      })

      if (error) {
        setError("Failed to sign in with GitHub: " + error.message)
        setIsGoogleLoading(false)
      }
    } catch (err) {
      setError("An error occurred during GitHub sign-in")
      setIsGoogleLoading(false)
    }
  }

  useEffect(() => {
    const handleAuthFlow = async () => {
      const stepParam = searchParams.get("step")
      const modeParam = searchParams.get("mode")

      if ((stepParam === "name" || stepParam === "name-phone") && modeParam === "signup" && !googleUserData && !otpSentRef.current) {
        otpSentRef.current = true
        const supabase = createBrowserClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const provider = session.user.app_metadata?.provider || 'google'
          setOauthProvider(provider as "google" | "github")
          
          setGoogleUserData({
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
            picture: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || "",
            sub: session.user.id,
          })
          
          const otp = Math.floor(100000 + Math.random() * 900000).toString()
          setGeneratedOtp(otp)
          
          try {
            const response = await fetch('/api/send-otp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: session.user.email,
                otp: otp,
                name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User'
              })
            })
            
            const data = await response.json()
            
            if (response.ok && data.success) {
              setAuthStep("otp")
              setResendTimer(600)
              setTimeout(() => addToast('Verification code sent!', 'success'), 0)
            } else {
              setError('Failed to send verification code.')
            }
          } catch (err) {
            setError('Failed to send verification code.')
          }
          
          setMode("signup")
        }
      }
    }

    handleAuthFlow()
  }, [searchParams, googleUserData, addToast])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createBrowserClient()

      const { data: existingUser } = await supabase
        .from("chameleons")
        .select("username")
        .eq("username", signupData.username)
        .maybeSingle()

      if (existingUser) {
        setError("Username already exists")
        setIsLoading(false)
        return
      }

      let authUserId: string
      const email = googleUserData?.email || `user_${Date.now()}@temp.local`

      if (googleUserData) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError("Authentication error. Please try again.")
          setIsLoading(false)
          return
        }
        authUserId = user.id
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email,
          password: signupData.password,
        })

        if (authError || !authData.user) {
          setError('Failed to create account: ' + (authError?.message || 'Unknown error'))
          setIsLoading(false)
          return
        }
        authUserId = authData.user.id
      }

      const hashedPassword = await hashPassword(signupData.password)

      const insertData = {
        username: signupData.username,
        phone_number: signupData.phoneNumber,
        pass: hashedPassword,
        specialization: specialization,
        age: Number.parseInt(signupData.age),
        current_level: Number.parseInt(level),
        is_admin: false,
        is_banned: false,
        email: email,
        profile_image: googleUserData?.picture || "",
        auth_id: authUserId,
      }

      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(insertData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError('Failed to create profile: ' + (errorData.error || 'Unknown error'))
        setIsLoading(false)
        return
      }

      const { data: newUser, error: insertError } = await response.json()

      if (insertError) {
        setError("Failed to create user profile: " + insertError.message)
        setIsLoading(false)
        return
      }

      if (newUser) {
        setAuthStep("complete")
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: { userId: newUser.user_id } }))
        addToast(`Welcome, ${newUser.username}!`, "success")
        setTimeout(() => router.push(previousPath), 2000)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const toggleMode = (newMode: "login" | "signup") => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set("mode", newMode)
    router.replace(`?${newSearchParams.toString()}`, { scroll: false })
    setMode(newMode)
    setError("")
  }

  const handleStepBack = () => {
    if (authStep === "otp") {
      setAuthStep("google")
      setGoogleUserData(null)
      setOtpCode("")
      setGeneratedOtp("")
      otpSentRef.current = false
    } else if (authStep === "name") {
      setAuthStep("google")
      setGoogleUserData(null)
    } else if (authStep === "specialization") {
      setAuthStep("name")
    } else if (authStep === "password") {
      setAuthStep("specialization")
    }
  }

  const handleOtpVerification = () => {
    setOtpVerificationAttempted(true)
    if (otpCode === generatedOtp) {
      setError("")
      addToast('Email verified!', 'success')
      setTimeout(() => setAuthStep("name"), 500)
    } else {
      setError("Invalid verification code.")
      addToast('Invalid code', 'error')
    }
  }

  const handleResendOtp = async () => {
    if (!googleUserData?.email || resendTimer > 0) return
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(otp)
    setOtpCode("")
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: googleUserData.email, otp: otp, name: googleUserData.name })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setResendTimer(600)
        addToast('New code sent', 'success')
        setError("")
        setOtpVerificationAttempted(false)
      } else {
        setError('Failed to resend code.')
      }
    } catch (err) {
      setError('Failed to resend code.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStepForward = () => {
    if (authStep === "google") {
      setAuthStep("name")
    } else if (authStep === "name") {
      if (!signupData.username.trim()) {
        setError("Username is required")
        return
      }
      if (signupData.username.trim().length < 3) {
        setError("Username must be at least 3 characters")
        return
      }
      setError("")
      setAuthStep("specialization")
    } else if (authStep === "specialization") {
      if (!specialization) {
        setError("Please select a specialization")
        return
      }
      if (!level) {
        setError("Please select your level")
        return
      }
      if (!signupData.age || Number.parseInt(signupData.age) < 16 || Number.parseInt(signupData.age) > 100) {
        setError("Please enter a valid age (16-100)")
        return
      }
      setError("")
      setAuthStep("password")
    }
  }

  const currentYear = () => new Date().getFullYear()

  const levelOptions = [
    { value: "1", label: `Level 1 - ${currentYear()}/${currentYear() + 1}` },
    { value: "2", label: `Level 2 - ${currentYear() - 1}/${currentYear()}` },
    { value: "3", label: `Level 3 - ${currentYear() - 2}/${currentYear() - 1}` },
    { value: "4", label: `Level 4 - ${currentYear() - 3}/${currentYear() - 2}` },
  ]

  const specializationOptions = [
    { value: "Data Science", label: "Data Science" },
    { value: "Cyber Security", label: "Cyber Security" },
    { value: "Artificial Intelligence", label: "Artificial Intelligence" },
    { value: "Media Analysis", label: "Media Analysis" },
    { value: "Business Analysis", label: "Business Analysis" },
    { value: "Health Care", label: "Health Care" },
  ]

  const getStepContent = () => {
    switch (authStep) {
      case "google":
        return {
          title: mode === "login" ? "Return to" : "Make Your",
          accent: mode === "login" ? "Core." : "Legacy.",
          subtitle: mode === "login" 
            ? "Ready to continue sculpting your digital workspace? The era awaits your return."
            : "We use Google & GitHub Auth for maximum security and simplicity.",
        }
      case "otp":
        return {
          title: "Verify",
          accent: "Identity.",
          subtitle: `We sent a verification code to ${googleUserData?.email}`,
        }
      case "name":
        return {
          title: "Welcome,",
          accent: "Explorer.",
          subtitle: `Authenticated via [${googleUserData?.email}]. Let's finalize your digital identity.`,
        }
      case "specialization":
        return {
          title: "Define your",
          accent: "Path.",
          subtitle: "Tell us about your academic journey to personalize your experience.",
        }
      case "password":
        return {
          title: "Secure your",
          accent: "Legacy.",
          subtitle: "Create a strong password to protect your digital identity.",
        }
      case "complete":
        return {
          title: "Identity",
          accent: "Synchronized.",
          subtitle: "Your digital workspace is ready. Redirecting...",
        }
    }
  }

  const stepContent = getStepContent()

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#030303] relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/Background.png)' }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Indigo gradient glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#433b86]/[0.1] blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#433b86]/[0.1] blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-0 w-[250px] h-[600px] bg-[#433b86]/[0.05] blur-[80px] -translate-x-1/2" />
        <div className="absolute top-1/2 right-0 w-[250px] h-[600px] bg-[#433b86]/[0.05] blur-[80px] translate-x-1/2" />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10"
      >
        <Image
          src="/images/1212-removebg-preview.png"
          alt="Chameleon Logo"
          width={32}
          height={32}
          className="object-contain"
        />
        <span className="text-white font-bold text-lg tracking-wide">Chameleon</span>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-4 text-center px-4 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${mode}-${authStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-outfit font-extrabold italic tracking-tight mb-3">
              <span className="text-white">{stepContent.title}</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
                {stepContent.accent}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/50 text-base mb-8 max-w-sm mx-auto leading-relaxed">
              {stepContent.subtitle}
            </p>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Content based on step */}
            {authStep === "complete" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-5"
              >
                <div className="w-14 h-14 bg-[#433b86] rounded-full flex items-center justify-center">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-xl text-white"
                  >
                    ✓
                  </motion.span>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/20 border-t-[#433b86] rounded-full"
                />
              </motion.div>
            ) : (
              <form 
                onSubmit={mode === "login" ? handleLogin : (authStep === "password" ? handleSignup : (e) => { e.preventDefault(); handleStepForward(); })}
                className="space-y-4"
              >
                {/* Login/Signup - OAuth buttons */}
                {(mode === "login" || authStep === "google") && authStep !== "otp" && (
                  <div className="space-y-3">
                    {/* Google OAuth Card */}
                    <motion.button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading}
                      className="w-full bg-white rounded-xl p-3.5 flex items-center gap-3 hover:bg-gray-50 transition-all group shadow-lg shadow-black/10"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                        {isGoogleLoading && oauthProvider === "google" ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full"
                          />
                        ) : (
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-900 text-sm">
                          {mode === "login" ? "Sync via Google" : "Launch with Google"}
                        </p>
                        <p className="text-gray-500 text-xs uppercase tracking-wider">
                          Instant Authentication
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </motion.button>

                    {/* GitHub OAuth Card */}
                    <motion.button
                      type="button"
                      onClick={handleGithubSignIn}
                      disabled={isGoogleLoading}
                      className="w-full bg-[#24292e] rounded-xl p-3.5 flex items-center gap-3 hover:bg-[#1b1f23] transition-all group shadow-lg shadow-black/10"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                        {isGoogleLoading && oauthProvider === "github" ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                        ) : (
                          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-white text-sm">
                          {mode === "login" ? "Sync via GitHub" : "Launch with GitHub"}
                        </p>
                        <p className="text-white/50 text-xs uppercase tracking-wider">
                          Developer Auth
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover:translate-x-0.5 transition-transform" />
                    </motion.button>

                    {/* Mode toggle link */}
                    <div className="pt-3 text-center">
                      <p className="text-white/40 text-xs uppercase tracking-widest mb-1.5">
                        {mode === "login" ? "First time here?" : "Already initialized?"}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleMode(mode === "login" ? "signup" : "login")}
                        className="text-white font-medium underline underline-offset-4 hover:text-[#818cf8] transition-colors inline-flex items-center gap-1.5 text-sm"
                      >
                        {mode === "login" ? "Initialize a new identity" : "Sign in to your account"}
                        <span className="text-[#818cf8]">✦</span>
                      </button>
                    </div>

                    {/* Back link */}
                    <div className="pt-1">
                      <Link href="/" className="text-white/40 hover:text-white transition-colors inline-flex items-center gap-1.5 text-xs">
                        <ArrowLeft className="w-3 h-3" />
                        Changed my mind
                      </Link>
                    </div>
                  </div>
                )}

                {/* OTP Verification */}
                {authStep === "otp" && (
                  <div className="space-y-5">
                    <div className="w-16 h-16 bg-[#433b86]/10 rounded-xl flex items-center justify-center mx-auto border border-[#433b86]/20">
                      <Shield className="w-8 h-8 text-[#818cf8]" />
                    </div>

                    <div className="flex justify-center gap-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => {
                        const digit = otpCode[index] || ""
                        const isCorrect = otpVerificationAttempted && otpCode === generatedOtp
                        const isWrong = otpVerificationAttempted && otpCode !== generatedOtp
                        
                        return (
                          <Input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '')
                              if (value) {
                                const newOtp = otpCode.split('')
                                newOtp[index] = value
                                setOtpCode(newOtp.join('').slice(0, 6))
                                setError("")
                                if (index < 5) {
                                  document.getElementById(`otp-${index + 1}`)?.focus()
                                }
                              } else {
                                const newOtp = otpCode.split('')
                                newOtp[index] = ''
                                setOtpCode(newOtp.join(''))
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace' && !digit && index > 0) {
                                document.getElementById(`otp-${index - 1}`)?.focus()
                              }
                            }}
                            className={`w-10 h-12 text-center text-xl font-bold bg-white/[0.03] border-2 text-white rounded-lg transition-all ${
                              isCorrect ? 'border-[#433b86] ring-2 ring-[#433b86]/20' 
                              : isWrong ? 'border-red-500 ring-2 ring-red-500/20' 
                              : 'border-white/10 focus:border-[#433b86]/50'
                            }`}
                          />
                        )
                      })}
                    </div>

                    <Button
                      type="button"
                      onClick={handleOtpVerification}
                      disabled={otpCode.length !== 6}
                      className="w-full h-11 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all text-sm"
                    >
                      Verify Code
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendTimer > 0}
                      className={`text-xs ${resendTimer > 0 ? 'text-white/30' : 'text-[#818cf8] hover:underline'}`}
                    >
                      {resendTimer > 0 ? `Resend in ${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')}` : "Resend code"}
                    </button>
                  </div>
                )}

                {/* Name Step */}
                {authStep === "name" && (
                  <div className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <Label className="text-[#818cf8] text-xs font-semibold tracking-widest uppercase">
                        Username
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter your username"
                        value={signupData.username}
                        onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                        className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl px-4 text-sm placeholder:text-white/30 focus:border-[#433b86]/50 focus:ring-[#433b86]/20"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[#818cf8] text-xs font-semibold tracking-widest uppercase">
                        Phone Number
                      </Label>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={signupData.phoneNumber}
                        onChange={(e) => setSignupData({ ...signupData, phoneNumber: e.target.value })}
                        className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl px-4 text-sm placeholder:text-white/30 focus:border-[#433b86]/50 focus:ring-[#433b86]/20"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all text-sm mt-3"
                    >
                      Continue
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>

                    <button
                      type="button"
                      onClick={handleStepBack}
                      className="text-white/40 hover:text-white transition-colors inline-flex items-center gap-1.5 text-xs mx-auto block pt-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Go back
                    </button>
                  </div>
                )}

                {/* Specialization Step */}
                {authStep === "specialization" && (
                  <div className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <Label className="text-[#818cf8] text-xs font-semibold tracking-widest uppercase">
                        Age
                      </Label>
                      <Input
                        type="number"
                        placeholder="Enter your age"
                        value={signupData.age}
                        onChange={(e) => setSignupData({ ...signupData, age: e.target.value })}
                        className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl px-4 text-sm placeholder:text-white/30 focus:border-[#433b86]/50 focus:ring-[#433b86]/20"
                        required
                      />
                    </div>

                    <CustomDropdown
                      id="level"
                      label="Level"
                      value={level}
                      onChange={setLevel}
                      options={levelOptions}
                    />

                    <CustomDropdown
                      id="specialization"
                      label="Specialization"
                      value={specialization}
                      onChange={setSpecialization}
                      options={specializationOptions}
                    />

                    <Button
                      type="submit"
                      className="w-full h-11 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all text-sm mt-3"
                    >
                      Continue
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>

                    <button
                      type="button"
                      onClick={handleStepBack}
                      className="text-white/40 hover:text-white transition-colors inline-flex items-center gap-1.5 text-xs mx-auto block pt-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Go back
                    </button>
                  </div>
                )}

                {/* Password Step */}
                {authStep === "password" && (
                  <div className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <Label className="text-[#818cf8] text-xs font-semibold tracking-widest uppercase">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl px-4 pr-10 text-sm placeholder:text-white/30 focus:border-[#433b86]/50 focus:ring-[#433b86]/20"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[#818cf8] text-xs font-semibold tracking-widest uppercase">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl px-4 pr-10 text-sm placeholder:text-white/30 focus:border-[#433b86]/50 focus:ring-[#433b86]/20"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all text-sm mt-3"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full"
                        />
                      ) : (
                        <>
                          Synchronize Identity
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>

                    <button
                      type="button"
                      onClick={handleStepBack}
                      className="text-white/40 hover:text-white transition-colors inline-flex items-center gap-1.5 text-xs mx-auto block pt-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Go back
                    </button>
                  </div>
                )}
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer status indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 text-[10px] tracking-widest"
      >
        <span className="text-[#818cf8] flex items-center gap-1.5">
          <span className="w-1 h-1 bg-[#433b86] rounded-full animate-pulse" />
          SECURE LOGIN
        </span>
        <span className="text-white/30 font-outfit">ENCRYPTED</span>
        <span className="text-white/30 font-outfit">CHAMELEON V2.1</span>
      </motion.div>
    </div>
  )
}
