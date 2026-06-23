"use client"

import type { Event } from "@/lib/types"
import { Calendar, MapPin, Clock, ChevronRight } from "lucide-react"

export function EventHero({ event }: { event: Event }) {
  const saleDate = new Date(event.on_sale_at)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card">
      <div className="grid md:grid-cols-2 min-h-[300px]">
        <div className="relative bg-gradient-to-br from-primary/30 via-primary/10 to-primary/5 p-8 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-white opacity-20" />
          <div className="relative z-10 text-center">
            {event.artist_image_url ? (
              <div
                className="w-48 h-48 mx-auto rounded-full bg-cover bg-center ring-4 ring-primary/20"
                style={{ backgroundImage: `url(${event.artist_image_url})` }}
              />
            ) : (
              <div className="space-y-2">
                <div className="text-xs font-semibold tracking-widest text-primary uppercase">World Tour</div>
                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                  {event.title}
                </h2>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 flex flex-col justify-center bg-card">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-lg">{event.venue}</p>
                <p className="text-sm text-muted-foreground">{event.city}, {event.country}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">
                  {new Date(event.date_start).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.date_end).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Ticket Sales</p>
                <p className="text-sm text-muted-foreground">
                  Starts {saleDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>

            {event.sponsors && event.sponsors.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">Presented by</p>
                <div className="flex flex-wrap gap-3">
                  {event.sponsors.map((sponsor) => (
                    <span key={sponsor} className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted text-xs font-medium">
                      {sponsor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
