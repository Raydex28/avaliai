// Serviço para gerenciamento de critérios

import type { CriteriaTemplate } from "@/types/criteria"

export async function getCriteriaTemplates(): Promise<CriteriaTemplate[]> {
  try {
    // Em uma implementação real, você buscaria os dados do backend
    const response = await fetch("/api/criteria-templates")

    if (!response.ok) {
      throw new Error("Falha ao buscar modelos de critérios")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Erro ao buscar modelos de critérios:", error)
    // Retornar dados simulados para fins de demonstração - apenas modelo ENEM
    return [
      {
        id: "template-enem",
        name: "Redação ENEM",
        criteria: [
          { name: "Competência 1 - Domínio da norma padrão", weight: 20, maxPoints: 200 },
          { name: "Competência 2 - Compreensão da proposta", weight: 20, maxPoints: 200 },
          { name: "Competência 3 - Argumentação", weight: 20, maxPoints: 200 },
          { name: "Competência 4 - Coesão textual", weight: 20, maxPoints: 200 },
          { name: "Competência 5 - Proposta de intervenção", weight: 20, maxPoints: 200 },
        ],
        createdAt: new Date().toISOString(),
      },
    ]
  }
}

export async function getCriteriaTemplate(id: string): Promise<CriteriaTemplate | null> {
  try {
    // Em uma implementação real, você buscaria os dados do backend
    const response = await fetch(`/api/criteria-templates/${id}`)

    if (!response.ok) {
      throw new Error("Falha ao buscar modelo de critérios")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Erro ao buscar modelo de critérios:", error)

    // Retornar dados simulados para fins de demonstração
    const templates = await getCriteriaTemplates()
    return templates.find((t) => t.id === id) || templates[0] // Retorna o modelo ENEM por padrão
  }
}

export async function saveCriteriaTemplate(template: Partial<CriteriaTemplate>): Promise<string> {
  try {
    // Em uma implementação real, você enviaria os dados para o backend
    const response = await fetch("/api/criteria-templates", {
      method: template.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
    })

    if (!response.ok) {
      throw new Error("Falha ao salvar modelo de critérios")
    }

    const result = await response.json()
    return result.id
  } catch (error) {
    console.error("Erro ao salvar modelo de critérios:", error)
    // Retornar um ID simulado para fins de demonstração
    return `template-${Date.now()}`
  }
}
