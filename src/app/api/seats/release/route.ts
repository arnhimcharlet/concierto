import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { seatIds } = await request.json()

    await supabase
      .from("seats")
      .update({ status: "available", held_by: null, held_until: null })
      .in("id", seatIds)
      .eq("held_by", user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to release seats" }, { status: 500 })
  }
}
