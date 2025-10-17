"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Search, Filter, Clock, CalendarDays } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface DisponibilidadHeaderProps {
  onDateRangeChange?: (fechaDesde: string, fechaHasta: string) => void
  onZoomChange?: (zoom: string) => void
  onSearchChange?: (search: string) => void
  onFiltersChange?: (filters: any) => void
}

export function DisponibilidadHeader({
  onDateRangeChange,
  onZoomChange,
  onSearchChange,
  onFiltersChange,
}: DisponibilidadHeaderProps) {
  const [fechaDesde, setFechaDesde] = useState("2025-01-05")
  const [fechaHasta, setFechaHasta] = useState("2025-01-05")
  const [zoomLevel, setZoomLevel] = useState("24h")
  const [searchTerm, setSearchTerm] = useState("")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isMonthViewOpen, setIsMonthViewOpen] = useState(false)

  const [filtros, setFiltros] = useState({
    categoria: "todas",
    estado: "todos",
    soloDisponibles: false,
    soloOcupados: false,
    mostrarMantenimiento: true,
  })

  const handleDateDesdeChange = (fecha: string) => {
    setFechaDesde(fecha)
    if (fecha > fechaHasta) {
      setFechaHasta(fecha)
    }
    onDateRangeChange?.(fecha, fechaHasta)
  }

  const handleDateHastaChange = (fecha: string) => {
    setFechaHasta(fecha)
    onDateRangeChange?.(fechaDesde, fecha)
  }

  const handleZoomChange = (zoom: string) => {
    setZoomLevel(zoom)
    onZoomChange?.(zoom)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange?.(value)
  }

  const aplicarFiltros = () => {
    onFiltersChange?.(filtros)
    setIsFiltersOpen(false)
  }

  const abrirVistaCalendario = () => {
    setIsMonthViewOpen(true)
    // Aquí se podría implementar la vista de calendario mensual
    console.log("[v0] Abriendo vista mensual de calendario")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Disponibilidad</h1>
          <p className="text-muted-foreground mt-1">Gestiona la disponibilidad de artículos por fecha y horario</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Filtros de Disponibilidad</DialogTitle>
                <DialogDescription>Configura los filtros para la vista de disponibilidad</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={filtros.categoria}
                    onValueChange={(value) => setFiltros({ ...filtros, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las categorías</SelectItem>
                      <SelectItem value="mobiliario">Mobiliario</SelectItem>
                      <SelectItem value="iluminacion">Iluminación</SelectItem>
                      <SelectItem value="sonido">Sonido</SelectItem>
                      <SelectItem value="decoracion">Decoración</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={filtros.estado} onValueChange={(value) => setFiltros({ ...filtros, estado: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="disponible">Solo disponibles</SelectItem>
                      <SelectItem value="ocupado">Solo ocupados</SelectItem>
                      <SelectItem value="mantenimiento">En mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="solo-disponibles">Solo mostrar disponibles</Label>
                    <Switch
                      id="solo-disponibles"
                      checked={filtros.soloDisponibles}
                      onCheckedChange={(checked) => setFiltros({ ...filtros, soloDisponibles: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="mostrar-mantenimiento">Incluir en mantenimiento</Label>
                    <Switch
                      id="mostrar-mantenimiento"
                      checked={filtros.mostrarMantenimiento}
                      onCheckedChange={(checked) => setFiltros({ ...filtros, mostrarMantenimiento: checked })}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={aplicarFiltros} className="flex-1">
                    Aplicar Filtros
                  </Button>
                  <Button variant="outline" onClick={() => setIsFiltersOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={abrirVistaCalendario}>
            <CalendarDays className="w-4 h-4 mr-2" />
            Vista Mensual
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Desde:</Label>
            <Input
              type="date"
              value={fechaDesde}
              onChange={(e) => handleDateDesdeChange(e.target.value)}
              className="w-40"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Hasta:</Label>
            <Input
              type="date"
              value={fechaHasta}
              onChange={(e) => handleDateHastaChange(e.target.value)}
              className="w-40"
              min={fechaDesde}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Zoom:</span>
          <div className="flex gap-1">
            {["6h", "12h", "24h", "48h", "7d", "14d", "30d", "6mth", "1y"].map((zoom) => (
              <Button
                key={zoom}
                variant={zoomLevel === zoom ? "default" : "outline"}
                size="sm"
                onClick={() => handleZoomChange(zoom)}
                className="text-xs px-2 py-1 h-8"
              >
                {zoom}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar artículos..."
            className="w-64"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
