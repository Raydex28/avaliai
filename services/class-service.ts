import type { Class } from "@/types/class"

// Função para buscar todas as turmas
export async function getClasses(): Promise<Class[]> {
  try {
    // Em uma implementação real, você buscaria os dados do backend
    const response = await fetch("/api/classes")

    if (!response.ok) {
      throw new Error("Falha ao buscar turmas")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Erro ao buscar turmas:", error)
    // Retornar dados simulados para fins de demonstração
    return [
      {
        id: "class-1",
        name: "3º Ano A - Ensino Médio",
        period: "Semestre",
        year: 2024,
        semester: 1,
        students: 32,
        createdAt: new Date().toISOString(),
      },
      {
        id: "class-2",
        name: "3º Ano B - Ensino Médio",
        period: "Bimestre",
        year: 2024,
        semester: 2,
        students: 28,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "class-3",
        name: "2º Ano A - Ensino Médio",
        period: "Semestre",
        year: 2024,
        semester: 1,
        students: 30,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ]
  }
}

// Função para buscar uma turma específica
export async function getClass(id: string): Promise<Class | null> {
  try {
    // Em uma implementação real, você buscaria os dados do backend
    const response = await fetch(`/api/classes/${id}`)

    if (!response.ok) {
      throw new Error("Falha ao buscar turma")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Erro ao buscar turma:", error)
    // Retornar dados simulados para fins de demonstração
    const classes = await getClasses()
    return classes.find((c) => c.id === id) || null
  }
}

// Função para criar uma nova turma
export async function createClass(classData: Partial<Class>): Promise<Class> {
  try {
    // Em uma implementação real, você enviaria os dados para o backend
    const response = await fetch("/api/classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classData),
    })

    if (!response.ok) {
      throw new Error("Falha ao criar turma")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Erro ao criar turma:", error)
    // Retornar dados simulados para fins de demonstração
    return {
      id: `class-${Date.now()}`,
      name: classData.name || "Nova Turma",
      period: classData.period || "Semestre",
      year: classData.year || new Date().getFullYear(),
      semester: classData.semester || 1,
      students: classData.students || 0,
      createdAt: new Date().toISOString(),
    }
  }
}
