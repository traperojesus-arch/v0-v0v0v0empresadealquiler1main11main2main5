"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const topClientes = [
  { nombre: "María García", empresa: "Eventos Elegantes SL", reservas: 24, ingresos: 12450, tipo: "VIP" },
  { nombre: "Juan Martínez", empresa: "Corporativo Eventos", reservas: 18, ingresos: 9870, tipo: "Premium" },
  { nombre: "Ana Fernández", empresa: "Bodas de Ensueño", reservas: 15, ingresos: 8230, tipo: "Premium" },
  { nombre: "Carlos López", empresa: "Producciones CL", reservas: 12, ingresos: 6540, tipo: "Regular" },
  { nombre: "Laura Sánchez", empresa: "LS Catering", reservas: 10, ingresos: 5320, tipo: "Regular" },
]

export function TopClientes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mejores Clientes</CardTitle>
        <CardDescription>Top 5 clientes por ingresos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topClientes.map((cliente, index) => (
            <div key={cliente.nombre} className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                {index + 1}
              </div>
              <Avatar className="w-10 h-10">
                <AvatarFallback>
                  {cliente.nombre
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{cliente.nombre}</p>
                <p className="text-sm text-muted-foreground truncate">{cliente.empresa}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">€{cliente.ingresos.toLocaleString()}</p>
                <Badge
                  variant={cliente.tipo === "VIP" ? "default" : cliente.tipo === "Premium" ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {cliente.tipo}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
