// /app/facturacion/albaran/editar/[albaranId]/page.tsx

// Importa el componente del formulario, que se puede reutilizar para edición
import { NuevoAlbaranForm } from "@/components/facturacion/nuevo-albaran-form"; 
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

export default function EditarAlbaranPage({ params }: { params: { albaranId: string } }) {
    // El 'albaranId' estará disponible en params.albaranId
    const albaranId = params.albaranId;

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <DashboardHeader title={`Editar Albarán: ${albaranId}`} />
                <main className="flex-1 p-6">
                    {/* El formulario debe manejar la lógica de carga de datos 
                        cuando se le pasa un ID. */}
                    <NuevoAlbaranForm albaranId={albaranId} isEditing={true} /> 
                </main>
            </div>
        </div>
    );
}
