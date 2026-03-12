import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

export const runtime = "nodejs"

// ISR cache
export const revalidate = 600

const drive = google.drive({
  version: "v3",
  auth: process.env.GOOGLE_DRIVE_API_KEY
})

export async function GET(request: NextRequest) {

  try {

    const { searchParams } = new URL(request.url)

    const folderId = searchParams.get("folderId")
    const pageToken = searchParams.get("pageToken") || undefined
    const pageSize = Math.min(Number(searchParams.get("pageSize") || 20), 50)

    if (!folderId) {
      return NextResponse.json(
        { error: "folderId is required" },
        { status: 400 }
      )
    }

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      pageSize,
      pageToken,
      orderBy: "folder,name",
      fields:
        "nextPageToken, files(id,name,mimeType,size,thumbnailLink,webViewLink,createdTime)"
    })

    return NextResponse.json(
      {
        files: response.data.files ?? [],
        nextPageToken: response.data.nextPageToken ?? null
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=600, stale-while-revalidate=86400"
        }
      }
    )

  } catch (error) {

    console.error("Drive API error:", error)

    return NextResponse.json(
      { error: "Failed to load drive files" },
      { status: 500 }
    )
  }
}
