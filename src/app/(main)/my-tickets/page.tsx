"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/AuthProvider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Ticket, Calendar, MapPin, QrCode } from "lucide-react"
import Link from "next/link"

export default function MyTicketsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }
    if (authLoading) return

    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">My Tickets</h1>
        <p className="text-sm text-muted-foreground">View all your purchased tickets</p>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Ticket className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h2 className="text-lg font-medium">No tickets yet</h2>
          <p className="text-muted-foreground text-sm">When you purchase tickets, they&apos;ll appear here.</p>
          <Link href="/">
            <Button>Browse Events</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((order: any) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{order.event_title || "Event"}</h3>
                    </div>
                    {order.tickets?.map((ticket: any) => (
                      <div key={ticket.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <QrCode className="h-8 w-8 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="font-medium">{ticket.section} • Row {ticket.row} • Seat {ticket.number}</p>
                          <p className="text-muted-foreground text-xs">{ticket.tier} • Code: {ticket.ticket_code}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{new Date(order.created_at).toLocaleDateString()}</p>
                    <p className="font-medium text-foreground">₱{Number(order.total).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
