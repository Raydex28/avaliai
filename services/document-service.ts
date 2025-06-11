import mammoth from "mammoth"

/**
 * Serviço para processamento de documentos
 * Responsável por extrair texto de diferentes tipos de arquivos
 */

export interface DocumentExtractionResult {
  text: string
  wordCount: number
  extractionTime: number
  success: boolean
  error?: string
}

// Função para extrair texto de um arquivo
export async function extractTextFromFile(file: File): Promise<DocumentExtractionResult> {
  const startTime = Date.now()
  const fileType = file.type
  const fileName = file.name.toLowerCase()

  try {
    let text = ""

    // Texto simples
    if (fileType === "text/plain") {
      text = await readTextFile(file)
    }
    // Word (DOCX)
    else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx")
    ) {
      text = await extractTextFromDOCX(file)
    }
    // RTF
    else if (fileType === "application/rtf" || fileName.endsWith(".rtf")) {
      text = await readTextFile(file)
    } else {
      throw new Error(`Formato de arquivo não suportado: ${fileType}. Formatos aceitos: .txt, .docx, .rtf`)
    }

    const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length
    const extractionTime = Date.now() - startTime

    return {
      text: text.trim(),
      wordCount,
      extractionTime,
      success: true,
    }
  } catch (error) {
    console.error("Erro ao extrair texto do arquivo:", error)
    return {
      text: "",
      wordCount: 0,
      extractionTime: Date.now() - startTime,
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    }
  }
}

// Lê um arquivo de texto
async function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error("Falha ao ler o arquivo de texto"))
      }
    }
    reader.onerror = () => reject(new Error("Erro ao ler o arquivo"))
    reader.readAsText(file, "utf-8")
  })
}

// Extrai texto de um arquivo DOCX usando mammoth.js
async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })

    if (!result.value.trim()) {
      throw new Error("Nenhum texto foi encontrado no documento DOCX.")
    }

    // Log de avisos se houver
    if (result.messages.length > 0) {
      console.warn("Avisos durante extração DOCX:", result.messages)
    }

    return result.value.trim()
  } catch (error) {
    console.error("Erro ao extrair texto do DOCX:", error)
    throw new Error(
      `Não foi possível extrair texto do DOCX: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
    )
  }
}

// Verifica se o arquivo é um tipo de documento suportado
export function isSupportedDocumentType(file: File): boolean {
  const fileType = file.type
  const fileName = file.name.toLowerCase()

  return (
    fileType === "text/plain" ||
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileType === "application/rtf" ||
    fileName.endsWith(".docx") ||
    fileName.endsWith(".rtf") ||
    fileName.endsWith(".txt")
  )
}

// Função para validar se o texto extraído é adequado para análise
export function validateExtractedText(text: string): {
  isValid: boolean
  wordCount: number
  issues: string[]
} {
  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length
  const issues: string[] = []

  if (wordCount < 50) {
    issues.push("Texto muito curto para análise (mínimo 50 palavras)")
  }

  if (wordCount > 2000) {
    issues.push("Texto muito longo (máximo 2000 palavras)")
  }

  // Verificar se há caracteres estranhos (possível erro de OCR)
  const strangeCharRatio = (text.match(/[^\w\sÀ-ÿ.,;:!?()[\]{}"'-]/g) || []).length / text.length
  if (strangeCharRatio > 0.1) {
    issues.push("Texto contém muitos caracteres não reconhecidos")
  }

  return {
    isValid: issues.length === 0,
    wordCount,
    issues,
  }
}
