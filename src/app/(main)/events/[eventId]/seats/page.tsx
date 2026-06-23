"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/providers/AuthProvider"
import { SeatMap } from "@/components/seats/SeatMap"
import { SeatLegend } from "@/components/seats/SeatLegend"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import type { Seat } from "@/lib/types"
import { PURCHASE_WINDOW_SECONDS, MAX_TICKETS_PER_ACCOUNT } from "@/lib/constants"

export default function SeatsPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(PURCHASE_WINDOW_SECONDS)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/events/${eventId}/seats`)
      return
    }
    if (authLoading) return

    fetch(`/api/events?eventId=${eventId}&seats=true`)
      .then((res) => res.json())
      .then((data) => {
        setSeats(data.seats || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [eventId, user, authLoading, router])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          toast.error("Time expired! Your seat hold has been released.")
          router.push(`/events/${eventId}/queue`)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [eventId, router])

  const handleSelectSeats = useCallback((newSelected: Seat[]) => {
    setSelectedSeats(newSelected)
  }, [])

  const handleHoldSeats = async () => {
    if (selectedSeats.length === 0) return
    try {
      const res = await fetch("/api/seats/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          seatIds: selectedSeats.map((s) => s.id),
        }),
      })
      if (!res.ok) throw new Error("Failed to hold seats")
      router.push(`/events/${eventId}/checkout?seats=${selectedSeats.map(s => s.id).join(",")}`)
    } catch {
      toast.error("Failed to reserve seats. Please try again.")
    }
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timerColor = timeLeft < 120 ? "text-destructive" : timeLeft < 300 ? "text-amber-500" : "text-muted-foreground"

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading seat map...</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/events/${eventId}/queue`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to queue
        </Link>
        <div className={`flex items-center gap-1.5 text-sm font-mono font-medium ${timerColor}`}>
          <Clock className="h-4 w-4" />
          <span>{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="rounded-xl border border-border/40 bg-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Select Your Seats</h2>
            <p className="text-sm text-muted-foreground">
              Choose up to {MAX_TICKETS_PER_ACCOUNT} {MAX_TICKETS_PER_ACCOUNT > 1 ? "adjacent seats" : "seat"}
            </p>
          </div>
          <SeatLegend />
        </div>

        {seats.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>No seats available. The event may be sold out.</p>
          </div>
        ) : (
          <SeatMap seats={seats} onSelect={handleSelectSeats} selectedSeats={selectedSeats} />
        )}
      </div>

      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
          <div className="mx-auto max-w-5xl flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">
                {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} selected
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedSeats.map((s) => `${s.section} ${s.row}${s.number}`).join(", ")}
              </p>
            </div>
            <Button onClick={handleHoldSeats} className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Proceed to Checkout — ₱{selectedSeats.reduce((sum, s) => sum + s.price, 0).toLocaleString()}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
