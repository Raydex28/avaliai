import { createWorker, PSM, OEM } from "tesseract.js"

export interface OCRResult {
  text: string
  confidence: number
  hasText: boolean
  contentType: "text" | "person" | "object" | "document" | "unknown"
  contentDescription?: string[]
  textQuality?: "high" | "medium" | "low" | "insufficient"
  wordCount?: number
  processingTime?: number
}

export interface OCRProgress {
  status: string
  progress: number
  message: string
}

// Configurações otimizadas para texto em português
const OCR_CONFIG = {
  lang: "por+eng", // Português + Inglês para melhor reconhecimento
  oem: OEM.LSTM_ONLY, // Usar apenas LSTM (melhor para textos manuscritos)
  psm: PSM.AUTO, // Detecção automática de layout
}

export async function processOCR(
  imageDataUrl: string,
  onProgress?: (progress: OCRProgress) => void,
): Promise<OCRResult> {
  const startTime = Date.now()

  try {
    // Criar worker do Tesseract
    const worker = await createWorker("por+eng", OEM.LSTM_ONLY, {
      logger: (m) => {
        if (onProgress) {
          onProgress({
            status: m.status,
            progress: m.progress || 0,
            message: getProgressMessage(m.status, m.progress),
          })
        }
      },
    })

    // Configurar parâmetros para melhor reconhecimento
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO,
      tessedit_char_whitelist:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüý0123456789.,;:!?()[]{}\"-' \n\t",
      tessedit_enable_dict_correction: "1",
      tessedit_enable_bigram_correction: "1",
      textord_really_old_xheight: "1",
      textord_min_xheight: "10",
    })

    // Processar a imagem
    const { data } = await worker.recognize(imageDataUrl)

    await worker.terminate()

    const processingTime = Date.now() - startTime
    const text = data.text.trim()
    const confidence = data.confidence / 100 // Converter para 0-1

    // Analisar qualidade do texto extraído
    const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length

    let textQuality: "high" | "medium" | "low" | "insufficient"
    if (wordCount < 10 || confidence < 0.6) {
      textQuality = "insufficient"
    } else if (wordCount < 30 || confidence < 0.75) {
      textQuality = "low"
    } else if (wordCount < 100 || confidence < 0.85) {
      textQuality = "medium"
    } else {
      textQuality = "high"
    }

    // Determinar tipo de conteúdo
    let contentType: "text" | "person" | "object" | "document" | "unknown" = "unknown"
    if (wordCount > 5) {
      contentType = "text"
    } else if (wordCount > 0) {
      contentType = "document"
    }

    const result: OCRResult = {
      text,
      confidence,
      hasText: wordCount > 0,
      contentType,
      contentDescription: generateContentDescription(text, confidence, wordCount),
      textQuality,
      wordCount,
      processingTime,
    }

    return result
  } catch (error) {
    console.error("Erro no processamento OCR:", error)

    return {
      text: "",
      confidence: 0,
      hasText: false,
      contentType: "unknown",
      contentDescription: ["Erro ao processar a imagem. Verifique se a imagem está clara e contém texto legível."],
      textQuality: "insufficient",
      wordCount: 0,
      processingTime: Date.now() - startTime,
    }
  }
}

function getProgressMessage(status: string, progress?: number): string {
  const progressPercent = Math.round((progress || 0) * 100)

  switch (status) {
    case "loading tesseract core":
      return "Carregando motor OCR..."
    case "initializing tesseract":
      return "Inicializando reconhecimento..."
    case "loading language traineddata":
      return "Carregando dados de idioma..."
    case "initializing api":
      return "Preparando análise..."
    case "recognizing text":
      return `Reconhecendo texto... ${progressPercent}%`
    default:
      return `Processando... ${progressPercent}%`
  }
}

function generateContentDescription(text: string, confidence: number, wordCount: number): string[] {
  const descriptions: string[] = []

  if (wordCount === 0) {
    descriptions.push("Nenhum texto foi detectado na imagem")
    descriptions.push("Verifique se a imagem contém texto legível")
  } else {
    descriptions.push(`${wordCount} palavras detectadas`)
    descriptions.push(`Confiança: ${Math.round(confidence * 100)}%`)

    if (confidence > 0.9) {
      descriptions.push("Texto reconhecido com alta precisão")
    } else if (confidence > 0.7) {
      descriptions.push("Texto reconhecido com boa precisão")
    } else if (confidence > 0.5) {
      descriptions.push("Texto reconhecido com precisão moderada")
    } else {
      descriptions.push("Texto reconhecido com baixa precisão")
      descriptions.push("Considere melhorar a qualidade da imagem")
    }
  }

  return descriptions
}

// Função para pré-processar imagem (melhorar qualidade para OCR)
export function preprocessImageForOCR(canvas: HTMLCanvasElement): string {
  const ctx = canvas.getContext("2d")!
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Converter para escala de cinza e aumentar contraste
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])

    // Aumentar contraste
    const contrast = 1.5
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
    const enhancedGray = Math.min(255, Math.max(0, factor * (gray - 128) + 128))

    data[i] = enhancedGray // R
    data[i + 1] = enhancedGray // G
    data[i + 2] = enhancedGray // B
    // Alpha permanece o mesmo
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL("image/png")
}
