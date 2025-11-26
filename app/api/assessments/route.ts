import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: essays, error } = await supabase
      .from("essays")
      .select(`
        *,
        evaluations (*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching assessments:", error)
      return NextResponse.json({ error: "Failed to fetch assessments" }, { status: 500 })
    }

    return NextResponse.json(essays || [])
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const { data: essay, error } = await supabase
      .from("essays")
      .insert({
        user_id: user.id,
        title: body.studentName || "Redação sem título",
        content: body.text,
        class_name: body.classId || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving assessment:", error)
      return NextResponse.json({ error: "Failed to save assessment" }, { status: 500 })
    }

    return NextResponse.json({
      id: essay.id,
      message: "Avaliação salva com sucesso",
    })
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
