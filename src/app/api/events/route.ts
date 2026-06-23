import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const eventId = searchParams.get("eventId")
  const includeSeats = searchParams.get("seats") === "true"
  const includeTiers = searchParams.get("tiers") === "true"

  const supabase = await createServerSupabaseClient()

  try {
    if (eventId) {
      const { data: event } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single()

      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
      }

      const result: any = { ...event }

      if (includeSeats) {
        const { data: seats } = await supabase
          .from("seats")
          .select("*")
          .eq("event_id", eventId)
          .order("section")
          .order("row")
          .order("number")
        result.seats = seats || []
      }

      if (includeTiers) {
        const { data: tiers } = await supabase
          .from("seat_tiers")
          .select("*")
          .eq("event_id", eventId)
        result.tiers = tiers || []
      }

      return NextResponse.json(result)
    }

    const { data: events } = await supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .order("date_start", { ascending: true })

    return NextResponse.json(events || [])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
