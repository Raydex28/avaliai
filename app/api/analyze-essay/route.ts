import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

function simulateAnalysis(essayText: string) {
  // Gera notas aleatórias mas realistas (múltiplos de 20)
  const generateScore = () => {
    const possibleScores = [120, 140, 160, 180, 200]
    return possibleScores[Math.floor(Math.random() * possibleScores.length)]
  }

  const scores = {
    competencia1: generateScore(),
    competencia2: generateScore(),
    competencia3: generateScore(),
    competencia4: generateScore(),
    competencia5: generateScore(),
  }

  return {
    competencia1: {
      nota: scores.competencia1,
      feedback: `Competência 1 (${scores.competencia1} pontos): O texto demonstra ${scores.competencia1 >= 160 ? "excelente" : "bom"} domínio da norma culta da língua portuguesa. ${scores.competencia1 >= 180 ? "Pouquíssimos desvios foram identificados." : "Foram identificados alguns desvios que podem ser corrigidos."}`,
    },
    competencia2: {
      nota: scores.competencia2,
      feedback: `Competência 2 (${scores.competencia2} pontos): ${scores.competencia2 >= 160 ? "Excelente" : "Boa"} compreensão do tema proposto. O autor demonstra conhecimento sobre o assunto e aplica conceitos pertinentes ao desenvolvimento do texto.`,
    },
    competencia3: {
      nota: scores.competencia3,
      feedback: `Competência 3 (${scores.competencia3} pontos): A seleção e organização dos argumentos está ${scores.competencia3 >= 160 ? "muito bem estruturada" : "adequada"}. ${scores.competencia3 >= 180 ? "Os fatos e opiniões são articulados de forma coerente e convincente." : "Há espaço para melhorar a articulação entre as ideias."}`,
    },
    competencia4: {
      nota: scores.competencia4,
      feedback: `Competência 4 (${scores.competencia4} pontos): O texto apresenta ${scores.competencia4 >= 160 ? "excelente" : "bom"} uso de mecanismos de coesão textual. ${scores.competencia4 >= 180 ? "A progressão entre os parágrafos é fluida e natural." : "Alguns conectivos poderiam ser utilizados para melhorar a fluidez."}`,
    },
    competencia5: {
      nota: scores.competencia5,
      feedback: `Competência 5 (${scores.competencia5} pontos): A proposta de intervenção está ${scores.competencia5 >= 160 ? "muito bem elaborada" : "presente"}, respeitando os direitos humanos. ${scores.competencia5 >= 180 ? "Todos os elementos necessários estão detalhados de forma clara." : "É possível detalhar melhor os agentes e ações envolvidos."}`,
    },
    feedbackGeral: `Análise geral da redação:\n\nPontos fortes identificados:\n• O texto apresenta estrutura dissertativa adequada\n• Há boa progressão temática ao longo do desenvolvimento\n• Os argumentos são pertinentes ao tema proposto\n• A linguagem formal é mantida durante todo o texto\n\nPontos de atenção:\n• Revise o uso de conectivos para melhorar a coesão\n• Atenção aos desvios gramaticais identificados\n• A proposta de intervenção pode ser mais detalhada\n• Continue praticando para aprimorar a argumentação\n\nNota total: ${scores.competencia1 + scores.competencia2 + scores.competencia3 + scores.competencia4 + scores.competencia5} pontos\n\nContinue estudando e praticando! Cada redação é uma oportunidade de evolução.`,
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting essay analysis...")
    const { essayText, essayTitle, className } = await request.json()

    if (!essayText) {
      return Response.json({ error: "Essay text is required" }, { status: 400 })
    }

    console.log("[v0] Creating Supabase client...")
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Auth error:", authError)
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User authenticated:", user.id)
    console.log("[v0] Simulating analysis...")
    const analysis = simulateAnalysis(essayText)

    const totalScore =
      analysis.competencia1.nota +
      analysis.competencia2.nota +
      analysis.competencia3.nota +
      analysis.competencia4.nota +
      analysis.competencia5.nota

    console.log("[v0] Total score:", totalScore)
    console.log("[v0] Inserting essay into database...")

    const { data: essay, error: essayError } = await supabase
      .from("essays")
      .insert({
        user_id: user.id,
        title: essayTitle || "Redação sem título",
        content: essayText,
        class_name: className || null,
      })
      .select()
      .single()

    if (essayError) {
      console.error("[v0] Error saving essay:", essayError)
      return Response.json({ error: "Failed to save essay" }, { status: 500 })
    }

    console.log("[v0] Essay saved with ID:", essay.id)
    console.log("[v0] Inserting evaluation into database...")

    const { data: evaluation, error: evalError } = await supabase
      .from("evaluations")
      .insert({
        essay_id: essay.id,
        user_id: user.id,
        competence_1: analysis.competencia1.nota,
        competence_2: analysis.competencia2.nota,
        competence_3: analysis.competencia3.nota,
        competence_4: analysis.competencia4.nota,
        competence_5: analysis.competencia5.nota,
        total_score: totalScore,
        feedback_c1: analysis.competencia1.feedback,
        feedback_c2: analysis.competencia2.feedback,
        feedback_c3: analysis.competencia3.feedback,
        feedback_c4: analysis.competencia4.feedback,
        feedback_c5: analysis.competencia5.feedback,
        general_feedback: analysis.feedbackGeral,
      })
      .select()
      .single()

    if (evalError) {
      console.error("[v0] Error saving evaluation:", evalError)
      return Response.json({ error: "Failed to save evaluation" }, { status: 500 })
    }

    console.log("[v0] Evaluation saved with ID:", evaluation.id)
    console.log("[v0] Analysis completed successfully!")

    return Response.json({
      success: true,
      essayId: essay.id,
      evaluationId: evaluation.id,
      analysis: {
        ...analysis,
        notaTotal: totalScore,
      },
    })
  } catch (error) {
    console.error("[v0] Error analyzing essay:", error)
    return Response.json(
      {
        error: "Failed to analyze essay",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
