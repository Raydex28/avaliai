// Serviço para processamento OCR e análise de imagem

export interface OCRResult {
  text: string
  confidence: number
  hasText: boolean
  contentType: "text" | "person" | "object" | "document" | "unknown"
  contentDescription?: string[]
  textQuality?: "high" | "medium" | "low" | "insufficient"
  wordCount?: number
}

export async function processOCR(imageDataUrl: string): Promise<OCRResult> {
  try {
    // Remover o prefixo do data URL para obter apenas os dados base64
    const base64Data = imageDataUrl.split(",")[1]

    // Em uma implementação real, você enviaria esta imagem para o backend
    // que usaria serviços como Google Cloud Vision ou Azure Computer Vision
    const response = await fetch("/api/ocr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64Data }),
    })

    if (!response.ok) {
      throw new Error("Falha ao processar OCR")
    }

    const result = await response.json()

    // Verificar a qualidade do texto extraído
    if (result.hasText && result.text) {
      const wordCount = result.text.split(/\s+/).filter((word) => word.length > 0).length
      result.wordCount = wordCount

      // Determinar a qualidade do texto com base no número de palavras e confiança
      if (wordCount < 10 || result.confidence < 0.6) {
        result.textQuality = "insufficient"
      } else if (wordCount < 30 || result.confidence < 0.75) {
        result.textQuality = "low"
      } else if (wordCount < 100 || result.confidence < 0.85) {
        result.textQuality = "medium"
      } else {
        result.textQuality = "high"
      }
    } else {
      result.textQuality = "insufficient"
      result.wordCount = 0
    }

    return result
  } catch (error) {
    console.error("Erro no processamento OCR:", error)
    // Retornar um resultado de erro
    return {
      text: "",
      confidence: 0,
      hasText: false,
      contentType: "unknown",
      contentDescription: ["Não foi possível analisar a imagem"],
      textQuality: "insufficient",
      wordCount: 0,
    }
  }
}
