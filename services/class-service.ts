import type { Class } from "@/types/class"
import { createClient } from "@/lib/supabase/client"

// Função para buscar todas as turmas
export async function getClasses(): Promise<Class[]> {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      console.log("[v0] getClasses: No active session, skipping API call")
      return []
    }

    console.log("[v0] class-service: Fetching classes from /api/classes")
    const response = await fetch("/api/classes", {
      credentials: "include",
      cache: "no-store",
    })

    console.log("[v0] class-service: Response status:", response.status)

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("[v0] getClasses: Unauthorized (401), returning empty list")
        return []
      }
      
      const contentType = response.headers.get("content-type")
      let errorMessage = `Error ${response.status}`
      
      if (contentType && contentType.includes("application/json")) {
        const errorJson = await response.json()
        errorMessage = errorJson.error || errorMessage
      } else {
        const text = await response.text()
        // Truncate long HTML responses
        errorMessage = text.length > 100 ? text.substring(0, 100) + "..." : text
      }

      console.error("[v0] class-service: Failed to fetch classes:", response.status, errorMessage)
      throw new Error(`Falha ao buscar turmas: ${errorMessage}`)
    }

    const result = await response.json()
    console.log("[v0] class-service: Successfully fetched", result.length, "classes")
    return result
  } catch (error) {
    console.error("[v0] class-service: Erro ao buscar turmas:", error)
    throw error
  }
}

// Função para buscar uma turma específica
export async function getClass(id: string): Promise<Class | null> {
  try {
    const response = await fetch(`/api/classes/${id}`)

    if (!response.ok) {
      throw new Error("Falha ao buscar turma")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Erro ao buscar turma:", error)
    return null
  }
}

// Função para criar uma nova turma
export async function createClass(classData: Partial<Class>): Promise<Class> {
  try {
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
    throw error
  }
}

// Função para excluir uma turma específica
export async function deleteClass(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/classes/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Falha ao excluir turma")
    }
  } catch (error) {
    console.error("Erro ao excluir turma:", error)
    throw error
  }
}
