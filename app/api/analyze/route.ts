import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const { text, criteria } = await request.json()

    // Verificar se a API key está configurada
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error("GEMINI_API_KEY não está configurada")
      throw new Error("API key não configurada")
    }

    // Inicializar o cliente Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Construir o prompt para análise
    const prompt = `
    Analise a seguinte redação do ENEM de acordo com os critérios fornecidos e forneça uma avaliação detalhada.

    TEXTO DA REDAÇÃO:
    """
    ${text}
    """

    CRITÉRIOS DE AVALIAÇÃO:
    ${criteria.map((c, i) => `${i + 1}. ${c.name} (Peso: ${c.weight}%, Pontuação máxima: ${c.maxPoints})`).join("\n")}

    Forneça uma análise completa no seguinte formato JSON:
    {
      "grade": number (nota total),
      "feedback": {
        "strengths": ["ponto forte 1", "ponto forte 2"],
        "improvements": ["melhoria 1", "melhoria 2"],
        "competencies": [
          {
            "name": "nome da competência",
            "score": number,
            "maxPoints": number,
            "feedback": "feedback específico"
          }
        ]
      },
      "criteriaScores": [
        {
          "name": "nome do critério",
          "score": number,
          "maxPoints": number,
          "weight": number
        }
      ],
      "textQuality": "high|medium|low|insufficient"
    }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const responseText = response.text()

    // Extrair o JSON da resposta
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Formato de resposta inválido da API Gemini")
    }

    const analysisResult = JSON.parse(jsonMatch[0])
    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Erro na análise com Gemini:", error)

    // Retornar erro para que o ai-service.ts possa usar o fallback
    return NextResponse.json({ error: "Falha na análise com Gemini" }, { status: 500 })
  }
}
