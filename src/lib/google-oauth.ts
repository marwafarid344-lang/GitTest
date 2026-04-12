import { google } from 'googleapis'
import { createClient } from '@/lib/supabase/client'
import { createAdminClient } from '@/lib/supabase/admin'

// Google OAuth2 configuration
export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/google-drive/callback`
)

// Google Drive API scopes
export const GOOGLE_DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive', // Full access to Google Drive
  'https://www.googleapis.com/auth/userinfo.email', // Get user email
  'https://www.googleapis.com/auth/userinfo.profile' // Get user profile
]

// Generate Google OAuth URL
export function getGoogleAuthUrl(state?: string): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline', // Required for refresh tokens
    scope: GOOGLE_DRIVE_SCOPES,
    prompt: 'consent', // Force consent screen to get refresh token
    state: state || 'default', // Optional state parameter
    include_granted_scopes: true
  })
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code: string) {
  try {
    return new Promise((resolve, reject) => {
      oauth2Client.getToken(code, (err, tokens) => {
        if (err) {
          console.error('Error getting tokens:', err)
          reject(new Error('Failed to exchange authorization code for tokens'))
        } else {
          resolve(tokens)
        }
      })
    })
  } catch (error) {
    console.error('Error exchanging code for tokens:', error)
    throw new Error('Failed to exchange authorization code for tokens')
  }
}

// Get user info from Google
export async function getGoogleUserInfo(accessToken: string) {
  try {
    oauth2Client.setCredentials({ access_token: accessToken })
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: userInfo } = await oauth2.userinfo.get()
    return userInfo
  } catch (error) {
    console.error('Error getting Google user info:', error)
    throw new Error('Failed to get user information from Google')
  }
}

// Refresh access token using refresh token
export async function refreshAccessToken(refreshToken: string) {
  try {
    // Create a new OAuth2 client instance for this refresh operation
    // to avoid global state conflicts between concurrent requests
    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/google-drive/callback`
    )

    client.setCredentials({ refresh_token: refreshToken })
    const { credentials } = await client.refreshAccessToken()
    return credentials
  } catch (error) {
    console.error('Error refreshing access token:', error)
    throw new Error('Failed to refresh access token')
  }
}

// Store tokens in database
export async function storeUserTokens(
  authId: string,
  googleId: string,
  googleEmail: string,
  accessToken: string,
  refreshToken?: string,
  expiryDate?: number
) {
  console.log(`🔐 STORE TOKENS DEBUG - Starting token storage for user ${authId} with Google account ${googleEmail}`)
  
  try {
    const supabase = createAdminClient()

    // Check if this refresh token is already used by another user
    if (refreshToken) {
      const { data: existingUsers } = await supabase
        .from('admins')
        .select('auth_id, google_email')
        .eq('refresh_token', refreshToken)
        .neq('auth_id', authId)

      if (existingUsers && existingUsers.length > 0) {
        console.error(`🚨 SECURITY VIOLATION: Attempting to store duplicate refresh token for user ${authId}. Token already used by:`, existingUsers)
        throw new Error('This Google account is already connected to another user. Each user must use their own Google account.')
      }
    }

    const updateData = {
      google_id: googleId,
      google_email: googleEmail,
      access_token: accessToken,
      token_expiry: expiryDate ? new Date(expiryDate) : null,
      authorized: true // Set admin as authorized when storing tokens
    } as any

    // Only update refresh token if provided (it's not always returned)
    if (refreshToken) {
      updateData.refresh_token = refreshToken
    }

    console.log(`🔐 STORE TOKENS DEBUG - Checking if user ${authId} is admin in chameleons table`)
    
    // First check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('chameleons')
      .select('is_admin, username')
      .eq('auth_id', authId)
      .single()

    if (userError) {
      console.error(`❌ STORE TOKENS DEBUG - Database error checking user ${authId}:`, userError)
      throw new Error(`Database error: ${userError.message}`)
    }

    if (!userData?.is_admin) {
      console.error(`❌ STORE TOKENS DEBUG - User ${authId} is not admin. User data:`, userData)
      throw new Error('User must be an admin to store Google Drive tokens')
    }

    console.log(`✅ STORE TOKENS DEBUG - User ${authId} (${userData.username}) confirmed as admin`)

    // Store tokens in admins table - check if record exists first
    console.log(`🔐 STORE TOKENS DEBUG - Checking if admin record exists for user ${authId}`)
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('auth_id')
      .eq('auth_id', authId)
      .single()

    let error
    if (existingAdmin) {
      console.log(`🔄 STORE TOKENS DEBUG - Updating existing admin record for user ${authId}`)
      // Update existing record
      const { error: updateError } = await supabase
        .from('admins')
        .update({
          google_id: googleId,
          google_email: googleEmail,
          access_token: accessToken,
          token_expiry: expiryDate ? new Date(expiryDate) : null,
          authorized: true,
          ...(refreshToken && { refresh_token: refreshToken })
        })
        .eq('auth_id', authId)
      error = updateError
    } else {
      console.log(`🆕 STORE TOKENS DEBUG - Creating new admin record for user ${authId}`)
      // Insert new record
      const { error: insertError } = await supabase
        .from('admins')
        .insert({
          auth_id: authId,
          google_id: googleId,
          google_email: googleEmail,
          access_token: accessToken,
          token_expiry: expiryDate ? new Date(expiryDate) : null,
          authorized: true,
          ...(refreshToken && { refresh_token: refreshToken })
        })
      error = insertError
    }

    if (error) {
      console.error('❌ STORE TOKENS DEBUG - Error storing tokens in database:', error)
      throw new Error(`Failed to store tokens: ${error.message}`)
    }

    console.log(`✅ STORE TOKENS DEBUG - Tokens stored successfully for user ${authId}`)
    return true
  } catch (error) {
    console.error('❌ STORE TOKENS DEBUG - Error in storeUserTokens:', error)
    throw error
  }
}

// Get user tokens from database
export async function getUserTokens(authId: string) {
  try {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('admins')
      .select('google_id, google_email, access_token, refresh_token, token_expiry')
      .eq('auth_id', authId)
      .single()

    if (error) {
      console.error('Error getting user tokens:', error)
      throw new Error('Failed to get user tokens from database')
    }

    return data
  } catch (error) {
    console.error('Error in getUserTokens:', error)
    throw error
  }
}

// Check if access token is expired
export function isTokenExpired(expiryDate: string | Date | null): boolean {
  if (!expiryDate) return true
  
  const expiry = new Date(expiryDate)
  const now = new Date()
  
  // Add 5-minute buffer to avoid edge cases
  const buffer = 5 * 60 * 1000 // 5 minutes in milliseconds
  return (expiry.getTime() - buffer) <= now.getTime()
}

// Get valid access token (refresh if needed) - requires individual authentication
export async function getValidAccessToken(authId: string): Promise<string> {
  try {
    console.log('🔑 TOKEN DEBUG - Getting valid access token for user:', authId)
    
    // Each user must have their own tokens - no token sharing
    const tokens = await getUserTokens(authId)
    
    if (!tokens?.access_token) {
      console.log('🔑 TOKEN DEBUG - No access token found for user:', authId)
      throw new Error('No access token found for user. Please authenticate with Google Drive.')
    }

    console.log('🔑 TOKEN DEBUG - User', authId, 'has token starting with:', tokens.access_token.substring(0, 20) + '...')

    // User has their own tokens, check if valid
    if (!isTokenExpired(tokens.token_expiry)) {
      console.log('🔑 TOKEN DEBUG - User', authId, 'token is still valid')
      return tokens.access_token
    }

    // Token is expired, refresh it
    if (!tokens.refresh_token) {
      console.log('🔑 TOKEN DEBUG - User', authId, 'has no refresh token')
      throw new Error('No refresh token available to refresh access token')
    }

    console.log('🔑 TOKEN DEBUG - User', authId, 'token expired, refreshing...')
    const newTokens = await refreshAccessToken(tokens.refresh_token)
    
    if (!newTokens.access_token) {
      console.log('🔑 TOKEN DEBUG - Failed to get new access token for user:', authId)
      throw new Error('Failed to get new access token')
    }

    console.log('🔑 TOKEN DEBUG - User', authId, 'got new token starting with:', newTokens.access_token.substring(0, 20) + '...')

    // Store new tokens
    await storeUserTokens(
      authId,
      tokens.google_id,
      tokens.google_email,
      newTokens.access_token,
      newTokens.refresh_token || tokens.refresh_token, // Keep old refresh token if new one not provided
      newTokens.expiry_date || undefined
    )

    console.log('🔑 TOKEN DEBUG - Stored new tokens for user:', authId)
    return newTokens.access_token
  } catch (error) {
    console.error('🔑 TOKEN DEBUG - Error getting valid access token for user', authId, ':', error)
    throw error
  }
}

// Configure OAuth client with user tokens
export async function configureOAuthClientForUser(authId: string) {
  try {
    const accessToken = await getValidAccessToken(authId)
    const tokens = await getUserTokens(authId)

    // Create a new OAuth2 client instance for this user
    // to avoid global state conflicts
    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/google-drive/callback`
    )

    client.setCredentials({
      access_token: accessToken,
      refresh_token: tokens.refresh_token
    })

    return client
  } catch (error) {
    console.error('Error configuring OAuth client for user:', error)
    throw error
  }
}

// Refresh tokens for all admin users
export async function refreshAllAdminTokens() {
  try {
    const supabase = createAdminClient()

    // Get all admin users with tokens from admins table
    const { data: adminData, error } = await supabase
      .from('admins')
      .select('auth_id, google_id, google_email, access_token, refresh_token, token_expiry, authorized')
      .eq('authorized', true)
      .not('refresh_token', 'is', null)

    if (error) {
      console.error('Error fetching admin users:', error)
      throw new Error('Failed to fetch admin users')
    }

    if (!adminData || adminData.length === 0) {
      console.log('No admin users found with refresh tokens')
      return { refreshedCount: 0, failedCount: 0, totalUsers: 0 }
    }

    let refreshedCount = 0
    let failedCount = 0
    const totalUsers = adminData.length

    console.log(`Starting token refresh for ${totalUsers} admin users`)

    for (const user of adminData) {
      try {
        // Check if token needs refresh (add 10-minute buffer for cron job)
        if (!isTokenExpired(user.token_expiry)) {
          console.log(`Token for user ${user.auth_id} is still valid`)
          continue
        }

        if (!user.refresh_token) {
          console.log(`No refresh token for user ${user.auth_id}`)
          failedCount++
          continue
        }

        console.log(`Refreshing token for user ${user.auth_id}`)

        // Refresh the token
        const newTokens = await refreshAccessToken(user.refresh_token)

        if (!newTokens.access_token) {
          console.error(`Failed to get new access token for user ${user.auth_id}`)
          failedCount++
          continue
        }

        // Store new tokens
        await storeUserTokens(
          user.auth_id,
          user.google_id,
          user.google_email,
          newTokens.access_token,
          newTokens.refresh_token || user.refresh_token,
          newTokens.expiry_date || undefined
        )

        refreshedCount++
        console.log(`Successfully refreshed token for user ${user.auth_id}`)

      } catch (userError) {
        console.error(`Error refreshing token for user ${user.auth_id}:`, userError)
        failedCount++
      }
    }

    console.log(`Token refresh completed: ${refreshedCount} refreshed, ${failedCount} failed, ${totalUsers} total`)
    return { refreshedCount, failedCount, totalUsers }

  } catch (error) {
    console.error('Error in refreshAllAdminTokens:', error)
    throw error
  }
}
