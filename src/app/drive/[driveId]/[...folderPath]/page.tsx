"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createBrowserClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Folder,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  NotebookPen,
  FilePlus,
  FileSpreadsheet,
  FileJson,
  FileCode,
  File,
  Download,
  Search,
  Calendar,
  User,
  Eye,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Home,
  ArrowLeft,
  Copy,
  Check,
  Shield,
  Crown,
} from "lucide-react"
import Navigation from "@/components/navigation"
import ScrollAnimatedSection from "@/components/scroll-animated-section"
import { useParams, useRouter } from "next/navigation"
import { getStudentSession } from "@/lib/auth"
import { AdminControls, FileActions, FolderActions } from "@/components/admin-controls"
import { CreateActions } from "@/components/create-actions"
import { AdminAuthWarningButton } from "@/components/admin-auth-warning-button"
import { useDynamicMetadata, dynamicPageMetadata } from "@/lib/dynamic-metadata"
import { isValidDriveId, resolveActualDriveId } from "@/lib/drive-mapping"
import { createSecureDriveUrl } from "@/lib/secure-drive-urls"
import { FileCardSkeleton, StatsCardSkeleton } from "@/components/loading-skeletons"
import { UploadProvider } from "@/components/upload-context"
import { UploadProgressBar } from "@/components/upload-progress-bar"
import AdBanner from "@/components/AdBanner"

interface DriveFile {
  id: string
  name: string
  mimeType: string
  size?: string
  modifiedTime: string
  createdTime: string
  owners?: Array<{ displayName: string; emailAddress: string }>
  webViewLink?: string
  webContentLink?: string
  thumbnailLink?: string
  parents?: string[]
}

interface DriveResponse {
  files: DriveFile[]
  nextPageToken?: string
}

interface FolderInfo {
  id: string
  name: string
  parents?: string[]
}

interface BreadcrumbItem {
  id: string
  name: string
  path: string[]
}

interface CacheItem {
  data: DriveFile[]
  timestamp: number
}

const CACHE_EXPIRATION = 5 * 60 * 1000
const driveCache = new Map<string, CacheItem>()

function getFileIcon(mimeType: string) {
  if (mimeType.includes("folder")) return Folder
  if (mimeType.includes("image")) return FileImage
  if (mimeType.includes("video")) return FileVideo
  if (mimeType.includes("audio")) return FileAudio
  if (mimeType.includes("pdf")) return NotebookPen
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("7z")) return FileArchive
  if (mimeType.includes("json")) return FileJson
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return FileSpreadsheet
  if (mimeType.includes("document") || mimeType.includes("word")) return FilePlus
  if (mimeType.includes("text") || mimeType.includes("plain")) return FileText
  if (mimeType.includes("code") || mimeType.includes("javascript") || mimeType.includes("typescript")) return FileCode
  return File
}

function formatFileSize(bytes?: string) {
  if (!bytes) return "Unknown size"
  const size = Number.parseInt(bytes)
  if (size === 0) return "0 B"

  const units = ["B", "KB", "MB", "GB", "TB"]
  let unitIndex = 0
  let fileSize = size

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024
    unitIndex++
  }

  return `${fileSize.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}



type SortOption = "name" | "modified" | "size" | "type"

// Component to display owner information with username lookup
function OwnerDisplay({ 
  owner, 
  getUsername 
}: { 
  owner: { displayName: string; emailAddress: string }
  getUsername: (email: string) => Promise<string>
}) {
  const [username, setUsername] = useState<string>("Loading...")

  useEffect(() => {
    let mounted = true
    
    const fetchUsername = async () => {
      try {
        const result = await getUsername(owner.emailAddress)
        if (mounted) {
          setUsername(result)
        }
      } catch (error) {
        console.error('Error fetching username for owner:', error)
        if (mounted) {
          setUsername(owner.displayName || "Unknown User")
        }
      }
    }

    fetchUsername()

    return () => {
      mounted = false
    }
  }, [owner.emailAddress, getUsername, owner.displayName])

  return (
    <div className="flex items-center gap-2">
      <User className="w-3 h-3" />
      <span className="truncate">
        Owner: {username}
      </span>
    </div>
  )
}

// Ownership Badge Component with beautiful styling and tooltip
function OwnershipBadge() {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="absolute -top-2 -right-2 z-10" style={{ cursor: 'pointer' ,marginTop:"12px"}}>
        <div className="relative">
          <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Crown className="w-3 h-3 text-yellow-900" />
          </div>
          <div className="absolute inset-0 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full animate-ping opacity-20"></div>
        </div>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gray-900 text-white text-xs py-2 px-3 rounded-lg shadow-xl border border-gray-700 whitespace-nowrap">
            <div className="flex items-center gap-1">
              <Crown className="w-3 h-3 text-yellow-400" />
              <span>Dude it's yours 😂</span>
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="w-2 h-2 bg-gray-900 border-r border-b border-gray-700 transform rotate-45"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DrivePage() {
  const params = useParams()
  const router = useRouter()
  const urlParam = params.driveId as string
  const folderPath = (params.folderPath as string[]) || []

  const [files, setFiles] = useState<DriveFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFiles, setFilteredFiles] = useState<DriveFile[]>([])
  const [currentFolder, setCurrentFolder] = useState<FolderInfo | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [urlCopied, setUrlCopied] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [userSession, setUserSession] = useState<any>(null)
  const [usernameCache, setUsernameCache] = useState<Map<string, string>>(new Map())

  // Hash resolution states
  const [notFound, setNotFound] = useState(false)
  const [actualDriveId, setActualDriveId] = useState<string | null>(null)
  const [isHashed, setIsHashed] = useState(false)

  const currentFolderId = folderPath.length > 0 ? folderPath[folderPath.length - 1] : (actualDriveId || urlParam)
  const isRootLevel = folderPath.length === 0

  // Dynamic metadata
  useDynamicMetadata(dynamicPageMetadata.driveFolder(currentFolder?.name, 
    breadcrumbs.length > 0 ? breadcrumbs[0]?.name : undefined))

  // Resolve URL parameter to actual drive ID
  useEffect(() => {
    const resolved = resolveActualDriveId(urlParam)
    if (resolved) {
      setActualDriveId(resolved)
      setIsHashed(!isValidDriveId(urlParam))
      setNotFound(false)
    } else {
      setNotFound(true)
      setLoading(false)
    }
  }, [urlParam])

  useEffect(() => {
    const loadSession = async () => {
      const session = await getStudentSession()
      setUserSession(session)
      
      // Fetch fresh admin status from database
      if (session?.auth_id) {
        try {
          const response = await fetch(`/api/google-drive/check-access?authId=${session.auth_id}`)
          const result = await response.json()
          
          console.log('Fresh admin status from DB:', result)
          
          // User is admin if they have is_admin=true
          const isUserAdmin = result.isAdmin
          const isUserAuthorized = result.authorized
          console.log('Final admin status:', isUserAdmin, 'Authorized:', isUserAuthorized)
          setIsAdmin(isUserAdmin)
          setIsAuthorized(isUserAuthorized)
        } catch (error) {
          console.error('Error checking admin status:', error)
          // Fallback to session data
          setIsAdmin(session?.is_admin || false)
        }
      }
    }
    
    loadSession()
  }, [])

  const fetchFolderInfo = useCallback(async (folderId: string): Promise<FolderInfo | null> => {
    try {
      if (!userSession) return null

      const cacheKey = `folder-info-${folderId}`;
      const cached = driveCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_EXPIRATION) {
        return cached.data[0] as unknown as FolderInfo;
      }

      console.log(`Fetching folder info for: ${folderId}`);
      
      // For non-admin users, try the public API first, then fallback to authenticated API
      let response
      let url
      
      if (!isAdmin) {
        // Try public API first
        url = `/api/drive/public-files?fileId=${encodeURIComponent(folderId)}&type=info`;
        response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        // If public API fails, fallback to authenticated API
        if (!response.ok) {
          console.log('Public API failed for folder info, trying authenticated API')
          url = `/api/google-drive/files?authId=${userSession.auth_id}&fileId=${encodeURIComponent(folderId)}&type=info`;
          response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
        }
      } else {
        // Admin users use authenticated API directly
        url = `/api/google-drive/files?authId=${userSession.auth_id}&fileId=${encodeURIComponent(folderId)}&type=info`;
        response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.id || !data.name) {
        console.error('Invalid folder data:', data);
        throw new Error('Invalid folder data received');
      }
      
      driveCache.set(cacheKey, { data: [data], timestamp: Date.now() });
      return data;
    } catch (err) {
      console.error("Error fetching folder info:", err);
      setError(err instanceof Error ? err.message : "Failed to load folder information");
      return null;
    }
  }, [userSession, isAdmin]) // Add dependencies for useCallback

  const fetchFolderContents = useCallback(async (folderId: string, pageToken?: string) => {
    try {
      if (!userSession) {
        throw new Error('No user session found')
      }

      const cacheKey = `folder-contents-${folderId}-${pageToken || "initial"}`
      const cached = driveCache.get(cacheKey)

      if (cached && Date.now() - cached.timestamp < CACHE_EXPIRATION) {
        setFiles(cached.data)
        setFilteredFiles(cached.data)
        return
      }

      pageToken ? setIsFetchingMore(true) : setLoading(true)
      setError(null)

      // For non-admin users, try the public API first, then fallback to authenticated API
      let response
      let url
      
      if (!isAdmin) {
        // Try public API first
        url = `/api/drive/public-files?folderId=${folderId}`;
        if (pageToken) {
          url += `&pageToken=${pageToken}`;
        }
        response = await fetch(url);
        
        // If public API fails, fallback to authenticated API
        if (!response.ok) {
          console.log('Public API failed for folder contents, trying authenticated API')
          url = `/api/google-drive/files?authId=${userSession.auth_id}&folderId=${folderId}`;
          if (pageToken) {
            url += `&pageToken=${pageToken}`;
          }
          response = await fetch(url);
        }
      } else {
        // Admin users use authenticated API directly
        url = `/api/google-drive/files?authId=${userSession.auth_id}&folderId=${folderId}`;
        if (pageToken) {
          url += `&pageToken=${pageToken}`;
        }
        response = await fetch(url);
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to fetch files: ${response.statusText}`)
      }

      const data: DriveResponse = await response.json()

      if (pageToken) {
        setFiles((prev) => [...prev, ...(data.files || [])])
        setFilteredFiles((prev) => [...prev, ...(data.files || [])])
      } else {
        setFiles(data.files || [])
        setFilteredFiles(data.files || [])
      }

      setNextPageToken(data.nextPageToken)
      driveCache.set(cacheKey, { data: data.files || [], timestamp: Date.now() })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while loading files")
    } finally {
      pageToken ? setIsFetchingMore(false) : setLoading(false)
    }
  }, [userSession, isAdmin]) // Add isAdmin as dependency

  const buildBreadcrumbs = async () => {
    try {
      const breadcrumbList: BreadcrumbItem[] = []

      // Add root folder
      const rootFolder = await fetchFolderInfo(actualDriveId!)
      if (rootFolder) {
        breadcrumbList.push({
          id: actualDriveId!,
          name: rootFolder.name || "Drive Root",
          path: [],
        })
      }

      // Add each folder in the path
      if (folderPath.length > 0) {
        for (let i = 0; i < folderPath.length; i++) {
          const folderId = folderPath[i]
          const folderInfo = await fetchFolderInfo(folderId)
          if (folderInfo) {
            breadcrumbList.push({
              id: folderId,
              name: folderInfo.name,
              path: folderPath.slice(0, i + 1),
            })
          }
        }
      }

      setBreadcrumbs(breadcrumbList)
    } catch (err) {
      console.error("Error building breadcrumbs:", err)
    }
  }

  const handleFolderClick = (folder: DriveFile) => {
    if (folder.mimeType.includes("folder")) {
      const newPath = [...folderPath, folder.id]
      const secureUrl = createSecureDriveUrl(actualDriveId!, newPath.join("/"))
      if (secureUrl) {
        router.push(secureUrl)
      } else {
        router.push(`/drive/${urlParam}/${newPath.join("/")}`)
      }
    }
  }

  const handleView = (file: DriveFile) => {
    if (file.mimeType.includes("folder")) {
      handleFolderClick(file)
    } else {
      // Open all file types in new tab
      if (file.webViewLink) {
        window.open(file.webViewLink, "_blank", "noopener,noreferrer")
      } else if (file.webContentLink) {
        window.open(file.webContentLink, "_blank", "noopener,noreferrer")
      } else {
        setError("This file cannot be displayed directly")
      }
    }
  }

  const handleBreadcrumbClick = (breadcrumb: BreadcrumbItem) => {
    if (breadcrumb.path.length === 0) {
      const secureUrl = createSecureDriveUrl(actualDriveId!)
      if (secureUrl) {
        router.push(secureUrl)
      } else {
        router.push(`/drive/${urlParam}`)
      }
    } else {
      const secureUrl = createSecureDriveUrl(actualDriveId!, breadcrumb.path.join("/"))
      if (secureUrl) {
        router.push(secureUrl)
      } else {
        router.push(`/drive/${urlParam}/${breadcrumb.path.join("/")}`)
      }
    }
  }

  const handleDownload = (file: DriveFile) => {
    if (file.webContentLink) {
      window.open(file.webContentLink, "_blank", "noopener,noreferrer")
    } else if (file.webViewLink) {
      window.open(file.webViewLink, "_blank", "noopener,noreferrer")
    }
  }

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
      setError("Failed to copy URL to clipboard")
    }
  }

  const goBack = () => {
    if (folderPath.length > 0) {
      const newPath = folderPath.slice(0, -1)
      if (newPath.length === 0) {
        const secureUrl = createSecureDriveUrl(actualDriveId!)
        if (secureUrl) {
          router.push(secureUrl)
        } else {
          router.push(`/drive/${urlParam}`)
        }
      } else {
        const secureUrl = createSecureDriveUrl(actualDriveId!, newPath.join("/"))
        if (secureUrl) {
          router.push(secureUrl)
        } else {
          router.push(`/drive/${urlParam}/${newPath.join("/")}`)
        }
      }
    }
  }

  const handleSort = (option: SortOption) => {
    if (sortOption === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortOption(option)
      setSortDirection("asc")
    }
  }

  const loadMoreFiles = () => {
    if (nextPageToken && !isFetchingMore) {
      fetchFolderContents(currentFolderId, nextPageToken)
    }
  }

  const refreshFiles = () => {
    // Clear cache for current folder to ensure fresh data
    const cacheKey = `folder-contents-${currentFolderId}-${"initial"}`
    driveCache.delete(cacheKey)
    
    // Also clear any pagination cache
    driveCache.forEach((_, key) => {
      if (key.startsWith(`folder-contents-${currentFolderId}-`)) {
        driveCache.delete(key)
      }
    })
    
    fetchFolderContents(currentFolderId)
  }

  // Sort files based on current sort option and direction
  useEffect(() => {
    const sorted = [...filteredFiles].sort((a, b) => {
      let comparison = 0

      switch (sortOption) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "modified":
          comparison = new Date(a.modifiedTime).getTime() - new Date(b.modifiedTime).getTime()
          break
        case "size":
          comparison = (Number(a.size) || 0) - (Number(b.size) || 0)
          break
        case "type":
          comparison = a.mimeType.localeCompare(b.mimeType)
          break
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    setFilteredFiles(sorted)
  }, [sortOption, sortDirection, files])

  // Filter files based on search
  useEffect(() => {
    const filtered = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    setFilteredFiles(filtered)
  }, [searchQuery, files])

  const supabase = createBrowserClient()

  // Check if current user owns the file
  const isCurrentUserOwner = (file: DriveFile): boolean => {
    if (!userSession?.email || !file.owners) return false
    
    return file.owners.some(owner => 
      owner.emailAddress.toLowerCase() === userSession.email.toLowerCase()
    )
  }

  const getUsername = async (email: string): Promise<string> => {
    // Check cache first
    if (usernameCache.has(email)) {
      return usernameCache.get(email)!
    }

    try {
      const { data: userData, error } = await supabase
        .from("chameleons")
        .select("username")
        .eq("email", email)
        .single()

      if (error || !userData) {
        console.log(`No user found for email: ${email}`)
        const fallback = "Unknown User"
        setUsernameCache(prev => new Map(prev).set(email, fallback))
        return fallback
      }

      const username = userData.username || "Unknown User"
      
      // Cache the result
      setUsernameCache(prev => new Map(prev).set(email, username))
      
      return username
    } catch (error) {
      console.error('Error fetching username:', error)
      const fallback = "Unknown User"
      setUsernameCache(prev => new Map(prev).set(email, fallback))
      return fallback
    }
  }
  // Load folder contents and info when path changes
  useEffect(() => {
    if (actualDriveId && userSession && !notFound) {
      fetchFolderContents(currentFolderId)
      buildBreadcrumbs()

      if (!isRootLevel) {
        fetchFolderInfo(currentFolderId).then(setCurrentFolder)
      } else {
        fetchFolderInfo(actualDriveId).then((folder) => {
          setCurrentFolder(folder ? { ...folder, name: folder.name || "Drive Root" } : null)
        })
      }
    }
  }, [actualDriveId, folderPath.join("/"), fetchFolderContents, userSession, notFound])

  return (
    <UploadProvider>
      <div className="min-h-screen bg-[#030303] overflow-x-hidden">
        <Navigation />

        {/* Upload Progress Bar */}
        <UploadProgressBar />

        {/* Not Found Page */}
        {notFound && (
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-md mx-auto">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Drive Not Found</h1>
              <p className="text-gray-400 mb-6">
                The requested drive could not be accessed. It may not exist or you may not have permission to view it.
              </p>
              <Button 
                onClick={() => router.push('/')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Return Home
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!notFound && (
        <>
          {/* Background Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
            {/* Static background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
              style={{ backgroundImage: 'url(/images/Background.png)' }}
            />
          </div>

      {/* Header Section */}
      <div className="pt-32 pb-16 relative z-10">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="mb-6" style={{ marginTop: "-60px" }}>
            {/* Back Button and URL Copy */}
            <div className="flex items-center justify-between mb-4 gap-2">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                {!isRootLevel && (
                  <Button
                    onClick={goBack}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm hover:scale-105 transition-transform hover:text-white hover:cursor-pointer"
                    aria-label="Go back to previous folder"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Back</span>
                  </Button>
                )}
                {isAdmin && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Admin Access</span>
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                {isAdmin && (
                  isAuthorized ? (
                    <CreateActions
                      currentFolderId={currentFolderId}
                      onFileCreated={refreshFiles}
                      userSession={userSession}
                    />
                  ) : (
                    <AdminAuthWarningButton
                      onAuthorize={async () => {
                        if (userSession) {
                          try {
                            const response = await fetch(`/api/google-drive/auth?authId=${userSession.auth_id}&isAdmin=${userSession.is_admin}`);
                            const result = await response.json();
                            
                            if (response.ok && result.authUrl) {
                              window.location.href = result.authUrl;
                            } else {
                              console.error('Failed to get authorization URL:', result.error);
                              alert('Failed to initiate authorization. Please try again.');
                            }
                          } catch (error) {
                            console.error('Error during authorization:', error);
                            alert('An error occurred during authorization. Please try again.');
                          }
                        }
                      }}
                    />
                  )
                )}
                <Button
                  onClick={copyCurrentUrl}
                  variant="outline"
                  size="sm"
                  className="bg-white/5 border-white/20 text-white/40 hover:bg-white/10 text-xs sm:text-sm hover:scale-105 transition-transform hover:text-white hover:cursor-pointer"
                  aria-label="Copy current URL to clipboard"
                >
                  {urlCopied ? (
                    <>
                      <Check className="w-4 h-4 mr-1 sm:mr-2 text-green-400" />
                      <span className="hidden sm:inline text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline text-white">Copy URL</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb navigation">
              <div className="flex items-center gap-1 sm:gap-2 mb-4 flex-wrap overflow-x-auto">
                {breadcrumbs.map((breadcrumb, index) => (
                  <div key={breadcrumb.id} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    {index > 0 && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/40" aria-hidden="true" />}
                    <button
                      onClick={() => handleBreadcrumbClick(breadcrumb)}
                      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-lg transition-colors duration-150 text-xs sm:text-sm whitespace-nowrap ${
                        index === breadcrumbs.length - 1
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                      aria-current={index === breadcrumbs.length - 1 ? "page" : false}
                    >
                      {index === 0 ? (
                        <Home className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                      ) : (
                        <Folder className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                      )}
                      <span className="font-medium">{breadcrumb.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            </nav>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <Folder className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span className="text-sm text-white/60 tracking-wide">
                {isRootLevel ? "Drive Root" : "Folder Contents"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-5xl font-bold text-white mb-4 px-2 leading-tight break-words" style={{fontSize: '50px', fontWeight: '700'}}>
              {currentFolder ? (
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {currentFolder.name}
              </span>
              ) : (
              <>
                Drive{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Content
                </span>
              </>
              )}
            </h1>

            <p className="text-sm sm:text-lg text-white/60 max-w-2xl mx-auto mb-6 px-2">
              {isRootLevel
                ? "Explore and manage your Google Drive files with our beautiful interface"
                : `Exploring the contents of ${currentFolder?.name || "this folder"}`}
            </p>

            {/* Search and Sort Controls */}
            <div className="max-w-3xl mx-auto flex flex-col gap-3 px-2">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-blue-500/50 focus:ring-blue-500/20 w-full"
                  aria-label="Search files"
                />
              </div>
              <div className="flex gap-2 justify-center flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort("name")}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm hover:text-purple-400 transition-colors duration-150"
                >
                  Name {sortOption === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort("modified")}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm hover:text-purple-400"
                >
                  Modified {sortOption === "modified" && (sortDirection === "asc" ? "↑" : "↓")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="pb-20 relative z-10 mt-[-75px]">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {loading ? (
              <>
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
              </>
            ) : (
              <>
                <ScrollAnimatedSection animation="slideUp" delay={0.05}>
                  <Card className="bg-white/[0.02] border-white/10 text-center">
                    <CardContent className="p-3" style={{ marginTop:'-34px',marginBottom:'-22px' }}>
                      <div className="text-xl font-bold text-purple-500 mb-1">{filteredFiles.length}</div>
                      <div className="text-xs text-white/60">Total Items</div>
                    </CardContent>
                  </Card>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection animation="slideUp" delay={0.1}>
                  <Card className="bg-white/[0.02] border-white/10 text-center">
                    <CardContent className="p-3" style={{ marginTop:'-34px',marginBottom:'-22px' }}>
                      <div className="text-xl font-bold text-purple-500 mb-1">
                        {filteredFiles.filter((f) => f.mimeType.includes("folder")).length}
                      </div>
                      <div className="text-xs text-white/60">Folders</div>
                    </CardContent>
                  </Card>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection animation="slideUp" delay={0.15}>
                  <Card className="bg-white/[0.02] border-white/10 text-center">
                    <CardContent className="p-3" style={{ marginTop:'-34px',marginBottom:'-22px' }}>
                      <div className="text-xl font-bold text-purple-500 mb-1">
                        {filteredFiles.filter((f) => f.mimeType.includes("image")).length}
                      </div>
                      <div className="text-xs text-white/60">Images</div>
                    </CardContent>
                  </Card>
                </ScrollAnimatedSection>

                <ScrollAnimatedSection animation="slideUp" delay={0.2}>
                  <Card className="bg-white/[0.02] border-white/10 text-center">
                    <CardContent className="p-3" style={{ marginTop:'-34px',marginBottom:'-22px' }}>
                      <div className="text-xl font-bold text-purple-500 mb-1">
                        {filteredFiles.filter((f) => !f.mimeType.includes("folder") && !f.mimeType.includes("image")).length}
                      </div>
                      <div className="text-xs text-white/60">Documents</div>
                    </CardContent>
                  </Card>
                </ScrollAnimatedSection>
              </>
            )}
          </div>
          
          <div className="mb-8">
            <AdBanner dataAdSlot="8021269551" />
          </div>

          {/* Loading State */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <FileCardSkeleton key={index} isLoggedIn={!!userSession} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <div className="text-center py-20">
                <Card className="bg-red-500/10 border-red-500/20 max-w-md mx-auto">
                  <CardContent className="p-6">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Error Loading Files</h3>
                    <p className="text-white/60 mb-4">{error}</p>
                    <Button
                      onClick={() => fetchFolderContents(currentFolderId)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                      disabled={loading}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </AnimatePresence>

          {/* Files Grid */}
          <AnimatePresence>
            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredFiles.map((file) => {
                    const FileIcon = getFileIcon(file.mimeType)
                    const isFolder = file.mimeType.includes("folder")
                    const isImage = file.mimeType.includes("image")
                    const isPDF = file.mimeType.includes("pdf")

                    return (
                      <Card
                        key={file.id}
                        className={`bg-white/[0.02] border-white/10 hover:bg-white/[0.04] transition-colors duration-150 group h-full cursor-pointer ${
                          isFolder ? "hover:border-blue-500/30" : "hover:border-purple-500/30"
                        }`}
                        onClick={() => isFolder ? handleFolderClick(file) : handleView(file)}
                        role="button"
                        aria-label={isFolder ? `Open folder ${file.name}` : `View file ${file.name}`}
                      >
                        <CardHeader className="pb-2 relative overflow-hidden">
                          {/* Ownership Badge */}
                          {isCurrentUserOwner(file) && (
                            <OwnershipBadge />
                          )}
                          
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-150 ${
                                isFolder
                                  ? "bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30"
                                  : isPDF
                                    ? "bg-red-500/20 text-red-400"
                                    : isImage
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-purple-500/20 text-purple-400"
                              }`}
                            >
                              {isImage && file.thumbnailLink ? (
                                <img
                                  src={file.thumbnailLink.replace("=s220", "=s500") || "https://cdn-icons-png.flaticon.com/512/5676/5676033.png"}
                                  alt={file.name}
                                  className="w-full h-full object-cover rounded-lg"
                                  loading="lazy"
                                />
                              ) : (
                                <FileIcon className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-white text-sm font-medium truncate" title={file.name}>
                                {file.name}
                                {isFolder && <ChevronRight className="inline w-4 h-4 ml-1 opacity-60" />}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className={`text-xs bg-white/5 border-white/20 text-white/60 ${
                                    isFolder ? "border-blue-500/30 text-blue-400" : ""
                                  }`}
                                >
                                  {isFolder ? "Folder" : file.mimeType.split("/")[1]?.toUpperCase() || "File"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0 pb-3">
                          <div className="space-y-1 text-xs text-white/50 mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              <span>Modified: {formatDate(file.modifiedTime)}</span>
                            </div>
                            {file.size && (
                              <div className="flex items-center gap-2">
                                <FileText className="w-3 h-3" />
                                <span>Size: {formatFileSize(file.size)}</span>
                              </div>
                            )}
                            {file.owners?.[0] && (
                              <OwnerDisplay 
                                owner={file.owners[0]} 
                                getUsername={getUsername}
                              />
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleView(file)
                              }}
                              className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 text-xs"
                              aria-label={isFolder ? `Open folder ${file.name}` : `View file ${file.name}`}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              {isFolder ? "Open" : isPDF ? "View PDF" : "View"}
                            </Button>
                            {!isFolder && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDownload(file)
                                }}
                                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30 text-xs"
                                aria-label={`Download file ${file.name}`}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            )}
                          </div>

                          {isAdmin && !isFolder && (
                            <div 
                              className="mt-2 pt-2 border-t border-white/10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FileActions
                                fileId={file.id}
                                fileName={file.name}
                                onDeleted={refreshFiles}
                                onRenamed={refreshFiles}
                              />
                            </div>
                          )}

                          {isAdmin && isFolder && (
                            <div 
                              className="mt-2 pt-2 border-t border-white/10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FolderActions
                                folderId={file.id}
                                folderName={file.name}
                                onDeleted={refreshFiles}
                                onRenamed={refreshFiles}
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Load More Button */}
                {nextPageToken && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={loadMoreFiles}
                      variant="outline"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      disabled={isFetchingMore}
                    >
                      {isFetchingMore ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More Files"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!loading && !error && filteredFiles.length === 0 && (
            <div className="text-center py-20">
              <Folder className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Files Found</h3>
              <p className="text-white/60">
                {searchQuery ? "No files match your search criteria." : "This folder appears to be empty."}
              </p>
            </div>
          )}
        </div>
      </div>
        </>
      )}
      </div>
    </UploadProvider>
  )
}
