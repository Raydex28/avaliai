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

export async function GET() {
  return NextResponse.json(classes)
}

export async function POST(request: Request) {
  const body = await request.json()
  
  // Criar nova turma
  const newClass = {
    id: `class-${Date.now()}`,
    name: body.name || "Nova Turma",
    period: body.period || "Semestre",
    year: body.year || new Date().getFullYear(),
    semester: body.semester || 1,
    students: body.students || 0,
    createdAt: new Date().toISOString(),
  }
  
  // Em uma implementação real, você salvaria no banco de dados
  classes.push(newClass)
  
  return NextResponse.json(newClass)
}
