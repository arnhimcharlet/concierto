import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data: event } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single()

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from("events")
      .update(body)
      .eq("id", eventId)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    if (body.action === "generate_seats" && body.sections) {
      for (const section of body.sections) {
        for (let r = 1; r <= section.rows; r++) {
          const seats = []
          for (let s = 1; s <= section.seatsPerRow; s++) {
            seats.push({
              event_id: eventId,
              section: section.name,
              row: String.fromCharCode(64 + r),
              number: s,
              tier: section.tierId,
              price: 0,
              status: "available",
            })
          }
          const { error } = await supabase.from("seats").insert(seats)
          if (error) throw error
        }
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
