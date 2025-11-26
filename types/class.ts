export interface Class {
  id: string
  name: string
  period: string
  year: number
  semester: 1 | 2
  students: number
  createdAt: string
}

export type Period = "Semestre" | "Bimestre"
export type TimeFrame = "1º Bimestre" | "2º Bimestre" | "3º Bimestre" | "4º Bimestre" | "1º Semestre" | "2º Semestre"
