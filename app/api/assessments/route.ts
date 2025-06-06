import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Em uma implementação real, você buscaria do banco de dados
    // Aqui retornamos uma resposta vazia pois os dados estão no localStorage
    return NextResponse.json([])
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Em uma implementação real, você salvaria no banco de dados
    // Aqui simulamos o salvamento retornando um ID
    const id = `assessment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      id,
      message: "Avaliação salva com sucesso",
    })
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
