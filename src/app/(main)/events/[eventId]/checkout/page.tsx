"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderSummary } from "@/components/checkout/OrderSummary"
import { MockPaymentForm } from "@/components/checkout/MockPaymentForm"
import { ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import type { Seat } from "@/lib/types"

export default function CheckoutPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [seats, setSeats] = useState<Seat[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [eventTitle, setEventTitle] = useState("")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/events/${eventId}/checkout`)
      return
    }
    if (authLoading) return

    const seatIds = searchParams.get("seats")?.split(",") || []
    if (seatIds.length === 0) {
      router.push(`/events/${eventId}/seats`)
      return
    }

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
  }, [eventId, searchParams, user, authLoading, router])

  const handlePurchase = async () => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          seatIds: seats.map((s) => s.id),
          attendeeName: user?.email?.split("@")[0] || "Attendee",
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Purchase failed")
      }

      const order = await res.json()
      toast.success("Purchase successful! Check your email for the confirmation.")

      console.log("=== MOCK EMAIL ===")
      console.log(`To: ${user?.email}`)
      console.log(`Subject: Your Concierto Tickets - ${eventTitle}`)
      console.log(`Order: ${order.id}`)
      console.log(`Seats: ${seats.map(s => `${s.section} ${s.row}${s.number}`).join(", ")}`)
      console.log("==================")

      router.push(`/success?orderId=${order.id}&eventId=${eventId}&seats=${seats.map(s => s.id).join(",")}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Purchase failed")
      setSubmitting(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading checkout...</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-6">
      <Link
        href={`/events/${eventId}/seats`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to seat selection
      </Link>

      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <MockPaymentForm />
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Demo mode — no real payment will be processed</span>
          </div>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-4">
              <OrderSummary seats={seats} eventTitle={eventTitle} />

              <Button
                onClick={handlePurchase}
                disabled={submitting || seats.length === 0}
                className="w-full"
                size="lg"
              >
                {submitting ? "Processing..." : "Confirm Purchase"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
