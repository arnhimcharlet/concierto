"use client"

import { useRouter } from "next/navigation"
import { EventForm } from "@/components/admin/EventForm"
import { toast } from "sonner"
import type { Event } from "@/lib/types"

export default function NewEventPage() {
  const router = useRouter()

  const handleSave = async (data: Partial<Event>) => {
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to create event")
    }

    const event = await res.json()
    toast.success("Event created!")
    router.push(`/admin/events/${event.id}/edit`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Event</h1>
        <p className="text-sm text-muted-foreground">Set up a new event</p>
      </div>
      <EventForm onSave={handleSave} />
    </div>
  )
}
