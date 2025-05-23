"use client"

import type React from "react"

import { useState, useRef } from "react"
import { FileText, Upload, X, FileIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { extractTextFromFile, isSupportedDocumentType } from "@/services/document-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FileUploadProps {
  onTextExtracted: (text: string) => void
  onError?: (error: string) => void
}

export function FileUpload({ onTextExtracted, onError }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      await handleFile(files[0])
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleFile(files[0])
    }
  }

  const handleFile = async (file: File) => {
    setError(null)

    // Verificar se o tipo de arquivo é suportado
    if (!isSupportedDocumentType(file)) {
      const errorMsg = "Formato de arquivo não suportado. Por favor, envie um arquivo PDF, DOCX, RTF ou TXT."
      setError(errorMsg)
      if (onError) onError(errorMsg)
      return
    }

    setFile(file)
    setIsProcessing(true)

    // Simular progresso
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    try {
      // Extrair texto do arquivo
      const extractedText = await extractTextFromFile(file)
      setProgress(100)

      // Notificar o componente pai sobre o texto extraído
      onTextExtracted(extractedText)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao processar o arquivo"
      setError(errorMsg)
      if (onError) onError(errorMsg)
    } finally {
      setIsProcessing(false)
      clearInterval(progressInterval)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setProgress(0)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="w-full">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-3">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Arraste e solte seu arquivo aqui</h3>
              <p className="text-sm text-muted-foreground">Suporta arquivos PDF, DOCX, RTF e TXT</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleButtonClick} className="mt-2">
                <Upload className="mr-2 h-4 w-4" />
                Selecionar arquivo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.rtf,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/rtf,text/plain"
                onChange={handleFileInput}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-primary/10 p-2">
                <FileIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleRemoveFile} disabled={isProcessing}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Processando arquivo...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  )
}
