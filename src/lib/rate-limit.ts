

interface RateLimitEntry {
  timestamps: number[]
  blocked: boolean
  blockUntil?: number
  violations: number
}

// In-memory store (resets on server restart, which is fine)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    // Remove entries older than 5 minutes
    entry.timestamps = entry.timestamps.filter(t => now - t < 5 * 60 * 1000)
    if (entry.timestamps.length === 0 && (!entry.blockUntil || now > entry.blockUntil)) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export enum RateLimitTier {
  READ = 'read',           // 60/min - Normal browsing, viewing files
  WRITE = 'write',         // 20/min - Creating, updating, deleting
  AUTH = 'auth',           // 5/min - Login, signup (prevent brute force)
  UPLOAD = 'upload',       // 10/min - File uploads (prevent spam)
  SENSITIVE = 'sensitive', // 3/min - Password reset, admin actions
}

const LIMITS = {
  [RateLimitTier.READ]: { requests: 60, window: 60 * 1000 },      // 60 per minute
  [RateLimitTier.WRITE]: { requests: 20, window: 60 * 1000 },     // 20 per minute
  [RateLimitTier.AUTH]: { requests: 5, window: 60 * 1000 },       // 5 per minute
  [RateLimitTier.UPLOAD]: { requests: 10, window: 60 * 1000 },    // 10 per minute
  [RateLimitTier.SENSITIVE]: { requests: 3, window: 60 * 1000 },  // 3 per minute
}

const VIOLATION_PENALTIES = {
  1: 30 * 1000,      // 30 seconds block after 1st violation
  2: 2 * 60 * 1000,  // 2 minutes block after 2nd violation
  3: 5 * 60 * 1000,  // 5 minutes block after 3rd violation
  4: 15 * 60 * 1000, // 15 minutes block after 4th violation
  5: 60 * 60 * 1000, // 1 hour block after 5th+ violations
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  blocked?: boolean
  blockUntil?: number
  violations?: number
}

/**
 * Check rate limit for an identifier
 * @param identifier - Unique identifier (IP, user ID, auth token hash)
 * @param tier - Rate limit tier
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  tier: RateLimitTier = RateLimitTier.READ
): RateLimitResult {
  const now = Date.now()
  const limit = LIMITS[tier]
  const key = `${tier}:${identifier}`

  // Get or create entry
  let entry = rateLimitStore.get(key)
  if (!entry) {
    entry = { timestamps: [], blocked: false, violations: 0 }
    rateLimitStore.set(key, entry)
  }

  // Check if currently blocked
  if (entry.blockUntil && now < entry.blockUntil) {
    return {
      success: false,
      limit: limit.requests,
      remaining: 0,
      reset: entry.blockUntil,
      blocked: true,
      blockUntil: entry.blockUntil,
      violations: entry.violations,
    }
  }

  // Remove blocked status if expired
  if (entry.blockUntil && now >= entry.blockUntil) {
    entry.blocked = false
    entry.blockUntil = undefined
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter(t => now - t < limit.window)

  // Calculate remaining requests
  const remaining = Math.max(0, limit.requests - entry.timestamps.length)
  const oldestTimestamp = entry.timestamps[0] || now
  const reset = oldestTimestamp + limit.window

  // Check if limit exceeded
  if (entry.timestamps.length >= limit.requests) {
    // Violation detected
    entry.violations++
    entry.blocked = true
    
    // Calculate block duration based on violation count
    const violationLevel = Math.min(entry.violations, 5)
    const blockDuration = VIOLATION_PENALTIES[violationLevel as keyof typeof VIOLATION_PENALTIES]
    entry.blockUntil = now + blockDuration

    console.warn(
      `⚠️ Rate limit exceeded: ${identifier} (${tier}) - Violation #${entry.violations} - Blocked for ${blockDuration / 1000}s`
    )

    return {
      success: false,
      limit: limit.requests,
      remaining: 0,
      reset,
      blocked: true,
      blockUntil: entry.blockUntil,
      violations: entry.violations,
    }
  }

  // Add current timestamp
  entry.timestamps.push(now)

  return {
    success: true,
    limit: limit.requests,
    remaining: remaining - 1,
    reset,
    violations: entry.violations,
  }
}

/**
 * Get identifier from request (IP address or auth token)
 */
export function getRequestIdentifier(request: Request): string {
  // Try to get auth token first (more accurate than IP)
  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    // Use hash of token as identifier
    const token = authHeader.replace('Bearer ', '')
    return hashString(token)
  }

  // Fallback to IP address
  const ip = 
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'

  return `ip:${ip}`
}

/**
 * Simple hash function for identifiers
 */
function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return `token:${Math.abs(hash).toString(36)}`
}

/**
 * Reset rate limit for an identifier (use for testing or admin override)
 */
export function resetRateLimit(identifier: string, tier?: RateLimitTier) {
  if (tier) {
    const key = `${tier}:${identifier}`
    rateLimitStore.delete(key)
  } else {
    // Reset all tiers for this identifier
    for (const t of Object.values(RateLimitTier)) {
      const key = `${t}:${identifier}`
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Get rate limit status without incrementing
 */
export function getRateLimitStatus(identifier: string, tier: RateLimitTier): RateLimitResult {
  const now = Date.now()
  const limit = LIMITS[tier]
  const key = `${tier}:${identifier}`

  const entry = rateLimitStore.get(key)
  if (!entry) {
    return {
      success: true,
      limit: limit.requests,
      remaining: limit.requests,
      reset: now + limit.window,
    }
  }

  // Check if blocked
  if (entry.blockUntil && now < entry.blockUntil) {
    return {
      success: false,
      limit: limit.requests,
      remaining: 0,
      reset: entry.blockUntil,
      blocked: true,
      blockUntil: entry.blockUntil,
      violations: entry.violations,
    }
  }

  // Filter old timestamps
  const validTimestamps = entry.timestamps.filter(t => now - t < limit.window)
  const remaining = Math.max(0, limit.requests - validTimestamps.length)
  const oldestTimestamp = validTimestamps[0] || now
  const reset = oldestTimestamp + limit.window

  return {
    success: validTimestamps.length < limit.requests,
    limit: limit.requests,
    remaining,
    reset,
    violations: entry.violations,
  }
}

