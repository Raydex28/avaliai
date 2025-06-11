import { type NextRequest, NextResponse } from "next/server"

// Simulação de banco de dados em memória - apenas modelo ENEM
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

export async function GET() {
  return NextResponse.json(templates)
}

export async function POST(request: NextRequest) {
  try {
    const template = await request.json()

    // Gerar ID e adicionar timestamp
    const newTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    // Adicionar ao "banco de dados"
    templates.push(newTemplate)

    return NextResponse.json(newTemplate)
  } catch (error) {
    console.error("Erro ao salvar modelo de critérios:", error)
    return NextResponse.json({ error: "Falha ao salvar modelo de critérios" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedTemplate = await request.json()

    // Encontrar e atualizar o modelo
    const index = templates.findIndex((t) => t.id === updatedTemplate.id)

    if (index === -1) {
      return NextResponse.json({ error: "Modelo não encontrado" }, { status: 404 })
    }

    templates[index] = {
      ...templates[index],
      ...updatedTemplate,
    }

    return NextResponse.json(templates[index])
  } catch (error) {
    console.error("Erro ao atualizar modelo de critérios:", error)
    return NextResponse.json({ error: "Falha ao atualizar modelo de critérios" }, { status: 500 })
  }
}
