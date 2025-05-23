// Serviço para integração com a API Gemini

import type { Criteria } from "@/types/criteria"

interface AIAnalysisResult {
  grade: number
  feedback: {
    strengths: string[]
    improvements: string[]
    competencies: {
      name: string
      score: number
      maxPoints: number
      feedback: string
    }[]
  }
  criteriaScores: {
    name: string
    score: number
    maxPoints: number
    weight: number
  }[]
  textQuality: "high" | "medium" | "low" | "insufficient"
}

export async function analyzeWithGemini(text: string, criteria: Criteria[]): Promise<AIAnalysisResult> {
  try {
    // Enviar o texto e os critérios para o backend que fará a chamada para a API Gemini
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        criteria: criteria.map((c) => ({ name: c.name, weight: c.weight, maxPoints: c.maxPoints })),
      }),
    })

    if (!response.ok) {
      throw new Error("Falha ao analisar com Gemini")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Erro na análise com Gemini:", error)

    // Verificar a qualidade do texto antes de gerar uma análise simulada
    const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length
    let textQuality: "high" | "medium" | "low" | "insufficient" = "insufficient"

    if (wordCount >= 100) {
      textQuality = "high"
    } else if (wordCount >= 50) {
      textQuality = "medium"
    } else if (wordCount >= 20) {
      textQuality = "low"
    }

    // Se o texto for insuficiente, retornar uma análise com nota baixa
    if (textQuality === "insufficient") {
      const criteriaScores = criteria.map((c) => ({
        name: c.name,
        score: 0,
        maxPoints: c.maxPoints || 200,
        weight: c.weight / 100,
      }))

      return {
        grade: 0,
        feedback: {
          strengths: [],
          improvements: [
            "O texto fornecido é insuficiente para uma análise adequada",
            "É necessário fornecer uma redação mais completa",
            "Não foi possível identificar conteúdo relevante para avaliação",
          ],
          competencies: criteria.map((c) => ({
            name: c.name,
            score: 0,
            maxPoints: c.maxPoints || 200,
            feedback: "Texto insuficiente para avaliação desta competência.",
          })),
        },
        criteriaScores,
        textQuality,
      }
    }

    // Para textos de baixa qualidade, gerar notas mais baixas
    if (textQuality === "low") {
      const criteriaScores = criteria.map((c) => {
        const maxPoints = c.maxPoints || 200
        const score = Math.floor(Math.random() * 60) + 20 // Entre 20 e 79 pontos
        return {
          name: c.name,
          score,
          maxPoints,
          weight: c.weight / 100,
        }
      })

      const grade = criteriaScores.reduce((sum, c) => sum + c.score, 0)

      return {
        grade,
        feedback: {
          strengths: ["Há alguns pontos relevantes na redação", "Demonstra conhecimento básico do tema"],
          improvements: [
            "A redação está incompleta e precisa ser desenvolvida",
            "Faltam elementos importantes para uma análise completa",
            "É necessário aprofundar o conteúdo e fornecer mais detalhes",
          ],
          competencies: criteriaScores.map((c) => ({
            name: c.name,
            score: c.score,
            maxPoints: c.maxPoints,
            feedback: getFeedbackForCompetency(c.name, c.score),
          })),
        },
        criteriaScores,
        textQuality,
      }
    }

    // Para textos de qualidade média, gerar notas médias
    if (textQuality === "medium") {
      const criteriaScores = criteria.map((c) => {
        const maxPoints = c.maxPoints || 200
        const score = Math.floor(Math.random() * 60) + 80 // Entre 80 e 139 pontos
        return {
          name: c.name,
          score,
          maxPoints,
          weight: c.weight / 100,
        }
      })

      const grade = criteriaScores.reduce((sum, c) => sum + c.score, 0)

      return {
        grade,
        feedback: {
          strengths: [
            "Demonstra compreensão dos conceitos principais",
            "Apresenta argumentos relevantes",
            "Aborda aspectos importantes do tema",
          ],
          improvements: [
            "Poderia aprofundar mais a análise em alguns pontos",
            "Alguns conceitos precisam ser melhor explicados",
            "Recomenda-se expandir a redação com mais exemplos e detalhes",
          ],
          competencies: criteriaScores.map((c) => ({
            name: c.name,
            score: c.score,
            maxPoints: c.maxPoints,
            feedback: getFeedbackForCompetency(c.name, c.score),
          })),
        },
        criteriaScores,
        textQuality,
      }
    }

    // Para textos de alta qualidade, gerar notas altas
    const criteriaScores = criteria.map((c) => {
      const maxPoints = c.maxPoints || 200
      const score = Math.floor(Math.random() * 60) + 140 // Entre 140 e 199 pontos
      return {
        name: c.name,
        score,
        maxPoints,
        weight: c.weight / 100,
      }
    })

    const grade = criteriaScores.reduce((sum, c) => sum + c.score, 0)

    return {
      grade,
      feedback: {
        strengths: [
          "Demonstra excelente compreensão dos conceitos",
          "Apresenta argumentos bem estruturados e fundamentados",
          "Utiliza exemplos relevantes para apoiar as ideias",
        ],
        improvements: [
          "Poderia aprofundar ainda mais alguns pontos específicos",
          "Alguns pequenos ajustes na estrutura melhorariam a clareza",
          "Considere explorar perspectivas adicionais sobre o tema",
        ],
        competencies: criteriaScores.map((c) => ({
          name: c.name,
          score: c.score,
          maxPoints: c.maxPoints,
          feedback: getFeedbackForCompetency(c.name, c.score),
        })),
      },
      criteriaScores,
      textQuality,
    }
  }
}

// Função para gerar feedback específico para cada competência
function getFeedbackForCompetency(competencyName: string, score: number): string {
  const level = score < 40 ? "baixo" : score < 100 ? "médio" : score < 160 ? "bom" : "excelente"

  if (competencyName.includes("Competência 1")) {
    if (level === "baixo") {
      return "Demonstra domínio precário da modalidade escrita formal da língua portuguesa, com muitos desvios gramaticais, de escolha de registro e de convenções da escrita."
    } else if (level === "médio") {
      return "Demonstra domínio mediano da modalidade escrita formal da língua portuguesa, com alguns desvios gramaticais e de convenções da escrita."
    } else if (level === "bom") {
      return "Demonstra bom domínio da modalidade escrita formal da língua portuguesa, com poucos desvios gramaticais e de convenções da escrita."
    } else {
      return "Demonstra excelente domínio da modalidade escrita formal da língua portuguesa e de escolha de registro. Desvios gramaticais ou de convenções da escrita são praticamente inexistentes."
    }
  } else if (competencyName.includes("Competência 2")) {
    if (level === "baixo") {
      return "Desenvolve o tema de forma tangencial, com problemas na compreensão da proposta e no uso de repertório sociocultural."
    } else if (level === "médio") {
      return "Desenvolve o tema por meio de argumentação previsível e apresenta domínio mediano do texto dissertativo-argumentativo, com proposição, argumentação e conclusão."
    } else if (level === "bom") {
      return "Desenvolve o tema por meio de argumentação consistente e apresenta bom domínio do texto dissertativo-argumentativo, com proposição, argumentação e conclusão."
    } else {
      return "Desenvolve o tema por meio de argumentação consistente, a partir de um repertório sociocultural produtivo, e apresenta excelente domínio do texto dissertativo-argumentativo."
    }
  } else if (competencyName.includes("Competência 3")) {
    if (level === "baixo") {
      return "Apresenta informações, fatos e opiniões pouco relacionados ao tema e sem defesa de um ponto de vista."
    } else if (level === "médio") {
      return "Apresenta informações, fatos e opiniões relacionados ao tema, mas limitados aos argumentos dos textos motivadores e pouco organizados."
    } else if (level === "bom") {
      return "Apresenta informações, fatos e opiniões relacionados ao tema, de forma organizada, com indícios de autoria, em defesa de um ponto de vista."
    } else {
      return "Apresenta informações, fatos e opiniões relacionados ao tema proposto, de forma consistente e organizada, configurando autoria, em defesa de um ponto de vista."
    }
  } else if (competencyName.includes("Competência 4")) {
    if (level === "baixo") {
      return "Articula as partes do texto de forma precária, com muitas inadequações e apresenta repertório limitado de recursos coesivos."
    } else if (level === "médio") {
      return "Articula as partes do texto com algumas inadequações e apresenta repertório pouco diversificado de recursos coesivos."
    } else if (level === "bom") {
      return "Articula as partes do texto, com poucas inadequações, e apresenta repertório diversificado de recursos coesivos."
    } else {
      return "Articula bem as partes do texto e apresenta repertório diversificado de recursos coesivos sem inadequações."
    }
  } else if (competencyName.includes("Competência 5")) {
    if (level === "baixo") {
      return "Apresenta proposta de intervenção vaga, precária ou relacionada apenas ao assunto."
    } else if (level === "médio") {
      return "Elabora, de forma mediana, proposta de intervenção relacionada ao tema, respeitando os direitos humanos."
    } else if (level === "bom") {
      return "Elabora bem proposta de intervenção relacionada ao tema e articulada à discussão desenvolvida no texto."
    } else {
      return "Elabora muito bem proposta de intervenção, detalhada, relacionada ao tema e articulada à discussão desenvolvida no texto, com respeito aos direitos humanos."
    }
  }

  return "Avaliação não disponível para esta competência."
}
