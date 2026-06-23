"use client"

import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/providers/AuthProvider"
import { useQueue } from "@/hooks/useQueue"
import { QueueWaitingRoom } from "@/components/queue/QueueWaitingRoom"
import { ArrowLeft, Ticket } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef } from "react"

export default function QueuePage() {
  const { eventId } = useParams<{ eventId: string }>()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { queueState, loading, error, joinQueue, enterEvent } = useQueue(eventId)
  const enteredRef = useRef(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/events/${eventId}/queue`)
    }
  }, [user, authLoading, router, eventId])

  useEffect(() => {
    if (queueState?.status === "entered") {
      router.push(`/events/${eventId}/seats`)
    }
  }, [queueState?.status, router, eventId])

  useEffect(() => {
    if (queueState && !enteredRef.current) {
      enteredRef.current = true
      const timer = setTimeout(() => {
        enterEvent()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [queueState, enterEvent])

  if (authLoading || !user) return null

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href={`/events/${eventId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to event
      </Link>

      <div className="rounded-xl border border-border/40 bg-card">
        <div className="p-4 border-b border-border/40 flex items-center gap-2">
          <Ticket className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Concierto Waiting Room</span>
        </div>

        <QueueWaitingRoom
          queueState={queueState}
          loading={loading}
          error={error}
          onJoinQueue={joinQueue}
          onEnterEvent={enterEvent}
        />
      </div>
    </div>
  )
}
