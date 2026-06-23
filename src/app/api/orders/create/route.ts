import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { MAX_TICKETS_PER_ACCOUNT } from "@/lib/constants"

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { eventId, seatIds, attendeeName } = await request.json()

    if (!eventId || !seatIds?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (seatIds.length > MAX_TICKETS_PER_ACCOUNT) {
      return NextResponse.json({ error: `Maximum ${MAX_TICKETS_PER_ACCOUNT} tickets per account` }, { status: 400 })
    }

    const { data: seats, error: seatsError } = await supabase
      .from("seats")
      .select("*")
      .in("id", seatIds)
      .eq("event_id", eventId)

    if (seatsError || !seats || seats.length !== seatIds.length) {
      return NextResponse.json({ error: "Invalid seats" }, { status: 400 })
    }

    const invalidSeat = seats.find(s => s.status === "sold")
    if (invalidSeat) {
      return NextResponse.json({ error: `Seat ${invalidSeat.section} ${invalidSeat.row}${invalidSeat.number} is no longer available` }, { status: 409 })
    }

    const total = seats.reduce((sum, s) => sum + Number(s.price), 0)

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        event_id: eventId,
        status: "completed",
        total,
        expires_at: new Date(Date.now() + 86400000).toISOString(),
      })
      .select()
      .single()

    if (orderError) throw orderError

    const ticketCodes = seats.map((seat) => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let code = "CN-"
      for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length))
      return { seat, code }
    })

    const { error: ticketsError } = await supabase
      .from("order_tickets")
      .insert(
        ticketCodes.map(({ seat, code }) => ({
          order_id: order.id,
          seat_id: seat.id,
          section: seat.section,
          row: seat.row,
          number: seat.number,
          tier: seat.tier,
          ticket_code: code,
          attendee_name: attendeeName,
        }))
      )

    if (ticketsError) throw ticketsError

    const { error: updateError } = await supabase
      .from("seats")
      .update({ status: "sold", held_by: null, held_until: null })
      .in("id", seatIds)

    if (updateError) throw updateError

    return NextResponse.json({
      id: order.id,
      total: order.total,
      status: order.status,
      tickets: ticketCodes.map(({ seat, code }) => ({
        section: seat.section,
        row: seat.row,
        number: seat.number,
        tier: seat.tier,
        ticket_code: code,
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
