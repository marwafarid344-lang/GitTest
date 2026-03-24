"use client"

import { useEffect, useMemo, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, CheckCheck, Bell, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/hooks/use-notifications"
import { formatDistanceToNow } from "date-fns"

const urlRegex = /(https?:\/\/[^\s]+)/g;

function renderMessageWithLinks(message: string | null | undefined) {
  if (!message) return 'No content';
  const parts = message.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a 
          key={i} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const { notifications, markAllAsRead, isLoading, deleteNotification } = useNotifications()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Memoize expensive calculations
  const hasUnreadNotifications = useMemo(() =>
    notifications.some(n => n.seen !== 'true'),
    [notifications]
  )

  // Memoize type styles to avoid recalculation on every render
  const getTypeStyles = useCallback((type: string | null) => {
    switch (type?.toLowerCase()) {
      case 'info':
        return {
          border: 'border-blue-500/30',
          bg: 'bg-blue-500/10',
          text: 'text-blue-300',
          icon: 'text-blue-400'
        }
      case 'success':
        return {
          border: 'border-green-500/30',
          bg: 'bg-green-500/10',
          text: 'text-green-300',
          icon: 'text-green-400'
        }
      case 'warning':
        return {
          border: 'border-yellow-500/30',
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-300',
          icon: 'text-yellow-400'
        }
      case 'failure':
      case 'error':
        return {
          border: 'border-red-500/30',
          bg: 'bg-red-500/10',
          text: 'text-red-300',
          icon: 'text-red-400'
        }
      default:
        return {
          border: 'border-white/10',
          bg: 'bg-white/5',
          text: 'text-white/70',
          icon: 'text-white/50'
        }
    }
  }, [])

  // Memoize time formatting
  const formatTime = useCallback((dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Unknown time'
    }
  }, [])

  // Mark all as read when dropdown opens - only if there are unread notifications
  useEffect(() => {
    if (isOpen && hasUnreadNotifications) {
      markAllAsRead()
    }
  }, [isOpen, hasUnreadNotifications, markAllAsRead])

  // Handle delete with confirmation
  const handleDelete = useCallback(async (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation()

    // Simple confirmation - could be enhanced with a modal
    if (window.confirm('Are you sure you want to delete this notification?')) {
      await deleteNotification(notificationId)
    }
  }, [deleteNotification])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  // Prevent body scroll when dropdown is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '0px' // Prevent layout shift
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - improved for better performance and no glitches */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'auto'
            }}
          />

          {/* Dropdown Menu - improved accessibility and performance */}
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-80 max-h-[500px] bg-[#030303]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl z-50 notification-dropdown"
            role="dialog"
            aria-label="Notifications"
            aria-modal="true"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white" id="notification-title">
                Notifications Center
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/70 hover:text-white hover:bg-white/10"
                aria-label="Close notifications"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content - improved scrolling */}
            <div className="relative">
              <ScrollArea className="h-96 w-full notification-scroll-area">
                <div className="pr-4">
                  {isLoading ? (
                    <div className="p-4 text-center text-white/50" role="status" aria-live="polite">
                      Loading notifications...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-white/50">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    <div
                      className="space-y-0"
                      role="list"
                      aria-label="Notification list"
                    >
                      {notifications.map((notification) => {
                        const styles = getTypeStyles(notification.type)
                        return (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors duration-150 border-l-4 ${styles.border} ${styles.bg} ${
                              notification.seen !== 'true' ? 'bg-blue-500/5' : ''
                            } last:border-b-0`}
                            role="listitem"
                          >
                            <div className="flex flex-col gap-2">
                              {/* Header with title and type badge */}
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium text-white truncate">
                                  {notification.title || 'Notification'}
                                </h4>
                                {notification.type && (
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${styles.bg} ${styles.text} border ${styles.border}`}
                                    aria-label={`Type: ${notification.type}`}
                                  >
                                    {notification.type}
                                  </span>
                                )}
                              </div>
                              
                              {/* Message content - auto-expanding without overflow */}
                              <div className="w-full">
                                <p className="text-xs text-white/70 whitespace-pre-wrap break-words">
                                  {renderMessageWithLinks(notification.message_content)}
                                </p>
                              </div>
                              
                              {/* Provider badge if exists */}
                              {notification.provider && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                                    {notification.provider}
                                  </span>
                                </div>
                              )}
                              
                              {/* Time */}
                              <p className="text-xs text-white/50">
                                {formatTime(notification.created_at)}
                              </p>
                              
                              {/* Action buttons - bottom left */}
                              <div className="flex items-center gap-2 mt-2">
                                {notification.seen === 'true' ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 transition-colors duration-150 flex items-center gap-1"
                                    aria-label="Read"
                                    disabled
                                  >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    <span className="text-xs">Read</span>
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors duration-150 flex items-center gap-1"
                                    aria-label="Unread"
                                  >
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    <span className="text-xs">Unread</span>
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => handleDelete(notification.id, e)}
                                  className="h-7 px-2 text-white/50 hover:text-red-400 hover:bg-red-500/20 transition-colors duration-150 flex items-center gap-1"
                                  aria-label={`Delete notification: ${notification.title || 'Notification'}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span className="text-xs">Delete</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-white/10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="w-full text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-150"
                  disabled={!hasUnreadNotifications}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
