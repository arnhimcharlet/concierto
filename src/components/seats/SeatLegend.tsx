export function SeatLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded bg-muted-foreground/10" />
        <span>Available</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded bg-primary" />
        <span>Selected</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded bg-amber-500/20" />
        <span>Held</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded bg-muted" />
        <span>Sold</span>
      </div>
    </div>
  )
}
