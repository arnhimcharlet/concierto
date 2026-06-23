import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/types"

const statusColors: Record<string, "secondary" | "default" | "destructive"> = {
  pending: "secondary",
  completed: "default",
  cancelled: "destructive",
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
              No orders yet
            </TableCell>
          </TableRow>
        )}
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
            <TableCell>{order.event_id.slice(0, 8)}</TableCell>
            <TableCell>₱{Number(order.total).toLocaleString()}</TableCell>
            <TableCell>
              <Badge variant={statusColors[order.status] || "secondary"}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
