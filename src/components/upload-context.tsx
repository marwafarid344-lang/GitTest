"use client"

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { useToast } from '@/components/ToastProvider'

export interface UploadItem {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
  startTime: number
  endTime?: number
  abortController?: AbortController
  parentFolderId: string
  authId: string
}

interface UploadContextType {
  uploads: UploadItem[]
  uploadFile: (file: File, parentFolderId: string, authId: string, onComplete?: () => void) => Promise<void>
  cancelUpload: (uploadId: string) => void
  clearCompleted: () => void
  retryUpload: (uploadId: string) => void
}

const UploadContext = createContext<UploadContextType | undefined>(undefined)

export function useUpload() {
  const context = useContext(UploadContext)
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider')
  }
  return context
}

interface UploadProviderProps {
  children: React.ReactNode
}

export function UploadProvider({ children }: UploadProviderProps) {
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const { addToast } = useToast()
  const uploadCallbacksRef = useRef<Map<string, () => void>>(new Map())

  const uploadFile = useCallback(async (file: File, parentFolderId: string, authId: string, onComplete?: () => void) => {
    const uploadId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const abortController = new AbortController()

    const uploadItem: UploadItem = {
      id: uploadId,
      file,
      progress: 0,
      status: 'pending',
      startTime: Date.now(),
      abortController,
      parentFolderId,
      authId
    }

    setUploads(prev => [...prev, uploadItem])

    // Store the callback for this upload
    if (onComplete) {
      uploadCallbacksRef.current.set(uploadId, onComplete)
    }

    try {
      // Start upload
      setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'uploading' } : u))

      console.log('Requesting upload URL for file:', {
        name: file.name,
        size: file.size,
        sizeMB: (file.size / (1024 * 1024)).toFixed(2),
        type: file.type,
        parentFolderId,
        authId
      })

      // Step 1: Get signed upload URL from our server
      const urlResponse = await fetch('/api/google-drive/get-upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          parentFolderId,
          authId
        }),
      })

      if (!urlResponse.ok) {
        const errorData = await urlResponse.json()
        throw new Error(errorData.error || 'Failed to get upload URL')
      }

      const urlData = await urlResponse.json()
      const accessToken = urlData.accessToken

      console.log('Got upload info:', {
        success: urlData.success,
        uploadMethod: urlData.uploadMethod,
        hasAccessToken: !!accessToken
      })

      // All uploads are now direct to Google Drive (no server proxy)
      if (!accessToken) {
        throw new Error('Missing access token from server')
      }

      console.log('Starting direct resumable upload to Google Drive')

      // 1. Initiate Resumable Upload Session
      const sessionMetadata = {
        name: file.name,
        ...(urlData.fileMetadata.parents && { parents: urlData.fileMetadata.parents })
      }

      const sessionResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
          'X-Upload-Content-Type': file.type || 'application/octet-stream',
          'X-Upload-Content-Length': file.size.toString()
        },
        body: JSON.stringify(sessionMetadata)
      })

      if (!sessionResponse.ok) {
        const errText = await sessionResponse.text()
        throw new Error(`Failed to start upload session: ${sessionResponse.status} ${errText}`)
      }

      const resumableUrl = sessionResponse.headers.get('Location')
      if (!resumableUrl) {
        throw new Error('Google Drive did not return a resumable upload URL')
      }

      // 2. Upload file content to the resumable URL
      const xhr = new XMLHttpRequest()

      // Set up progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploads(prev => prev.map(u =>
            u.id === uploadId ? { ...u, progress } : u
          ))
        }
      })

      // Set up completion
      xhr.addEventListener('load', () => {
        console.log('Direct resumable upload completed:', {
          status: xhr.status,
          statusText: xhr.statusText,
          responseText: xhr.responseText?.substring(0, 200)
        })

        if (xhr.status >= 200 && xhr.status < 300) {
          setUploads(prev => prev.map(u =>
            u.id === uploadId ? {
              ...u,
              status: 'completed',
              progress: 100,
              endTime: Date.now()
            } : u
          ))
          addToast(`File "${file.name}" uploaded successfully`, 'success')

          // Call refresh callback if set
          const callback = uploadCallbacksRef.current.get(uploadId)
          if (callback) {
            callback()
            uploadCallbacksRef.current.delete(uploadId)
          }
        } else {
          let errorMessage = `Upload failed with status ${xhr.status}`

          try {
            if (xhr.responseText && xhr.responseText.trim()) {
              const response = JSON.parse(xhr.responseText)
              errorMessage = response.error?.message || response.error || `Server error: ${xhr.status} ${xhr.statusText}`
            } else {
              errorMessage = `Server error: ${xhr.status} ${xhr.statusText || 'Unknown error'}`
            }
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError)
            if (xhr.statusText) {
              errorMessage = `HTTP ${xhr.status}: ${xhr.statusText}`
            } else {
              errorMessage = `Upload failed with HTTP ${xhr.status} error`
            }
          }

          setUploads(prev => prev.map(u =>
            u.id === uploadId ? {
              ...u,
              status: 'error',
              error: errorMessage,
              endTime: Date.now()
            } : u
          ))
          addToast(`Failed to upload "${file.name}": ${errorMessage}`, 'error')
        }
      })

      // Set up error handling
      xhr.addEventListener('error', (event) => {
        console.error('Direct upload network error:', {
          fileName: file.name,
          fileSize: file.size,
          event
        })
        setUploads(prev => prev.map(u =>
          u.id === uploadId ? {
            ...u,
            status: 'error',
            error: `Network error during upload. Check your connection and try again. File: ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            endTime: Date.now()
          } : u
        ))
        addToast(`Network error uploading "${file.name}". Please check your connection and retry.`, 'error')
      })

      // Set timeout for large files (30 minutes for files over 50MB, 15 minutes for large files, 5 minutes for small)
      const timeoutMs = file.size > 50 * 1024 * 1024 ? 1800000 : file.size > 10 * 1024 * 1024 ? 900000 : 300000 // 30 min for >50MB, 15 min for >10MB, 5 min for small
      xhr.timeout = timeoutMs

      // Set up timeout handling
      xhr.addEventListener('timeout', () => {
        console.error('Direct upload timeout:', {
          fileName: file.name,
          fileSize: file.size,
          timeoutMs
        })
        setUploads(prev => prev.map(u =>
          u.id === uploadId ? {
            ...u,
            status: 'error',
            error: `Upload timeout after ${timeoutMs / 1000} seconds. File size: ${(file.size / (1024 * 1024)).toFixed(2)} MB may be too large or network is slow.`,
            endTime: Date.now()
          } : u
        ))
        addToast(`Upload timeout for "${file.name}". Large files may take longer.`, 'error')
      })

      // Set up abort handling
      xhr.addEventListener('abort', () => {
        setUploads(prev => prev.map(u =>
          u.id === uploadId ? {
            ...u,
            status: 'error',
            error: 'Upload cancelled',
            endTime: Date.now()
          } : u
        ))
      })

      // Configure and send file content request
      xhr.open('PUT', resumableUrl)
      // The Location URL includes an upload_id, so we don't need the Authorization header again,
      // but we need to specify the content type to match what we initiated with
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
      
      console.log('Direct resumable upload configuration:', {
        method: 'PUT',
        url: resumableUrl,
        fileSize: file.size,
        fileType: file.type,
        timeoutMs
      })

      // Handle abort controller
      abortController.signal.addEventListener('abort', () => {
        console.log('Upload aborted for:', file.name)
        xhr.abort()
      })

      // Send the file directly (no multipart assembly)
      xhr.send(file)

    } catch (error) {
      console.error('Upload setup error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      setUploads(prev => prev.map(u =>
        u.id === uploadId ? {
          ...u,
          status: 'error',
          error: errorMessage,
          endTime: Date.now()
        } : u
      ))
      addToast(`Failed to upload "${file.name}": ${errorMessage}`, 'error')
    }
  }, [addToast])

  const cancelUpload = useCallback((uploadId: string) => {
    setUploads(prev => prev.map(u => {
      if (u.id === uploadId && u.status === 'uploading' && u.abortController) {
        u.abortController.abort()
        return { ...u, status: 'error', error: 'Upload cancelled', endTime: Date.now() }
      }
      return u
    }))
  }, [])

  const clearCompleted = useCallback(() => {
    setUploads(prev => prev.filter(u => u.status !== 'completed'))
  }, [])

  const retryUpload = useCallback((uploadId: string) => {
    const upload = uploads.find(u => u.id === uploadId)
    if (!upload || upload.status !== 'error') return

    // Reset the upload item and retry with stored parameters
    setUploads(prev => prev.map(u =>
      u.id === uploadId ? {
        ...u,
        status: 'pending',
        progress: 0,
        error: undefined,
        startTime: Date.now(),
        endTime: undefined,
        abortController: new AbortController()
      } : u
    ))

    // Retry the upload with stored parameters
    const retryFile = new File([upload.file], upload.file.name, { type: upload.file.type })
    uploadFile(retryFile, upload.parentFolderId, upload.authId)
      .catch(error => {
        console.error('Retry failed:', error)
        addToast(`Retry failed for "${upload.file.name}"`, 'error')
      })
  }, [uploads, uploadFile, addToast])

  const value: UploadContextType = {
    uploads,
    uploadFile,
    cancelUpload,
    clearCompleted,
    retryUpload
  }

  return (
    <UploadContext.Provider value={value}>
      {children}
    </UploadContext.Provider>
  )
}
