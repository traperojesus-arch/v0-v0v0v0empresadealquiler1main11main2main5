import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { NuevaFacturaForm } from "@/components/facturacion/nueva-factura-form"

export default function NuevaFacturaPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6">
          <NuevaFacturaForm />
        </main>
      </div>
    </div>
  )
}
