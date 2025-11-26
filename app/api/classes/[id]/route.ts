import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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
  try {
    const id = params.id
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: classData, error } = await supabase
      .from("classes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) {
      console.error("Erro ao buscar turma:", error)
      return NextResponse.json(
        { error: "Turma não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(classData)
  } catch (error) {
    console.error("Erro ao buscar turma:", error)
    return NextResponse.json(
      { error: "Erro ao buscar turma" },
      { status: 500 }
    )
  }
}
