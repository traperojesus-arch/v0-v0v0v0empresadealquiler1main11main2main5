// components/facturacion/albaranes-list.tsx
"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Download, FileText, Edit, Trash2, Search, Signature } from "lucide-react" // Importar Signature
import { useState } from "react"
import { useRouter } from "next/navigation"
import { SignatureModal } from "./signature-modal" // Importar el nuevo modal

// *** DATOS DE EJEMPLO ACTUALIZADOS con el campo 'signed' ***
const albaranesData = [
    {
        id: "ALB-2025-001", pedido: "PED-2025-001", cliente: "María García R.", empresa: "Eventos Elegantes SL",
        fechaEmision: "2025-01-10", fechaEntrega: "2025-01-15", direccion: "Hotel Majestic...",
        articulos: 5, estado: "entregado", facturado: true, numeroFactura: "FAC-2025-001",
        signed: false // ** NO FIRMADO
    },
    {
        id: "ALB-2025-002", pedido: "PED-2025-002", cliente: "Juan Martínez L.", empresa: "Corporativo Eventos",
        fechaEmision: "2025-01-12", fechaEntrega: "2025-01-20", direccion: "Centro de Convenciones...",
        articulos: 3, estado: "entregado", facturado: false, numeroFactura: null,
        signed: true, // ** FIRMADO Y BLOQUEADO
        firmaNombre: "Juan Martínez López",
        firmaDNI: "12345678A"
    },
    {
        id: "ALB-2025-003", pedido: "PED-2025-003", cliente: "Ana Fernández S.", empresa: "Bodas de Ensueño",
        fechaEmision: "2025-01-08", fechaEntrega: "2025-01-12", direccion: "Finca El Olivar...",
        articulos: 8, estado: "pendiente", facturado: false, numeroFactura: null,
        signed: false // ** NO FIRMADO
    },
]

// ... (statusColors y statusLabels se mantienen igual) ...

export function AlbaranesList() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [albaranes, setAlbaranes] = useState(albaranesData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAlbaranId, setSelectedAlbaranId] = useState<string | null>(null);

    const handleFirmar = (albaranId: string) => {
        setSelectedAlbaranId(albaranId);
        setIsModalOpen(true);
    };

    const handleFirmaExitosa = (albaranId: string) => {
        // En un entorno real, recargarías los datos de Supabase.
        // Aquí actualizamos el estado estático para reflejar el cambio.
        setAlbaranes(prev => prev.map(a => 
            a.id === albaranId ? { ...a, signed: true, estado: 'entregado' } : a
        ));
    };
    
    const handleEditar = (albaranId: string) => {
        // Redirigir al formulario de edición (se asume que existe la ruta)
        router.push(`/facturacion/albaran/editar/${albaranId}`);
    };

    const handleEliminar = (albaranId: string) => {
        if(window.confirm(`¿Estás seguro de eliminar el albarán ${albaranId}?`)) {
            // Lógica de eliminación. En RLS, esto fallará si signed: true.
            console.log("Eliminando albarán:", albaranId);
            setAlbaranes(prev => prev.filter(a => a.id !== albaranId));
        }
    };

    // ... (handleDescargarPDF y handleGenerarFactura se mantienen igual) ...

    return (
        <div className="space-y-4">
            {/* ... (Filtros y búsqueda se mantienen igual) ... */}
            
            <div className="space-y-4">
                {albaranes.map((albaran) => (
                    <Card key={albaran.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        {/* ... (Números y Badges de estado se mantienen igual) ... */}
                                        {albaran.signed && (
                                            <Badge className="bg-purple-100 text-purple-800">
                                                FIRMADO
                                            </Badge>
                                        )}
                                    </div>
                                    {/* ... (Cliente, empresa y pedido se mantienen igual) ... */}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Eye className="mr-2 h-4 w-4" /> Ver detalles
                                        </DropdownMenuItem>
                                        {/* ... (Descargar PDF, Generar Factura se mantienen igual) ... */}
                                        
                                        {/* ** OPCIÓN DE FIRMA ** */}
                                        {!albaran.signed && (
                                            <DropdownMenuItem onClick={() => handleFirmar(albaran.id)} className="font-semibold text-primary">
                                                <Signature className="mr-2 h-4 w-4" />
                                                Firmar Albarán
                                            </DropdownMenuItem>
                                        )}

                                        {/* ** OPCIÓN DE EDICIÓN (BLOQUEADA POR signed) ** */}
                                        <DropdownMenuItem 
                                            onClick={() => handleEditar(albaran.id)}
                                            disabled={albaran.signed}
                                            className={albaran.signed ? "text-muted-foreground" : ""}
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            {albaran.signed ? "Editar (Bloqueado)" : "Editar"}
                                        </DropdownMenuItem>

                                        {/* ** OPCIÓN DE ELIMINAR (BLOQUEADA POR signed) ** */}
                                        <DropdownMenuItem 
                                            onClick={() => handleEliminar(albaran.id)}
                                            disabled={albaran.signed}
                                            className={albaran.signed ? "text-muted-foreground" : "text-destructive"}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            {albaran.signed ? "Eliminar (Bloqueado)" : "Eliminar"}
                                        </DropdownMenuItem>
                                        
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            
                            {/* ** Muestra la info de firma si está firmado ** */}
                            {albaran.signed && albaran.firmaNombre && (
                                <div className="text-sm text-gray-600 mb-4 p-2 bg-purple-50 rounded-md border-l-4 border-purple-500">
                                    Albarán firmado por: **{albaran.firmaNombre}** (DNI: {albaran.firmaDNI})
                                </div>
                            )}

                            {/* ... (Datos de emisión, entrega, etc. se mantienen igual) ... */}
                            
                            {/* ... (Botones inferiores se mantienen igual) ... */}
                            
                        </CardContent>
                    </Card>
                ))}
            </div>

            {isModalOpen && selectedAlbaranId && (
                <SignatureModal 
                    albaranId={selectedAlbaranId} 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={() => handleFirmaExitosa(selectedAlbaranId)}
                />
            )}
        </div>
    )
}
