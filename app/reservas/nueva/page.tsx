// app/reservas/nueva/page.tsx
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { NuevaReservaForm } from "@/components/reservas/nueva-reserva-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NuevaReservaPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/reservas">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Reservas
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Nueva Reserva</h1>
             <p className="text-muted-foreground mt-1">Crea una nueva reserva de artículos</p>
          </div>
          {/* Renderiza el formulario SIN pasar onSubmitAction */}
          <NuevaReservaForm />
        </main>
      </div>
    </div>
  );
}
