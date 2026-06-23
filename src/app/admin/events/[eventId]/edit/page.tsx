"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { EventForm } from "@/components/admin/EventForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "sonner"
import { Settings } from "lucide-react"
import type { Event } from "@/lib/types"

export default function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch(() => toast.error("Failed to load event"))
      .finally(() => setLoading(false))
  }, [eventId])

  const handleSave = async (data: Partial<Event>) => {
    const res = await fetch(`/api/admin/events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to update event")
    }

    toast.success("Event updated!")
  }

  if (loading) {
    return <div className="animate-pulse h-96 rounded-lg bg-muted" />
  }

  if (!event) {
    return <div className="text-center py-16 text-muted-foreground">Event not found.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Event</h1>
          <p className="text-sm text-muted-foreground">{event.title}</p>
        </div>
        <Link href={`/admin/events/${eventId}/seats`}>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" /> Manage Seats
          </Button>
        </Link>
      </div>
      <EventForm initialData={event} onSave={handleSave} />
    </div>
  )
}
