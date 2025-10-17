"use client"

import type React from "react"

import { Bell, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Implementar lógica de búsqueda global
      console.log("[v0] Buscando:", searchQuery)
      // Aquí se podría redirigir a una página de resultados o filtrar contenido
    }
  }

  const handleNuevoPedido = () => {
    router.push("/pedidos/nuevo")
  }

  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <form onSubmit={handleSearch} className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar artículos, pedidos, clientes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="relative bg-transparent">
                <Bell className="w-4 h-4 mr-2" />
                Notificaciones
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Pedido #001 pendiente</p>
                  <p className="text-sm text-muted-foreground">Cliente: María García - Hace 2 horas</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Artículo con stock bajo</p>
                  <p className="text-sm text-muted-foreground">Sillas Chiavari - Solo 2 disponibles</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Reserva próxima a vencer</p>
                  <p className="text-sm text-muted-foreground">Evento mañana - Verificar preparación</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" onClick={handleNuevoPedido}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Pedido
          </Button>
        </div>
      </div>
    </header>
  )
}
