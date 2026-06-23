"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, MapPin, Clock } from "lucide-react"
import type { Event } from "@/lib/types"

export function EventCard({ event }: { event: Event }) {
  const saleDate = new Date(event.on_sale_at)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/events/${event.id}`} className="group block">
        <div className="relative overflow-hidden rounded-xl border border-border/40 bg-card">
          <div
            className="aspect-[16/9] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
            style={{ backgroundColor: event.banner_color || undefined }}
          >
            <div className="absolute inset-0 bg-grid-white opacity-30" />
            <div className="relative z-10 text-center p-6">
              <p className="text-3xl font-black text-white/90 uppercase tracking-widest">
                {event.title.split(" ").slice(0, 3).join(" ")}
              </p>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {event.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(event.date_start).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{event.venue}, {event.city}</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>On Sale: {saleDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
              <span className="text-xs font-medium text-primary">View Details →</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
