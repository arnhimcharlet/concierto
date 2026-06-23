"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { EventCard } from "@/components/events/EventCard"
import { EventFilters } from "@/components/events/EventFilters"
import { Button } from "@/components/ui/button"
import { Ticket, ArrowRight, Sparkles } from "lucide-react"
import type { Event } from "@/lib/types"

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-grid-white opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-muted/50 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Live event tickets, reimagined</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
              Your Next Live
              <span className="block text-primary">Experience Awaits</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Secure your spot at the biggest concerts, sports events, and shows. Fair queue system, no bots, just great seats.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button size="lg" className="gap-2">
                <Ticket className="h-5 w-5" />
                Browse Events
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                How It Works <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <p className="text-sm text-muted-foreground mt-1">Discover amazing live experiences</p>
          </div>
        </div>
        <div className="mb-6">
          <EventFilters />
        </div>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-border/40 bg-card p-4 space-y-3 animate-pulse">
                <div className="aspect-[16/9] rounded-lg bg-muted" />
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Ticket className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No events available yet</p>
            <p className="text-sm">Check back soon for upcoming events</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
