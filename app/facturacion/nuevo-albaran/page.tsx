import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { NuevoAlbaranForm } from "@/components/facturacion/nuevo-albaran-form"

export default function NuevoAlbaranPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6">
          <NuevoAlbaranForm />
        </main>
      </div>
    </div>
  )
}
