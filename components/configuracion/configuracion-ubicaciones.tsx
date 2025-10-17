"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, MapPin, Navigation } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export function ConfiguracionUbicaciones() {
  const [zonasServicio, setZonasServicio] = useState([
    {
      id: 1,
      nombre: "Madrid Centro",
      direccion: "Gran Vía, 1",
      poblacion: "Madrid",
      codigoPostal: "28013",
      radioKm: 15,
      costoAdicional: 0.0,
      activa: true,
      descripcion: "Zona centro de Madrid con entrega gratuita",
    },
    {
      id: 2,
      nombre: "Madrid Norte",
      direccion: "Calle Alcalá, 100",
      poblacion: "Madrid",
      codigoPostal: "28009",
      radioKm: 20,
      costoAdicional: 5.0,
      activa: true,
      descripcion: "Zona norte con pequeño recargo por distancia",
    },
    {
      id: 3,
      nombre: "Alcalá de Henares",
      direccion: "Plaza de Cervantes, 1",
      poblacion: "Alcalá de Henares",
      codigoPostal: "28801",
      radioKm: 10,
      costoAdicional: 15.0,
      activa: false,
      descripcion: "Zona metropolitana con recargo por distancia",
    },
  ])

  const [isNewZoneOpen, setIsNewZoneOpen] = useState(false)
  const [editingZone, setEditingZone] = useState<any>(null)

  const agregarZona = (nuevaZona: any) => {
    setZonasServicio([...zonasServicio, { ...nuevaZona, id: Date.now() }])
    setIsNewZoneOpen(false)
  }

  const eliminarZona = (id: number) => {
    setZonasServicio(zonasServicio.filter((zona) => zona.id !== id))
  }

  const toggleActiva = (id: number) => {
    setZonasServicio(zonasServicio.map((zona) => (zona.id === id ? { ...zona, activa: !zona.activa } : zona)))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Zonas de Servicio
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Define las ubicaciones donde realizas entregas y recogidas con sus respectivos costos
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {zonasServicio.map((zona) => (
              <div
                key={zona.id}
                className={`p-4 border rounded-lg transition-all ${
                  zona.activa ? "hover:shadow-md" : "opacity-60 bg-muted/50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${zona.activa ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{zona.nombre}</h3>
                        <Badge variant={zona.activa ? "default" : "secondary"} className="text-xs">
                          {zona.activa ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          <strong>Dirección:</strong> {zona.direccion}
                        </p>
                        <p>
                          <strong>Población:</strong> {zona.poblacion} - {zona.codigoPostal}
                        </p>
                        <p>
                          <strong>Radio:</strong> {zona.radioKm} km
                        </p>
                        {zona.costoAdicional > 0 && (
                          <p>
                            <strong>Costo adicional:</strong>{" "}
                            <span className="text-orange-600">€{zona.costoAdicional.toFixed(2)}</span>
                          </p>
                        )}
                        {zona.descripcion && <p className="italic">{zona.descripcion}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleActiva(zona.id)}>
                      {zona.activa ? "🔴" : "🟢"}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setEditingZone(zona)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive"
                      onClick={() => eliminarZona(zona.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Dialog open={isNewZoneOpen} onOpenChange={setIsNewZoneOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Nueva Zona de Servicio
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Nueva Zona de Servicio</DialogTitle>
                <DialogDescription>Define una nueva zona donde realizas entregas y recogidas</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre-zona">Nombre de la Zona</Label>
                  <Input id="nombre-zona" placeholder="Ej: Madrid Sur" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion-zona">Dirección</Label>
                  <Input id="direccion-zona" placeholder="Ej: Calle Mayor, 123" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="poblacion-zona">Población</Label>
                    <Input id="poblacion-zona" placeholder="Ej: Madrid" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cp-zona">Código Postal</Label>
                    <Input id="cp-zona" placeholder="Ej: 28001" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="radio-zona">Radio de Servicio (km)</Label>
                    <Input id="radio-zona" type="number" placeholder="15" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costo-zona">Costo Adicional (€)</Label>
                    <Input id="costo-zona" type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion-zona">Descripción (opcional)</Label>
                  <Textarea id="descripcion-zona" placeholder="Descripción de la zona de servicio..." />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="activa-zona">Zona activa</Label>
                  <Switch id="activa-zona" defaultChecked />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      agregarZona({
                        nombre: "Nueva Zona",
                        direccion: "Dirección",
                        poblacion: "Población",
                        codigoPostal: "00000",
                        radioKm: 15,
                        costoAdicional: 0.0,
                        activa: true,
                        descripcion: "",
                      })
                    }
                    className="flex-1"
                  >
                    Crear Zona
                  </Button>
                  <Button variant="outline" onClick={() => setIsNewZoneOpen(false)} className="flex-1">
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
