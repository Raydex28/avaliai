/**
 * Serviço para processamento de documentos
 * Responsável por extrair texto de diferentes tipos de arquivos
 */

// Função para extrair texto de um arquivo
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type
  const fileName = file.name.toLowerCase()

  // Texto simples
  if (fileType === "text/plain") {
    return await readTextFile(file)
  }

  // PDF
  if (fileType === "application/pdf") {
    return await extractTextFromPDF(file)
  }

  // Word (DOCX)
  if (
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    return await extractTextFromDOCX(file)
  }

  // RTF
  if (fileType === "application/rtf" || fileName.endsWith(".rtf")) {
    return await readTextFile(file)
  }

  // Formato não suportado
  throw new Error(`Formato de arquivo não suportado: ${fileType}`)
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
    reader.readAsText(file)
  })
}

// Extrai texto de um PDF usando a biblioteca pdf.js
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Simulação de extração de PDF
    // Em produção, você usaria uma biblioteca como pdf.js
    return "Texto extraído do PDF. Em um ambiente de produção, use uma biblioteca como pdf.js para extrair o texto real."
  } catch (error) {
    console.error("Erro ao extrair texto do PDF:", error)
    throw new Error("Não foi possível extrair texto do PDF")
  }
}

// Extrai texto de um arquivo DOCX
async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    // Simulação de extração de DOCX
    // Em produção, você usaria uma biblioteca como mammoth.js
    return "Texto extraído do DOCX. Em um ambiente de produção, use uma biblioteca como mammoth.js para extrair o texto real."
  } catch (error) {
    console.error("Erro ao extrair texto do DOCX:", error)
    throw new Error("Não foi possível extrair texto do DOCX")
  }
}

// Verifica se o arquivo é um tipo de documento suportado
export function isSupportedDocumentType(file: File): boolean {
  const fileType = file.type
  const fileName = file.name.toLowerCase()

  return (
    fileType === "text/plain" ||
    fileType === "application/pdf" ||
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileType === "application/rtf" ||
    fileName.endsWith(".docx") ||
    fileName.endsWith(".rtf") ||
    fileName.endsWith(".txt") ||
    fileName.endsWith(".pdf")
  )
}
