"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Ticket, DollarSign, Users } from "lucide-react"

interface Stats {
  totalRevenue: number
  ticketsSold: number
  activeEvents: number
  totalOrders: number
}

export function SalesDashboard({ stats }: { stats: Stats }) {
  const cards = [
    { label: "Total Revenue", value: `₱${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-500" },
    { label: "Tickets Sold", value: stats.ticketsSold.toLocaleString(), icon: Ticket, color: "text-primary" },
    { label: "Active Events", value: stats.activeEvents.toLocaleString(), icon: TrendingUp, color: "text-blue-500" },
    { label: "Total Orders", value: stats.totalOrders.toLocaleString(), icon: Users, color: "text-purple-500" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-xl font-bold">{card.value}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
