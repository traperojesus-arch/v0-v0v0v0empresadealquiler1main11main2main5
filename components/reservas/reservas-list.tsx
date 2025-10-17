"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Calendar, MapPin, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { mockDataStore } from "@/lib/mock-data-store"

const statusColors = {
  pendiente: "bg-yellow-100 text-yellow-800",
  confirmado: "bg-blue-100 text-blue-800",
  en_servicio: "bg-green-100 text-green-800",
  completado: "bg-gray-100 text-gray-800",
  cancelado: "bg-red-100 text-red-800",
}

export function ReservasList() {
  const router = useRouter()
  const [reservas, setReservas] = useState(mockDataStore.getReservas())

  useEffect(() => {
    const interval = setInterval(() => {
      setReservas(mockDataStore.getReservas())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleContactar = (telefono: string, cliente: string) => {
    const mensaje = `Hola ${cliente}, le contacto desde la empresa de alquiler...`
    window.open(`https://wa.me/${telefono.replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`, "_blank")
  }

  const handleVerDetalles = (id: string) => {
    router.push(`/reservas/${id}`)
  }

  const handleCancelar = (id: string) => {
    if (confirm("¿Está seguro de cancelar esta reserva?")) {
      const reserva = reservas.find((r) => r.id === id)
      if (reserva) {
        mockDataStore.updateReserva(id, { ...reserva, estado: "cancelado" })
        setReservas(mockDataStore.getReservas())
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Mostrando {reservas.length} reservas</p>
      </div>

      <div className="space-y-4">
        {reservas.map((reserva) => (
          <Card key={reserva.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-semibold text-lg">{reserva.numeroPedido}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{reserva.cliente}</span>
                      {reserva.empresa && <span>• {reserva.empresa}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={statusColors[reserva.estado as keyof typeof statusColors]}>
                    {reserva.estado.replace("_", " ")}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleVerDetalles(reserva.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/reservas/${reserva.id}/editar`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleCancelar(reserva.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Cancelar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Fechas:</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">Desde: {reserva.fechaInicio}</p>
                  <p className="text-sm text-muted-foreground ml-6">Hasta: {reserva.fechaFin}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Ubicación:</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">{reserva.ubicacion}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Total:</span>
                  </div>
                  <p className="text-lg font-bold text-primary ml-6">€{reserva.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Artículos:</h4>
                <div className="flex flex-wrap gap-2">
                  {reserva.articulos.map((articulo, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {articulo.nombre} x{articulo.cantidad}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">Contacto: {reserva.telefono}</div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactar(reserva.telefono, reserva.cliente)}
                  >
                    Contactar Cliente
                  </Button>
                  <Button size="sm" onClick={() => handleVerDetalles(reserva.id)}>
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
