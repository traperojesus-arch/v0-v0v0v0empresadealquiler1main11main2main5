import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Package, Users, Calendar, Euro } from "lucide-react"
import { getDashboardStats } from "@/app/actions/dashboard-actions"

export async function DashboardStats() {
  const stats = await getDashboardStats()

  const statsDisplay = [
    {
      title: "Ingresos del Mes",
      value: `€${stats.ingresosMes.toFixed(2)}`,
      change: "+12.5%",
      trend: "up" as const,
      icon: Euro,
    },
    {
      title: "Pedidos Activos",
      value: stats.pedidosActivos.toString(),
      change: "+3",
      trend: "up" as const,
      icon: Calendar,
    },
    {
      title: "Artículos Disponibles",
      value: stats.articulosDisponibles.toString(),
      change: "-8",
      trend: "down" as const,
      icon: Package,
    },
    {
      title: "Clientes Totales",
      value: stats.totalClientes.toString(),
      change: "+5",
      trend: "up" as const,
      icon: Users,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsDisplay.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stat.trend === "up" ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
              <span className="ml-1">desde el mes pasado</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
