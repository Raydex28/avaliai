import { type NextRequest, NextResponse } from "next/server"

// Simulação de banco de dados em memória (compartilhado com a rota principal)
// Na implementação real, isso seria um banco de dados MySQL

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Simular busca no banco de dados
  // Em uma implementação real, você buscaria do MySQL

  // Dados simulados para demonstração
  const assessments = [
    {
      id: "assessment-1",
      studentName: "Maria Silva",
      subject: "Matemática",
      text: "Resposta da avaliação...",
      criteria: [],
      grade: 92,
      feedback: {
        strengths: ["Ponto forte 1", "Ponto forte 2"],
        improvements: ["Melhoria 1", "Melhoria 2"],
      },
      criteriaScores: [
        { name: "Conteúdo", score: 95, weight: 0.4 },
        { name: "Estrutura", score: 90, weight: 0.3 },
        { name: "Gramática", score: 85, weight: 0.2 },
        { name: "Citações", score: 95, weight: 0.1 },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: "assessment-2",
      studentName: "João Santos",
      subject: "Física",
      text: "Resposta da avaliação...",
      criteria: [],
      grade: 78,
      feedback: {
        strengths: ["Ponto forte 1", "Ponto forte 2"],
        improvements: ["Melhoria 1", "Melhoria 2"],
      },
      criteriaScores: [
        { name: "Conteúdo", score: 80, weight: 0.4 },
        { name: "Estrutura", score: 75, weight: 0.3 },
        { name: "Gramática", score: 80, weight: 0.2 },
        { name: "Citações", score: 75, weight: 0.1 },
      ],
      createdAt: new Date(Date.now() - 86400000).toISOString(), // Ontem
    },
  ]

  const assessment = assessments.find((a) => a.id === params.id)

  if (!assessment) {
    return NextResponse.json({ error: "Avaliação não encontrada" }, { status: 404 })
  }

  return NextResponse.json(assessment)
}
