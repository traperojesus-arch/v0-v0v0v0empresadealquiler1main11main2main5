"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { mockStore } from "@/lib/mock-data-store"

export function NuevoAlbaranForm() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    numeroAlbaran: `ALB-2025-${String(Math.floor(Math.random() * 1000)).padStart(4, "0")}`,
    pedidoId: "",
    fechaEmision: new Date().toISOString().split("T")[0],
    fechaEntrega: "",
    direccionEntrega: "",
    responsableEntrega: "",
    observaciones: "",
  })

  const [articulos, setArticulos] = useState([{ articulo_id: "", descripcion: "", cantidad: 1 }])

  // Datos de ejemplo que vendrían de la base de datos
  const pedidos = mockStore.getReservas()
  const empleados = [
    { id: "emp1", nombre: "Carlos Ruiz" },
    { id: "emp2", nombre: "Ana López" },
  ]

  useEffect(() => {
    if (formData.pedidoId) {
      const pedidoSeleccionado = pedidos.find((p) => p.id === formData.pedidoId)
      if (pedidoSeleccionado) {
        setFormData((prev) => ({
          ...prev,
          fechaEntrega: pedidoSeleccionado.fecha_desde,
          direccionEntrega: pedidoSeleccionado.ubicacion || "",
        }))
        setArticulos(
          pedidoSeleccionado.articulos.map((a) => ({ ...a, descripcion: a.nombre })) || [
            { articulo_id: "", descripcion: "", cantidad: 1 },
          ],
        )
      }
    }
  }, [formData.pedidoId])

  const agregarArticulo = () => {
    setArticulos([...articulos, { articulo_id: "", descripcion: "", cantidad: 1 }])
  }

  const eliminarArticulo = (index: number) => {
    setArticulos(articulos.filter((_, i) => i !== index))
  }

  const actualizarArticulo = (index: number, campo: string, valor: any) => {
    const nuevosArticulos = [...articulos]
    nuevosArticulos[index] = { ...nuevosArticulos[index], [campo]: valor }
    setArticulos(nuevosArticulos)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Creando nuevo albarán:", { formData, articulos })
    alert("Albarán creado exitosamente")
    router.push("/facturacion")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/facturacion">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Nuevo Albarán de Entrega</h1>
            <p className="text-muted-foreground mt-1">Crear un nuevo albarán de entrega</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numeroAlbaran">Número de Albarán</Label>
                <Input
                  id="numeroAlbaran"
                  value={formData.numeroAlbaran}
                  onChange={(e) => setFormData({ ...formData, numeroAlbaran: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="pedidoId">Pedido Asociado</Label>
                <Select
                  value={formData.pedidoId}
                  onValueChange={(value) => setFormData({ ...formData, pedidoId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar pedido" />
                  </SelectTrigger>
                  <SelectContent>
                    {pedidos.map((pedido) => (
                      <SelectItem key={pedido.id} value={pedido.id}>{`${pedido.numeroPedido} - ${pedido.cliente}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="fechaEntrega">Fecha de Entrega Prevista</Label>
                <Input
                  id="fechaEntrega"
                  type="date"
                  value={formData.fechaEntrega}
                  onChange={(e) => setFormData({ ...formData, fechaEntrega: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="direccionEntrega">Dirección de Entrega</Label>
              <Textarea
                id="direccionEntrega"
                value={formData.direccionEntrega}
                onChange={(e) => setFormData({ ...formData, direccionEntrega: e.target.value })}
                placeholder="Dirección completa de entrega..."
                rows={2}
                required
              />
            </div>

            <div>
              <Label htmlFor="responsableEntrega">Responsable de Entrega</Label>
              <Select
                value={formData.responsableEntrega}
                onValueChange={(value) => setFormData({ ...formData, responsableEntrega: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar responsable" />
                </SelectTrigger>
                <SelectContent>
                  {empleados.map((emp) => (
                    <SelectItem key={emp.id} value={emp.nombre}>{emp.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                placeholder="Observaciones adicionales..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Artículos a Entregar</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={agregarArticulo}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Artículo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {articulos.map((articulo, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Artículo {index + 1}</h4>
                  {articulos.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => eliminarArticulo(index)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label>Descripción</Label>
                    <Input
                      value={articulo.descripcion}
                      onChange={(e) => actualizarArticulo(index, "descripcion", e.target.value)} // `descripcion` en lugar de `nombre`
                      placeholder="Descripción del artículo"
                      required
                    />
                  </div>
                  <div>
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      min="1"
                      value={articulo.cantidad}
                      onChange={(e) => actualizarArticulo(index, "cantidad", Number.parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/facturacion")}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Crear Albarán
          </Button>
        </div>
      </form>
    </div>
  )
}
