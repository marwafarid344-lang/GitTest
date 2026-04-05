import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export const revalidate = 3600 // Cache public file indexes for 1 hour

export async function GET(request: NextRequest) {
  try {

    const { searchParams } = new URL(request.url)

    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const pageToken = searchParams.get('pageToken')
    const folderId = searchParams.get('folderId')
    const fileId = searchParams.get('fileId')
    const type = searchParams.get('type')

    const drive = google.drive({
      version: 'v3',
      auth: process.env.GOOGLE_DRIVE_API_KEY
    })

    if (type === 'info' && fileId) {

      const response = await drive.files.get({
        fileId: fileId,
        fields: 'id,name,parents,mimeType,size,createdTime,modifiedTime,owners,webViewLink,webContentLink,thumbnailLink'
      })

      return NextResponse.json(response.data,{
        headers:{
          "Cache-Control":"public, s-maxage=86400, stale-while-revalidate=604800"
        }
      })
    }

    let query = 'trashed=false'

    if (folderId) {
      query += ` and '${folderId}' in parents`
    }

    const response = await drive.files.list({
      q: query,
      pageSize: pageSize,
      pageToken: pageToken || undefined,
      fields: 'nextPageToken, files(id,name,mimeType,size,createdTime,modifiedTime,owners,webViewLink,webContentLink,thumbnailLink,parents)',
      orderBy: 'folder,name'
    })

    return NextResponse.json({
      files: response.data.files || [],
      nextPageToken: response.data.nextPageToken
    },{
      headers:{
        "Cache-Control":"public, s-maxage=3600, stale-while-revalidate=86400"
      }
    })

  } catch (error) {

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage },{ status:500 })
  }
}
