"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Event } from "@/lib/types"

export function EventTabs({ event }: { event: Event }) {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="w-full justify-start border-b border-border/40 rounded-none bg-transparent p-0 h-auto">
        <TabsTrigger
          value="details"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent px-4 py-3 text-sm font-medium data-[state=active]:text-foreground text-muted-foreground"
        >
          Event Details
        </TabsTrigger>
        <TabsTrigger
          value="faq"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent px-4 py-3 text-sm font-medium data-[state=active]:text-foreground text-muted-foreground"
        >
          FAQ
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="pt-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed">{event.description}</p>

          <h3 className="text-lg font-semibold mt-6 mb-2">Event Dates</h3>
          <div className="space-y-2">
            {[event.date_start, event.date_end].map((date, i) => {
              const d = new Date(date)
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/40">
                  <div className="text-center">
                    <div className="text-xs font-medium text-muted-foreground uppercase">{d.toLocaleString("en-US", { month: "short" })}</div>
                    <div className="text-lg font-bold">{d.getDate()}</div>
                    <div className="text-xs font-medium text-muted-foreground">{d.toLocaleString("en-US", { weekday: "short" })}</div>
                  </div>
                  <div className="text-sm">
                    {d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="faq" className="pt-6">
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border/40 bg-card">
            <h4 className="font-semibold mb-1">How do I buy tickets?</h4>
            <p className="text-sm text-muted-foreground">Join the queue when it opens 10 minutes before the scheduled sale. When it&apos;s your turn, you&apos;ll have 15 minutes to select seats and complete your purchase.</p>
          </div>
          <div className="p-4 rounded-lg border border-border/40 bg-card">
            <h4 className="font-semibold mb-1">How many tickets can I buy?</h4>
            <p className="text-sm text-muted-foreground">Maximum of 2 tickets per account. If buying 2, they will be seated beside each other.</p>
          </div>
          <div className="p-4 rounded-lg border border-border/40 bg-card">
            <h4 className="font-semibold mb-1">What happens if I miss my turn?</h4>
            <p className="text-sm text-muted-foreground">You have 60 seconds to enter the venue once notified. If you miss it, your spot in the queue will be forfeited.</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
