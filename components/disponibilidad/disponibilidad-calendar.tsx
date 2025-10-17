"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronUp, ChevronDown, MoreHorizontal, Eye, Calendar, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Datos de ejemplo con más información
const articulos = [
  {
    id: "1",
    nombre: "Mesa Redonda 150cm",
    codigo: "MESA",
    cantidad: 3,
    disponibles: 2,
    categoria: "mobiliario",
    imagen: "/mesa-redonda-madera.jpg",
    precio: 25.0,
    reservas: [{ desde: "10:00", hasta: "18:00", cliente: "Evento Corporativo ABC", estado: "confirmado" }],
  },
  {
    id: "2",
    nombre: "Silla Chiavari Dorada",
    codigo: "SILLA",
    cantidad: 5,
    disponibles: 5,
    categoria: "mobiliario",
    imagen: "/silla-chiavari-dorada.jpg",
    precio: 8.0,
    reservas: [],
  },
]

interface DisponibilidadCalendarProps {
  searchTerm?: string
  filtros?: any
  zoomLevel?: string
  fechaDesde?: string
  fechaHasta?: string
}

export function DisponibilidadCalendar({
  searchTerm = "",
  filtros = {},
  zoomLevel = "24h",
  fechaDesde = "2025-01-05",
  fechaHasta = "2025-01-05",
}: DisponibilidadCalendarProps) {
  const [expandedArticulos, setExpandedArticulos] = useState<string[]>(["2"])
  const [articulosFiltrados, setArticulosFiltrados] = useState(articulos)
  const [isContratoOpen, setIsContratoOpen] = useState(false)
  const [isDetalleOpen, setIsDetalleOpen] = useState(false)
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<any>(null)

  useEffect(() => {
    let filtered = articulos

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (art) =>
          art.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          art.codigo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoría
    if (filtros.categoria) {
      filtered = filtered.filter((art) => art.categoria === filtros.categoria)
    }

    // Filtrar por estado
    if (filtros.estado === "disponible") {
      filtered = filtered.filter((art) => art.disponibles > 0)
    } else if (filtros.estado === "ocupado") {
      filtered = filtered.filter((art) => art.disponibles < art.cantidad)
    }

    setArticulosFiltrados(filtered)
  }, [searchTerm, filtros])

  const toggleArticulo = (articuloId: string) => {
    setExpandedArticulos((prev) =>
      prev.includes(articuloId) ? prev.filter((id) => id !== articuloId) : [...prev, articuloId],
    )
  }

  const handleContratar = (articulo: any, entidadIndex?: number) => {
    setArticuloSeleccionado({ ...articulo, entidadIndex })
    setIsContratoOpen(true)
  }

  const handleVerDetalle = (articulo: any, entidadIndex?: number) => {
    setArticuloSeleccionado({ ...articulo, entidadIndex })
    setIsDetalleOpen(true)
  }

  const procesarContrato = () => {
    console.log("[v0] Procesando contrato para:", articuloSeleccionado)
    // Aquí se implementaría la lógica de contratación
    setIsContratoOpen(false)
    setArticuloSeleccionado(null)
  }

  return (
    <div className="flex gap-6 h-[600px]">
      {/* Panel izquierdo - Lista de artículos */}
      <div className="w-80 space-y-2">
        <div className="text-sm font-medium text-muted-foreground mb-4">
          {fechaDesde === fechaHasta ? fechaDesde : `${fechaDesde} - ${fechaHasta}`}
        </div>
        {articulosFiltrados.map((articulo) => {
          const isExpanded = expandedArticulos.includes(articulo.id)
          return (
            <Card key={articulo.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleArticulo(articulo.id)}
                >
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src={articulo.imagen || "/placeholder.svg"}
                      alt={articulo.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{articulo.nombre}</p>
                    <p className="text-xs text-muted-foreground">{articulo.codigo}</p>
                    <p className="text-xs text-green-600">€{articulo.precio}/día</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={articulo.disponibles > 0 ? "default" : "destructive"} className="text-xs">
                      {articulo.disponibles}/{articulo.cantidad}
                    </Badge>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t bg-muted/25">
                    {Array.from({ length: articulo.cantidad }, (_, index) => {
                      const estaDisponible = index < articulo.disponibles
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 border-b last:border-b-0">
                          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              {articulo.codigo} {String(index + 1).padStart(2, "0")}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant={estaDisponible ? "outline" : "destructive"} className="text-xs">
                              {estaDisponible ? "Disponible" : "Ocupado"}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => handleVerDetalle(articulo, index)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            {estaDisponible && (
                              <Button
                                size="sm"
                                variant="default"
                                className="h-6 px-2 text-xs"
                                onClick={() => handleContratar(articulo, index)}
                              >
                                Contratar
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Panel derecho - Timeline */}
      <div className="flex-1">
        <Card className="h-full">
          <CardContent className="p-0 h-full">
            {/* Header del timeline */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-4">
                <h3 className="font-medium">Vista: {zoomLevel}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>AHORA</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Timeline grid */}
            <div className="relative h-full overflow-hidden">
              {/* Header de horas */}
              <div className="flex border-b bg-muted/25 sticky top-0 z-10">
                <div className="w-20 p-2 border-r bg-background"></div>
                <ScrollArea className="flex-1" orientation="horizontal">
                  <div className="flex">
                    {["08:00", "12:00", "16:00", "20:00", "00:00"].map((time, index) => (
                      <div key={time} className="w-32 p-2 text-center text-sm font-medium border-r">
                        {time}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Contenido del timeline */}
              <ScrollArea className="h-[calc(100%-60px)]">
                <div className="space-y-0">
                  {articulosFiltrados.map((articulo) => {
                    const isExpanded = expandedArticulos.includes(articulo.id)
                    const itemsToShow = isExpanded ? articulo.cantidad : 1

                    return Array.from({ length: itemsToShow }, (_, index) => {
                      const estaDisponible = index < articulo.disponibles
                      return (
                        <div key={`${articulo.id}-${index}`} className="flex border-b">
                          <div className="w-20 p-2 border-r bg-muted/25 flex items-center justify-center">
                            {isExpanded ? (
                              <span className="text-xs font-medium">
                                {articulo.codigo} {String(index + 1).padStart(2, "0")}
                              </span>
                            ) : (
                              <span className="text-xs font-medium">{articulo.nombre}</span>
                            )}
                          </div>
                          <div className="flex-1 relative">
                            <ScrollArea orientation="horizontal" className="h-12">
                              <div className="flex h-12">
                                {Array.from({ length: 20 }, (_, hourIndex) => (
                                  <div
                                    key={hourIndex}
                                    className={`w-32 border-r h-full relative ${
                                      estaDisponible ? "bg-green-50 hover:bg-green-100" : "bg-red-50"
                                    }`}
                                    style={
                                      !estaDisponible
                                        ? {
                                            background: `repeating-linear-gradient(
                                        45deg,
                                        #fef2f2,
                                        #fef2f2 10px,
                                        #fecaca 10px,
                                        #fecaca 20px
                                      )`,
                                          }
                                        : undefined
                                    }
                                  >
                                    {/* Indicador de disponibilidad */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div
                                        className={`w-1 h-6 ${estaDisponible ? "bg-green-400" : "bg-red-400"} opacity-50`}
                                      ></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      )
                    })
                  })}
                </div>
              </ScrollArea>

              {/* Línea de tiempo actual */}
              <div className="absolute top-[60px] left-20 w-0.5 h-full bg-blue-500 z-20 pointer-events-none">
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Contratación */}
      <Dialog open={isContratoOpen} onOpenChange={setIsContratoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contratar Artículo</DialogTitle>
            <DialogDescription>Crear nueva reserva para {articuloSeleccionado?.nombre}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Input id="cliente" placeholder="Nombre del cliente" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha-inicio">Fecha Inicio</Label>
                <Input id="fecha-inicio" type="date" defaultValue={fechaDesde} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha-fin">Fecha Fin</Label>
                <Input id="fecha-fin" type="date" defaultValue={fechaHasta} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hora-inicio">Hora Inicio</Label>
                <Input id="hora-inicio" type="time" defaultValue="09:00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora-fin">Hora Fin</Label>
                <Input id="hora-fin" type="time" defaultValue="18:00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas">Notas</Label>
              <Textarea id="notas" placeholder="Notas adicionales..." />
            </div>

            <div className="flex gap-2">
              <Button onClick={procesarContrato} className="flex-1">
                <Calendar className="w-4 h-4 mr-2" />
                Crear Reserva
              </Button>
              <Button variant="outline" onClick={() => setIsContratoOpen(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalle */}
      <Dialog open={isDetalleOpen} onOpenChange={setIsDetalleOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle del Artículo</DialogTitle>
            <DialogDescription>Información completa de {articuloSeleccionado?.nombre}</DialogDescription>
          </DialogHeader>
          {articuloSeleccionado && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={articuloSeleccionado.imagen || "/placeholder.svg"}
                  alt={articuloSeleccionado.nombre}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-medium">{articuloSeleccionado.nombre}</h3>
                  <p className="text-sm text-muted-foreground">Código: {articuloSeleccionado.codigo}</p>
                  <p className="text-sm text-green-600">€{articuloSeleccionado.precio}/día</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Cantidad Total:</span>
                  <p>{articuloSeleccionado.cantidad}</p>
                </div>
                <div>
                  <span className="font-medium">Disponibles:</span>
                  <p>{articuloSeleccionado.disponibles}</p>
                </div>
                <div>
                  <span className="font-medium">Categoría:</span>
                  <p className="capitalize">{articuloSeleccionado.categoria}</p>
                </div>
                <div>
                  <span className="font-medium">Estado:</span>
                  <Badge variant={articuloSeleccionado.disponibles > 0 ? "default" : "destructive"}>
                    {articuloSeleccionado.disponibles > 0 ? "Disponible" : "Ocupado"}
                  </Badge>
                </div>
              </div>

              {articuloSeleccionado.reservas?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Reservas Activas:</h4>
                  <div className="space-y-2">
                    {articuloSeleccionado.reservas.map((reserva: any, index: number) => (
                      <div key={index} className="p-2 bg-muted rounded-lg text-sm">
                        <p className="font-medium">{reserva.cliente}</p>
                        <p className="text-muted-foreground">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {reserva.desde} - {reserva.hasta}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {reserva.estado}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={() => setIsDetalleOpen(false)} className="w-full">
                Cerrar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
