//app/drive/[driveId]/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createBrowserClient } from "@/lib/supabase/client";
import {
  FileText,
  Folder,
  ImageIcon,
  Video,
  Music,
  Archive,
  Download,
  Search,
  Calendar,
  User,
  Eye,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Shield,
  Crown,
} from "lucide-react";
import Navigation from "@/components/navigation";
import ScrollAnimatedSection from "@/components/scroll-animated-section";
import { useParams, useRouter } from "next/navigation";
import { getStudentSession } from "@/lib/auth";
import {
  AdminControls,
  FileActions,
  FolderActions,
} from "@/components/admin-controls";
import { CreateActions } from "@/components/create-actions";
import { AdminAuthWarningButton } from "@/components/admin-auth-warning-button";
import {
  FileCardSkeleton,
  StatsCardSkeleton,
} from "@/components/loading-skeletons";
import { filesCache, folderInfoCache, getCacheKey } from "@/lib/fast-cache";
import {
  useDynamicMetadata,
  dynamicPageMetadata,
} from "@/lib/dynamic-metadata";
import { isValidDriveId, resolveActualDriveId } from "@/lib/drive-mapping";
import { createSecureDriveUrl } from "@/lib/secure-drive-urls";
import { AdminAuthGuard } from "@/components/AdminAuthGuard";
import { UploadProvider } from "@/components/upload-context";
import { UploadProgressBar } from "@/components/upload-progress-bar";
import AdBanner from "@/components/AdBanner";

// Module-level caches persist across navigations within the same browser session.
// resultCache: stores resolved usernames so we never re-fetch the same email.
// inFlightCache: deduplicates concurrent requests — if 100 components ask for the
// same email simultaneously, only one DB request is made; all others await it.
const usernameResultCache = new Map<string, string>();
const usernameInFlightCache = new Map<string, Promise<string>>();

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  createdTime: string;
  owners?: Array<{ displayName: string; emailAddress: string }>;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  parents?: string[];
}

interface DriveResponse {
  files: DriveFile[];
  nextPageToken?: string;
}

interface FolderInfo {
  id: string;
  name: string;
  parents?: string[];
}

function getFileIcon(mimeType: string) {
  if (mimeType.includes("folder")) return Folder;
  if (mimeType.includes("image")) return ImageIcon;
  if (mimeType.includes("video")) return Video;
  if (mimeType.includes("audio")) return Music;
  if (mimeType.includes("zip") || mimeType.includes("rar")) return Archive;
  return FileText;
}

function formatFileSize(bytes?: string) {
  if (!bytes) return "Unknown size";
  const size = Number.parseInt(bytes);
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  let fileSize = size;

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex++;
  }

  return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type SortOption = "name" | "modified" | "size" | "type";

// Ownership Badge Component with beautiful styling and tooltip
function OwnershipBadge() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className="absolute -top-2 -right-2 z-10"
        style={{ cursor: "pointer", marginTop: "12px" }}
      >
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
  );
}

// Component to display owner information with username lookup
function OwnerDisplay({
  owner,
  getUsername,
}: {
  owner: { displayName: string; emailAddress: string };
  getUsername: (email: string) => Promise<string>;
}) {
  const [username, setUsername] = useState<string>("Loading...");

  useEffect(() => {
    let mounted = true;

    const fetchUsername = async () => {
      try {
        const result = await getUsername(owner.emailAddress);
        if (mounted) {
          setUsername(result);
        }
      } catch (error) {
        console.error("Error fetching username for owner:", error);
        if (mounted) {
          setUsername(owner.displayName || "Unknown User");
        }
      }
    };

    fetchUsername();

    return () => {
      mounted = false;
    };
  }, [owner.emailAddress, getUsername, owner.displayName]);

  return (
    <div className="flex items-center gap-2">
      <User className="w-3 h-3 flex-shrink-0" />
      <span className="truncate">Owner: {username}</span>
    </div>
  );
}

export default function DriveRootPage() {
  const params = useParams();
  const router = useRouter();
  const urlParam = params.driveId as string;

  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFiles, setFilteredFiles] = useState<DriveFile[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [driveInfo, setDriveInfo] = useState<FolderInfo | null>(null);
  const [urlCopied, setUrlCopied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);
  const [fetchingPromises, setFetchingPromises] = useState<
    Map<string, Promise<any>>
  >(new Map());
  const [basicLoaded, setBasicLoaded] = useState(false);

  // Hash resolution states
  const [notFound, setNotFound] = useState(false);
  const [actualDriveId, setActualDriveId] = useState<string | null>(null);
  const [isHashed, setIsHashed] = useState(false);

  // Dynamic metadata
  useDynamicMetadata(dynamicPageMetadata.driveRoot(driveInfo?.name));

  // Supabase client and username fetching function
  const supabase = createBrowserClient();

  const getUsername = useCallback(async (email: string): Promise<string> => {
    // 1. Return immediately if result is already cached
    if (usernameResultCache.has(email)) {
      return usernameResultCache.get(email)!;
    }

    // 2. If a request for this email is already in flight, reuse it instead of
    //    firing a duplicate — this prevents N concurrent DB hits for the same email
    if (usernameInFlightCache.has(email)) {
      return usernameInFlightCache.get(email)!;
    }

    // 3. Fire the DB request and register it in the in-flight map immediately
    const request = supabase
      .from("chameleons")
      .select("username")
      .eq("email", email)
      .maybeSingle()
      .then(({ data: userData, error }) => {
        usernameInFlightCache.delete(email);
        if (error || !userData) {
          console.log(`No user found for email: ${email}`);
          usernameResultCache.set(email, "Unknown User");
          return "Unknown User";
        }
        const username = userData.username || "Unknown User";
        usernameResultCache.set(email, username);
        return username;
      })
      .catch((error) => {
        usernameInFlightCache.delete(email);
        console.error("Error fetching username:", error);
        usernameResultCache.set(email, "Unknown User");
        return "Unknown User";
      });

    usernameInFlightCache.set(email, request);
    return request;
  }, [supabase]);

  // Check if current user owns the file
  const isCurrentUserOwner = (file: DriveFile): boolean => {
    if (!userSession?.email || !file.owners) return false;

    return file.owners.some(
      (owner) =>
        owner.emailAddress.toLowerCase() === userSession.email.toLowerCase()
    );
  };

  // Resolve URL parameter to actual drive ID with enhanced security logging
  useEffect(() => {
    // Log access attempt for security monitoring
    const accessAttempt = {
      urlParam,
      timestamp: new Date().toISOString(),
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
      referrer: typeof window !== "undefined" ? document.referrer : "unknown",
    };

    console.log("Drive access attempt:", accessAttempt);

    const resolved = resolveActualDriveId(urlParam);
    if (resolved) {
      setActualDriveId(resolved);
      // Check if the URL param looks like a secure token (longer than 20 chars and contains URL-safe base64 chars)
      const isSecureToken = urlParam.length > 20 && !isValidDriveId(urlParam);
      setIsHashed(isSecureToken);
      setNotFound(false);

      // Log successful resolution
      console.log("Drive access authorized:", {
        originalParam: urlParam,
        resolvedId: resolved,
        isHashed: isSecureToken,
      });
    } else {
      setNotFound(true);
      setLoading(false);

      // Log unauthorized access attempt
      console.warn("Unauthorized drive access attempt:", {
        urlParam,
        timestamp: accessAttempt.timestamp,
        userAgent: accessAttempt.userAgent,
        referrer: accessAttempt.referrer,
      });
    }
  }, [urlParam]);

  useEffect(() => {
    // Preload session immediately
    const loadSession = async () => {
      const session = await getStudentSession();
      if (session) {
        setUserSession(session);
        setBasicLoaded(true);
        
        // Fetch fresh admin status from database
        try {
          const response = await fetch(
            `/api/google-drive/check-access?authId=${session.auth_id}`
          );
          const result = await response.json();

          console.log("Fresh admin status from DB:", result);

          // User is admin if they have is_admin=true
          const isUserAdmin = result.isAdmin;
          const isUserAuthorized = result.authorized;
          console.log("Final admin status:", isUserAdmin, "Authorized:", isUserAuthorized);
          setIsAdmin(isUserAdmin);
          setIsAuthorized(isUserAuthorized);
        } catch (error) {
          console.error("Error checking admin status:", error);
          // Fallback to session data
          setIsAdmin(session.is_admin || false);
        }
      }
    };

    loadSession();
  }, []);

  const fetchDriveInfo = async () => {
    try {
      if (!userSession || !actualDriveId) return;

      // Check cache first
      const cacheKey = getCacheKey.folderInfo(actualDriveId, isAdmin);
      const cached = folderInfoCache.get(cacheKey);
      if (cached) {
        setDriveInfo(cached);
        return;
      }

      // For non-admin users, try the public API first, then fallback to authenticated API
      let response;
      let endpoint;

      if (!isAdmin) {
        // Try public API first
        endpoint = `/api/drive/public-files?fileId=${encodeURIComponent(
          actualDriveId
        )}&type=info`;
        response = await fetch(endpoint);

        // If public API fails, fallback to authenticated API
        if (!response.ok) {
          console.log(
            "Public API failed for drive info, trying authenticated API"
          );
          endpoint = `/api/google-drive/files?authId=${
            userSession.auth_id
          }&fileId=${encodeURIComponent(actualDriveId)}&type=info`;
          response = await fetch(endpoint);
        }
      } else {
        // Admin users use authenticated API directly
        endpoint = `/api/google-drive/files?authId=${
          userSession.auth_id
        }&fileId=${encodeURIComponent(actualDriveId)}&type=info`;
        response = await fetch(endpoint);
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch drive info: ${response.status}`);
      }

      const data = await response.json();
      setDriveInfo(data);

      // Cache the result
      folderInfoCache.set(cacheKey, data);
    } catch (err) {
      console.error("Error fetching drive info:", err);
    }
  };

  const fetchDriveFiles = async () => {
    try {
      if (!userSession || !actualDriveId) {
        throw new Error("No user session or drive ID found");
      }

      // Check cache first
      const cacheKey = getCacheKey.files(actualDriveId, isAdmin);
      const cached = filesCache.get(cacheKey);
      if (cached) {
        setFiles(cached);
        setFilteredFiles(cached);
        return;
      }

      // Prevent duplicate requests
      if (fetchingPromises.has(cacheKey)) {
        const result = await fetchingPromises.get(cacheKey);
        return result;
      }

      setLoading(true);
      setError(null);

      const fetchPromise = (async () => {
        // For non-admin users, try the public API first, then fallback to authenticated API
        let response;
        let endpoint;

        if (!isAdmin) {
          // Try public API first
          endpoint = `/api/drive/public-files?folderId=${actualDriveId}`;
          response = await fetch(endpoint);

          // If public API fails, fallback to authenticated API
          if (!response.ok) {
            console.log(
              "Public API failed, trying authenticated API for non-admin user"
            );
            endpoint = `/api/google-drive/files?authId=${userSession.auth_id}&folderId=${actualDriveId}`;
            response = await fetch(endpoint);
          }
        } else {
          // Admin users use authenticated API directly
          endpoint = `/api/google-drive/files?authId=${userSession.auth_id}&folderId=${actualDriveId}`;
          response = await fetch(endpoint);
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
              `Failed to fetch files: ${response.status} ${response.statusText}`
          );
        }

        const data: DriveResponse = await response.json();
        const files = data.files || [];

        setFiles(files);
        setFilteredFiles(files);

        // Cache the result
        filesCache.set(cacheKey, files);
        return files;
      })();

      // Store promise to prevent duplicates
      setFetchingPromises((prev) => new Map(prev).set(cacheKey, fetchPromise));

      try {
        await fetchPromise;
      } finally {
        // Clean up promise
        setFetchingPromises((prev) => {
          const newMap = new Map(prev);
          newMap.delete(cacheKey);
          return newMap;
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching files";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (actualDriveId && userSession) {
      // Show basic layout immediately
      setBasicLoaded(true);

      // Then load data
      fetchDriveInfo();
      fetchDriveFiles();
    }
  }, [actualDriveId, userSession, isAdmin]); // Add isAdmin as dependency

  // Sort files based on current sort option and direction
  useEffect(() => {
    const sorted = [...files].sort((a, b) => {
      let comparison = 0;

      switch (sortOption) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "modified":
          comparison =
            new Date(a.modifiedTime).getTime() -
            new Date(b.modifiedTime).getTime();
          break;
        case "size":
          comparison = (Number(a.size) || 0) - (Number(b.size) || 0);
          break;
        case "type":
          comparison = a.mimeType.localeCompare(b.mimeType);
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    // Apply search filter to sorted results
    const filtered = sorted.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFiles(filtered);
  }, [files, sortOption, sortDirection, searchQuery]);

  const handleFolderClick = (folder: DriveFile) => {
    if (folder.mimeType.includes("folder")) {
      // Generate a secure URL for the subfolder navigation
      const secureUrl = createSecureDriveUrl(actualDriveId!, folder.id);
      if (secureUrl) {
        router.push(secureUrl);
      } else {
        // Fallback to original method if secure URL generation fails
        router.push(`/drive/${actualDriveId}/${folder.id}`);
      }
    }
  };

  const handleView = (file: DriveFile) => {
    if (file.mimeType.includes("folder")) {
      handleFolderClick(file);
    } else {
      // Open all file types in new tab
      if (file.webViewLink) {
        window.open(file.webViewLink, "_blank", "noopener,noreferrer");
      } else if (file.webContentLink) {
        window.open(file.webContentLink, "_blank", "noopener,noreferrer");
      }
    }
  };

  const handleDownload = (file: DriveFile) => {
    if (file.webContentLink) {
      window.open(file.webContentLink, "_blank");
    } else if (file.webViewLink) {
      window.open(file.webViewLink, "_blank");
    }
  };

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const refreshFiles = () => {
    if (!actualDriveId) return;

    // Clear cache for this folder
    const cacheKey = getCacheKey.files(actualDriveId, isAdmin);
    filesCache.delete(cacheKey);

    // Refetch files
    fetchDriveFiles();
  };

  const handleSort = (option: SortOption) => {
    if (sortOption === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortOption(option);
      setSortDirection("asc");
    }
  };

  return (
    <UploadProvider>
      <div className="min-h-screen bg-[#030303] overflow-x-hidden">
        <Navigation />

        {/* Upload Progress Bar */}
        <UploadProgressBar />

        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
          {/* Static background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ backgroundImage: "url(/images/Background.png)" }}
          />
        </div>

      {/* 404 Not Found Section */}
      {notFound && (
        <ScrollAnimatedSection className="pt-32 pb-16 relative z-10">
          <div className="container mx-auto px-3 sm:px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Card className="bg-red-500/10 border-red-500/20 max-w-md mx-auto">
                <CardContent className="p-8">
                  <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    404 - Not Found
                  </h3>
                  <p className="text-white/60 mb-4">
                    The drive link you're looking for doesn't exist or is not
                    authorized.
                  </p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-white/40">
                      URL Parameter:{" "}
                      <code className="bg-white/10 px-2 py-1 rounded text-xs">
                        {urlParam}
                      </code>
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push("/drive")}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Go Back to Drive Home
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </ScrollAnimatedSection>
      )}

      {/* Normal Drive Content */}
      {!notFound && (
        <>
          <ScrollAnimatedSection className="pt-32 pb-16 relative z-10">
            <div className="container mx-auto px-3 sm:px-4">
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    {isAdmin && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Admin Access</span>
                      </Badge>
                    )}
                    <Badge
                      className={`text-xs ${
                        isHashed
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">
                        {isHashed ? "Secure URL" : "Direct Access"}
                      </span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    {isAdmin && actualDriveId && (
                      isAuthorized ? (
                        <CreateActions
                          currentFolderId={actualDriveId}
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
                          <Check className="w-4 h-4 mr-1 sm:mr-2 text-green-500" />
                          <span className="hidden sm:inline text-green-500">Copied!</span>
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
              </div>

              <div className="text-center mb-8 sm:mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4 sm:mb-6"
                >
                  <Folder className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white/60 tracking-wide">
                    Drive Root
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  style={{fontSize: '50px', fontWeight: '700'}}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 px-2"
                >
                  {driveInfo ? (
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {driveInfo.name}
                    </span>
                  ) : (
                    <>
                      Drive{" "}
                      <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Content
                      </span>
                    </>
                  )}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="text-sm sm:text-lg text-white/60 max-w-2xl mx-auto mb-6 sm:mb-8 px-2"
                >
                  Explore and manage your files with our beautiful and
                  Intelligent interface
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="max-w-md mx-auto relative px-2"
                >
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-blue-500/50 focus:ring-blue-500/20 w-full"
                  />
                </motion.div>

                {/* Sort Controls */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                  className="flex items-center justify-center gap-2 mt-4 px-2"
                >
                  <Button
                    onClick={() => handleSort("name")}
                    variant="outline"
                    size="sm"
                    className={`text-xs transition-colors duration-200
      ${
        sortOption === "name"
          ? "bg-purple-500 text-white border-purple-500 hover:bg-white hover:text-purple-500"
          : "bg-black text-white border-black hover:bg-white hover:text-black"
      }`}
                  >
                    Name{" "}
                    {sortOption === "name" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </Button>

                  <Button
                    onClick={() => handleSort("modified")}
                    variant="outline"
                    size="sm"
                    className={`text-xs transition-colors duration-200
      ${
        sortOption === "modified"
          ? "bg-purple-500 text-white border-purple-500 hover:bg-white hover:text-purple-500"
          : "bg-black text-white border-black hover:bg-white hover:text-black"
      }`}
                  >
                    Modified{" "}
                    {sortOption === "modified" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </Button>
                </motion.div>
              </div>
            </div>
          </ScrollAnimatedSection>

          <ScrollAnimatedSection className="pb-20 relative z-10 mt-[-75px]">
            <div className="container mx-auto px-3 sm:px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
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
                        <CardContent className="p-3 sm:p-4" style={{ marginTop:'-34px',marginBottom:'-22px' }}>
                          <div className="text-xl sm:text-2xl font-bold text-purple-500 mb-1">
                            {filteredFiles.length}
                          </div>
                          <div className="text-xs sm:text-sm text-white/60">
                            Total Items
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollAnimatedSection>

                    <ScrollAnimatedSection animation="slideUp" delay={0.1}>
                      <Card className="bg-white/[0.02] border-white/10 text-center">
                        <CardContent className="p-3 sm:p-4" style={{ marginTop:'-34px',marginBottom:'-22px' }}>
                          <div className="text-xl sm:text-2xl font-bold text-purple-500 mb-1">
                            {
                              filteredFiles.filter((f) =>
                                f.mimeType.includes("folder")
                              ).length
                            }
                          </div>
                          <div className="text-xs sm:text-sm text-white/60">
                            Folders
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollAnimatedSection>

                    <ScrollAnimatedSection animation="slideUp" delay={0.15}>
                      <Card className="bg-white/[0.02] border-white/10 text-center">
                        <CardContent className="p-3 sm:p-4" style={{ marginTop:'-34px',marginBottom:'-22px' }}>
                          <div className="text-xl sm:text-2xl font-bold text-purple-500 mb-1">
                            {
                              filteredFiles.filter((f) =>
                                f.mimeType.includes("image")
                              ).length
                            }
                          </div>
                          <div className="text-xs sm:text-sm text-white/60">
                            Images
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollAnimatedSection>

                    <ScrollAnimatedSection animation="slideUp" delay={0.2}>
                      <Card className="bg-white/[0.02] border-white/10 text-center">
                        <CardContent className="p-3 sm:p-4" style={{ marginTop:'-34px',marginBottom:'-22px' }}>
                          <div className="text-xl sm:text-2xl font-bold text-purple-500 mb-1">
                            {
                              filteredFiles.filter(
                                (f) =>
                                  !f.mimeType.includes("folder") &&
                                  !f.mimeType.includes("image")
                              ).length
                            }
                          </div>
                          <div className="text-xs sm:text-sm text-white/60">
                            Documents
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollAnimatedSection>
                  </>
                )}
              </div>
              
              <div className="mb-8">
                <AdBanner dataAdSlot="8021269551" />
              </div>

              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
                  >
                    {Array.from({ length: 6 }).map((_, index) => (
                      <FileCardSkeleton key={index} isLoggedIn={!!userSession} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-20"
                  >
                    <Card className="bg-red-500/10 border-red-500/20 max-w-md mx-auto">
                      <CardContent className="p-6">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">
                          Error Loading Files
                        </h3>
                        <p className="text-white/60 mb-4">{error}</p>
                        <Button
                          onClick={fetchDriveFiles}
                          className="bg-red-500 hover:bg-red-600 text-white"
                          disabled={loading}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Try Again
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {!loading && error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-20"
                  >
                    <Card className="bg-red-500/10 border-red-500/20 max-w-md mx-auto">
                      <CardContent className="p-6">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">
                          Error Loading Files
                        </h3>
                        <p className="text-white/60 mb-4">{error}</p>
                        <Button
                          onClick={fetchDriveFiles}
                          className="bg-red-500 hover:bg-red-600 text-white"
                          disabled={loading}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Try Again
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {!loading && !error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
                  >
                    {filteredFiles.map((file, index) => {
                      const FileIcon = getFileIcon(file.mimeType);
                      const isFolder = file.mimeType.includes("folder");
                      const isImage = file.mimeType.includes("image");

                      return (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02, duration: 0.2 }}
                          className="relative w-full h-full"
                        >
                          <Card
                            className={`relative bg-white/[0.02] border-white/10 hover:bg-white/[0.06] hover:border-white/20 hover:scale-[1.02] transition-all duration-300 group h-full cursor-pointer overflow-hidden ${
                              isFolder
                                ? "hover:border-blue-500/40"
                                : "hover:border-green-500/40"
                            }`}
                            onClick={() => handleView(file)}
                          >
                            <CardHeader className="pb-3 relative overflow-hidden">
                              {/* Ownership Badge */}
                              {isCurrentUserOwner(file) && <OwnershipBadge />}

                              <div className="flex items-start gap-3 w-full">
                                <div
                                  className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                                    isFolder
                                      ? "bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30"
                                      : isImage
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-purple-500/20 text-purple-400"
                                  }`}
                                >
                                  {isImage && file.thumbnailLink ? (
                                    <img
                                      src={file.thumbnailLink}
                                      alt={file.name}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <FileIcon className="w-6 h-6" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                                  <div className="w-full">
                                    <CardTitle
                                      className="text-white text-sm font-medium leading-tight break-words max-w-full"
                                      style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        wordBreak: "break-word",
                                        hyphens: "auto",
                                      }}
                                      title={file.name}
                                    >
                                      {file.name}
                                    </CardTitle>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className={`text-xs bg-white/5 border-white/20 text-white/60 flex-shrink-0 ${
                                        isFolder
                                          ? "border-blue-500/30 text-blue-400"
                                          : ""
                                      }`}
                                    >
                                      {isFolder
                                        ? "Folder"
                                        : file.mimeType
                                            .split("/")[1]
                                            ?.toUpperCase() || "File"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="pt-0 relative">
                              <div className="space-y-2 text-xs text-white/50 mb-4">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">
                                    Modified: {formatDate(file.modifiedTime)}
                                  </span>
                                </div>
                                {file.size && (
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">
                                      Size: {formatFileSize(file.size)}
                                    </span>
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
                                    e.stopPropagation();
                                    handleView(file);
                                  }}
                                  className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 text-xs hover:text-white/80"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  {isFolder ? "Open" : "View"}
                                </Button>
                                {!isFolder && (
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDownload(file);
                                    }}
                                    className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30 text-xs"
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
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {!loading && !error && filteredFiles.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <Folder className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Files Found
                  </h3>
                  <p className="text-white/60">
                    {searchQuery
                      ? "No files match your search criteria."
                      : "This drive appears to be empty."}
                  </p>
                </motion.div>
              )}
            </div>
          </ScrollAnimatedSection>
        </>
      )}
      </div>
    </UploadProvider>
  );
}
