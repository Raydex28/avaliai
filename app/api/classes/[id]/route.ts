import { NextResponse } from "next/server"

// Dados simulados para turmas
const classes = [
  {
    id: "class-1",
    name: "3º Ano A - Ensino Médio",
    period: "Semestre",
    year: 2023,
    semester: 1,
    students: 32,
    createdAt: new Date().toISOString(),
  },
  {
    id: "class-2",
    name: "3º Ano B - Ensino Médio",
    period: "Bimestre",
    year: 2023,
    semester: 2,
    students: 28,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "class-3",
    name: "2º Ano A - Ensino Médio",
    period: "Semestre",
    year: 2023,
    semester: 1,
    students: 30,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
]

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const classData = classes.find((c) => c.id === id)
  
  if (!classData) {
    return new Response("Turma não encontrada", { status: 404 })
  }
  
  return NextResponse.json(classData)
}
