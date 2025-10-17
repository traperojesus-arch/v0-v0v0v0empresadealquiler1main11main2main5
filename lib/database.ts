import { shouldUseSupabase, createServerClient } from "./supabase/server"
import { mockDataStore } from "./mock-data-store"

export const articulosDB = {
  async getAll() {
    if (shouldUseSupabase()) {
      const supabase = createServerClient()
      if (!supabase) return mockDataStore.getArticulos()

      const { data, error } = await supabase.from("articulos").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data
    } else {
      return mockDataStore.getArticulos()
    }
  },
  async create(articulo: any) {
    if (shouldUseSupabase()) {
      const supabase = createServerClient()
      if (!supabase) return mockDataStore.addArticulo(articulo)

      const { data, error } = await supabase.from("articulos").insert(articulo).select().single()

      if (error) throw error
      return data
    } else {
      return mockDataStore.addArticulo(articulo)
    }
  },
}

export const pedidosDB = {
  async getAll() {
    if (shouldUseSupabase()) {
      const supabase = createServerClient()
      if (!supabase) return mockDataStore.getPedidos()

      const { data, error } = await supabase.from("pedidos").select("*").order("fecha_pedido", { ascending: false })

      if (error) throw error
      return data
    } else {
      return mockDataStore.getPedidos()
    }
  },
  async create(pedido: any) {
    if (shouldUseSupabase()) {
      const supabase = createServerClient()
      if (!supabase) return mockDataStore.addPedido(pedido)

      const { data, error } = await supabase.from("pedidos").insert(pedido).select().single()

      if (error) throw error
      return data
    } else {
      return mockDataStore.addPedido(pedido)
    }
  },
}

export const usuariosDB = {
  async getAll() {
    if (shouldUseSupabase()) {
      const supabase = createServerClient()
      if (!supabase) return mockDataStore.getClientes()

      const { data, error } = await supabase.from("clientes").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data
    } else {
      return mockDataStore.getClientes()
    }
  },
  async create(usuario: any) {
    if (shouldUseSupabase()) {
      const supabase = createServerClient()
      if (!supabase) return mockDataStore.addCliente(usuario)

      const { data, error } = await supabase.from("clientes").insert(usuario).select().single()

      if (error) throw error
      return data
    } else {
      return mockDataStore.addCliente(usuario)
    }
  },
}
