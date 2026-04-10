import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// In-memory server-side cache
let cachedQuizResult: { data: any; timestamp: number } | null = null
const QUIZ_CACHE_TTL = 60 * 60 * 1000 // 1 hour (quiz count changes rarely)

// Cache for 1 hour – quiz count changes very rarely
export const revalidate = 3600

async function countJsonFiles(dir: string): Promise<number> {
  let count = 0
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        // Recursively count files in subdirectories
        count += await countJsonFiles(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        count++
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error)
  }
  
  return count
}

export async function GET() {
  try {
    // Return cached result if still valid
    if (cachedQuizResult && Date.now() - cachedQuizResult.timestamp < QUIZ_CACHE_TTL) {
      return NextResponse.json(cachedQuizResult.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
          'X-Cache': 'HIT',
        },
      })
    }

    // Count solved quizzes from Supabase
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

    const { count: solvedQuizzes, error } = await supabase
      .from('quiz_data')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error counting quiz_data:', error)
    }

    // Get the path to the public/quizzes directory
    const quizzesDir = path.join(process.cwd(), 'public', 'quizzes')
    
    // Count all JSON files recursively for available quizzes
    const totalQuizzes = await countJsonFiles(quizzesDir)

    const responseData = {
      totalQuizzes,
      solvedQuizzes: solvedQuizzes ?? 30000, // Fallback if error
      timestamp: new Date().toISOString(),
    }

    // Store in server-side cache
    cachedQuizResult = { data: responseData, timestamp: Date.now() }

    return NextResponse.json(
      responseData,
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
          'X-Cache': 'MISS',
        },
      }
    )
  } catch (error) {
    console.error('Unexpected error in quiz stats API:', error)
    return NextResponse.json(
      { error: 'Internal server error', totalQuizzes: 140, solvedQuizzes: 30000 },
      { status: 500 }
    )
  }
}
