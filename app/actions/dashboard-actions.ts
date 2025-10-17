"use server"

import {
  createServerClient,
  shouldUseSupabase,
  isTableNotFoundError,
  markTablesAsNonExistent,
} from "@/lib/supabase/server"
import { mockStore } from "@/lib/mock-data-store"

export async function getDashboardStats() {
  if (!shouldUseSupabase()) {
    const reservas = mockStore.getReservas()
    const articulos = mockStore.getArticulos()
    const clientes = mockStore.getClientes()

    return {
      ingresosMes: reservas.reduce((sum, r) => sum + r.total, 0),
      pedidosActivos: reservas.filter((r) => r.estado === "confirmado" || r.estado === "pendiente").length,
      articulosDisponibles: articulos.filter((a) => a.stock_disponible > 0).length,
      totalClientes: clientes.length,
    }
  }

  const supabase = createServerClient()
  if (!supabase) {
    const reservas = mockStore.getReservas()
    const articulos = mockStore.getArticulos()
    const clientes = mockStore.getClientes()

    return {
      ingresosMes: reservas.reduce((sum, r) => sum + r.total, 0),
      pedidosActivos: reservas.filter((r) => r.estado === "confirmado" || r.estado === "pendiente").length,
      articulosDisponibles: articulos.filter((a) => a.stock_disponible > 0).length,
      totalClientes: clientes.length,
    }
  }

  try {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data: pedidos, error: pedidosError } = await supabase
      .from("pedidos")
      .select("total")
      .gte("fecha_pedido", startOfMonth.toISOString())

    if (pedidosError) {
      if (isTableNotFoundError(pedidosError)) {
        markTablesAsNonExistent()
        const reservas = mockStore.getReservas()
        const articulos = mockStore.getArticulos()
        const clientes = mockStore.getClientes()

        return {
          ingresosMes: reservas.reduce((sum, r) => sum + r.total, 0),
          pedidosActivos: reservas.filter((r) => r.estado === "confirmado" || r.estado === "pendiente").length,
          articulosDisponibles: articulos.filter((a) => a.stock_disponible > 0).length,
          totalClientes: clientes.length,
        }
      }
      throw pedidosError
    }

    const ingresosMes = pedidos?.reduce((sum, p) => sum + (p.total || 0), 0) || 0

    const { count: pedidosActivos, error: activosError } = await supabase
      .from("pedidos")
      .select("*", { count: "exact", head: true })
      .in("estado", ["pendiente", "confirmado", "en_preparacion"])

    if (activosError) throw activosError

    const { count: articulosDisponibles, error: articulosError } = await supabase
      .from("articulos")
      .select("*", { count: "exact", head: true })
      .eq("estado", "disponible")

    if (articulosError) throw articulosError

    const { count: totalClientes, error: clientesError } = await supabase
      .from("usuarios")
      .select("*", { count: "exact", head: true })
      .eq("rol", "cliente")

    if (clientesError) throw clientesError

    return {
      ingresosMes: ingresosMes,
      pedidosActivos: pedidosActivos || 0,
      articulosDisponibles: articulosDisponibles || 0,
      totalClientes: totalClientes || 0,
    }
  } catch (error) {
    const reservas = mockStore.getReservas()
    const articulos = mockStore.getArticulos()
    const clientes = mockStore.getClientes()

    return {
      ingresosMes: reservas.reduce((sum, r) => sum + r.total, 0),
      pedidosActivos: reservas.filter((r) => r.estado === "confirmado" || r.estado === "pendiente").length,
      articulosDisponibles: articulos.filter((a) => a.stock_disponible > 0).length,
      totalClientes: clientes.length,
    }
  }
}

export async function getRecentOrders() {
  if (!shouldUseSupabase()) {
    return mockStore
      .getReservas()
      .slice(0, 5)
      .map((r) => ({
        id: r.id,
        numero_pedido: r.numeroPedido,
        fecha_pedido: r.fecha_desde,
        fecha_entrega: r.fecha_hasta,
        estado: r.estado,
        total: r.total,
        usuarios: { nombre: r.cliente, email: r.email },
      }))
  }

  const supabase = createServerClient()
  if (!supabase) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from("pedidos")
      .select(`
        id,
        numero_pedido,
        fecha_pedido,
        fecha_entrega,
        estado,
        total,
        usuarios:cliente_id (
          nombre,
          email
        )
      `)
      .order("fecha_pedido", { ascending: false })
      .limit(5)

    if (error) {
      if (isTableNotFoundError(error)) {
        markTablesAsNonExistent()
        return mockStore
          .getReservas()
          .slice(0, 5)
          .map((r) => ({
            id: r.id,
            numero_pedido: r.numeroPedido,
            fecha_pedido: r.fecha_desde,
            fecha_entrega: r.fecha_hasta,
            estado: r.estado,
            total: r.total,
            usuarios: { nombre: r.cliente, email: r.email },
          }))
      }
      throw error
    }

    return data || []
  } catch (error) {
    return mockStore
      .getReservas()
      .slice(0, 5)
      .map((r) => ({
        id: r.id,
        numero_pedido: r.numeroPedido,
        fecha_pedido: r.fecha_desde,
        fecha_entrega: r.fecha_hasta,
        estado: r.estado,
        total: r.total,
        usuarios: { nombre: r.cliente, email: r.email },
      }))
  }
}

export async function getUpcomingDeliveries() {
  if (!shouldUseSupabase()) {
    return mockStore
      .getReservasConfirmadas()
      .slice(0, 5)
      .map((r) => ({
        id: r.id,
        numero_pedido: r.numeroPedido,
        fecha_entrega: r.fecha_hasta,
        usuarios: { nombre: r.cliente },
      }))
  }

  const supabase = createServerClient()
  if (!supabase) {
    return []
  }

  try {
    const today = new Date()
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(today.getDate() + 3)

    const { data, error } = await supabase
      .from("pedidos")
      .select(`
        id,
        numero_pedido,
        fecha_entrega,
        usuarios:cliente_id (
          nombre
        )
      `)
      .gte("fecha_entrega", today.toISOString())
      .lte("fecha_entrega", threeDaysFromNow.toISOString())
      .in("estado", ["confirmado", "en_preparacion"])
      .order("fecha_entrega", { ascending: true })
      .limit(5)

    if (error) {
      if (isTableNotFoundError(error)) {
        markTablesAsNonExistent()
        return mockStore
          .getReservasConfirmadas()
          .slice(0, 5)
          .map((r) => ({
            id: r.id,
            numero_pedido: r.numeroPedido,
            fecha_entrega: r.fecha_hasta,
            usuarios: { nombre: r.cliente },
          }))
      }
      throw error
    }

    return data || []
  } catch (error) {
    return mockStore
      .getReservasConfirmadas()
      .slice(0, 5)
      .map((r) => ({
        id: r.id,
        numero_pedido: r.numeroPedido,
        fecha_entrega: r.fecha_hasta,
        usuarios: { nombre: r.cliente },
      }))
  }
}
