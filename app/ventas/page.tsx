import { Sidebar } from "@/components/sidebar"
import { VentasHeader } from "@/components/ventas/ventas-header"
import { VentasStats } from "@/components/ventas/ventas-stats"
import { VentasCharts } from "@/components/ventas/ventas-charts"
import { TopArticulos } from "@/components/ventas/top-articulos"
import { TopClientes } from "@/components/ventas/top-clientes"

export default function VentasPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 space-y-6">
          <VentasHeader />
          <VentasStats />
          <VentasCharts />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopArticulos />
            <TopClientes />
          </div>
        </main>
      </div>
    </div>
  )
}
