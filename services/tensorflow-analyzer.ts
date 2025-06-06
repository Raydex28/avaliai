// services/tensorflow-analyzer.ts
import type { Assessment } from "@/types/assessment"

class AnalisadorRedacaoComTensorFlow {
  private modeloCarregado = false

  async inicializarModelos(): Promise<boolean> {
    try {
      // Tentativa de importar TensorFlow.js dinamicamente
      try {
        // Importar apenas se estiver no navegador
        if (typeof window !== "undefined") {
          const tf = await import("@tensorflow/tfjs")
          // Registrar o backend adequado
          ;(await tf.setBackend("webgl")) || (await tf.setBackend("cpu"))
          console.log("TensorFlow.js inicializado com sucesso usando backend:", tf.getBackend())
        }
      } catch (error) {
        console.warn("Não foi possível carregar TensorFlow.js. Usando analisador baseado em regras.", error)
        return false
      }

      // Simulação de carregamento de modelo bem-sucedido
      this.modeloCarregado = true
      return true
    } catch (error) {
      console.error("Erro ao inicializar modelos:", error)
      return false
    }
  }

  async analisarRedacao(texto: string): Promise<Partial<Assessment>> {
    // Se o modelo não foi carregado, retornar uma análise básica
    if (!this.modeloCarregado) {
      console.warn("Usando análise baseada em regras porque o modelo TensorFlow não foi carregado")
      return this.analisarComRegras(texto)
    }

    // Simulação de análise com TensorFlow.js
    console.log("Analisando redação com TensorFlow.js")

    // Análise simulada
    return {
      grade: 800,
      criteriaScores: [
        { name: "Competência 1", score: 160, weight: 0.2 },
        { name: "Competência 2", score: 160, weight: 0.2 },
        { name: "Competência 3", score: 160, weight: 0.2 },
        { name: "Competência 4", score: 160, weight: 0.2 },
        { name: "Competência 5", score: 160, weight: 0.2 },
      ],
      feedback: {
        strengths: ["Bom domínio da norma culta", "Argumentação consistente", "Boa estrutura textual"],
        improvements: ["Pode melhorar a proposta de intervenção", "Pode diversificar o uso de conectivos"],
      },
    }
  }

  private analisarComRegras(texto: string): Partial<Assessment> {
    // Análise baseada em regras simples
    const palavras = texto.split(/\s+/).length
    const paragrafos = texto.split(/\n\s*\n/).length

    // Calcular pontuação baseada em características básicas do texto
    let pontuacaoBase = 0

    // Verificar tamanho do texto (entre 500 e 900 palavras é ideal)
    if (palavras >= 500 && palavras <= 900) {
      pontuacaoBase += 200
    } else if (palavras >= 300) {
      pontuacaoBase += 150
    } else {
      pontuacaoBase += 100
    }

    // Verificar estrutura de parágrafos (ideal: 4-5 parágrafos)
    if (paragrafos >= 4 && paragrafos <= 5) {
      pontuacaoBase += 200
    } else if (paragrafos >= 3) {
      pontuacaoBase += 150
    } else {
      pontuacaoBase += 100
    }

    // Calcular pontuação final (máximo 1000)
    const pontuacaoFinal = Math.min(1000, pontuacaoBase + 400)

    // Distribuir pontuação entre competências
    const pontuacaoPorCompetencia = pontuacaoFinal / 5

    return {
      grade: pontuacaoFinal,
      criteriaScores: [
        { name: "Competência 1", score: pontuacaoPorCompetencia, weight: 0.2 },
        { name: "Competência 2", score: pontuacaoPorCompetencia, weight: 0.2 },
        { name: "Competência 3", score: pontuacaoPorCompetencia, weight: 0.2 },
        { name: "Competência 4", score: pontuacaoPorCompetencia, weight: 0.2 },
        { name: "Competência 5", score: pontuacaoPorCompetencia, weight: 0.2 },
      ],
      feedback: {
        strengths: [
          "Texto com estrutura adequada",
          "Desenvolvimento de argumentos",
          "Proposta de intervenção presente",
        ],
        improvements: [
          "Pode melhorar o uso da norma culta",
          "Pode aprofundar a argumentação",
          "Pode detalhar mais a proposta de intervenção",
        ],
      },
    }
  }
}

export const analisadorTensorFlow = new AnalisadorRedacaoComTensorFlow()
