// Serviço para gerenciamento de avaliações

import type { Assessment } from "@/types/assessment"

export async function saveAssessment(assessment: Partial<Assessment>): Promise<string> {
  try {
    // Em uma implementação real, você enviaria os dados para o backend
    const response = await fetch("/api/assessments", {
      method: assessment.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assessment),
    })

    if (!response.ok) {
      throw new Error("Falha ao salvar avaliação")
    }

    const result = await response.json()
    return result.id
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error)
    // Retornar um ID simulado para fins de demonstração
    return `assessment-${Date.now()}`
  }
}

export async function getAssessments(): Promise<Assessment[]> {
  try {
    // Em uma implementação real, você buscaria os dados do backend
    const response = await fetch("/api/assessments")

    if (!response.ok) {
      throw new Error("Falha ao buscar avaliações")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error)
    // Retornar dados simulados para fins de demonstração
    return [
      {
        id: "assessment-1",
        studentName: "Maria Silva",
        subject: "Matemática",
        text: "Resposta da avaliação...",
        criteria: [],
        grade: 92,
        feedback: {
          strengths: ["Ponto forte 1", "Ponto forte 2"],
          improvements: ["Melhoria 1", "Melhoria 2"],
        },
        criteriaScores: [
          { name: "Conteúdo", score: 95, weight: 0.4 },
          { name: "Estrutura", score: 90, weight: 0.3 },
          { name: "Gramática", score: 85, weight: 0.2 },
          { name: "Citações", score: 95, weight: 0.1 },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: "assessment-2",
        studentName: "João Santos",
        subject: "Física",
        text: "Resposta da avaliação...",
        criteria: [],
        grade: 78,
        feedback: {
          strengths: ["Ponto forte 1", "Ponto forte 2"],
          improvements: ["Melhoria 1", "Melhoria 2"],
        },
        criteriaScores: [
          { name: "Conteúdo", score: 80, weight: 0.4 },
          { name: "Estrutura", score: 75, weight: 0.3 },
          { name: "Gramática", score: 80, weight: 0.2 },
          { name: "Citações", score: 75, weight: 0.1 },
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Ontem
      },
      {
        id: "assessment-3",
        studentName: "Ana Oliveira",
        subject: "Química",
        text: "Resposta da avaliação...",
        criteria: [],
        grade: 85,
        feedback: {
          strengths: ["Ponto forte 1", "Ponto forte 2"],
          improvements: ["Melhoria 1", "Melhoria 2"],
        },
        criteriaScores: [
          { name: "Conteúdo", score: 85, weight: 0.4 },
          { name: "Estrutura", score: 85, weight: 0.3 },
          { name: "Gramática", score: 90, weight: 0.2 },
          { name: "Citações", score: 80, weight: 0.1 },
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Ontem
      },
    ]
  }
}

export async function getAssessment(id: string): Promise<Assessment | null> {
  try {
    // Em uma implementação real, você buscaria os dados do backend
    const response = await fetch(`/api/assessments/${id}`)

    if (!response.ok) {
      throw new Error("Falha ao buscar avaliação")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error)
    return null
  }
}
