"use client"

import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Calendar, MapPin, User, Euro, Phone, Search, Filter, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { mockDataStore } from "@/lib/mock-data-store"

const statusColors = {
  pendiente: "bg-yellow-100 text-yellow-800",
  pendiente_pago_anticipado: "bg-orange-100 text-orange-800",
  confirmado: "bg-blue-100 text-blue-800",
  reservado: "bg-purple-100 text-purple-800",
  en_servicio: "bg-green-100 text-green-800",
  completado: "bg-gray-100 text-gray-800",
  cancelado: "bg-red-100 text-red-800",
}

const statusLabels = {
  pendiente: "Pendiente",
  pendiente_pago_anticipado: "Pendiente de Pago",
  confirmado: "Confirmado",
  reservado: "Reservado",
  en_servicio: "En Servicio",
  completado: "Completado",
  cancelado: "Cancelado",
}

export function PedidosList() {
  const router = useRouter()
  const [pedidos, setPedidos] = useState(mockDataStore.getPedidos())

  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [filtros, setFiltros] = useState({
    busqueda: "",
    estado: "todos",
    fechaDesde: "",
    fechaHasta: "",
    cliente: "",
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setPedidos(mockDataStore.getPedidos())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const pedidosFiltrados = pedidos.filter((pedido) => {
    // Filtro por búsqueda general
    if (filtros.busqueda) {
      const busquedaLower = filtros.busqueda.toLowerCase()
      const coincide =
        pedido.id.toLowerCase().includes(busquedaLower) ||
        pedido.cliente.toLowerCase().includes(busquedaLower) ||
        pedido.empresa?.toLowerCase().includes(busquedaLower) ||
        pedido.ubicacion.toLowerCase().includes(busquedaLower) ||
        pedido.telefono.includes(busquedaLower)
      if (!coincide) return false
    }

    // Filtro por estado
    if (filtros.estado !== "todos" && pedido.estado !== filtros.estado) {
      return false
    }

    // Filtro por fecha desde
    if (filtros.fechaDesde && pedido.fechaRecogida < filtros.fechaDesde) {
      return false
    }

    // Filtro por fecha hasta
    if (filtros.fechaHasta && pedido.fechaRecogida > filtros.fechaHasta) {
      return false
    }

    // Filtro por cliente
    if (filtros.cliente && !pedido.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())) {
      return false
    }

    return true
  })

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: "",
      estado: "todos",
      fechaDesde: "",
      fechaHasta: "",
      cliente: "",
    })
  }

  const handleContactar = (telefono: string, cliente: string) => {
    const mensaje = `Hola ${cliente}, le contacto desde la empresa de alquiler...`
    window.open(`https://wa.me/${telefono.replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`, "_blank")
  }

  const handleVerDetalles = (id: string) => {
    router.push(`/pedidos/${id}`)
  }

  const handleCancelar = (id: string) => {
    if (confirm("¿Está seguro de cancelar este pedido?")) {
      const pedido = pedidos.find((p) => p.id === id)
      if (pedido) {
        mockDataStore.updatePedido(id, { ...pedido, estado: "cancelado" })
        setPedidos(mockDataStore.getPedidos())
      }
    }
  }

  const totalPagado = pedidosFiltrados.reduce((sum, p) => sum + (p.pagado || 0), 0)
  const totalPendiente = pedidosFiltrados.reduce((sum, p) => sum + (p.pendiente || 0), 0)

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, cliente, empresa, ubicación o teléfono..."
                  className="pl-9"
                  value={filtros.busqueda}
                  onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                />
              </div>
              <Button
                variant={mostrarFiltros ? "default" : "outline"}
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              {(filtros.estado !== "todos" ||
                filtros.fechaDesde ||
                filtros.fechaHasta ||
                filtros.cliente ||
                filtros.busqueda) && (
                <Button variant="ghost" onClick={limpiarFiltros}>
                  <X className="w-4 h-4 mr-2" />
                  Limpiar
                </Button>
              )}
            </div>

            {mostrarFiltros && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <label htmlFor="filtro-estado">Estado</label>
                  <select value={filtros.estado} onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}>
                    <option value="todos">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="pendiente_pago_anticipado">Pendiente de Pago</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="reservado">Reservado</option>
                    <option value="en_servicio">En Servicio</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="filtro-fecha-desde">Fecha Desde</label>
                  <input
                    id="filtro-fecha-desde"
                    type="date"
                    value={filtros.fechaDesde}
                    onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="filtro-fecha-hasta">Fecha Hasta</label>
                  <input
                    id="filtro-fecha-hasta"
                    type="date"
                    value={filtros.fechaHasta}
                    onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="filtro-cliente">Cliente</label>
                  <input
                    id="filtro-cliente"
                    placeholder="Nombre del cliente"
                    value={filtros.cliente}
                    onChange={(e) => setFiltros({ ...filtros, cliente: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Total pagado:</span>
          <span className="font-medium text-green-600">€{totalPagado.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground ml-4">Total pendiente:</span>
          <span className="font-medium text-red-600">€{totalPendiente.toFixed(2)}</span>
        </div>
      </div>

      {pedidosFiltrados.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No se encontraron pedidos con los filtros aplicados</p>
            <Button variant="outline" onClick={limpiarFiltros}>
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pedidosFiltrados.map((pedido) => (
            <Card key={pedido.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold text-lg">{pedido.id}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{pedido.cliente}</span>
                        {pedido.empresa && <span>• {pedido.empresa}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[pedido.estado as keyof typeof statusColors]}>
                      {statusLabels[pedido.estado as keyof typeof statusLabels]}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleVerDetalles(pedido.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/pedidos/${pedido.id}/editar`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContactar(pedido.telefono, pedido.cliente)}>
                          <Phone className="mr-2 h-4 w-4" />
                          Contactar cliente
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleCancelar(pedido.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancelar pedido
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Fechas:</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">Desde: {pedido.fechaRecogida}</p>
                    <p className="text-sm text-muted-foreground ml-6">Hasta: {pedido.fechaDevolucion}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Ubicación:</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">{pedido.ubicacion}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Artículos:</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">{pedido.articulos} artículos</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Euro className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Total:</span>
                    </div>
                    <p className="text-lg font-bold text-primary ml-6">€{pedido.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Contacto: {pedido.telefono}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">Pagado: €{(pedido.pagado || 0).toFixed(2)}</span>
                      <span className="text-red-600">Pendiente: €{(pedido.pendiente || 0).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContactar(pedido.telefono, pedido.cliente)}
                    >
                      Contactar Cliente
                    </Button>
                    <Button size="sm" onClick={() => handleVerDetalles(pedido.id)}>
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
