"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Download, Send, Edit, Trash2, Search } from "lucide-react"
import { useState } from "react"

const facturas = [
  {
    id: "FAC-2025-001",
    cliente: "María García Rodríguez",
    empresa: "Eventos Elegantes SL",
    fechaEmision: "2025-01-10",
    fechaVencimiento: "2025-02-10",
    subtotal: 400.0,
    iva: 80.0,
    total: 480.0,
    pagado: 240.0,
    pendiente: 240.0,
    estado: "pendiente",
    albaran: "ALB-2025-001",
  },
  {
    id: "FAC-2025-002",
    cliente: "Juan Martínez López",
    empresa: "Corporativo Eventos",
    fechaEmision: "2025-01-12",
    fechaVencimiento: "2025-02-12",
    subtotal: 550.0,
    iva: 115.5,
    total: 665.5,
    pagado: 665.5,
    pendiente: 0,
    estado: "pagada",
    albaran: "ALB-2025-002",
  },
  {
    id: "FAC-2025-003",
    cliente: "Ana Fernández Silva",
    empresa: "Bodas de Ensueño",
    fechaEmision: "2024-12-20",
    fechaVencimiento: "2025-01-20",
    subtotal: 1050.0,
    iva: 220.5,
    total: 1270.5,
    pagado: 0,
    pendiente: 1270.5,
    estado: "vencida",
    albaran: "ALB-2024-045",
  },
]

const statusColors = {
  pendiente: "bg-orange-100 text-orange-800",
  pagada: "bg-green-100 text-green-800",
  vencida: "bg-red-100 text-red-800",
  cancelada: "bg-gray-100 text-gray-800",
}

const statusLabels = {
  pendiente: "Pendiente",
  pagada: "Pagada",
  vencida: "Vencida",
  cancelada: "Cancelada",
}

export function FacturasList() {
  const [searchTerm, setSearchTerm] = useState("")

  const handleDescargarPDF = (id: string) => {
    console.log("[v0] Descargando PDF de factura:", id)
    alert(`Generando PDF de ${id}...`)
  }

  const handleEnviarEmail = (id: string, cliente: string) => {
    console.log("[v0] Enviando factura por email:", id)
    alert(`Enviando factura ${id} a ${cliente}...`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por número de factura, cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Input type="date" className="w-48" placeholder="Fecha desde" />
        <Input type="date" className="w-48" placeholder="Fecha hasta" />
      </div>

      <div className="space-y-4">
        {facturas.map((factura) => (
          <Card key={factura.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{factura.id}</h3>
                    <Badge className={statusColors[factura.estado as keyof typeof statusColors]}>
                      {statusLabels[factura.estado as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {factura.cliente} • {factura.empresa}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Albarán: {factura.albaran}</p>
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
                    <DropdownMenuItem onClick={() => handleDescargarPDF(factura.id)}>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEnviarEmail(factura.id, factura.cliente)}>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar por email
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Anular
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Fecha Emisión</p>
                  <p className="text-sm font-medium">{factura.fechaEmision}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vencimiento</p>
                  <p className="text-sm font-medium">{factura.fechaVencimiento}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Subtotal</p>
                  <p className="text-sm font-medium">€{factura.subtotal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">IVA (21%)</p>
                  <p className="text-sm font-medium">€{factura.iva.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-bold text-primary">€{factura.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600 font-medium">Pagado: €{factura.pagado.toFixed(2)}</span>
                  <span className="text-red-600 font-medium">Pendiente: €{factura.pendiente.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDescargarPDF(factura.id)}>
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                  <Button size="sm" onClick={() => handleEnviarEmail(factura.id, factura.cliente)}>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar
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
