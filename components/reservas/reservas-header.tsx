import { Button } from "@/components/ui/button"
import { Plus, Calendar, Download } from "lucide-react"
import Link from "next/link"

export function ReservasHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reservas</h1>
        <p className="text-muted-foreground mt-1">Gestiona todas las reservas de artículos</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Calendar className="w-4 h-4 mr-2" />
          Vista Calendario
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
        <Link href="/reservas/nueva">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Reserva
          </Button>
        </Link>
      </div>
    </div>
  )
}
