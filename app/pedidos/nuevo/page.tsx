// app/pedidos/nuevo/page.tsx
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { NuevaReservaForm } from "@/components/reservas/nueva-reserva-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// Importa la acción específica para crear pedidos directamente
import { createPedidoDirecto } from "@/app/actions/pedidos-actions";

export default function NuevoPedidoPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/pedidos">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Pedidos
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Nuevo Pedido Directo</h1>
             <p className="text-muted-foreground mt-1">Crea un pedido sin pasar por reserva previa</p>
          </div>
          {/* Pasa la acción createPedidoDirecto al formulario */}
          <NuevaReservaForm onSubmitAction={createPedidoDirecto} />
        </main>
      </div>
    </div>
  );
}
