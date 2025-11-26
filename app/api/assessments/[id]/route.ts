import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { data: essay, error } = await supabase
      .from("essays")
      .select(`
        *,
        evaluations (*)
      `)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (error) {
      console.error("[v0] Error fetching assessment:", error)
      return NextResponse.json({ error: "Avaliação não encontrada" }, { status: 404 })
    }

    const evaluation = essay.evaluations?.[0]

    if (!evaluation) {
      return NextResponse.json({ error: "Avaliação não possui dados de correção" }, { status: 404 })
    }

    // Retornar no formato Assessment
    const assessment = {
      id: essay.id,
      studentName: essay.title,
      subject: "Redação",
      text: essay.content,
      criteria: [],
      grade: evaluation.total_score,
      feedback: {
        strengths: [evaluation.general_feedback],
        improvements: [],
      },
      criteriaScores: [
        { name: "Competência 1", score: evaluation.competence_1, weight: 0.2 },
        { name: "Competência 2", score: evaluation.competence_2, weight: 0.2 },
        { name: "Competência 3", score: evaluation.competence_3, weight: 0.2 },
        { name: "Competência 4", score: evaluation.competence_4, weight: 0.2 },
        { name: "Competência 5", score: evaluation.competence_5, weight: 0.2 },
      ],
      createdAt: essay.created_at,
      classId: essay.class_name || "",
    }

    return NextResponse.json(assessment)
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Em uma implementação real, você atualizaria no banco de dados
    return NextResponse.json({
      id: params.id,
      message: "Avaliação atualizada com sucesso",
    })
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { error } = await supabase.from("essays").delete().eq("id", params.id).eq("user_id", user.id)

    if (error) {
      console.error("[v0] Error deleting assessment:", error)
      return NextResponse.json({ error: "Erro ao excluir avaliação" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Avaliação excluída com sucesso",
    })
  } catch (error) {
    console.error("Erro ao excluir avaliação:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
