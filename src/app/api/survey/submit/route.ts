import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const res = await fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLSd-mzQXe4BIt6YYbqO-U7IOnjCyQ1dmY1P1k7s6vhacdfLxIw/formResponse",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      }
    )
    
    return NextResponse.json(
      { ok: res.ok, status: res.status },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    )
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e) }, 
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    )
  }
}
