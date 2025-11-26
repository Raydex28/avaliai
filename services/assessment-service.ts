import type { Assessment } from "@/types/assessment"
import { createClient } from "@/lib/supabase/client"

export async function getAssessments(): Promise<Assessment[]> {
  const supabase = createClient()

  try {
    console.log("[v0] Fetching assessments...")
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      console.log("[v0] No user found")
      return []
    }

    console.log("[v0] User ID:", user.id)

    const { data: essays, error } = await supabase
      .from("essays")
      .select(`
        *,
        evaluations (*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching essays:", error)
      throw error
    }

    console.log("[v0] Essays fetched:", essays?.length || 0)

    return essays.map((essay: any) => {
      const evaluation = essay.evaluations?.[0]
      console.log("[v0] Essay:", essay.id, "has evaluation:", !!evaluation)

      return {
        id: essay.id,
        studentName: essay.title,
        subject: "Redação",
        text: essay.content,
        criteria: [],
        grade: evaluation?.total_score || 0,
        feedback: {
          strengths: [evaluation?.general_feedback || ""],
          improvements: [],
        },
        criteriaScores: evaluation
          ? [
              { name: "Competência 1", score: evaluation.competence_1, weight: 0.2 },
              { name: "Competência 2", score: evaluation.competence_2, weight: 0.2 },
              { name: "Competência 3", score: evaluation.competence_3, weight: 0.2 },
              { name: "Competência 4", score: evaluation.competence_4, weight: 0.2 },
              { name: "Competência 5", score: evaluation.competence_5, weight: 0.2 },
            ]
          : [],
        createdAt: essay.created_at,
        classId: essay.class_name || "",
      }
    })
  } catch (error) {
    console.error("[v0] Error fetching assessments:", error)
    return []
  }
}

export async function getAssessment(id: string): Promise<Assessment | null> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data: essay, error } = await supabase
      .from("essays")
      .select(`
        *,
        evaluations (*)
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) throw error

    const evaluation = essay.evaluations?.[0]

    return {
      id: essay.id,
      studentName: essay.title,
      subject: "Redação",
      text: essay.content,
      criteria: [],
      grade: evaluation?.total_score || 0,
      feedback: {
        strengths: [evaluation?.general_feedback || ""],
        improvements: [],
      },
      criteriaScores: evaluation
        ? [
            { name: "Competência 1", score: evaluation.competence_1, weight: 0.2 },
            { name: "Competência 2", score: evaluation.competence_2, weight: 0.2 },
            { name: "Competência 3", score: evaluation.competence_3, weight: 0.2 },
            { name: "Competência 4", score: evaluation.competence_4, weight: 0.2 },
            { name: "Competência 5", score: evaluation.competence_5, weight: 0.2 },
          ]
        : [],
      createdAt: essay.created_at,
      classId: essay.class_name || "",
    }
  } catch (error) {
    console.error("Error fetching assessment:", error)
    return null
  }
}

export async function deleteAssessment(id: string): Promise<void> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("essays").delete().eq("id", id).eq("user_id", user.id)

    if (error) throw error
  } catch (error) {
    console.error("Error deleting assessment:", error)
    throw error
  }
}
