export interface Assessment {
  id: string
  studentName: string
  subject: string
  text: string
  criteria: any[]
  grade: number
  gradeScale?: "decimal" | "thousand"
  feedback: {
    strengths: string[]
    improvements: string[]
  }
  criteriaScores: {
    name: string
    score: number
    weight: number
  }[]
  createdAt: string
}
