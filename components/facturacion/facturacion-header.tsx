"use client"

import { Button } from "@/components/ui/button"
import { FileText, Package, Download } from "lucide-react"
import { useRouter } from "next/navigation"

export function FacturacionHeader() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Facturación</h1>
        <p className="text-muted-foreground mt-1">Gestiona albaranes de entrega y facturas</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => router.push("/facturacion/nuevo-albaran")}>
          <Package className="w-4 h-4 mr-2" />
          Nuevo Albarán
        </Button>
        <Button onClick={() => router.push("/facturacion/nueva-factura")}>
          <FileText className="w-4 h-4 mr-2" />
          Nueva Factura
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>
    </div>
  )
}
