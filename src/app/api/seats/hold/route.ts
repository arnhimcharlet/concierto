import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { PURCHASE_WINDOW_SECONDS } from "@/lib/constants"

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { eventId, seatIds } = await request.json()

    if (!eventId || !seatIds?.length) {
      return NextResponse.json({ error: "eventId and seatIds are required" }, { status: 400 })
    }

    const heldUntil = new Date(Date.now() + PURCHASE_WINDOW_SECONDS * 1000).toISOString()

    const { error } = await supabase
      .from("seats")
      .update({
        status: "held",
        held_by: user.id,
        held_until: heldUntil,
      })
      .in("id", seatIds)
      .eq("event_id", eventId)
      .eq("status", "available")

    if (error) {
      return NextResponse.json({ error: "Failed to hold seats" }, { status: 500 })
    }

    return NextResponse.json({ success: true, held_until: heldUntil })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
