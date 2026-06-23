import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const summary = searchParams.get("summary") === "true"

  try {
    if (summary) {
      const { data: orders } = await supabase.from("orders").select("total, status")
      const { data: events } = await supabase.from("events").select("status")
      const { data: tickets } = await supabase.from("order_tickets").select("id")

      const totalRevenue = (orders || [])
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + Number(o.total), 0)

      return NextResponse.json({
        totalRevenue,
        ticketsSold: tickets?.length || 0,
        activeEvents: events?.filter((e) => e.status === "published").length || 0,
        totalOrders: orders?.filter((o) => o.status === "completed").length || 0,
      })
    }

    const { data: events } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false })

    return NextResponse.json(events || [])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from("events")
      .insert({
        title: body.title,
        description: body.description,
        venue: body.venue,
        city: body.city,
        country: body.country || "Philippines",
        date_start: body.date_start,
        date_end: body.date_end,
        on_sale_at: body.on_sale_at,
        category: body.category || "Concert",
        status: body.status || "draft",
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
