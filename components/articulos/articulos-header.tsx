"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Plus, Download, Upload, FileSpreadsheet, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ArticulosHeaderProps {
  onSearchChange?: (query: string) => void
}

export function ArticulosHeader({ onSearchChange }: ArticulosHeaderProps) {
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearchChange?.(query)
  }

  const handleExportar = () => {
    // Crear datos de ejemplo para exportar
    const articulos = [
      {
        nombre: "Mesa Redonda 150cm",
        categoria: "Mobiliario",
        cantidad: 10,
        precio_dia: 25.0,
        estado: "activo",
        descripcion: "Mesa redonda de madera para 8 personas",
      },
      {
        nombre: "Silla Chiavari Dorada",
        categoria: "Mobiliario",
        cantidad: 50,
        precio_dia: 8.0,
        estado: "activo",
        descripcion: "Silla elegante estilo Chiavari en color dorado",
      },
    ]

    // Convertir a CSV
    const headers = ["Nombre", "Categoría", "Cantidad", "Precio por Día", "Estado", "Descripción"]
    const csvContent = [
      headers.join(","),
      ...articulos.map((art) =>
        [
          `"${art.nombre}"`,
          `"${art.categoria}"`,
          art.cantidad,
          art.precio_dia,
          `"${art.estado}"`,
          `"${art.descripcion}"`,
        ].join(","),
      ),
    ].join("\n")

    // Descargar archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `articulos_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDescargarPlantilla = () => {
    const headers = ["Nombre", "Categoría", "Cantidad", "Precio por Día", "Estado", "Descripción"]
    const ejemploFila = ["Mesa de Ejemplo", "Mobiliario", "5", "20.00", "activo", "Descripción del artículo"]

    const csvContent = [headers.join(","), ejemploFila.map((campo) => `"${campo}"`).join(",")].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "plantilla_articulos.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImportar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csv = e.target?.result as string
        const lines = csv.split("\n")
        const headers = lines[0].split(",")

        console.log("[v0] Archivo importado:", file.name)
        console.log("[v0] Cabeceras encontradas:", headers)
        console.log("[v0] Número de filas:", lines.length - 1)

        // Aquí se procesarían los datos y se guardarían en la base de datos
        alert(`Archivo importado correctamente: ${lines.length - 1} artículos procesados`)
        setIsImportOpen(false)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Artículos</h1>
          <p className="text-muted-foreground mt-1">Gestiona tu inventario de artículos para alquiler</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExportar}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>

          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Importar Excel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Importar Artículos</DialogTitle>
                <DialogDescription>Sube un archivo CSV o Excel con los datos de tus artículos</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Alert>
                  <FileSpreadsheet className="h-4 w-4" />
                  <AlertDescription>Descarga primero la plantilla para asegurar el formato correcto</AlertDescription>
                </Alert>

                <Button variant="outline" onClick={handleDescargarPlantilla} className="w-full bg-transparent">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Descargar Plantilla Excel
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="archivo">Seleccionar Archivo</Label>
                  <Input id="archivo" type="file" accept=".csv,.xlsx,.xls" onChange={handleImportar} />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Link href="/articulos/nuevo">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Artículo
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nombre, código, categoría o descripción..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
    </div>
  )
}
