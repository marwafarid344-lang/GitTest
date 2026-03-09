import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ⚠️ Toggle this to enable/disable maintenance mode
const MAINTENANCE_MODE = false

// Block scrapers/crawlers but allow legit search engines
const BLOCKED_BOT_PATTERNS = /scraper|crawler|spider|curl|wget|python-requests|Go-http-client|httpclient|java\/|libwww|lwp-trivial|sitesucker|grab|fetch|node-fetch/i
const ALLOWED_BOTS = /googlebot|bingbot|yandexbot|duckduckbot|slurp|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram/i

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent') || ''

  // Block malicious bots (but allow search engines)
  if (BLOCKED_BOT_PATTERNS.test(userAgent) && !ALLOWED_BOTS.test(userAgent)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // If maintenance mode is enabled
  if (MAINTENANCE_MODE) {
    // Allow access to maintenance page itself and essential assets
    const allowedPaths = [
      '/maintenance',
      '/api',
      '/_next',
      '/favicon.ico',
    ]

    // Check if the path is allowed
    const isAllowed = allowedPaths.some(path => pathname.startsWith(path))

    // If not allowed, redirect to maintenance page
    if (!isAllowed) {
      const maintenanceUrl = new URL('/maintenance', request.url)
      return NextResponse.redirect(maintenanceUrl)
    }
  }

  // Simply pass through all requests
  return NextResponse.next()
}

// Only run middleware on page routes – skip static assets, API routes, and public files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|mp3|mp4|css|js|woff|woff2|ttf|eot)$).*)',
  ],
}
