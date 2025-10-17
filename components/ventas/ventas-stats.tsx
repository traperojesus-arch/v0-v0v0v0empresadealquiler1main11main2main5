"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"

export function VentasStats() {
  const stats = [
    {
      title: "Ingresos Totales",
      value: "€45,231.89",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      description: "vs. mes anterior",
    },
    {
      title: "Reservas",
      value: "234",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
      description: "vs. mes anterior",
    },
    {
      title: "Clientes Activos",
      value: "89",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      description: "vs. mes anterior",
    },
    {
      title: "Artículos Alquilados",
      value: "1,234",
      change: "-3.1%",
      trend: "down",
      icon: Package,
      description: "vs. mes anterior",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-2 mt-1">
              {stat.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {stat.change}
              </span>
              <span className="text-sm text-muted-foreground">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
