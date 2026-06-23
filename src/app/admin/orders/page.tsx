"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrdersTable } from "@/components/admin/OrdersTable"
import type { Order } from "@/lib/types"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">View all ticket orders</p>
      </div>
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground animate-pulse">Loading orders...</div>
          ) : (
            <OrdersTable orders={orders} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
