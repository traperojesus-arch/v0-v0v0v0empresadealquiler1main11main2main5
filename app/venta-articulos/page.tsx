import { Sidebar } from "@/components/sidebar"
import { VentaArticulosHeader } from "@/components/venta-articulos/venta-articulos-header"
import { VentaArticulosList } from "@/components/venta-articulos/venta-articulos-list"

export default function VentaArticulosPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 space-y-6">
          <VentaArticulosHeader />
          <VentaArticulosList />
        </main>
      </div>
    </div>
  )
}
