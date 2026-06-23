"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { QueueState } from "@/lib/types"
import { QUEUE_POLL_INTERVAL_MS } from "@/lib/constants"

export function useQueue(eventId: string) {
  const [queueState, setQueueState] = useState<QueueState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const fetchPosition = useCallback(async () => {
    try {
      const res = await fetch(`/api/queue/status?eventId=${eventId}`)
      if (!res.ok) throw new Error("Failed to fetch queue status")
      const data = await res.json()
      setQueueState(data)

      if (data.status === "invited" || data.status === "entered" || data.status === "expired") {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Queue error")
    } finally {
      setLoading(false)
    }
  }, [eventId])

  const joinQueue = useCallback(async () => {
    setLoading(true)
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
  }, [eventId, fetchPosition])

  const enterEvent = useCallback(async () => {
    try {
      await fetch("/api/queue/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, action: "enter" }),
      })
      setQueueState(prev => prev ? { ...prev, status: "entered" } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enter")
    }
  }, [eventId])

  useEffect(() => {
    intervalRef.current = setInterval(fetchPosition, QUEUE_POLL_INTERVAL_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchPosition])

  return { queueState, loading, error, joinQueue, enterEvent }
}
