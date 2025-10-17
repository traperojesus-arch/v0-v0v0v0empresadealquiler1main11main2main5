"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Truck, Car, Bike } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export function ConfiguracionTransporte() {
  const [mediosTransporte, setMediosTransporte] = useState([
    {
      id: 1,
      nombre: "Furgoneta",
      descripcion: "Furgoneta pequeña para entregas locales",
      costePorKm: 0.5,
      capacidadMaxima: "500 kg",
      icono: "truck",
      activo: true,
    },
    {
      id: 2,
      nombre: "Camión",
      descripcion: "Camión grande para eventos importantes",
      costePorKm: 1.2,
      capacidadMaxima: "2000 kg",
      icono: "truck",
      activo: true,
    },
    {
      id: 3,
      nombre: "Tráiler",
      descripcion: "Tráiler para eventos muy grandes",
      costePorKm: 2.0,
      capacidadMaxima: "5000 kg",
      icono: "truck",
      activo: false,
    },
    {
      id: 4,
      nombre: "Cliente Recoge",
      descripcion: "El cliente recoge en nuestras instalaciones",
      costePorKm: 0.0,
      capacidadMaxima: "N/A",
      icono: "car",
      activo: true,
    },
  ])

  const [isNewTransportOpen, setIsNewTransportOpen] = useState(false)
  const [editingTransport, setEditingTransport] = useState<any>(null)

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "truck":
        return <Truck className="w-5 h-5" />
      case "car":
        return <Car className="w-5 h-5" />
      case "bike":
        return <Bike className="w-5 h-5" />
      default:
        return <Truck className="w-5 h-5" />
    }
  }

  const agregarTransporte = (nuevoTransporte: any) => {
    setMediosTransporte([...mediosTransporte, { ...nuevoTransporte, id: Date.now() }])
    setIsNewTransportOpen(false)
  }

  const eliminarTransporte = (id: number) => {
    setMediosTransporte(mediosTransporte.filter((transport) => transport.id !== id))
  }

  const toggleActivo = (id: number) => {
    setMediosTransporte(
      mediosTransporte.map((transport) =>
        transport.id === id ? { ...transport, activo: !transport.activo } : transport,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Medios de Transporte
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configura los medios de transporte disponibles para entregas y recogidas
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mediosTransporte.map((transporte) => (
              <div
                key={transporte.id}
                className={`p-4 border rounded-lg transition-all ${
                  transporte.activo ? "hover:shadow-md" : "opacity-60 bg-muted/50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${transporte.activo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      {getIcon(transporte.icono)}
                    </div>
                    <div>
                      <h3 className="font-medium">{transporte.nombre}</h3>
                      <Badge variant={transporte.activo ? "default" : "secondary"} className="text-xs">
                        {transporte.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => toggleActivo(transporte.id)}
                    >
                      {transporte.activo ? "🔴" : "🟢"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setEditingTransport(transporte)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive"
                      onClick={() => eliminarTransporte(transporte.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{transporte.descripcion}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Coste/km:</span>
                    <p className="text-green-600">€{transporte.costePorKm.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Capacidad:</span>
                    <p>{transporte.capacidadMaxima}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Dialog open={isNewTransportOpen} onOpenChange={setIsNewTransportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Nuevo Medio de Transporte
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Medio de Transporte</DialogTitle>
                <DialogDescription>Configura un nuevo medio de transporte para entregas</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre-transporte">Nombre</Label>
                  <Input id="nombre-transporte" placeholder="Ej: Motocicleta" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion-transporte">Descripción</Label>
                  <Textarea id="descripcion-transporte" placeholder="Descripción del medio de transporte..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coste-km">Coste por Km (€)</Label>
                    <Input id="coste-km" type="number" step="0.01" placeholder="0.30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacidad">Capacidad Máxima</Label>
                    <Input id="capacidad" placeholder="100 kg" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      agregarTransporte({
                        nombre: "Nuevo Transporte",
                        descripcion: "Descripción",
                        costePorKm: 0.5,
                        capacidadMaxima: "500 kg",
                        icono: "truck",
                        activo: true,
                      })
                    }
                    className="flex-1"
                  >
                    Crear Transporte
                  </Button>
                  <Button variant="outline" onClick={() => setIsNewTransportOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Guardar Configuración</Button>
      </div>
    </div>
  )
}
