"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Copy, Trash2 } from "lucide-react"

const diasSemana = [
  { id: 1, nombre: "lunes", label: "Lunes" },
  { id: 2, nombre: "martes", label: "Martes" },
  { id: 3, nombre: "miercoles", label: "Miércoles" },
  { id: 4, nombre: "jueves", label: "Jueves" },
  { id: 5, nombre: "viernes", label: "Viernes" },
  { id: 6, nombre: "sabado", label: "Sábado" },
  { id: 0, nombre: "domingo", label: "Domingo" },
]

export function HorariosOperacion() {
  const [horarios, setHorarios] = useState({
    lunes: { abierto: true, desde: "09:00", hasta: "18:00" },
    martes: { abierto: true, desde: "09:00", hasta: "18:00" },
    miercoles: { abierto: true, desde: "09:00", hasta: "18:00" },
    jueves: { abierto: true, desde: "09:00", hasta: "18:00" },
    viernes: { abierto: true, desde: "09:00", hasta: "18:00" },
    sabado: { abierto: true, desde: "09:00", hasta: "18:00" },
    domingo: { abierto: false, desde: "", hasta: "" },
  })

  const [excepciones, setExcepciones] = useState([
    {
      id: 1,
      fecha: "2025-12-25",
      descripcion: "Navidad",
      cerrado: true,
    },
  ])

  const [igualarRecogidaDevolucion, setIgualarRecogidaDevolucion] = useState(true)

  const updateHorario = (dia: string, field: string, value: any) => {
    setHorarios((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const agregarExcepcion = () => {
    const nuevaExcepcion = {
      id: Date.now(),
      fecha: "",
      descripcion: "",
      cerrado: true,
    }
    setExcepciones([...excepciones, nuevaExcepcion])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Horario de operación
            <Switch checked={igualarRecogidaDevolucion} onCheckedChange={setIgualarRecogidaDevolucion} />
            <span className="text-sm font-normal">Igual para recogida y devolución</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Recogida & Devolución</Label>
              <Select defaultValue="configurable">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="configurable">Configurable individualmente</SelectItem>
                  <SelectItem value="igual">Igual para ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {diasSemana.map((dia) => {
                const horario = horarios[dia.nombre as keyof typeof horarios]
                return (
                  <div key={dia.id} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2">
                      <Label className="text-sm font-medium">{dia.label}</Label>
                    </div>
                    <div className="col-span-2">
                      <Select
                        value={horario.abierto ? "abierto" : "cerrado"}
                        onValueChange={(value) => updateHorario(dia.nombre, "abierto", value === "abierto")}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="abierto">Abierto</SelectItem>
                          <SelectItem value="cerrado">Cerrado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {horario.abierto && (
                      <>
                        <div className="col-span-1 text-center">
                          <Label className="text-sm">Desde</Label>
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="time"
                            value={horario.desde}
                            onChange={(e) => updateHorario(dia.nombre, "desde", e.target.value)}
                          />
                        </div>
                        <div className="col-span-1 text-center">
                          <Label className="text-sm">Hasta</Label>
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="time"
                            value={horario.hasta}
                            onChange={(e) => updateHorario(dia.nombre, "hasta", e.target.value)}
                          />
                        </div>
                        <div className="col-span-2 flex gap-1">
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Excepciones de Horarios</CardTitle>
          <p className="text-sm text-muted-foreground">
            Crea excepciones para días festivos o vacaciones planificadas.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {excepciones.map((excepcion) => (
            <div key={excepcion.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <Input type="date" value={excepcion.fecha} className="w-48" />
              <Input placeholder="Descripción (ej: Navidad)" value={excepcion.descripcion} className="flex-1" />
              <Badge variant={excepcion.cerrado ? "destructive" : "default"}>
                {excepcion.cerrado ? "Cerrado" : "Abierto"}
              </Badge>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={agregarExcepcion} className="w-full bg-transparent">
            <Plus className="w-4 h-4 mr-2" />
            Agregar una excepción
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Guardar Configuración</Button>
      </div>
    </div>
  )
}
