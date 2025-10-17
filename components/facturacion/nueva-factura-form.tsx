"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"
import Link from "next/link"
import { getPedidos } from "@/app/actions/pedidos-actions"
import { getClientes } from "@/app/actions/clientes-actions"

export function NuevaFacturaForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reservaId = searchParams.get("reserva")
  const albaranId = searchParams.get("albaran")

  const [reservas, setReservas] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [reservaSeleccionada, setReservaSeleccionada] = useState<any>(null)

  const [formData, setFormData] = useState({
    numeroFactura: `FAC-2025-${String(Math.floor(Math.random() * 1000)).padStart(4, "0")}`,
    clienteId: "",
    reservaId: reservaId || "",
    albaranId: albaranId || "",
    fechaEmision: new Date().toISOString().split("T")[0],
    fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    metodoPago: "",
    notas: "",
  })

  const [lineas, setLineas] = useState([
    { articulo: "", descripcion: "", cantidad: 1, precioUnitario: 0, descuento: 0 },
  ])

  useEffect(() => {
    cargarDatos()
  }, [])

  useEffect(() => {
    if (reservaId && reservas.length > 0) {
      const reserva = reservas.find((r) => r.id === reservaId)
      if (reserva) {
        cargarArticulosDeReserva(reserva)
      }
    }
  }, [reservaId, reservas])

  const cargarDatos = async () => {
    const [resultReservas, resultClientes] = await Promise.all([getPedidos({ estado: "confirmado" }), getClientes()])

    if (resultReservas.success) {
      setReservas(resultReservas.data)
    }

    if (resultClientes.success) {
      setClientes(resultClientes.data)
    }
  }

  const cargarArticulosDeReserva = (reserva: any) => {
    console.log("[v0] Cargando artículos de reserva:", reserva)
    setReservaSeleccionada(reserva)

    // Calcular días de alquiler
    const fechaInicio = new Date(reserva.fecha_desde || reserva.fechaInicio)
    const fechaFin = new Date(reserva.fecha_hasta || reserva.fechaFin)
    const dias = Math.max(1, Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)))

    // Cargar artículos de la reserva
    if (reserva.articulos && reserva.articulos.length > 0) {
      const nuevasLineas = reserva.articulos.map((art: any) => ({
        articulo: art.articulo_id || art.id,
        descripcion: `${art.nombre} (${dias} días)`,
        cantidad: art.cantidad,
        precioUnitario: art.precio_unitario * dias,
        descuento: 0,
      }))
      setLineas(nuevasLineas)
    }

    // Autocompletar datos del cliente
    setFormData({
      ...formData,
      clienteId: reserva.cliente_id,
      reservaId: reserva.id,
      notas: `Factura generada desde reserva ${reserva.numeroPedido || reserva.numero_pedido || reserva.id}\n${reserva.notas || ""}`,
    })
  }

  const handleReservaChange = (reservaId: string) => {
    const reserva = reservas.find((r) => r.id === reservaId)
    if (reserva) {
      cargarArticulosDeReserva(reserva)
    }
  }

  const agregarLinea = () => {
    setLineas([...lineas, { articulo: "", descripcion: "", cantidad: 1, precioUnitario: 0, descuento: 0 }])
  }

  const eliminarLinea = (index: number) => {
    setLineas(lineas.filter((_, i) => i !== index))
  }

  const actualizarLinea = (index: number, campo: string, valor: any) => {
    const nuevasLineas = [...lineas]
    nuevasLineas[index] = { ...nuevasLineas[index], [campo]: valor }
    setLineas(nuevasLineas)
  }

  const calcularSubtotal = (linea: any) => {
    const subtotal = linea.cantidad * linea.precioUnitario
    return subtotal - (subtotal * linea.descuento) / 100
  }

  const calcularTotales = () => {
    const subtotal = lineas.reduce((sum, linea) => sum + calcularSubtotal(linea), 0)
    const iva = subtotal * 0.21
    const total = subtotal + iva
    return { subtotal, iva, total }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Creando nueva factura:", { formData, lineas })
    alert("Factura creada exitosamente")
    router.push("/facturacion")
  }

  const totales = calcularTotales()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/facturacion">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Nueva Factura</h1>
            <p className="text-muted-foreground mt-1">
              {reservaSeleccionada
                ? `Generando factura desde reserva ${reservaSeleccionada.numeroPedido || reservaSeleccionada.numero_pedido || reservaSeleccionada.id}`
                : albaranId
                  ? `Generando factura desde albarán ${albaranId}`
                  : "Crear una nueva factura"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="numeroFactura">Número de Factura</Label>
                <Input
                  id="numeroFactura"
                  value={formData.numeroFactura}
                  onChange={(e) => setFormData({ ...formData, numeroFactura: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fechaEmision">Fecha de Emisión</Label>
                <Input
                  id="fechaEmision"
                  type="date"
                  value={formData.fechaEmision}
                  onChange={(e) => setFormData({ ...formData, fechaEmision: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
                <Input
                  id="fechaVencimiento"
                  type="date"
                  value={formData.fechaVencimiento}
                  onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reservaId">Reserva (opcional)</Label>
                <Select value={formData.reservaId} onValueChange={handleReservaChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar reserva confirmada" />
                  </SelectTrigger>
                  <SelectContent>
                    {reservas.map((reserva) => (
                      <SelectItem key={reserva.id} value={reserva.id}>
                        {reserva.numeroPedido || reserva.numero_pedido || `Reserva ${reserva.id}`} -{" "}
                        {reserva.cliente || reserva.cliente_nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Al seleccionar una reserva, los artículos se cargarán automáticamente
                </p>
              </div>
              <div>
                <Label htmlFor="clienteId">Cliente</Label>
                <Select
                  value={formData.clienteId}
                  onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nombre} {cliente.empresa ? `- ${cliente.empresa}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="metodoPago">Método de Pago</Label>
                <Select
                  value={formData.metodoPago}
                  onValueChange={(value) => setFormData({ ...formData, metodoPago: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {albaranId && (
                <div>
                  <Label>Albarán Asociado</Label>
                  <Input value={albaranId} disabled />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                placeholder="Notas adicionales para la factura..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Líneas de Factura</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={agregarLinea}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Línea
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {lineas.map((linea, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Línea {index + 1}</h4>
                  {lineas.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => eliminarLinea(index)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-2">
                    <Label>Descripción</Label>
                    <Input
                      value={linea.descripcion}
                      onChange={(e) => actualizarLinea(index, "descripcion", e.target.value)}
                      placeholder="Descripción del artículo"
                      required
                    />
                  </div>
                  <div>
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      min="1"
                      value={linea.cantidad}
                      onChange={(e) => actualizarLinea(index, "cantidad", Number.parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Precio Unitario (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={linea.precioUnitario}
                      onChange={(e) => actualizarLinea(index, "precioUnitario", Number.parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Descuento (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={linea.descuento}
                      onChange={(e) => actualizarLinea(index, "descuento", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Subtotal</p>
                    <p className="text-lg font-bold">€{calcularSubtotal(linea).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span className="font-medium">€{totales.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>IVA (21%):</span>
                <span className="font-medium">€{totales.iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-3 border-t">
                <span>Total:</span>
                <span className="text-primary">€{totales.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/facturacion")}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Crear Factura
          </Button>
        </div>
      </form>
    </div>
  )
}
