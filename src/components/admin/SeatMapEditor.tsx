"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import type { SeatTier, VenueSection } from "@/lib/types"

interface SectionInput {
  name: string
  label: string
  rows: number
  seatsPerRow: number
  tierId: string
}

interface Props {
  tiers: SeatTier[]
  sections: SectionInput[]
  onSectionsChange: (sections: SectionInput[]) => void
  onSave: () => Promise<void>
}

export function SeatMapEditor({ tiers, sections, onSectionsChange, onSave }: Props) {
  const [saving, setSaving] = useState(false)

  const addSection = () => {
    onSectionsChange([
      ...sections,
      { name: "", label: "", rows: 5, seatsPerRow: 10, tierId: tiers[0]?.id || "" },
    ])
  }

  const removeSection = (index: number) => {
    onSectionsChange(sections.filter((_, i) => i !== index))
  }

  const updateSection = (index: number, field: keyof SectionInput, value: string | number) => {
    const updated = sections.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    )
    onSectionsChange(updated)
  }

  const handleSave = async () => {
    setSaving(true)
    await onSave()
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Venue Sections</h3>
        <Button onClick={addSection} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" /> Add Section
        </Button>
      </div>

      {sections.map((section, index) => (
        <div key={index} className="p-4 rounded-lg border border-border/40 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Section {index + 1}</span>
            <Button variant="ghost" size="icon" onClick={() => removeSection(index)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Code</Label>
              <Input value={section.name} onChange={(e) => updateSection(index, "name", e.target.value)} placeholder="VIP-A" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Label</Label>
              <Input value={section.label} onChange={(e) => updateSection(index, "label", e.target.value)} placeholder="VIP Section A" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Rows</Label>
              <Input type="number" value={section.rows} onChange={(e) => updateSection(index, "rows", parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Seats per Row</Label>
              <Input type="number" value={section.seatsPerRow} onChange={(e) => updateSection(index, "seatsPerRow", parseInt(e.target.value) || 0)} />
            </div>
          </div>
        </div>
      ))}

      {sections.length > 0 && (
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Generating Seats..." : "Generate Seats"}
        </Button>
      )}
    </div>
  )
}
