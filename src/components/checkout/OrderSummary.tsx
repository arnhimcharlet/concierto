import type { Seat } from "@/lib/types"

export function OrderSummary({ seats, eventTitle }: { seats: Seat[]; eventTitle: string }) {
  const subtotal = seats.reduce((sum, s) => sum + s.price, 0)
  const fee = Math.round(subtotal * 0.1)
  const total = subtotal + fee

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Order Summary</h3>
      <p className="text-sm text-muted-foreground">{eventTitle}</p>

      <div className="space-y-2 text-sm">
        {seats.map((seat) => (
          <div key={seat.id} className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {seat.section} • Row {seat.row} • Seat {seat.number} ({seat.tier})
            </span>
            <span className="font-medium">₱{seat.price.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-border/40 pt-3 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₱{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Service Fee (10%)</span>
          <span>₱{fee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-1.5 border-t border-border/40">
          <span>Total</span>
          <span>₱{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
