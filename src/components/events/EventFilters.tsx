"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function EventFilters() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search events..." className="pl-9" />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="text-xs">All Categories</Button>
        <Button variant="outline" size="sm" className="text-xs">All Dates</Button>
      </div>
    </div>
  )
}
