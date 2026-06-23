import { createServerSupabaseClient } from "@/lib/supabase-server"
import { EventDetailClient } from "./EventDetailClient"

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params
  const supabase = await createServerSupabaseClient()

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single()

  const { data: tiers } = await supabase
    .from("seat_tiers")
    .select("*")
    .eq("event_id", eventId)

  if (!event) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Event not found</h1>
          <p className="text-muted-foreground">This event may have been removed or is unavailable.</p>
        </div>
      </div>
    )
  }

  return <EventDetailClient event={event} tiers={tiers || []} />
}
