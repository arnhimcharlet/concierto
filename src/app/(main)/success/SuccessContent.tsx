"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { PurchaseSuccess } from "@/components/checkout/PurchaseSuccess"
import type { Seat } from "@/lib/types"

export function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId") || ""
  const eventId = searchParams.get("eventId") || ""
  const seatIds = searchParams.get("seats")?.split(",") || []
  const [seats, setSeats] = useState<Seat[]>([])
  const [eventTitle, setEventTitle] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!eventId) return

    Promise.all([
      fetch(`/api/events?eventId=${eventId}`).then((r) => r.json()),
      fetch(`/api/events?eventId=${eventId}&seats=true`).then((r) => r.json()),
    ])
      .then(([eventData, seatsData]) => {
        setEventTitle(eventData.title || "Event")
        const filtered = (seatsData.seats || []).filter((s: Seat) => seatIds.includes(s.id))
        setSeats(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [eventId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-muted-foreground">No order information found.</p>
        <Link href="/" className="text-primary hover:underline">Browse Events</Link>
      </div>
    )
  }

  return (
    <PurchaseSuccess orderId={orderId} seats={seats} eventTitle={eventTitle} />
  )
}
