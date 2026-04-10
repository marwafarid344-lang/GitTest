import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// In-memory server-side cache — survives across requests within the same serverless instance
let cachedResult: { data: any; timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Cache for 5 minutes – user count changes slowly
export const revalidate = 300

export async function GET() {
  try {
    // Return cached result if still valid
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedResult.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Cache': 'HIT',
        },
      })
    }

    // Use service role to bypass RLS and get ALL users
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Fetch ALL users by paginating (Supabase default limit is 1000)
    let allUsers: { current_level: number | null }[] = []
    let from = 0
    const pageSize = 1000
    let hasMore = true

    while (hasMore) {
      const { data, error } = await supabase
        .from('chameleons')
        .select('current_level')
        .range(from, from + pageSize - 1)

      if (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
          { error: 'Failed to fetch user statistics' },
          { status: 500 }
        )
      }

      if (data && data.length > 0) {
        allUsers = allUsers.concat(data)
        from += pageSize
        hasMore = data.length === pageSize
      } else {
        hasMore = false
      }
    }

    const totalUsers = allUsers.length

    // Calculate level statistics - handle NULL and undefined
    const levelStats: Record<number, number> = {}
    
    allUsers?.forEach((user) => {
      // Handle NULL, undefined, or use the actual value
      const level = user.current_level ?? 0  // Use nullish coalescing
      levelStats[level] = (levelStats[level] || 0) + 1
    })

    // Sort levels and create array
    const levels = Object.entries(levelStats)
      .map(([level, count]) => ({
        level: parseInt(level),
        count,
      }))
      .sort((a, b) => a.level - b.level)

    const responseData = {
      totalUsers,
      levels,
      timestamp: new Date().toISOString(),
    }

    // Store in server-side cache
    cachedResult = { data: responseData, timestamp: Date.now() }

    return NextResponse.json(
      responseData,
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Cache': 'MISS',
        },
      }
    )
  } catch (error) {
    console.error('Unexpected error in user stats API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

