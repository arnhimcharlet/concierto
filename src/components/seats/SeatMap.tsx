"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MAX_TICKETS_PER_ACCOUNT } from "@/lib/constants"
import type { Seat } from "@/lib/types"

interface Props {
  seats: Seat[]
  onSelect: (seats: Seat[]) => void
  selectedSeats: Seat[]
}

export function SeatMap({ seats, onSelect, selectedSeats }: Props) {
  const sections = [...new Set(seats.map(s => s.section))]
  const [activeSection, setActiveSection] = useState(sections[0])

  const sectionSeats = seats.filter(s => s.section === activeSection)

  const handleSeatClick = useCallback((seat: Seat) => {
    if (seat.status === "sold") return
    if (seat.status === "held" && !selectedSeats.find(s => s.id === seat.id)) return

    const isSelected = selectedSeats.find(s => s.id === seat.id)
    let newSelected: Seat[]

    if (isSelected) {
      newSelected = selectedSeats.filter(s => s.id !== seat.id)
    } else {
      if (selectedSeats.length >= MAX_TICKETS_PER_ACCOUNT) return
      if (selectedSeats.length === 1 && MAX_TICKETS_PER_ACCOUNT === 2) {
        const first = selectedSeats[0]
        const isAdjacent =
          first.row === seat.row &&
          Math.abs(first.number - seat.number) === 1
        if (!isAdjacent && first.section === seat.section) return
      }
      newSelected = [...selectedSeats, seat]
    }
    onSelect(newSelected)
  }, [selectedSeats, onSelect])

  const rows = [...new Set(sectionSeats.map(s => s.row))].sort()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {sections.map((sec) => (
          <Button
            key={sec}
            variant={activeSection === sec ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection(sec)}
          >
            {sec}
          </Button>
        ))}
      </div>

      <div className="relative overflow-x-auto">
        <div className="mx-auto w-fit space-y-1.5 p-4">
          <div className="flex justify-center mb-6">
            <div className="w-48 h-8 rounded-t-full bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">
              STAGE
            </div>
          </div>

          {rows.map((row) => (
            <div key={row} className="flex items-center gap-2">
              <span className="w-6 text-xs text-muted-foreground text-right">{row}</span>
              <div className="flex gap-1">
                {sectionSeats
                  .filter(s => s.row === row)
                  .sort((a, b) => a.number - b.number)
                  .map((seat) => {
                    const isSelected = selectedSeats.find(s => s.id === seat.id)
                    const isSold = seat.status === "sold"
                    const isHeld = seat.status === "held" && !isSelected

                    return (
                      <motion.button
                        key={seat.id}
                        whileHover={!isSold && !isHeld ? { scale: 1.15 } : undefined}
                        whileTap={!isSold && !isHeld ? { scale: 0.95 } : undefined}
                        onClick={() => handleSeatClick(seat)}
                        disabled={isSold || isHeld}
                        className={`
                          w-7 h-7 rounded-t-md text-[10px] font-medium transition-colors
                          ${isSelected
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                            : isSold
                            ? "bg-muted text-muted-foreground/30 cursor-not-allowed"
                            : isHeld
                            ? "bg-amber-500/20 text-amber-500/50 cursor-not-allowed"
                            : "bg-muted-foreground/10 text-muted-foreground hover:bg-primary/20 hover:text-primary cursor-pointer"
                          }
                        `}
                      >
                        {seat.number}
                      </motion.button>
                    )
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
