import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const revalidate = 900; // Cache admin check for 15 minutes per user

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    // Get auth_id from query params
    const url = new URL(request.url)
    const authId = url.searchParams.get('authId')

    if (!authId) {
      return NextResponse.json(
        { error: 'Missing authId parameter' },
        { status: 400 }
      )
    }

    // Get user data using auth_id (uses admin client to bypass RLS)
    const { data: user, error: userError } = await supabase
      .from('chameleons')
      .select('auth_id, is_admin')
      .eq('auth_id', authId)
      .single()

    if (userError) {
      console.error('Error checking user:', userError)
      return NextResponse.json(
        { hasAccess: false, error: 'Failed to check user' },
        { status: 500 }
      )
    }

    // If user is not an admin, they don't have Google Drive access
    if (!user?.is_admin) {
      return NextResponse.json({
        hasAccess: false,
        isAdmin: false,
        authorized: false
      })
    }

    // Check if admin has Google OAuth tokens in admins table
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('access_token, refresh_token, authorized')
      .eq('auth_id', authId)
      .single()

    if (adminError && adminError.code !== 'PGRST116') {
      console.error('Error checking admin access:', adminError)
      return NextResponse.json(
        { hasAccess: false, error: 'Failed to check admin access' },
        { status: 500 }
      )
    }

    // Admin has access if they have tokens and are authorized
    const hasAccess = !!(adminData?.access_token && adminData?.authorized)
    
    return NextResponse.json({
      hasAccess,
      isAdmin: user?.is_admin || false,
      authorized: adminData?.authorized || false
    })
    
  } catch (error) {
    console.error('Error checking Google Drive access:', error)
    return NextResponse.json(
      { hasAccess: false, error: 'Failed to check Google Drive access' },
      { status: 500 }
    )
  }
}
