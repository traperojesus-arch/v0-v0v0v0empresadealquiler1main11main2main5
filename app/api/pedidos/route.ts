import { type NextRequest, NextResponse } from "next/server"
import { pedidosDB } from "@/lib/database"

export async function GET() {
  try {
    const pedidos = await pedidosDB.getAll()
    return NextResponse.json(pedidos)
  } catch (error) {
    console.error("Error fetching pedidos:", error)
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const pedido = await pedidosDB.create(body)
    return NextResponse.json(pedido, { status: 201 })
  } catch (error) {
    console.error("Error creating pedido:", error)
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 })
  }
}
