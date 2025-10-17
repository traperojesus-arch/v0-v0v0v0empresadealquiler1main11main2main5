import { Sidebar } from "@/components/sidebar"
import { ReservasHeader } from "@/components/reservas/reservas-header"
import { ReservasList } from "@/components/reservas/reservas-list"

export default function ReservasPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 space-y-6">
          <ReservasHeader />
          <ReservasList />
        </main>
      </div>
    </div>
  )
}
