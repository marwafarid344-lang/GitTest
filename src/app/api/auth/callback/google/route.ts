import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens, getGoogleUserInfo, storeUserTokens } from '@/lib/google-oauth'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/drive?error=${encodeURIComponent('OAuth authorization was denied')}`, request.url)
      )
    }

    if (!code) {
      return NextResponse.redirect(
        new URL(`/drive?error=${encodeURIComponent('No authorization code received')}`, request.url)
      )
    }

    // Parse and verify signed state parameter
    let authId: string
    
    if (!state) {
      return NextResponse.redirect(
        new URL(`/drive?error=${encodeURIComponent('Missing state parameter')}`, request.url)
      )
    }

    try {
      const [payloadBase64, signature] = state.split('.')
      
      // Verify signature
      const expectedSignature = crypto
        .createHmac('sha256', process.env.OAUTH_STATE_SECRET!)
        .update(payloadBase64)
        .digest('base64url')
      
      if (signature !== expectedSignature) {
        throw new Error('Invalid signature')
      }
      
      // Decode payload
      const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString())
      authId = payload.authId || payload.userId // Support both for backwards compat
      
      // Optional: Check timestamp (e.g., reject if older than 10 minutes)
      const age = Date.now() - payload.ts
      if (age > 10 * 60 * 1000) {
        throw new Error('State expired')
      }
      
    } catch (error) {
      console.error('State verification failed:', error)
      return NextResponse.redirect(
        new URL(`/drive?error=${encodeURIComponent('Invalid or expired state')}`, request.url)
      )
    }

    console.log(`🔐 OAUTH CALLBACK DEBUG - Processing callback for user ${authId}, state: ${state}`)

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code) as any
    
    if (!tokens.access_token) {
      throw new Error('No access token received from Google')
    }

    console.log(`🔐 OAUTH CALLBACK DEBUG - Got tokens for user ${authId}: access_token starts with ${tokens.access_token.substring(0, 20)}..., refresh_token starts with ${tokens.refresh_token ? tokens.refresh_token.substring(0, 20) + '...' : 'NONE'}`)

    // Get user info from Google
    const userInfo = await getGoogleUserInfo(tokens.access_token)
    
    if (!userInfo.id || !userInfo.email) {
      throw new Error('Failed to get user information from Google')
    }

    console.log(`🔐 OAUTH CALLBACK DEBUG - Google user info for user ${authId}: ${userInfo.email} (ID: ${userInfo.id})`)

    // Check if this Google account is already associated with another user in admins table
    const supabase = createAdminClient()
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('auth_id, google_email')
      .eq('google_id', userInfo.id)
      .neq('auth_id', authId)
      .single()

    if (existingAdmin) {
      console.log(`🚨 OAUTH CALLBACK DEBUG - Google account ${userInfo.email} already associated with user ${existingAdmin.auth_id}, but trying to associate with user ${authId}`)
      return NextResponse.redirect(
        new URL(`/drive?error=${encodeURIComponent('This Google account is already connected to another user. Each user must use their own Google account.')}`, request.url)
      )
    }

    // Check if user is admin before storing tokens
    console.log(`🔐 OAUTH CALLBACK DEBUG - Checking if user ${authId} is admin before storing tokens`)
    const { data: userCheck, error: checkError } = await supabase
      .from('chameleons')
      .select('is_admin, username')
      .eq('auth_id', authId)
      .single()

    if (checkError) {
      console.error('Error checking user admin status:', checkError)
      return NextResponse.redirect(
        new URL(`/drive?error=${encodeURIComponent('Failed to verify user permissions')}`, request.url)
      )
    }

    if (!userCheck?.is_admin) {
      console.error(`User ${authId} is not an admin. User data:`, userCheck)
      return NextResponse.redirect(
        new URL(`/drive?error=${encodeURIComponent('User must be an admin to authorize Google Drive access')}`, request.url)
      )
    }

    console.log(`✅ OAUTH CALLBACK DEBUG - User ${authId} (${userCheck.username}) is confirmed as admin`)

    // Store tokens in database
    console.log(`🔐 OAUTH CALLBACK DEBUG - Storing tokens for admin user ${authId}`)
    await storeUserTokens(
      authId,
      userInfo.id,
      userInfo.email,
      tokens.access_token,
      tokens.refresh_token,
      tokens.expiry_date
    )

    console.log(`✅ OAUTH CALLBACK DEBUG - Tokens stored successfully for user ${authId} with Google account ${userInfo.email}`)

    console.log(`✅ OAuth tokens stored successfully for user ${authId}`)
    
    // Redirect back to drive page with success message using proper base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.chameleon-nu.vercel.app'
    console.log(`🔄 OAUTH CALLBACK DEBUG - Redirecting to: ${baseUrl}/drive?success=Google Drive connected successfully`)
    return NextResponse.redirect(
      new URL('/drive?success=Google Drive connected successfully', baseUrl)
    )
    
  } catch (error) {
    console.error('Error in OAuth callback:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    // Use proper base URL for error redirect too
    const baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_URL || 'https://www.chameleon-nu.vercel.app'
    return NextResponse.redirect(
      new URL(`/drive?error=${encodeURIComponent(errorMessage)}`, baseUrl)
    )
  }
}
