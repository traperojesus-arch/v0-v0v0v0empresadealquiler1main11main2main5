"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Download, FileText, Edit, Trash2, Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const albaranes = [
  {
    id: "ALB-2025-001",
    pedido: "PED-2025-001",
    cliente: "María García Rodríguez",
    empresa: "Eventos Elegantes SL",
    fechaEmision: "2025-01-10",
    fechaEntrega: "2025-01-15",
    direccion: "Hotel Majestic, Calle Gran Vía 123, Madrid",
    articulos: 5,
    estado: "entregado",
    facturado: true,
    numeroFactura: "FAC-2025-001",
  },
  {
    id: "ALB-2025-002",
    pedido: "PED-2025-002",
    cliente: "Juan Martínez López",
    empresa: "Corporativo Eventos",
    fechaEmision: "2025-01-12",
    fechaEntrega: "2025-01-20",
    direccion: "Centro de Convenciones, Av. Diagonal 456, Barcelona",
    articulos: 3,
    estado: "pendiente",
    facturado: false,
    numeroFactura: null,
  },
  {
    id: "ALB-2025-003",
    pedido: "PED-2025-003",
    cliente: "Ana Fernández Silva",
    empresa: "Bodas de Ensueño",
    fechaEmision: "2025-01-08",
    fechaEntrega: "2025-01-12",
    direccion: "Finca El Olivar, Carretera A-123 Km 45, Sevilla",
    articulos: 8,
    estado: "entregado",
    facturado: false,
    numeroFactura: null,
  },
]

const statusColors = {
  pendiente: "bg-yellow-100 text-yellow-800",
  entregado: "bg-green-100 text-green-800",
  facturado: "bg-blue-100 text-blue-800",
}

const statusLabels = {
  pendiente: "Pendiente",
  entregado: "Entregado",
  facturado: "Facturado",
}

export function AlbaranesList() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const handleDescargarPDF = (id: string) => {
    console.log("[v0] Descargando PDF de albarán:", id)
    alert(`Generando PDF de ${id}...`)
  }

  const handleGenerarFactura = (albaran: any) => {
    console.log("[v0] Generando factura desde albarán:", albaran.id)
    router.push(`/facturacion/nueva-factura?albaran=${albaran.id}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por número de albarán, cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Input type="date" className="w-48" placeholder="Fecha desde" />
        <Input type="date" className="w-48" placeholder="Fecha hasta" />
      </div>

      <div className="space-y-4">
        {albaranes.map((albaran) => (
          <Card key={albaran.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{albaran.id}</h3>
                    <Badge className={statusColors[albaran.estado as keyof typeof statusColors]}>
                      {statusLabels[albaran.estado as keyof typeof statusLabels]}
                    </Badge>
                    {albaran.facturado && (
                      <Badge variant="outline" className="bg-blue-50">
                        Facturado: {albaran.numeroFactura}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {albaran.cliente} • {albaran.empresa}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Pedido: {albaran.pedido}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDescargarPDF(albaran.id)}>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar PDF
                    </DropdownMenuItem>
                    {!albaran.facturado && albaran.estado === "entregado" && (
                      <DropdownMenuItem onClick={() => handleGenerarFactura(albaran)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Generar Factura
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Fecha Emisión</p>
                  <p className="text-sm font-medium">{albaran.fechaEmision}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fecha Entrega</p>
                  <p className="text-sm font-medium">{albaran.fechaEntrega}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Artículos</p>
                  <p className="text-sm font-medium">{albaran.articulos} items</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estado</p>
                  <p className="text-sm font-medium capitalize">{albaran.estado}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Dirección de Entrega</p>
                <p className="text-sm">{albaran.direccion}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {albaran.facturado ? (
                    <span className="text-blue-600 font-medium">✓ Facturado ({albaran.numeroFactura})</span>
                  ) : (
                    <span className="text-orange-600 font-medium">Pendiente de facturar</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDescargarPDF(albaran.id)}>
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                  {!albaran.facturado && albaran.estado === "entregado" && (
                    <Button size="sm" onClick={() => handleGenerarFactura(albaran)}>
                      <FileText className="w-4 h-4 mr-2" />
                      Generar Factura
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
