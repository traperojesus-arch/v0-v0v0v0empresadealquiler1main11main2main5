// components/facturacion/albaranes-list.tsx
"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Download, FileText, Edit, Trash2, Search, Signature } from "lucide-react"
import { createClient } from "@/lib/supabase-browser";

import { useState, useEffect } from "react" // Importación de useEffect y useState
import { useRouter } from "next/navigation"
import { SignatureModal } from "./signature-modal" 

// *** DATOS DE EJEMPLO para reserva (fallback) y tipado ***
interface Albaran {
    id: string;
    pedido: string;
    cliente: string;
    empresa: string;
    fechaEmision: string;
    fechaEntrega: string;
    direccion: string;
    articulos: number;
    estado: string;
    facturado: boolean;
    numeroFactura: string | null;
    signed: boolean;
    firmaNombre?: string;
    firmaDNI?: string;
}

const albaranesData: Albaran[] = [
    {
        id: "ALB-2025-001", pedido: "PED-2025-001", cliente: "María García R.", empresa: "Eventos Elegantes SL",
        fechaEmision: "2025-01-10", fechaEntrega: "2025-01-15", direccion: "Hotel Majestic...",
        articulos: 5, estado: "entregado", facturado: true, numeroFactura: "FAC-2025-001",
        signed: false 
    },
    {
        id: "ALB-2025-002", pedido: "PED-2025-002", cliente: "Juan Martínez L.", empresa: "Corporativo Eventos",
        fechaEmision: "2025-01-12", fechaEntrega: "2025-01-20", direccion: "Centro de Convenciones...",
        articulos: 3, estado: "entregado", facturado: false, numeroFactura: null,
        signed: true, 
        firmaNombre: "Juan Martínez López",
        firmaDNI: "12345678A"
    },
    {
        id: "ALB-2025-003", pedido: "PED-2025-003", cliente: "Ana Fernández S.", empresa: "Bodas de Ensueño",
        fechaEmision: "2025-01-08", fechaEntrega: "2025-01-12", direccion: "Finca El Olivar...",
        articulos: 8, estado: "pendiente", facturado: false, numeroFactura: null,
        signed: false 
    },
]

// Mapping de colores y etiquetas
const statusColors: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    entregado: "default",
    pendiente: "secondary",
    cancelado: "destructive",
    borrador: "outline",
}

const statusLabels: { [key: string]: string } = {
    entregado: "Entregado",
    pendiente: "Pendiente",
    cancelado: "Cancelado",
    borrador: "Borrador",
}

export function AlbaranesList() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [albaranes, setAlbaranes] = useState<Albaran[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [selectedAlbaran, setSelectedAlbaran] = useState<Albaran | null>(null);

    // Función para manejar la firma
    const handleSign = (albaran: Albaran) => {
        setSelectedAlbaran(albaran);
        setShowSignatureModal(true);
    };

    // Función para manejar la edición (navegación)
    const handleEdit = (albaranId: string) => {
        // CORRECCIÓN DE RUTA: Asegúrate de que esta ruta exista en /app/facturacion/albaran/editar/[albaranId]/page.tsx
        router.push(`/facturacion/albaran/editar/${albaranId}`);
    };

    // ** LÓGICA PARA CARGAR DATOS DE SUPABASE **
    useEffect(() => {
        const fetchAlbaranes = async () => {
            const supabase = createClient();
            
            // Reemplaza 'albaranes' con el nombre real de tu tabla
            const { data, error } = await supabase
                .from('albaranes') 
                .select('*') 
                .order('fechaEmision', { ascending: false });

            if (error) {
                console.error("Error cargando albaranes:", error);
                // Usar datos estáticos como fallback
                setAlbaranes(albaranesData); 
            } else {
                // Mapear los datos de Supabase al formato local
                setAlbaranes(data.map(a => ({
                    ...a,
                    id: a.numero_albaran || a.id, // Ajusta si el campo ID es diferente en tu DB
                    signed: !!a.signed_at // asumiendo que 'signed_at' indica la firma
                } as Albaran)));
            }
            setIsLoading(false);
        };

        fetchAlbaranes();
    }, []);

    // Filtrado
    const filteredAlbaranes = albaranes.filter(albaran =>
        albaran.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        albaran.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        albaran.empresa.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // ** Agrega un estado de carga **
    if (isLoading) {
        return <div className="text-center p-8 text-lg font-medium">Cargando albaranes...</div>;
    }
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por ID, Cliente o Empresa..."
                        className="pl-9 w-[300px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={() => router.push("/facturacion/albaran/nuevo")}>
                    Crear Nuevo Albarán
                </Button>
            </div>
            
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente/Empresa</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fecha Entrega</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Firma</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                                {filteredAlbaranes.length > 0 ? (
                                    filteredAlbaranes.map((albaran) => (
                                        <tr key={albaran.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">{albaran.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-card-foreground">{albaran.cliente}</div>
                                                <div className="text-xs text-muted-foreground">{albaran.empresa}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{albaran.fechaEntrega}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={statusColors[albaran.estado] || "outline"}>
                                                    {statusLabels[albaran.estado] || albaran.estado}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Badge variant={albaran.signed ? "default" : "secondary"} className={albaran.signed ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>
                                                    {albaran.signed ? "Firmado" : "Pendiente"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => router.push(`/facturacion/albaran/detalle/${albaran.id}`)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Ver Detalles
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEdit(albaran.id)} disabled={albaran.signed}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar {!albaran.signed ? '' : '(Bloqueado)'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Download className="mr-2 h-4 w-4" />
                                                            Descargar PDF
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleSign(albaran)} disabled={albaran.signed}>
                                                            <Signature className="mr-2 h-4 w-4" />
                                                            Firmar {!albaran.signed ? '' : '(Firmado)'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            No se encontraron albaranes o la tabla de Supabase está vacía.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Modal de Firma */}
            {selectedAlbaran && (
                <SignatureModal 
                    isOpen={showSignatureModal}
                    onClose={() => setShowSignatureModal(false)}
                    albaranId={selectedAlbaran.id}
                    onSignatureSave={(data) => {
                        console.log("Firma guardada para el albarán:", selectedAlbaran.id, data);
                        // Aquí implementarías la lógica de Supabase para actualizar el albarán
                        // (marcarlo como signed: true, subir la imagen, etc.)
                        setShowSignatureModal(false);

                        // Opcional: Refrescar la lista de albaranes
                        // fetchAlbaranes(); 
                    }}
                />
            )}
        </div>
    );
}
