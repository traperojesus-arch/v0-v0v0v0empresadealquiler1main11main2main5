import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUpcomingDeliveries } from "@/app/actions/dashboard-actions"
import { Calendar } from "lucide-react"

export async function UpcomingDeliveries() {
  const deliveries = await getUpcomingDeliveries()

  const formatDeliveryDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return `Hoy ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Mañana ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`
    } else {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Entregas</CardTitle>
      </CardHeader>
      <CardContent>
        {deliveries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No hay entregas programadas próximamente</div>
        ) : (
          <div className="space-y-3">
            {deliveries.map((delivery, index) => (
              <div key={delivery.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${index === 0 ? "bg-blue-500" : "bg-orange-500"}`}></div>
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{delivery.numero_pedido}</p>
                  <p className="text-sm text-muted-foreground">{delivery.usuarios?.nombre || "Cliente desconocido"}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatDeliveryDate(delivery.fecha_entrega)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
