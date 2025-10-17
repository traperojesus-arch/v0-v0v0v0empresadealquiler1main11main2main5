import { type NextRequest, NextResponse } from "next/server"
import { usuariosDB } from "@/lib/database"

export async function GET() {
  try {
    const usuarios = await usuariosDB.getAll()
    return NextResponse.json(usuarios)
  } catch (error) {
    console.error("Error fetching usuarios:", error)
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const usuario = await usuariosDB.create(body)
    return NextResponse.json(usuario, { status: 201 })
  } catch (error) {
    console.error("Error creating usuario:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}
