// Admin operations helper library
// Use this for all admin-related database operations after migration

import { createServerClient } from '@/lib/supabase/server'
import type { AdminData } from './auth-updated'

/**
 * Check if a user is an authorized admin
 * Uses the new admins table structure
 */
export async function checkAdminAccess(authId: string): Promise<{
  hasAccess: boolean
  isAdmin: boolean
  authorized: boolean
}> {
  const supabase = await createServerClient()
  
  // Query both chameleons and admins tables
  const { data: user, error } = await supabase
    .from('chameleons')
    .select(`
      is_admin,
      is_banned,
      admins (
        authorized
      )
    `)
    .eq('auth_id', authId)
    .maybeSingle()
  
  if (error || !user) {
    return { hasAccess: false, isAdmin: false, authorized: false }
  }
  
  const isAdmin = user.is_admin === true
  const notBanned = user.is_banned === false
  const authorized = user.admins?.[0]?.authorized === true
  const hasAccess = isAdmin && notBanned && authorized
  
  return { hasAccess, isAdmin, authorized }
}

/**
 * Get admin data including Google Drive tokens
 */
export async function getAdminData(authId: string): Promise<AdminData | null> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('admins')
    .select('auth_id, username, email, is_admin, current_level, specialization, profile_image')
    .eq('auth_id', authId)
    .maybeSingle()
  
  if (error || !data) {
    return null
  }
  
  return data as AdminData
}

/**
 * Update admin Google Drive tokens
 */
export async function updateAdminTokens(
  authId: string,
  tokens: {
    access_token?: string
    refresh_token?: string
    token_expiry?: string
    authorized?: boolean
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient()
  
  // First ensure user is admin
  const { data: user } = await supabase
    .from('chameleons')
    .select('is_admin')
    .eq('auth_id', authId)
    .maybeSingle()
  
  if (!user?.is_admin) {
    return { success: false, error: 'User is not an admin' }
  }
  
  // Update or insert admin record
  const { error } = await supabase
    .from('admins')
    .upsert({
      auth_id: authId,
      ...tokens,
      updated_at: new Date().toISOString()
    })
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  return { success: true }
}

/**
 * Get admin Google Drive tokens for API calls
 */
export async function getAdminGoogleTokens(authId: string): Promise<{
  access_token?: string
  refresh_token?: string
  token_expiry?: string
  authorized: boolean
} | null> {
  const supabase = await createServerClient()
  
  // Use the database function we created
  const { data, error } = await supabase.rpc('get_admin_tokens', {
    p_auth_id: authId
  })
  
  if (error || !data || data.length === 0) {
    return null
  }
  
  return data[0]
}

/**
 * Check if admin is authorized (simplified check)
 */
export async function isAdminAuthorized(authId: string): Promise<boolean> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase.rpc('is_admin_authorized', {
    p_auth_id: authId
  })
  
  if (error) {
    return false
  }
  
  return data === true
}

/**
 * Authorize an admin for Google Drive access
 */
export async function authorizeAdmin(
  authId: string,
  googleData: {
    google_id: string
    google_email: string
    access_token: string
    refresh_token?: string
    token_expiry?: string
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient()
  
  // Verify user is admin
  const { data: user } = await supabase
    .from('chameleons')
    .select('is_admin')
    .eq('auth_id', authId)
    .maybeSingle()
  
  if (!user?.is_admin) {
    return { success: false, error: 'User is not an admin' }
  }
  
  // Insert or update admin record
  const { error } = await supabase
    .from('admins')
    .upsert({
      auth_id: authId,
      google_id: googleData.google_id,
      google_email: googleData.google_email,
      access_token: googleData.access_token,
      refresh_token: googleData.refresh_token,
      token_expiry: googleData.token_expiry,
      authorized: true,
      updated_at: new Date().toISOString()
    })
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  return { success: true }
}

/**
 * Revoke admin authorization
 */
export async function revokeAdminAccess(authId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient()
  
  const { error } = await supabase
    .from('admins')
    .update({
      authorized: false,
      access_token: null,
      refresh_token: null,
      token_expiry: null,
      updated_at: new Date().toISOString()
    })
    .eq('auth_id', authId)
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  return { success: true }
}

/**
 * Get user with admin info using secure function
 */
export async function getUserWithAdminInfo(authId: string) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .rpc('get_user_with_admin_info', { p_auth_id: authId })
  
  if (error || !data || data.length === 0) {
    return null
  }
  
  return data[0]
}

/**
 * List all authorized admins
 */
export async function getAuthorizedAdmins() {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .rpc('get_admin_users')
  
  if (error) {
    return []
  }
  
  return data
}
