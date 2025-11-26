import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log("[v0] GET /api/classes - Starting request")
    const supabase = await createClient()
    console.log("[v0] Supabase client created")

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] Auth check result:", { 
      hasUser: !!user, 
      userId: user?.id,
      authError: authError?.message 
    })

    if (authError) {
      console.error("[v0] Auth error:", authError)
      return NextResponse.json({ error: "Authentication failed", details: authError.message }, { status: 401 })
    }

    if (!user) {
      console.error("[v0] No user found in session")
      return NextResponse.json({ error: "Unauthorized - No user session" }, { status: 401 })
    }

    console.log("[v0] Fetching classes for user:", user.id)
    const { data: classes, error } = await supabase
      .from("classes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 })
    }

    console.log("[v0] Successfully fetched classes:", classes?.length || 0)
    return NextResponse.json(classes || [])
  } catch (error) {
    console.error("[v0] Error fetching classes:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] Auth check result:", { 
      hasUser: !!user, 
      userId: user?.id,
      authError: authError?.message 
    })

    if (authError) {
      console.error("[v0] Auth error:", authError)
      return NextResponse.json({ error: "Authentication failed", details: authError.message }, { status: 401 })
    }

    if (!user) {
      console.error("[v0] No user found in session")
      return NextResponse.json({ error: "Unauthorized - No user session" }, { status: 401 })
    }

    console.log("[v0] Creating new class for user:", user.id)
    const { data: newClass, error } = await supabase
      .from("classes")
      .insert({
        user_id: user.id,
        name: body.name || "Nova Turma",
        period: body.period || "Semestre",
        year: body.year || new Date().getFullYear(),
        semester: body.semester || 1,
        students: body.students || 0,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to create class", details: error.message }, { status: 500 })
    }

    console.log("[v0] Successfully created new class:", newClass)
    return NextResponse.json(newClass)
  } catch (error) {
    console.error("[v0] Error creating class:", error)
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Class ID is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from("classes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) {
      console.error("[v0] Error deleting class:", error)
      return NextResponse.json({ error: "Failed to delete class" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting class:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
