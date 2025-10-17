import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ConfiguracionTabs } from "@/components/configuracion/configuracion-tabs"

export default function ConfiguracionPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
            <p className="text-muted-foreground mt-1">Configura los horarios de operación y otros ajustes</p>
          </div>
          <ConfiguracionTabs />
        </main>
      </div>
    </div>
  )
}
