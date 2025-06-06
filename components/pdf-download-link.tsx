"use client"

import type { ReactNode } from "react"
import type { Assessment } from "@/types/assessment"

interface PDFDownloadLinkProps {
  assessmentData: Partial<Assessment>
  children: ReactNode
}

export function PDFDownloadLink({ assessmentData, children }: PDFDownloadLinkProps) {
  const generatePDF = () => {
    // Em uma implementação real, você geraria um PDF usando uma biblioteca como jsPDF
    // ou enviaria os dados para o backend para gerar o PDF

    // Aqui estamos apenas simulando o download
    const jsonString = JSON.stringify(assessmentData, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `avaliacao-${assessmentData.studentName?.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div onClick={generatePDF} style={{ cursor: "pointer" }}>
      {children}
    </div>
  )
}
