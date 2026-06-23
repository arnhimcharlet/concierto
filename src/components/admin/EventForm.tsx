"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Event } from "@/lib/types"

interface Props {
  initialData?: Event
  onSave: (data: Partial<Event>) => Promise<void>
}

export function EventForm({ initialData, onSave }: Props) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [venue, setVenue] = useState(initialData?.venue || "")
  const [city, setCity] = useState(initialData?.city || "")
  const [dateStart, setDateStart] = useState(initialData?.date_start?.slice(0, 16) || "")
  const [dateEnd, setDateEnd] = useState(initialData?.date_end?.slice(0, 16) || "")
  const [onSaleAt, setOnSaleAt] = useState(initialData?.on_sale_at?.slice(0, 16) || "")
  const [category, setCategory] = useState(initialData?.category || "Concert")
  const [status, setStatus] = useState(initialData?.status || "draft")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSave({
      title,
      description,
      venue,
      city,
      date_start: new Date(dateStart).toISOString(),
      date_end: new Date(dateEnd).toISOString(),
      on_sale_at: new Date(onSaleAt).toISOString(),
      category,
      status: status as Event["status"],
    })
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="title">Event Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue">Venue</Label>
          <Input id="venue" value={venue} onChange={(e) => setVenue(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateStart">Start Date & Time</Label>
          <Input id="dateStart" type="datetime-local" value={dateStart} onChange={(e) => setDateStart(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateEnd">End Date & Time</Label>
          <Input id="dateEnd" type="datetime-local" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="onSaleAt">Ticket On-Sale Date</Label>
          <Input id="onSaleAt" type="datetime-local" value={onSaleAt} onChange={(e) => setOnSaleAt(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={(v) => v && setCategory(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Concert">Concert</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Theatre">Theatre</SelectItem>
              <SelectItem value="Festival">Festival</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(v) => v && setStatus(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : initialData ? "Update Event" : "Create Event"}
      </Button>
    </form>
  )
}
