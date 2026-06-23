import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data: orders } = await supabase
      .from("orders")
      .select("*, order_tickets(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    return NextResponse.json(orders || [])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
