"use server"

import { createServerClient, shouldUseSupabase } from "@/lib/supabase/server"
import { mockStore } from "@/lib/mock-data-store"
import { revalidatePath } from "next/cache"

export async function getClientes(filters?: { search?: string; tipo?: string }) {
  if (!shouldUseSupabase()) {
    console.log("[v0] Usando datos mock para clientes")
    let clientes = mockStore.getClientes()

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      clientes = clientes.filter(
        (c) =>
          c.nombre.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.empresa?.toLowerCase().includes(searchLower),
      )
    }

    return { success: true, data: clientes }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, data: [], error: "Supabase no configurado" }
  }

  try {
    let query = supabase.from("usuarios").select("*").eq("rol", "cliente").order("created_at", { ascending: false })

    if (filters?.search) {
      query = query.or(
        `nombre.ilike.%${filters.search}%,email.ilike.%${filters.search}%,empresa.ilike.%${filters.search}%`,
      )
    }

    if (filters?.tipo && filters.tipo !== "todos") {
      query = query.eq("tipo_cliente", filters.tipo)
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("[v0] Error obteniendo clientes:", error)
    return { success: false, data: [], error: "Error al obtener clientes" }
  }
}

export async function createCliente(formData: {
  nombre: string
  email: string
  telefono: string
  direccion: string
  empresa?: string
  nif_cif?: string
  tipo_cliente: string
  notas?: string
}) {
  if (!shouldUseSupabase()) {
    const newCliente = mockStore.addCliente({
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      empresa: formData.empresa,
      direccion: formData.direccion,
    })
    revalidatePath("/clientes")
    return { success: true, data: newCliente }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Supabase no configurado" }
  }

  try {
    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ ...formData, rol: "cliente" }])
      .select()
      .single()

    if (error) throw error

    revalidatePath("/clientes")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error creando cliente:", error)
    return { success: false, error: "Error al crear cliente" }
  }
}

export async function updateCliente(id: string, formData: any) {
  if (!shouldUseSupabase()) {
    return { success: true, data: null }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Supabase no configurado" }
  }

  try {
    const { data, error } = await supabase.from("usuarios").update(formData).eq("id", id).select().single()

    if (error) throw error

    revalidatePath("/clientes")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error actualizando cliente:", error)
    return { success: false, error: "Error al actualizar cliente" }
  }
}

export async function deleteCliente(id: string) {
  if (!shouldUseSupabase()) {
    return { success: true }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Supabase no configurado" }
  }

  try {
    const { error } = await supabase.from("usuarios").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/clientes")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error eliminando cliente:", error)
    return { success: false, error: "Error al eliminar cliente" }
  }
}

export async function getClienteById(id: string) {
  if (!shouldUseSupabase()) {
    return { success: true, data: null }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Supabase no configurado" }
  }

  try {
    const { data, error } = await supabase.from("usuarios").select("*").eq("id", id).eq("rol", "cliente").single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error obteniendo cliente:", error)
    return { success: false, error: "Error al obtener cliente" }
  }
}

export async function getClientePedidos(clienteId: string) {
  if (!shouldUseSupabase()) {
    return { success: true, data: [] }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, data: [], error: "Supabase no configurado" }
  }

  try {
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .eq("cliente_id", clienteId)
      .order("fecha_pedido", { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("[v0] Error obteniendo pedidos del cliente:", error)
    return { success: false, data: [], error: "Error al obtener pedidos" }
  }
}
