// services/ai-service.ts

import type { Criteria } from "@/types/criteria"
import { AnalisadorRedacaoENEMAutocontido } from "./enem-analyzer" // Importa a IA correta da versão 12
import type { AIAnalysisResult } from "@/types/analysis"

// Função principal que orquestra a análise
export async function analyzeWithGemini(text: string, criteria: Criteria[]): Promise<AIAnalysisResult> {
  try {
    // Instancia o analisador da versão 12
    const analisador = new AnalisadorRedacaoENEMAutocontido(text)
    const resultado = analisador.analisar()

    return convertAnalysisResultToAIResult(resultado, criteria, text)
  } catch (error) {
    console.error("Erro crítico na análise da redação:", error)
    // Retorna uma estrutura de erro consistente
    return {
      grade: 0,
      feedback: {
        strengths: [],
        improvements: ["Ocorreu um erro inesperado durante a análise. Por favor, tente novamente."],
        competencies: criteria.map((c) => ({
          name: c.name,
          score: 0,
          maxPoints: c.maxPoints || 200,
          feedback: "Não foi possível analisar esta competência devido a um erro.",
        })),
      },
      criteriaScores: [],
      textQuality: "insufficient",
    }
  }
}

// Converte o resultado bruto da análise para o formato final da UI
function convertAnalysisResultToAIResult(resultado: any, criteria: Criteria[], text: string): AIAnalysisResult {
  const wordCount = text.split(/\s+/).filter(Boolean).length
  let textQuality: "high" | "medium" | "low" | "insufficient" = "insufficient"

  if (wordCount >= 300) {
    textQuality = "high"
  } else if (wordCount >= 200) {
    textQuality = "medium"
  } else if (wordCount >= 100) {
    textQuality = "low"
  }

  const strengths: string[] = []
  const improvements: string[] = []

  resultado.analiseCompetencias.forEach((comp: any) => {
    const isGood = comp.pontuacao >= 160
    const isPerfect = comp.pontuacao === 200

    // Filtra observações positivas para 'strengths' e negativas para 'improvements'
    comp.observacoes.forEach((obs: string) => {
      if (
        isPerfect &&
        (obs.startsWith("Excelente") || obs.startsWith("🏆") || obs.startsWith("Projeto de texto estratégico"))
      ) {
        strengths.push(obs)
      } else if (isGood && !obs.startsWith("✗") && !obs.includes("poderia")) {
        strengths.push(obs)
      } else if (obs.startsWith("✗") || comp.pontuacao < 160) {
        improvements.push(obs)
      }
    })
  })

  if (strengths.length === 0 && resultado.notaFinal > 600) {
    strengths.push("A redação demonstra uma estrutura argumentativa clara e uma boa abordagem ao tema.")
  }
  if (improvements.length === 0 && resultado.notaFinal < 1000) {
    improvements.push(
      "Sua redação está excelente! Para a nota máxima, revise pequenos detalhes na articulação e diversidade lexical.",
    )
  }

  return {
    grade: resultado.notaFinal,
    feedback: {
      strengths: [...new Set(strengths)].slice(0, 5),
      improvements: [...new Set(improvements)].slice(0, 5),
      competencies: resultado.analiseCompetencias.map((comp: any) => ({
        name: comp.nome,
        score: comp.pontuacao,
        maxPoints: 200,
        feedback: comp.observacoes.join(" "),
      })),
    },
    criteriaScores: criteria.map((c, index) => ({
      name: c.name,
      score: resultado.analiseCompetencias[index]?.pontuacao || 0,
      maxPoints: c.maxPoints || 200,
      weight: c.weight / 100,
    })),
    textQuality,
  }
}
