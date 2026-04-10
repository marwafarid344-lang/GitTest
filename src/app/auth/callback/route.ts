import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('Callback route called with code:', !!code)
  console.log('Request URL:', requestUrl.toString())

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    console.log('Exchanging code for session...')
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=callback_error`)
    }

    // Get the current session after exchange
    console.log('Getting session after exchange...')
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      console.log('User found in session:', session.user.email)
      
      // Check if this is a forgot password flow
      const isForgotPassword = requestUrl.searchParams.get('mode') === 'forgot-password'
      
      // Check if user already exists in our database using admin client (bypasses RLS)
      const adminSupabase = createAdminClient()
      const { data: existingUser, error: dbError } = await adminSupabase
        .from("chameleons")
        .select("auth_id")
        .eq("auth_id", session.user.id)
        .single()

      console.log('Database query result:', !!existingUser, dbError?.message)

      if (existingUser) {
        // Handle forgot password flow
        if (isForgotPassword) {
          console.log('Forgot password flow - redirecting to reset password')
          const emailParam = encodeURIComponent(session.user.email || '')
          return NextResponse.redirect(`${requestUrl.origin}/auth?step=reset-password&mode=forgot-password&email=${emailParam}`)
        }
        
        console.log('Existing user found, redirecting to main page')
        // User is already logged in via Supabase Auth
        // Add a timestamp to force cache clear
        return NextResponse.redirect(`${requestUrl.origin}/?login=success&t=${Date.now()}`)
      } else {
        // Handle forgot password for non-existing user
        if (isForgotPassword) {
          console.log('Forgot password - no account found with this email')
          return NextResponse.redirect(`${requestUrl.origin}/auth?error=no_account&mode=forgot-password`)
        }
        
        console.log('New user, redirecting to profile completion')
        // New user - redirect to complete profile
        return NextResponse.redirect(`${requestUrl.origin}/auth?step=name&mode=signup`)
      }
    } else {
      console.log('No session found after exchange')
    }
  }

  console.log('No code or session, redirecting to auth')
  // If no code or session, redirect to auth
  return NextResponse.redirect(`${requestUrl.origin}/auth`)
}
