import { Sidebar } from "@/components/sidebar"
import { PedidosHeader } from "@/components/pedidos/pedidos-header"
import { PedidosList } from "@/components/pedidos/pedidos-list"

export default function PedidosPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 space-y-6">
          <PedidosHeader />
          <PedidosList />
        </main>
      </div>
    </div>
  )
}
