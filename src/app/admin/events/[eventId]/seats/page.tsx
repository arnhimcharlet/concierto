"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { SeatMapEditor } from "@/components/admin/SeatMapEditor"
import { toast } from "sonner"
import type { SeatTier } from "@/lib/types"
import type { VenueSection } from "@/lib/types"

export default function EditSeatsPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const [tiers, setTiers] = useState<SeatTier[]>([])
  const [sections, setSections] = useState<{ name: string; label: string; rows: number; seatsPerRow: number; tierId: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/events?eventId=${eventId}&tiers=true`).then((r) => r.json()),
      fetch(`/api/admin/events/${eventId}`).then((r) => r.json()),
    ])
      .then(([tiersData]) => {
        setTiers(tiersData.tiers || tiersData || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [eventId])

  const handleSave = async () => {
    const res = await fetch(`/api/admin/events/${eventId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate_seats", sections }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to generate seats")
    }

    toast.success("Seats generated!")
  }

  if (loading) {
    return <div className="animate-pulse h-96 rounded-lg bg-muted" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Seat Map Editor</h1>
        <p className="text-sm text-muted-foreground">Configure venue sections and generate seats</p>
      </div>

      {tiers.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No ticket tiers configured. Please add price tiers to the event first.</p>
        </div>
      ) : (
        <SeatMapEditor
          tiers={tiers}
          sections={sections}
          onSectionsChange={setSections}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
