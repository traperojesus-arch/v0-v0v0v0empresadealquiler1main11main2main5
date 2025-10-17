import { Sidebar } from "@/components/sidebar"
import { FacturacionHeader } from "@/components/facturacion/facturacion-header"
import { FacturacionStats } from "@/components/facturacion/facturacion-stats"
import { FacturacionTabs } from "@/components/facturacion/facturacion-tabs"

export default function FacturacionPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 space-y-6">
          <FacturacionHeader />
          <FacturacionStats />
          <FacturacionTabs />
        </main>
      </div>
    </div>
  )
}
