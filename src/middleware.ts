import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Toggle maintenance mode
const MAINTENANCE_MODE = false
const BLOCKED_BOTS =
  /scraper|crawler|spider|curl|wget|python|httpclient|java|libwww|sitesucker|node-fetch/i
const ALLOWED_BOTS =
  /googlebot|bingbot|duckduckbot|yandexbot|slurp|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram/i

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  // ⚡ Skip very common safe paths immediately
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
  if (BLOCKED_BOTS.test(userAgent) && !ALLOWED_BOTS.test(userAgent)) {
    return new NextResponse('Forbidden', { status: 403 })
  }
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
