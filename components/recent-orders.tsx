import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { getRecentOrders } from "@/app/actions/dashboard-actions"
import Link from "next/link"

const statusColors = {
  pendiente: "bg-yellow-100 text-yellow-800",
  confirmado: "bg-blue-100 text-blue-800",
  en_preparacion: "bg-purple-100 text-purple-800",
  en_servicio: "bg-green-100 text-green-800",
  completado: "bg-gray-100 text-gray-800",
  cancelado: "bg-red-100 text-red-800",
}

const statusLabels = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  en_preparacion: "En Preparación",
  en_servicio: "En Servicio",
  completado: "Completado",
  cancelado: "Cancelado",
}

export async function RecentOrders() {
  const orders = await getRecentOrders()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No hay pedidos recientes</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium">{order.numero_pedido}</span>
                    <Badge className={statusColors[order.estado as keyof typeof statusColors]}>
                      {statusLabels[order.estado as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {order.usuarios?.nombre || "Cliente desconocido"}
                  </p>
                  <p className="text-xs text-muted-foreground">{order.usuarios?.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">€{order.total?.toFixed(2) || "0.00"}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.fecha_pedido).toLocaleDateString("es-ES")}
                  </p>
                  <Link href={`/pedidos/${order.id}`}>
                    <Button variant="ghost" size="sm" className="mt-2">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
