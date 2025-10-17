import { type NextRequest, NextResponse } from "next/server"
import { articulosDB } from "@/lib/database"

export async function GET() {
  try {
    const articulos = await articulosDB.getAll()
    return NextResponse.json(articulos)
  } catch (error) {
    console.error("Error fetching articulos:", error)
    return NextResponse.json({ error: "Error al obtener artículos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const articulo = await articulosDB.create(body)
    return NextResponse.json(articulo, { status: 201 })
  } catch (error) {
    console.error("Error creating articulo:", error)
    return NextResponse.json({ error: "Error al crear artículo" }, { status: 500 })
  }
}
