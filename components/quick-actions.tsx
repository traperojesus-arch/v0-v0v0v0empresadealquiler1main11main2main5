"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Package, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export function QuickActions() {
  const router = useRouter()

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => router.push("/articulos/nuevo")}>
        <Package className="w-4 h-4 mr-2" />
        Nuevo Artículo
      </Button>
      <Button variant="outline" size="sm" onClick={() => router.push("/clientes?action=nuevo")}>
        <Users className="w-4 h-4 mr-2" />
        Nuevo Cliente
      </Button>
      <Button variant="outline" size="sm" onClick={() => router.push("/disponibilidad")}>
        <Calendar className="w-4 h-4 mr-2" />
        Ver Calendario
      </Button>
    </div>
  )
}
