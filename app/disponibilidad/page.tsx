"use client"

import { Sidebar } from "@/components/sidebar"
import { DisponibilidadHeader } from "@/components/disponibilidad/disponibilidad-header"
import { DisponibilidadCalendar } from "@/components/disponibilidad/disponibilidad-calendar"
import { useState } from "react"

export default function DisponibilidadPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtros, setFiltros] = useState({})
  const [zoomLevel, setZoomLevel] = useState("24h")
  const [fechaDesde, setFechaDesde] = useState("2025-01-05")
  const [fechaHasta, setFechaHasta] = useState("2025-01-05")

  const handleDateRangeChange = (desde: string, hasta: string) => {
    setFechaDesde(desde)
    setFechaHasta(hasta)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 space-y-6">
          <DisponibilidadHeader
            onDateRangeChange={handleDateRangeChange}
            onZoomChange={setZoomLevel}
            onSearchChange={setSearchTerm}
            onFiltersChange={setFiltros}
          />
          <DisponibilidadCalendar
            searchTerm={searchTerm}
            filtros={filtros}
            zoomLevel={zoomLevel}
            fechaDesde={fechaDesde}
            fechaHasta={fechaHasta}
          />
        </main>
      </div>
    </div>
  )
}
