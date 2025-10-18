"use server"

import { createServerClient, shouldUseSupabase, isTableNotFoundError } from "@/lib/supabase/server"
import { mockStore } from "@/lib/mock-data-store"
import { revalidatePath } from "next/cache"

export async function getArticulos(filters?: { categoria?: string; estado?: string; search?: string }) {
  if (!shouldUseSupabase()) {
    let articulos = mockStore.getArticulos()

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      articulos = articulos.filter(
        (a) =>
          a.nombre.toLowerCase().includes(searchLower) ||
          a.descripcion.toLowerCase().includes(searchLower) ||
          a.codigo.toLowerCase().includes(searchLower),
      )
    }

    if (filters?.categoria && filters.categoria !== "todas") {
      articulos = articulos.filter((a) => a.categoria === filters.categoria)
    }

    return { success: true, data: articulos }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return { success: true, data: mockStore.getArticulos() }
  }

  try {
    let query = supabase.from("articulos").select("*").order("created_at", { ascending: false })

    if (filters?.categoria && filters.categoria !== "todas") {
      query = query.eq("categoria", filters.categoria)
    }

    if (filters?.estado && filters.estado !== "todos") {
      query = query.eq("estado", filters.estado)
    }

    if (filters?.search) {
      query = query.or(`nombre.ilike.%${filters.search}%,descripcion.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) {
      if (isTableNotFoundError(error)) {
        // Silenciosamente usar datos mock cuando las tablas no existen
        return { success: true, data: mockStore.getArticulos() }
      }
      console.error("[v0] Error obteniendo artículos:", error)
      return { success: true, data: mockStore.getArticulos() }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    // Usar mock como fallback
    return { success: true, data: mockStore.getArticulos() }
  }
}

export async function createArticulo(formData: {
  nombre: string
  descripcion: string
  categoria: string
  precio_alquiler: number
  cantidad_disponible: number
  cantidad_total: number
  estado: string
  imagen_url?: string
  imagenes?: string[]
  coste_compra?: number
  fecha_compra?: string
  proveedor?: string
  entidades?: string[]
}) {
  if (!shouldUseSupabase()) {
    const newArticulo = mockStore.addArticulo({
      codigo: `ART-${Date.now()}`,
      nombre: formData.nombre,
      categoria: formData.categoria,
      descripcion: formData.descripcion,
      precio_dia: formData.precio_alquiler,
      stock_total: formData.cantidad_total,
      stock_disponible: formData.cantidad_disponible,
      imagenes: formData.imagenes || (formData.imagen_url ? [formData.imagen_url] : []),
    })
    revalidatePath("/articulos")
    return { success: true, data: newArticulo }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Supabase no configurado" }
  }

  try {
    const articuloData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      precio_dia: formData.precio_alquiler,
      stock_total: formData.cantidad_total,
      stock_disponible: formData.cantidad_disponible,
      estado: formData.estado,
      imagenes: formData.imagenes || [],
      coste_compra: formData.coste_compra,
      fecha_compra: formData.fecha_compra,
      proveedor: formData.proveedor,
      activo: true,
    }

    const { data: articulo, error: articuloError } = await supabase
      .from("articulos")
      .insert([articuloData])
      .select()
      .single()

    if (articuloError) throw articuloError

    if (formData.entidades && formData.entidades.length > 0) {
      const entidadesData = formData.entidades.map((codigo) => ({
        articulo_id: articulo.id,
        codigo_unico: codigo,
        estado: "disponible",
        ubicacion: null,
        notas: null,
      }))

      const { error: entidadesError } = await supabase.from("entidades_articulos").insert(entidadesData)

      if (entidadesError) {
        console.error("[v0] Error creando entidades:", entidadesError)
        // No fallar si las entidades no se crean, el artículo ya está creado
      }
    }

    revalidatePath("/articulos")
    return { success: true, data: articulo }
  } catch (error) {
    console.error("[v0] Error creando artículo:", error)
    return { success: false, error: "Error al crear artículo" }
  }
}

export async function updateArticulo(
  id: string,
  formData: {
    nombre?: string
    descripcion?: string
    categoria?: string
    precio_alquiler?: number
    cantidad_disponible?: number
    cantidad_total?: number
    estado?: string
    imagen_url?: string
    imagenes?: string[]
    coste_compra?: number
    fecha_compra?: string
    proveedor?: string
    entidades?: string[]
  },
) {
  if (!shouldUseSupabase()) {
    const updated = mockStore.updateArticulo(id, {
      nombre: formData.nombre,
      categoria: formData.categoria,
      descripcion: formData.descripcion,
      precio_dia: formData.precio_alquiler,
      stock_total: formData.cantidad_total,
      stock_disponible: formData.cantidad_disponible,
      imagenes: formData.imagenes || (formData.imagen_url ? [formData.imagen_url] : undefined),
    })
    revalidatePath("/articulos")
    return { success: true, data: updated }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Supabase no configurado" }
  }

  try {
    const { data, error } = await supabase.from("articulos").update(formData).eq("id", id).select().single()

    if (error) throw error

    revalidatePath("/articulos")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error actualizando artículo:", error)
    return { success: false, error: "Error al actualizar artículo" }
  }
}

export async function deleteArticulo(id: string) {
  if (!shouldUseSupabase()) {
    mockStore.deleteArticulo(id)
    revalidatePath("/articulos")
    return { success: true }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Supabase no configurado" }
  }

  try {
    const { error } = await supabase.from("articulos").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/articulos")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error eliminando artículo:", error)
    return { success: false, error: "Error al eliminar artículo" }
  }
}

export async function getArticuloById(id: string) {
  if (!shouldUseSupabase()) {
    const articulo = mockStore.getArticulo(id)
    return { success: true, data: articulo }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Supabase no configurado" }
  }

  try {
    const { data, error } = await supabase.from("articulos").select("*").eq("id", id).single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error obteniendo artículo:", error)
    return { success: false, error: "Error al obtener artículo" }
  }
}

export async function getHistorialArticulo(articuloId: string) {
  if (!shouldUseSupabase()) {
    return { success: true, data: [] }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, data: [], error: "Supabase no configurado" }
  }

  try {
    const { data, error } = await supabase
      .from("historial_articulos")
      .select(`
        *,
        pedidos:pedido_id (
          numero_pedido,
          fecha_pedido,
          fecha_entrega,
          fecha_devolucion
        )
      `)
      .eq("articulo_id", articuloId)
      .order("fecha_inicio", { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("[v0] Error obteniendo historial:", error)
    return { success: false, data: [], error: "Error al obtener historial" }
  }
}
