"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { QueueState } from "@/lib/types"
import { QUEUE_POLL_INTERVAL_MS } from "@/lib/constants"

export function useQueue(eventId: string) {
  const [queueState, setQueueState] = useState<QueueState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }, [])

  const fetchPosition = useCallback(async () => {
    try {
      const res = await fetch(`/api/queue/status?eventId=${eventId}`)
      if (!res.ok) throw new Error("Failed to fetch queue status")
      const data = await res.json()
      if (data) {
        setQueueState(data)
        if (data.status === "invited" || data.status === "entered" || data.status === "expired") {
          stopPolling()
        }
      } else {
        setQueueState(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Queue error")
    } finally {
      setLoading(false)
    }
  }, [eventId, stopPolling])

  const joinQueue = useCallback(async () => {
    setLoading(true)
    setError(null)
    stopPolling()
    try {
      const res = await fetch("/api/queue/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to join queue")
      }
      const data = await res.json()
      setQueueState(data)
      intervalRef.current = setInterval(fetchPosition, QUEUE_POLL_INTERVAL_MS)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join queue")
      setLoading(false)
    }
  }, [eventId, fetchPosition, stopPolling])

  const enterEvent = useCallback(async () => {
    try {
      const res = await fetch("/api/queue/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, action: "enter" }),
      })
      if (!res.ok) throw new Error("Failed to enter event")
      setQueueState(prev => prev ? { ...prev, status: "entered" } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enter")
    }
  }, [eventId])

  useEffect(() => {
    fetchPosition()
    return stopPolling
  }, [fetchPosition, stopPolling])

  return { queueState, loading, error, joinQueue, enterEvent }
}
