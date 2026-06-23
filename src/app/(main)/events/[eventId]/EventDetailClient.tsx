"use client"

import { useAuth } from "@/providers/AuthProvider"
import { EventHero } from "@/components/events/EventHero"
import { EventTabs } from "@/components/events/EventTabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ChevronRight, Clock, Users, Ticket } from "lucide-react"
import { SITE_NAME, QUEUE_OPEN_BEFORE_SECONDS } from "@/lib/constants"
import type { Event, SeatTier } from "@/lib/types"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Props {
  event: Event
  tiers: SeatTier[]
}

export function EventDetailClient({ event, tiers }: Props) {
  const { user } = useAuth()
  const [timeLeft, setTimeLeft] = useState("")
  const [isQueueOpen, setIsQueueOpen] = useState(false)

  useEffect(() => {
    const update = () => {
      const now = Date.now()
      const saleTime = new Date(event.on_sale_at).getTime()
      const queueOpenTime = saleTime - QUEUE_OPEN_BEFORE_SECONDS * 1000

      if (now >= saleTime) {
        setTimeLeft("On sale now!")
        setIsQueueOpen(true)
      } else if (now >= queueOpenTime) {
        setTimeLeft("Queue is open!")
        setIsQueueOpen(true)
      } else {
        const diff = queueOpenTime - now
        const minutes = Math.floor(diff / 60000)
        const seconds = Math.floor((diff % 60000) / 1000)
        setTimeLeft(`Queue opens in ${minutes}m ${seconds}s`)
        setIsQueueOpen(false)
      }
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [event.on_sale_at])

  const minPrice = tiers.length > 0 ? Math.min(...tiers.map(t => Number(t.price))) : 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/" className="hover:text-foreground transition-colors">Events</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{event.title.split(" ").slice(0, 4).join(" ")}</span>
      </nav>

      <EventHero event={event} />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventTabs event={event} />
        </div>

        <div className="space-y-4">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Starting from</p>
                <p className="text-3xl font-bold text-primary">₱{minPrice.toLocaleString()}</p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className={isQueueOpen ? "text-green-500 font-medium" : ""}>{timeLeft}</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Ticket className="h-4 w-4" />
                <span>Max 2 tickets per account</span>
              </div>

              {user ? (
                <Link href={`/events/${event.id}/queue`}>
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    disabled={!isQueueOpen}
                  >
                    {isQueueOpen ? (
                      <>
                        <Users className="h-5 w-5" />
                        Join Queue
                      </>
                    ) : (
                      <>
                        <Clock className="h-5 w-5" />
                        {timeLeft}
                      </>
                    )}
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button className="w-full" size="lg">
                    Sign In to Purchase
                  </Button>
                </Link>
              )}

              {tiers.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <p className="text-xs font-medium text-muted-foreground">Available Tiers</p>
                  {tiers.map((tier) => (
                    <div key={tier.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                        <span>{tier.name}</span>
                      </div>
                      <span className="font-medium">₱{Number(tier.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
