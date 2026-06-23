"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Ticket, Mail, PartyPopper } from "lucide-react"
import type { Seat } from "@/lib/types"

interface Props {
  orderId: string
  seats: Seat[]
  eventTitle: string
}

export function PurchaseSuccess({ orderId, seats, eventTitle }: Props) {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                top: -20,
                left: Math.random() * 100 + "%",
                rotate: 0,
              }}
              animate={{
                top: "100%",
                rotate: 720,
                opacity: 0,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 1.5,
                ease: "easeIn",
              }}
            >
              <PartyPopper className="h-5 w-5 text-primary" />
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="w-24 h-24 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>

        <h2 className="text-3xl font-bold">Purchase Successful!</h2>
        <p className="text-muted-foreground">
          Your tickets for {eventTitle} have been confirmed.
        </p>

        <div className="p-6 rounded-xl border border-border/40 bg-card space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Ticket className="h-4 w-4 text-primary" />
            <span className="font-medium">Order #{orderId.slice(0, 8)}</span>
          </div>
          {seats.map((seat) => (
            <div key={seat.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Ticket className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left text-sm">
                <p className="font-medium">{seat.section} • Row {seat.row} • Seat {seat.number}</p>
                <p className="text-muted-foreground text-xs">{seat.tier} • ₱{seat.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
            <Mail className="h-3 w-3" />
            <span>Confirmation sent to your email</span>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Link href="/my-tickets">
            <Button variant="outline">View My Tickets</Button>
          </Link>
          <Link href="/">
            <Button>Browse Events</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
