import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import bcrypt from 'bcryptjs'
import { checkRateLimit, getRequestIdentifier, RateLimitTier } from '@/lib/rate-limit'

// In-memory storage for login attempts (per IP address)
// In production, this should be replaced with a proper database or Redis
interface LoginAttempt {
  attempts: number
  lastAttempt: number
  lockoutUntil: number | null
}

const loginAttempts = new Map<string, LoginAttempt>()

const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds

function getClientIP(request: NextRequest): string {
  // Get IP from various headers (in order of preference)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const clientIP = request.headers.get('x-client-ip')

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }

  if (realIP) return realIP
  if (clientIP) return clientIP

  // Fallback to a default IP for development
  return '127.0.0.1'
}

function getLoginAttempt(ip: string): LoginAttempt {
  if (!loginAttempts.has(ip)) {
    loginAttempts.set(ip, {
      attempts: 0,
      lastAttempt: Date.now(),
      lockoutUntil: null
    })
  }
  return loginAttempts.get(ip)!
}

function recordFailedAttempt(ip: string) {
  const attempt = getLoginAttempt(ip)
  attempt.attempts += 1
  attempt.lastAttempt = Date.now()

  if (attempt.attempts >= MAX_ATTEMPTS) {
    attempt.lockoutUntil = Date.now() + LOCKOUT_DURATION
  }
}

function recordSuccessfulLogin(ip: string) {
  const attempt = getLoginAttempt(ip)
  attempt.attempts = 0
  attempt.lockoutUntil = null
}

function isLockedOut(ip: string): boolean {
  const attempt = getLoginAttempt(ip)
  if (attempt.lockoutUntil && Date.now() < attempt.lockoutUntil) {
    return true
  }
  return false
}

function getRemainingLockoutTime(ip: string): number {
  const attempt = getLoginAttempt(ip)
  if (attempt.lockoutUntil) {
    const remaining = attempt.lockoutUntil - Date.now()
    return Math.max(0, remaining)
  }
  return 0
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, password } = await request.json()

    if (!studentId || !password) {
      return NextResponse.json(
        { error: 'Student ID and password are required' },
        { status: 400 }
      )
    }

    const clientIP = getClientIP(request)

    // Rate limit check — prevent brute force attacks
    const rateLimitId = getRequestIdentifier(request)
    const rateLimit = checkRateLimit(rateLimitId, RateLimitTier.AUTH)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.', retryAfter: Math.ceil((rateLimit.reset - Date.now()) / 1000) },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          }
        }
      )
    }

    // Check if IP is currently locked out
    if (isLockedOut(clientIP)) {
      const remainingTime = Math.ceil(getRemainingLockoutTime(clientIP) / 1000 / 60) // minutes
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please try again in ${remainingTime} minutes or login with a Google account.`,
          lockoutRemaining: remainingTime
        },
        { status: 429 }
      )
    }

    // Create Supabase admin client (bypasses RLS for server-side operations)
    const supabase = createAdminClient()

    // Get user data by username (MUST filter to a single row — never fetch all users)
    const { data: userData, error: userError } = await supabase
      .from('chameleons')
      .select('auth_id, username, email, role, current_level, specialization, profile_image, is_admin, is_banned, age, created_at, pass')
      .eq('username', studentId)
      .single()

    if (userError || !userData) {
      recordFailedAttempt(clientIP)
      return NextResponse.json(
        { error: 'Invalid student ID or password' },
        { status: 401 }
      )
    }

    // Cast userData to proper type
    const user = userData as {
      auth_id: string
      username: string
      specialization: string
      age: number
      current_level: number
      is_admin: boolean
      is_banned: boolean
      created_at: string
      email?: string
      profile_image?: string
      pass: string
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.pass)

    if (!isPasswordValid) {
      recordFailedAttempt(clientIP)
      return NextResponse.json(
        { error: 'Invalid student ID or password' },
        { status: 401 }
      )
    }

    // Check if account is banned
    if (user.is_banned) {
      return NextResponse.json(
        { error: 'Your account has been banned. Please contact support.' },
        { status: 403 }
      )
    }

    // Successful login - reset attempts
    recordSuccessfulLogin(clientIP)

    // Sign in with Supabase Auth using auth_id
    // First, check if user has auth_id
    if (!userData.auth_id) {
      return NextResponse.json(
        { error: 'Account not properly configured. Please contact support.' },
        { status: 500 }
      )
    }

    // Get the auth user's email to sign in
    const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserById(userData.auth_id)
    
    if (authUserError || !authUser?.user?.email) {
      console.error('Error fetching auth user:', authUserError)
      return NextResponse.json(
        { error: 'Authentication error. Please contact support.' },
        { status: 500 }
      )
    }

    // Return user data (excluding password) and auth_id for client-side auth
    const sessionData = {
      auth_id: user.auth_id,
      username: user.username,
      specialization: user.specialization,
      age: user.age,
      current_level: user.current_level,
      is_admin: user.is_admin,
      is_banned: user.is_banned,
      created_at: user.created_at,
      email: user.email,
      profile_image: user.profile_image,
    }

    // Return success with auth credentials for client-side session
    return NextResponse.json({ 
      user: sessionData,
      authEmail: authUser.user.email
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
