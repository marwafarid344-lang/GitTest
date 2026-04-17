"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Notification, NotificationContextType } from '@/lib/types'
import { getStudentSession, StudentUser } from '@/lib/auth'

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<StudentUser | null>(null)
  const supabase = createClient()

  // Load user session on mount
  useEffect(() => {
    const loadUser = async () => {
      const session = await getStudentSession()
      setUser(session)
    }
    loadUser()
  }, [])

  // Dedup guard — prevent fetching more often than every 30 seconds
  const lastFetchRef = React.useRef<number>(0)

  const fetchNotifications = useCallback(async (force = false) => {
    if (!user?.auth_id) return

    // Dedup: skip if fetched within last 30 seconds (unless forced)
    const now = Date.now()
    if (!force && now - lastFetchRef.current < 30_000) return
    lastFetchRef.current = now

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('Notifications')
        .select('id, auth_id, title, message_content, type, provider, seen, created_at')
        .eq('auth_id', user.auth_id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching notifications:', error)
        return
      }

      setNotifications(data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.auth_id, supabase])

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const { error } = await supabase
        .from('Notifications')
        .update({ seen: 'true' })
        .eq('id', notificationId)

      if (error) {
        console.error('Error marking notification as read:', error)
        return
      }

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, seen: 'true' }
            : notif
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [supabase])

  const markAllAsRead = useCallback(async () => {
    if (!user?.auth_id) return

    try {
      const { error } = await supabase
        .from('Notifications')
        .update({ seen: 'true' })
        .eq('auth_id', user.auth_id)
        .eq('seen', 'false')

      if (error) {
        console.error('Error marking all notifications as read:', error)
        return
      }

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, seen: 'true' }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [user?.auth_id, supabase])

  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('Notifications')
        .insert([notification])
        .select()
        .maybeSingle()

      if (error) {
        console.error('Error adding notification:', error)
        return
      }

      if (data) {
        setNotifications(prev => [data, ...prev])
      }
    } catch (error) {
      console.error('Error adding notification:', error)
    }
  }, [supabase])

  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      const { error } = await supabase
        .from('Notifications')
        .delete()
        .eq('id', notificationId)

      if (error) {
        console.error('Error deleting notification:', error)
        return
      }

      setNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      )
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }, [supabase])

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications()
  }, [fetchNotifications])

  // Force fetch notifications (used after login)
  const fetchNotificationsOnLogin = useCallback(async (authId: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('Notifications')
        .select('id, auth_id, title, message_content, type, provider, seen, created_at')
        .eq('auth_id', authId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching notifications on login:', error)
        return
      }

      setNotifications(data || [])
    } catch (error) {
      console.error('Error fetching notifications on login:', error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    if (user?.auth_id) {
      fetchNotifications()
    }
  }, [user?.auth_id, fetchNotifications])

  // Listen for login events to fetch notifications
  useEffect(() => {
    const handleUserLogin = (event: CustomEvent) => {
      const { authId } = event.detail
      if (authId && authId === user?.auth_id) {
        // User has logged in, fetch their notifications
        fetchNotificationsOnLogin(authId)
      }
    }

    window.addEventListener('userLoggedIn', handleUserLogin as EventListener)

    return () => {
      window.removeEventListener('userLoggedIn', handleUserLogin as EventListener)
    }
  }, [user?.auth_id, fetchNotificationsOnLogin])

  // Memoize unread count calculation
  const unreadCount = useMemo(() =>
    notifications.filter(n => n.seen !== 'true').length,
    [notifications]
  )

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    addNotification,
    deleteNotification,
    refreshNotifications,
    fetchNotificationsOnLogin,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
