import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Toggle maintenance mode
const MAINTENANCE_MODE = false

// Bots we want to block
const BLOCKED_BOTS =
  /scraper|spider|curl|wget|python|httpclient|java|libwww|sitesucker|node-fetch/i

// Bots we allow (including Google AdSense crawler)
const ALLOWED_BOTS =
  /googlebot|adsbot-google|mediapartners-google|bingbot|duckduckbot|yandexbot|slurp|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram/i

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip static and safe paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/quizzes') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const userAgent = request.headers.get('user-agent') || ''

  // Block bad bots
  if (BLOCKED_BOTS.test(userAgent) && !ALLOWED_BOTS.test(userAgent)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Maintenance mode
  if (MAINTENANCE_MODE) {
    if (pathname !== '/maintenance') {
      const maintenanceUrl = new URL('/maintenance', request.url)
      return NextResponse.redirect(maintenanceUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|api|.*\\..*).*)',
  ],
}