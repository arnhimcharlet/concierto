import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getQueuePosition, markUserEntered } from "@/lib/queue"

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const eventId = searchParams.get("eventId")

  if (!eventId) {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 })
  }

  try {
    const state = await getQueuePosition(eventId, user.id)

    if (!state) {
      return NextResponse.json({ error: "Not in queue" }, { status: 404 })
    }

    return NextResponse.json(state)
  } catch (error) {
    return NextResponse.json({ error: "Failed to get queue status" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { eventId, action } = await request.json()

    if (action === "enter") {
      await markUserEntered(eventId, user.id)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update queue status" }, { status: 500 })
  }
}
