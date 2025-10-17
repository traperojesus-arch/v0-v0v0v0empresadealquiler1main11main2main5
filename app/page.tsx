import { Sidebar } from "@/components/sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentOrders } from "@/components/recent-orders"
import { QuickActions } from "@/components/quick-actions"
import { UpcomingDeliveries } from "@/components/upcoming-deliveries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <QuickActions />
          </div>

          <DashboardStats />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentOrders />
            <div className="space-y-6">
              <UpcomingDeliveries />

              <Card>
                <CardHeader>
                  <CardTitle>Resumen de Hoy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Pedidos nuevos</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Artículos en servicio</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Ingresos del día</span>
                      <span className="font-medium text-green-600">€1,250</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
