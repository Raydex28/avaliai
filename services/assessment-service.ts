// Serviço para gerenciamento de avaliações com armazenamento local

import type { Assessment } from "@/types/assessment"

// Chave para armazenamento local
const ASSESSMENTS_STORAGE_KEY = "avali-ai-assessments"

// Função para obter assessments do localStorage
function getStoredAssessments(): Assessment[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(ASSESSMENTS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Erro ao ler assessments do localStorage:", error)
    return []
  }
}

// Função para salvar assessments no localStorage
function saveStoredAssessments(assessments: Assessment[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(ASSESSMENTS_STORAGE_KEY, JSON.stringify(assessments))
  } catch (error) {
    console.error("Erro ao salvar assessments no localStorage:", error)
  }
}

// Dados iniciais de exemplo (só serão usados se não houver dados salvos)
const defaultAssessments: Assessment[] = [
  {
    id: "assessment-example-1",
    studentName: "Maria Silva",
    subject: "Redação",
    text: "A educação é um direito fundamental que deve ser garantido a todos os cidadãos. No Brasil, apesar dos avanços conquistados nas últimas décadas, ainda enfrentamos desafios significativos para assegurar uma educação de qualidade para toda a população.\n\nUm dos principais problemas é a desigualdade no acesso à educação. Enquanto nas regiões mais desenvolvidas do país as escolas contam com melhor infraestrutura e recursos, nas áreas mais carentes faltam desde materiais básicos até professores qualificados. Essa disparidade perpetua um ciclo de exclusão social que precisa ser rompido.\n\nAlém disso, a valorização dos profissionais da educação é fundamental para melhorar a qualidade do ensino. Professores bem remunerados e capacitados são essenciais para formar cidadãos críticos e preparados para os desafios do século XXI.\n\nPortanto, é necessário que o poder público invista massivamente na educação, garantindo recursos adequados, formação continuada para os educadores e políticas que promovam a equidade no acesso ao conhecimento. Somente assim poderemos construir uma sociedade mais justa e desenvolvida.",
    criteria: [],
    grade: 920,
    feedback: {
      strengths: [
        "Excelente domínio da norma culta da língua portuguesa",
        "Argumentação consistente e bem estruturada",
        "Boa articulação entre os parágrafos",
        "Proposta de intervenção clara e viável",
      ],
      improvements: [
        "Poderia explorar mais dados estatísticos para fortalecer a argumentação",
        "Maior diversificação no uso de conectivos",
      ],
    },
    criteriaScores: [
      { name: "Competência 1", score: 200, weight: 0.2 },
      { name: "Competência 2", score: 180, weight: 0.2 },
      { name: "Competência 3", score: 180, weight: 0.2 },
      { name: "Competência 4", score: 180, weight: 0.2 },
      { name: "Competência 5", score: 180, weight: 0.2 },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    classId: "class-1",
  },
  {
    id: "assessment-example-2",
    studentName: "João Santos",
    subject: "Redação",
    text: "A tecnologia mudou muito nossa vida. Hoje em dia todo mundo tem celular e usa internet. Isso é bom porque podemos conversar com pessoas longe e aprender coisas novas.\n\nMas também tem problemas. Muita gente fica viciada no celular e não conversa mais pessoalmente. Os jovens passam o dia todo nas redes sociais e esquecem de estudar.\n\nNa escola também mudou. Agora tem computador e tablet para estudar. Isso ajuda muito porque é mais interessante que só livro. Mas alguns alunos usam para jogar ao invés de prestar atenção na aula.\n\nEu acho que a tecnologia é boa se usar direito. Os pais e professores devem ensinar como usar bem. Assim podemos aproveitar o que tem de bom e evitar os problemas.",
    criteria: [],
    grade: 640,
    feedback: {
      strengths: [
        "Compreensão básica do tema proposto",
        "Tentativa de estruturação em parágrafos",
        "Apresentação de argumentos simples",
      ],
      improvements: [
        "Necessário melhorar o domínio da norma culta",
        "Desenvolver melhor a argumentação com exemplos mais específicos",
        "Usar conectivos mais variados para articular as ideias",
        "Elaborar uma proposta de intervenção mais detalhada",
      ],
    },
    criteriaScores: [
      { name: "Competência 1", score: 120, weight: 0.2 },
      { name: "Competência 2", score: 140, weight: 0.2 },
      { name: "Competência 3", score: 120, weight: 0.2 },
      { name: "Competência 4", score: 120, weight: 0.2 },
      { name: "Competência 5", score: 140, weight: 0.2 },
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    classId: "class-2",
  },
]

export async function saveAssessment(assessment: Partial<Assessment>): Promise<string> {
  try {
    const assessments = getStoredAssessments()

    if (assessment.id) {
      // Atualizar assessment existente
      const index = assessments.findIndex((a) => a.id === assessment.id)
      if (index !== -1) {
        assessments[index] = { ...assessments[index], ...assessment } as Assessment
      }
    } else {
      // Criar novo assessment
      const newAssessment: Assessment = {
        id: `assessment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        studentName: assessment.studentName || "Aluno não identificado",
        subject: assessment.subject || "Redação",
        text: assessment.text || "",
        criteria: assessment.criteria || [],
        grade: assessment.grade || 0,
        feedback: assessment.feedback || { strengths: [], improvements: [] },
        criteriaScores: assessment.criteriaScores || [],
        createdAt: new Date().toISOString(),
        classId: assessment.classId || "", // Include the classId
      }
      assessments.unshift(newAssessment) // Adicionar no início da lista
      assessment.id = newAssessment.id
    }

    saveStoredAssessments(assessments)
    return assessment.id!
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error)
    throw error
  }
}

export async function getAssessments(): Promise<Assessment[]> {
  try {
    let assessments = getStoredAssessments()

    // Se não há assessments salvos, usar dados de exemplo
    if (assessments.length === 0) {
      assessments = [...defaultAssessments]
      saveStoredAssessments(assessments)
    }

    // Ordenar por data de criação (mais recentes primeiro)
    return assessments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error)
    return defaultAssessments
  }
}

export async function getAssessment(id: string): Promise<Assessment | null> {
  try {
    const assessments = getStoredAssessments()

    // Se não há assessments salvos, usar dados de exemplo
    if (assessments.length === 0) {
      const defaultAssessment = defaultAssessments.find((a) => a.id === id)
      return defaultAssessment || null
    }

    return assessments.find((a) => a.id === id) || null
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error)
    return null
  }
}

export async function deleteAssessment(id: string): Promise<void> {
  try {
    const assessments = getStoredAssessments()
    const filteredAssessments = assessments.filter((a) => a.id !== id)
    saveStoredAssessments(filteredAssessments)
  } catch (error) {
    console.error("Erro ao excluir avaliação:", error)
    throw error
  }
}

// Função para limpar todos os dados (útil para desenvolvimento)
export function clearAllAssessments(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ASSESSMENTS_STORAGE_KEY)
  }
}

// Função para exportar dados (útil para backup)
export function exportAssessments(): string {
  const assessments = getStoredAssessments()
  return JSON.stringify(assessments, null, 2)
}

// Função para importar dados (útil para restaurar backup)
export function importAssessments(data: string): void {
  try {
    const assessments = JSON.parse(data) as Assessment[]
    saveStoredAssessments(assessments)
  } catch (error) {
    console.error("Erro ao importar avaliações:", error)
    throw new Error("Formato de dados inválido")
  }
}
