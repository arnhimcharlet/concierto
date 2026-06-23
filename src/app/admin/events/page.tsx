"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Calendar } from "lucide-react"
import type { Event } from "@/lib/types"

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/events")
      .then((res) => res.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statusColors: Record<string, "secondary" | "default" | "destructive"> = {
    draft: "secondary",
    published: "default",
    cancelled: "destructive",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-sm text-muted-foreground">Manage your events</p>
        </div>
        <Link href="/admin/events/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Event
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground space-y-4">
          <Calendar className="h-12 w-12 mx-auto opacity-30" />
          <p className="text-lg font-medium">No events yet</p>
          <Link href="/admin/events/new">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Create Your First Event
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date_start).toLocaleDateString()} • {event.venue}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusColors[event.status] || "secondary"}>{event.status}</Badge>
                  <Link href={`/admin/events/${event.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
