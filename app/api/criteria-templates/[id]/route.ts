import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Dados simulados para demonstração - apenas modelo ENEM
  const templates = [
    {
      id: "template-enem",
      name: "Redação ENEM",
      criteria: [
        { name: "Competência 1 - Domínio da norma padrão", weight: 20, maxPoints: 200 },
        { name: "Competência 2 - Compreensão da proposta", weight: 20, maxPoints: 200 },
        { name: "Competência 3 - Argumentação", weight: 20, maxPoints: 200 },
        { name: "Competência 4 - Coesão textual", weight: 20, maxPoints: 200 },
        { name: "Competência 5 - Proposta de intervenção", weight: 20, maxPoints: 200 },
      ],
      createdAt: new Date().toISOString(),
    },
  ]

  const template = templates.find((t) => t.id === params.id) || templates[0]

  if (!template) {
    return NextResponse.json({ error: "Modelo não encontrado" }, { status: 404 })
  }

  return NextResponse.json(template)
}
