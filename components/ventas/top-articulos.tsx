"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const topArticulos = [
  { nombre: "Mesa Redonda 150cm", alquileres: 89, ingresos: 4450, tendencia: "+15%" },
  { nombre: "Silla Chiavari Dorada", alquileres: 456, ingresos: 3648, tendencia: "+22%" },
  { nombre: "Foco LED Profesional", alquileres: 67, ingresos: 3350, tendencia: "+8%" },
  { nombre: "Sistema de Audio", alquileres: 34, ingresos: 2720, tendencia: "+12%" },
  { nombre: "Mantelería Premium", alquileres: 78, ingresos: 2340, tendencia: "+5%" },
]

export function TopArticulos() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Artículos Más Rentables</CardTitle>
        <CardDescription>Top 5 artículos por ingresos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topArticulos.map((articulo, index) => (
            <div key={articulo.nombre} className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{articulo.nombre}</p>
                <p className="text-sm text-muted-foreground">{articulo.alquileres} alquileres</p>
              </div>
              <div className="text-right">
                <p className="font-bold">€{articulo.ingresos.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <TrendingUp className="w-3 h-3" />
                  {articulo.tendencia}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
