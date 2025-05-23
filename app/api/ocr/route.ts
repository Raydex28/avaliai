import { type NextRequest, NextResponse } from "next/server"
import type { OCRResult } from "@/services/ocr-service"

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    // Simular atraso de processamento
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Verificar se a imagem é vazia ou preta (simulação)
    // Em uma implementação real, você analisaria os dados da imagem
    // para verificar se é uma imagem preta ou vazia

    // Sempre retornar como conteúdo vazio/desconhecido quando não há imagem clara
    const result: OCRResult = {
      text: "",
      confidence: 0,
      hasText: false,
      contentType: "unknown",
      contentDescription: ["Imagem vazia ou sem conteúdo identificável"],
      textQuality: "insufficient",
      wordCount: 0,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro no processamento OCR:", error)
    return NextResponse.json({ error: "Falha ao processar OCR" }, { status: 500 })
  }
}
