import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import Link from "next/link"

export function PedidosHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pedidos</h1>
        <p className="text-muted-foreground mt-1">Gestiona todos los pedidos y su estado</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
        <Link href="/pedidos/nuevo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Pedido
          </Button>
        </Link>
      </div>
    </div>
  )
}
