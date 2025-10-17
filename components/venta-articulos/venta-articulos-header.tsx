import { Button } from "@/components/ui/button"
import { Download, TrendingUp } from "lucide-react"

export function VentaArticulosHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Venta de Artículos</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona la venta de artículos con información de amortización y rentabilidad
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exportar Informe
        </Button>
        <Button>
          <TrendingUp className="w-4 h-4 mr-2" />
          Análisis de Rentabilidad
        </Button>
      </div>
    </div>
  )
}
