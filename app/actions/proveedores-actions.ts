"use server"

import { createServerClient, shouldUseSupabase } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Proveedor {
  id: string
  nombre: string
  contacto?: string
  telefono?: string
  email?: string
  direccion?: string
  cif?: string
  notas?: string
  activo: boolean
}

export async function getProveedores(search?: string) {
  if (!shouldUseSupabase()) {
    // Mock data
    const mockProveedores: Proveedor[] = [
      {
        id: "1",
        nombre: "Muebles García S.L.",
        contacto: "Juan García",
        telefono: "912345678",
        email: "info@mueblesgarcia.com",
        activo: true,
      },
      {
        id: "2",
        nombre: "Eventos Pro",
        contacto: "María López",
        telefono: "923456789",
        email: "ventas@eventospro.com",
        activo: true,
      },
      {
        id: "3",
        nombre: "Iluminación Total",
        contacto: "Pedro Martínez",
        telefono: "934567890",
        email: "contacto@iluminaciontotal.com",
        activo: true,
      },
    ]

    if (search) {
      const searchLower = search.toLowerCase()
      return { success: true, data: mockProveedores.filter((p) => p.nombre.toLowerCase().includes(searchLower)) }
    }

    return { success: true, data: mockProveedores }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Supabase no configurado", data: [] }
  }

  try {
    let query = supabase.from("proveedores").select("*").eq("activo", true).order("nombre", { ascending: true })

    if (search) {
      query = query.ilike("nombre", `%${search}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("[v0] Error obteniendo proveedores:", error)
    return { success: false, error: "Error al obtener proveedores", data: [] }
  }
}

export async function createProveedor(formData: {
  nombre: string
  contacto?: string
  telefono?: string
  email?: string
  direccion?: string
  cif?: string
  notas?: string
}) {
  if (!shouldUseSupabase()) {
    return { success: true, data: { id: Date.now().toString(), ...formData, activo: true } }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Supabase no configurado" }
  }

  try {
    const { data, error } = await supabase
      .from("proveedores")
      .insert([{ ...formData, activo: true }])
      .select()
      .single()

    if (error) throw error

    revalidatePath("/articulos")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error creando proveedor:", error)
    if (error.code === "23505") {
      return { success: false, error: "Ya existe un proveedor con ese nombre" }
    }
    return { success: false, error: "Error al crear proveedor" }
  }
}
