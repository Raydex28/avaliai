import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    // Verificar se o texto é suficiente para análise
    const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length
    if (wordCount < 20) {
      return NextResponse.json({
        isValid: false,
        reason: "Texto muito curto para análise",
        textType: "insuficiente",
      })
    }

    // Verificar se a API key está configurada
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error("GEMINI_API_KEY não está configurada")
      return NextResponse.json({
        isValid: true,
        reason: "Não foi possível verificar o tipo de texto - API key não configurada",
        textType: "não determinado",
      })
    }

    // Inicializar o cliente Gemini com a chave de API
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Construir o prompt para o Gemini
    const prompt = `
    Analise o seguinte texto e determine se ele é um texto dissertativo-argumentativo no estilo de redação do ENEM (Exame Nacional do Ensino Médio do Brasil).
    
    TEXTO:
    """
    ${text}
    """
    
    Um texto dissertativo-argumentativo do ENEM deve:
    1. Apresentar uma tese/ponto de vista
    2. Desenvolver argumentos para defender essa tese
    3. Ter introdução, desenvolvimento e conclusão
    4. Propor uma intervenção para o problema abordado
    5. Ser escrito em linguagem formal
    
    Responda apenas com um objeto JSON no seguinte formato:
    {
      "isValid": boolean (true se for dissertativo-argumentativo, false caso contrário),
      "reason": string (explicação breve da sua decisão),
      "textType": string (tipo de texto identificado: "dissertativo-argumentativo", "narrativo", "descritivo", "expositivo", "outro")
    }
    `

    // Chamar a API do Gemini
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
    console.error("Erro na verificação do texto:", error)

    // Verificar se é um erro de autenticação
    if (error.message && error.message.includes("403")) {
      console.error(
        "Erro de autenticação com a API Gemini. Verifique se a API key está correta e tem as permissões necessárias.",
      )
    }

    // Fallback em caso de erro - assumir que é válido para não bloquear o usuário
    return NextResponse.json({
      isValid: true,
      reason: "Não foi possível verificar o tipo de texto com precisão devido a um erro na API",
      textType: "não determinado",
    })
  }
}
