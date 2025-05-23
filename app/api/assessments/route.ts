import { type NextRequest, NextResponse } from "next/server"

// Simulação de banco de dados em memória
const assessments: any[] = []

export async function GET() {
  return NextResponse.json(assessments)
}

export async function POST(request: NextRequest) {
  try {
    const assessment = await request.json()

    // Gerar ID e adicionar timestamp
    const newAssessment = {
      ...assessment,
      id: `assessment-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    // Adicionar ao "banco de dados"
    assessments.push(newAssessment)

    return NextResponse.json(newAssessment)
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error)
    return NextResponse.json({ error: "Falha ao salvar avaliação" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedAssessment = await request.json()

    // Encontrar e atualizar a avaliação
    const index = assessments.findIndex((a) => a.id === updatedAssessment.id)

    if (index === -1) {
      return NextResponse.json({ error: "Avaliação não encontrada" }, { status: 404 })
    }

    assessments[index] = {
      ...assessments[index],
      ...updatedAssessment,
    }

    return NextResponse.json(assessments[index])
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error)
    return NextResponse.json({ error: "Falha ao atualizar avaliação" }, { status: 500 })
  }
}
