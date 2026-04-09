/**
 * Security Middleware Helper
 * 
 * Example implementation showing how to use rate limiting,
 * validation, and audit logging in API routes.
 */

import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getRequestIdentifier, RateLimitTier } from './rate-limit'
import { logSecurityEvent, AuditEventType, checkSuspiciousActivity } from './audit-log'
import { validateOrigin, detectSQLInjection } from './validation'

/**
 * Apply rate limiting to a request
 * Returns null if allowed, or an error response if blocked
 */
export async function applyRateLimit(
  request: NextRequest,
  tier: RateLimitTier = RateLimitTier.READ
): Promise<NextResponse | null> {
  const identifier = getRequestIdentifier(request)
  const result = checkRateLimit(identifier, tier)

  if (!result.success) {
    // Log rate limit violation
    logSecurityEvent(
      result.blocked ? AuditEventType.RATE_LIMIT_BLOCKED : AuditEventType.RATE_LIMIT_EXCEEDED,
      request,
      {
        identifier,
        message: `Rate limit ${result.blocked ? 'blocked' : 'exceeded'} for ${tier}`,
        metadata: {
          limit: result.limit,
          remaining: result.remaining,
          reset: result.reset,
          violations: result.violations,
          blockUntil: result.blockUntil,
        },
      }
    )

    return NextResponse.json(
      {
        error: result.blocked
          ? 'Too many requests. You have been temporarily blocked due to repeated violations.'
          : 'Rate limit exceeded. Please slow down.',
        limit: result.limit,
        remaining: result.remaining,
        reset: new Date(result.reset).toISOString(),
        blocked: result.blocked,
        blockUntil: result.blockUntil ? new Date(result.blockUntil).toISOString() : undefined,
        retryAfter: result.blockUntil ? Math.ceil((result.blockUntil - Date.now()) / 1000) : undefined,
      },
      {
        status: 429,
        headers: {
          'Retry-After': result.blockUntil
            ? Math.ceil((result.blockUntil - Date.now()) / 1000).toString()
            : '60',
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': new Date(result.reset).toISOString(),
        },
      }
    )
  }

  return null
}

/**
 * Check for suspicious activity
 * Returns error response if suspicious
 */
export async function checkSuspicious(
  request: NextRequest
): Promise<NextResponse | null> {
  const identifier = getRequestIdentifier(request)
  const analysis = checkSuspiciousActivity(identifier)

  if (analysis.suspicious) {
    logSecurityEvent(AuditEventType.UNAUTHORIZED_ACCESS, request, {
      identifier,
      message: `Suspicious activity detected: ${analysis.reason}`,
      metadata: { score: analysis.score, reason: analysis.reason },
    })

    return NextResponse.json(
      {
        error: 'Access denied due to suspicious activity',
        details: 'Your account has been flagged for security review.',
      },
      { status: 403 }
    )
  }

  return null
}

/**
 * Validate request origin for CSRF protection
 */
export function validateRequestOrigin(request: NextRequest): NextResponse | null {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_PRODUCTION_URL || 'https://www.chameleon-nu.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
  ]

  if (!validateOrigin(request, allowedOrigins)) {
    logSecurityEvent(AuditEventType.FORBIDDEN_ACTION, request, {
      identifier: getRequestIdentifier(request),
      message: 'Invalid origin',
      metadata: {
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer'),
      },
    })

    return NextResponse.json(
      { error: 'Invalid request origin' },
      { status: 403 }
    )
  }

  return null
}

/**
 * Check for SQL injection attempts
 */
export function checkSQLInjection(input: string, request: NextRequest): NextResponse | null {
  if (detectSQLInjection(input)) {
    logSecurityEvent(AuditEventType.SQL_INJECTION_ATTEMPT, request, {
      identifier: getRequestIdentifier(request),
      message: 'SQL injection attempt detected',
      metadata: { input },
    })

    return NextResponse.json(
      { error: 'Invalid input detected' },
      { status: 400 }
    )
  }

  return null
}

/**
 * Complete security check wrapper
 * Use this in API routes for comprehensive protection
 */
export async function securityCheck(
  request: NextRequest,
  options: {
    rateLimitTier?: RateLimitTier
    checkOrigin?: boolean
    checkSuspiciousActivity?: boolean
  } = {}
): Promise<NextResponse | null> {
  const {
    rateLimitTier = RateLimitTier.READ,
    checkOrigin = true,
    checkSuspiciousActivity = true,
  } = options

  // 1. Check for suspicious activity
  if (checkSuspiciousActivity) {
    const suspiciousCheck = await checkSuspicious(request)
    if (suspiciousCheck) return suspiciousCheck
  }

  // 2. Validate origin
  if (checkOrigin && request.method !== 'GET') {
    const originCheck = validateRequestOrigin(request)
    if (originCheck) return originCheck
  }

  // 3. Apply rate limiting
  const rateLimitCheck = await applyRateLimit(request, rateLimitTier)
  if (rateLimitCheck) return rateLimitCheck

  return null
}

/**
 * Example usage in an API route:
 * 
 * export async function POST(request: NextRequest) {
 *   // Apply security checks
 *   const securityError = await securityCheck(request, {
 *     rateLimitTier: RateLimitTier.WRITE,
 *     checkOrigin: true,
 *     checkSuspiciousActivity: true,
 *   })
 *   if (securityError) return securityError
 * 
 *   // Your API logic here
 *   const data = await request.json()
 *   // ...
 * }
 */
