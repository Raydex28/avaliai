// types/analysis.ts

export interface AIAnalysisResult {
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
