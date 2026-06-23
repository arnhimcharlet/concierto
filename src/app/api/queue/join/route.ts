import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { joinQueue, isQueueOpen, serveNextBatch } from "@/lib/queue"
import { QUEUE_BATCH_SIZE } from "@/lib/constants"

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { eventId } = await request.json()

    if (!eventId) {
      return NextResponse.json({ error: "eventId is required" }, { status: 400 })
    }

    const { data: event } = await supabase
      .from("events")
      .select("on_sale_at")
      .eq("id", eventId)
      .single()

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const queueOpen = await isQueueOpen(event.on_sale_at)
    if (!queueOpen) {
      return NextResponse.json({ error: "Queue is not yet open" }, { status: 400 })
    }

    const { position, totalInQueue } = await joinQueue(eventId, user.id)

    await serveNextBatch(eventId, QUEUE_BATCH_SIZE)

    return NextResponse.json({
      event_id: eventId,
      position,
      total_in_queue: totalInQueue,
      status: "waiting",
      estimated_wait_seconds: (position - 1) * 2,
      is_open: true,
    })
  } catch (error) {
    console.error("joinQueue error:", error)
    return NextResponse.json({ error: "Failed to join queue" }, { status: 500 })
  }
}
