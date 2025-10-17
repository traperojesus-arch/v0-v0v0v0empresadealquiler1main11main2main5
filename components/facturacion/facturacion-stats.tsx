import { Card, CardContent } from "@/components/ui/card"
import { FileText, Package, Euro, Clock } from "lucide-react"

export function FacturacionStats() {
  const stats = [
    {
      title: "Facturas Pendientes",
      value: "12",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      amount: "€8,450.00",
    },
    {
      title: "Facturas Pagadas",
      value: "45",
      icon: Euro,
      color: "text-green-600",
      bgColor: "bg-green-100",
      amount: "€32,150.00",
    },
    {
      title: "Albaranes Pendientes",
      value: "8",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      amount: "€5,200.00",
    },
    {
      title: "Facturas Vencidas",
      value: "3",
      icon: Clock,
      color: "text-red-600",
      bgColor: "bg-red-100",
      amount: "€2,100.00",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className={`text-sm font-medium mt-1 ${stat.color}`}>{stat.amount}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
