"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/AuthProvider"
import { SalesDashboard } from "@/components/admin/SalesDashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboardPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ totalRevenue: 0, ticketsSold: 0, activeEvents: 0, totalOrders: 0 })

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== "admin")) {
      router.push("/admin/login")
      return
    }
    if (authLoading) return

    fetch("/api/admin/events")
      .then((res) => res.json())
      .then((data) => {
        const events = Array.isArray(data) ? data : []
        setStats((prev) => ({ ...prev, activeEvents: events.filter((e: any) => e.status === "published").length }))
      })
      .catch(() => {})

    fetch("/api/admin/events?summary=true")
      .then((res) => res.json())
      .then((data) => {
        if (data) setStats(data)
      })
      .catch(() => {})
  }, [user, profile, authLoading, router])

  if (authLoading) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your event sales</p>
      </div>
      <SalesDashboard stats={stats} />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity to display.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Use the sidebar to manage events, view orders, or configure seat maps.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
