"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Search, Eye, TrendingUp, Package, Euro, Calendar } from "lucide-react"
import Image from "next/image"
import { getArticulos } from "@/app/actions/articulos-actions"
import { getPedidos } from "@/app/actions/pedidos-actions"

export function VentaArticulosList() {
  const [articulos, setArticulos] = useState<any[]>([])
  const [pedidos, setPedidos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<any>(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    const [resultArticulos, resultPedidos] = await Promise.all([getArticulos(), getPedidos()])

    if (resultArticulos.success) {
      setArticulos(resultArticulos.data)
    }

    if (resultPedidos.success) {
      setPedidos(resultPedidos.data)
    }

    setLoading(false)
  }

  const calcularEstadisticas = (articulo: any) => {
    const vecesAlquilado = articulo.veces_alquilado || 0
    const costeCompra = articulo.coste_compra || 0
    const amortizacion = articulo.amortizacion || 0
    const porcentajeAmortizado = costeCompra > 0 ? (amortizacion / costeCompra) * 100 : 0
    const pendienteAmortizar = Math.max(0, costeCompra - amortizacion)
    const ingresosPorAlquiler = vecesAlquilado * articulo.precio_dia
    const beneficioNeto = amortizacion - costeCompra

    return {
      vecesAlquilado,
      costeCompra,
      amortizacion,
      porcentajeAmortizado,
      pendienteAmortizar,
      ingresosPorAlquiler,
      beneficioNeto,
      estaAmortizado: porcentajeAmortizado >= 100,
    }
  }

  const obtenerHistorialAlquileres = (articuloId: string) => {
    return pedidos
      .filter((pedido) => pedido.articulos?.some((art: any) => art.articulo_id === articuloId))
      .map((pedido) => {
        const articulo = pedido.articulos.find((art: any) => art.articulo_id === articuloId)
        return {
          ...pedido,
          cantidad: articulo?.cantidad || 0,
          precioUnitario: articulo?.precio_unitario || 0,
        }
      })
  }

  const articulosFiltrados = articulos.filter((articulo) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      articulo.nombre.toLowerCase().includes(query) ||
      articulo.codigo.toLowerCase().includes(query) ||
      articulo.categoria.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando artículos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar artículo</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre, código o categoría..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Artículos</p>
                <p className="text-2xl font-bold">{articulos.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Totalmente Amortizados</p>
                <p className="text-2xl font-bold">
                  {articulos.filter((a) => calcularEstadisticas(a).estaAmortizado).length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inversión Total</p>
                <p className="text-2xl font-bold">
                  €{articulos.reduce((sum, a) => sum + (a.coste_compra || 0), 0).toFixed(2)}
                </p>
              </div>
              <Euro className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Amortizado Total</p>
                <p className="text-2xl font-bold">
                  €{articulos.reduce((sum, a) => sum + (a.amortizacion || 0), 0).toFixed(2)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Artículos Disponibles para Venta</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artículo</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Coste Compra</TableHead>
                <TableHead>Amortizado</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Veces Alquilado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articulosFiltrados.map((articulo) => {
                const stats = calcularEstadisticas(articulo)
                return (
                  <TableRow key={articulo.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative flex-shrink-0">
                          <Image
                            src={articulo.imagenes?.[0] || "/placeholder.svg"}
                            alt={articulo.nombre}
                            fill
                            className="object-cover rounded"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="font-medium">{articulo.nombre}</p>
                          <p className="text-sm text-muted-foreground">{articulo.codigo}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {articulo.stock_disponible}/{articulo.stock_total}
                      </Badge>
                    </TableCell>
                    <TableCell>€{stats.costeCompra.toFixed(2)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">€{stats.amortizacion.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          Pendiente: €{stats.pendienteAmortizar.toFixed(2)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={Math.min(100, stats.porcentajeAmortizado)} className="h-2" />
                        <p className="text-xs text-muted-foreground">{stats.porcentajeAmortizado.toFixed(1)}%</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{stats.vecesAlquilado}x</Badge>
                    </TableCell>
                    <TableCell>
                      {stats.estaAmortizado ? (
                        <Badge className="bg-green-500">Amortizado</Badge>
                      ) : stats.porcentajeAmortizado >= 50 ? (
                        <Badge className="bg-yellow-500">En Progreso</Badge>
                      ) : (
                        <Badge variant="secondary">Inicial</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setArticuloSeleccionado(articulo)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Detalles del Artículo</DialogTitle>
                            <DialogDescription>
                              Información completa de rentabilidad y historial de alquileres
                            </DialogDescription>
                          </DialogHeader>

                          {articuloSeleccionado && (
                            <div className="space-y-6">
                              <div className="flex items-start gap-4">
                                <div className="w-32 h-32 relative flex-shrink-0">
                                  <Image
                                    src={articuloSeleccionado.imagenes?.[0] || "/placeholder.svg"}
                                    alt={articuloSeleccionado.nombre}
                                    fill
                                    className="object-cover rounded-lg"
                                    unoptimized
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold">{articuloSeleccionado.nombre}</h3>
                                  <p className="text-muted-foreground">{articuloSeleccionado.codigo}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <Badge>{articuloSeleccionado.categoria}</Badge>
                                    <span className="text-sm">€{articuloSeleccionado.precio_dia}/día</span>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card>
                                  <CardContent className="pt-4">
                                    <p className="text-sm text-muted-foreground">Coste Compra</p>
                                    <p className="text-xl font-bold">
                                      €{calcularEstadisticas(articuloSeleccionado).costeCompra.toFixed(2)}
                                    </p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="pt-4">
                                    <p className="text-sm text-muted-foreground">Amortizado</p>
                                    <p className="text-xl font-bold text-green-600">
                                      €{calcularEstadisticas(articuloSeleccionado).amortizacion.toFixed(2)}
                                    </p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="pt-4">
                                    <p className="text-sm text-muted-foreground">Pendiente</p>
                                    <p className="text-xl font-bold text-orange-600">
                                      €{calcularEstadisticas(articuloSeleccionado).pendienteAmortizar.toFixed(2)}
                                    </p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="pt-4">
                                    <p className="text-sm text-muted-foreground">Veces Alquilado</p>
                                    <p className="text-xl font-bold">
                                      {calcularEstadisticas(articuloSeleccionado).vecesAlquilado}x
                                    </p>
                                  </CardContent>
                                </Card>
                              </div>

                              <Card>
                                <CardHeader>
                                  <CardTitle>Información de Compra</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      Fecha de compra: {articuloSeleccionado.fecha_compra || "No especificada"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      Proveedor: {articuloSeleccionado.proveedor || "No especificado"}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle>Historial de Alquileres</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  {obtenerHistorialAlquileres(articuloSeleccionado.id).length > 0 ? (
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Fecha</TableHead>
                                          <TableHead>Cliente</TableHead>
                                          <TableHead>Cantidad</TableHead>
                                          <TableHead>Precio</TableHead>
                                          <TableHead>Estado</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {obtenerHistorialAlquileres(articuloSeleccionado.id).map((pedido) => (
                                          <TableRow key={pedido.id}>
                                            <TableCell>
                                              {new Date(pedido.fecha_pedido || pedido.fecha_desde).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{pedido.cliente_nombre || pedido.cliente}</TableCell>
                                            <TableCell>{pedido.cantidad}</TableCell>
                                            <TableCell>€{pedido.precioUnitario.toFixed(2)}</TableCell>
                                            <TableCell>
                                              <Badge>{pedido.estado}</Badge>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  ) : (
                                    <p className="text-center text-muted-foreground py-4">
                                      No hay historial de alquileres para este artículo
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
