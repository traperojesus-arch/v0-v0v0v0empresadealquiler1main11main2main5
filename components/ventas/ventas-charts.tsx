"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const ventasMensuales = [
  { mes: "Ene", ingresos: 12400, reservas: 45 },
  { mes: "Feb", ingresos: 15600, reservas: 52 },
  { mes: "Mar", ingresos: 18900, reservas: 61 },
  { mes: "Abr", ingresos: 22300, reservas: 73 },
  { mes: "May", ingresos: 25800, reservas: 85 },
  { mes: "Jun", ingresos: 28400, reservas: 92 },
  { mes: "Jul", ingresos: 32100, reservas: 104 },
  { mes: "Ago", ingresos: 29700, reservas: 98 },
  { mes: "Sep", ingresos: 26500, reservas: 87 },
  { mes: "Oct", ingresos: 24200, reservas: 79 },
  { mes: "Nov", ingresos: 21800, reservas: 71 },
  { mes: "Dic", ingresos: 19500, reservas: 64 },
]

const categorias = [
  { nombre: "Mobiliario", ventas: 45231, porcentaje: 35 },
  { nombre: "Iluminación", ventas: 32890, porcentaje: 25 },
  { nombre: "Audio/Video", ventas: 28456, porcentaje: 22 },
  { nombre: "Decoración", ventas: 15678, porcentaje: 12 },
  { nombre: "Otros", ventas: 7845, porcentaje: 6 },
]

export function VentasCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Evolución de Ventas</CardTitle>
          <CardDescription>Ingresos y reservas por mes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ingresos" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
              <TabsTrigger value="reservas">Reservas</TabsTrigger>
            </TabsList>
            <TabsContent value="ingresos" className="mt-6">
              <ChartContainer
                config={{
                  ingresos: {
                    label: "Ingresos",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ventasMensuales}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mes" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="ingresos"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-1))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="reservas" className="mt-6">
              <ChartContainer
                config={{
                  reservas: {
                    label: "Reservas",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ventasMensuales}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mes" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="reservas" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ventas por Categoría</CardTitle>
          <CardDescription>Distribución de ingresos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categorias.map((categoria) => (
              <div key={categoria.nombre} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{categoria.nombre}</span>
                  <span className="text-muted-foreground">€{categoria.ventas.toLocaleString()}</span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
                    style={{ width: `${categoria.porcentaje}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-right">{categoria.porcentaje}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
