// components/facturacion/albaranes-list.tsx
"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Download, FileText, Edit, Trash2, Search, Signature } from "lucide-react"
// ✅ RUTA CORREGIDA:
import { createClient } from '../../lib/supabase-browser';
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SignatureModal } from "./signature-modal" 

// *** 🐞 TIPADO CORREGIDO ***
interface Albaran {
    id: string; // ✅ ESTE ES EL UUID DE SUPABASE
    numeroAlbaran: string; // ✅ ESTE ES EL ID VISIBLE (Ej: ALB-2025-001)
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
    signed: boolean; // Controlado localmente por la existencia de 'signed_at'
    firmaNombre?: string;
    firmaDNI?: string;
    signed_at?: string | null; 
}

// Datos de ejemplo para fallback (actualizados al nuevo tipado)
const albaranesData: Albaran[] = [
    {
        id: "UUID-001", numeroAlbaran: "ALB-2025-001", pedido: "PED-2025-001", cliente: "María García R.", empresa: "Eventos Elegantes SL",
        fechaEmision: "2025-01-10", fechaEntrega: "2025-01-15", direccion: "Hotel Majestic...",
        articulos: 5, estado: "entregado", facturado: true, numeroFactura: "FAC-2025-001",
        signed: false 
    },
    {
        id: "UUID-002", numeroAlbaran: "ALB-2025-002", pedido: "PED-2025-002", cliente: "Juan Martínez L.", empresa: "Corporativo Eventos",
        fechaEmision: "2025-01-12", fechaEntrega: "2025-01-20", direccion: "Centro de Convenciones...",
        articulos: 3, estado: "entregado", facturado: false, numeroFactura: null,
        signed: true, 
        firmaNombre: "Juan Martínez López",
        firmaDNI: "12345678A"
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

// --- 🐞 FUNCIÓN DE MAPEO CORREGIDA ---
const mapSupabaseToAlbaran = (data: any[]): Albaran[] => {
    return data.map(a => ({
        ...a,
        id: a.id, // ✅ El id real (UUID)
        numeroAlbaran: a.numero_albaran || a.id, // El id visible
        fechaEmision: a.fecha_emision || a.fechaEmision,
        fechaEntrega: a.fecha_entrega || a.fechaEntrega,
        numeroFactura: a.numero_factura || a.numeroFactura,
        signed: !!a.signed_at, 
        firmaNombre: a.firma_nombre || a.firmaNombre,
        firmaDNI: a.firma_dni || a.firmaDNI,
    }));
};


export function AlbaranesList() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [albaranes, setAlbaranes] = useState<Albaran[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [selectedAlbaran, setSelectedAlbaran] = useState<Albaran | null>(null);

    // Función para recargar los albaranes
    const fetchAlbaranes = async () => {
        // No seteamos isLoading(true) aquí para evitar parpadeo al recargar
        const supabase = createClient();
        
        const { data, error } = await supabase
            .from('albaranes') 
            .select('*') 
            .order('fechaEmision', { ascending: false });

        if (error) {
            console.error("Error cargando albaranes:", error);
            setAlbaranes(albaranesData); 
        } else {
            setAlbaranes(mapSupabaseToAlbaran(data));
        }
        setIsLoading(false);
    };

    // Carga inicial de datos
    useEffect(() => {
        setIsLoading(true); // Solo en la carga inicial
        fetchAlbaranes();
    }, []);

    // --- MANEJADORES DE ACCIONES ---

    const handleSign = (albaran: Albaran) => {
        setSelectedAlbaran(albaran);
        setShowSignatureModal(true);
    };

    const handleSignatureSave = async (signatureData: { firmaNombre: string, firmaDNI: string, firmaImagen: string }) => {
        if (!selectedAlbaran) return;

        const supabase = createClient();
        
        // ✅ AHORA selectedAlbaran.id ES EL UUID CORRECTO
        const { error } = await supabase
            .from('albaranes')
            .update({
                firma_nombre: signatureData.firmaNombre,
                firma_dni: signatureData.firmaDNI,
                firma_imagen_url: signatureData.firmaImagen, 
                signed_at: new Date().toISOString(), 
            })
            .eq('id', selectedAlbaran.id); // ✅ La consulta funcionará

        if (error) {
            console.error("Error al guardar la firma:", error);
        } else {
            console.log("Firma guardada con éxito");
            setShowSignatureModal(false);
            fetchAlbaranes(); // Recarga los datos
        }
    };

    const handleEdit = (albaranId: string) => {
        // ✅ albaranId es el UUID, perfecto para la página de edición
        router.push(`/facturacion/albaran/editar/${albaranId}`);
    };

    const handleDelete = async (albaranId: string) => {
        // ✅ albaranId es el UUID, listo para borrar
        console.log("Eliminar albarán:", albaranId);
        // const supabase = createClient();
        // const { error } = await supabase.from('albaranes').delete().eq('id', albaranId);
        // if (!error) fetchAlbaranes();
    };


    // --- RENDERIZADO ---

    const filteredAlbaranes = albaranes.filter(albaran =>
        (albaran.numeroAlbaran && albaran.numeroAlbaran.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (albaran.cliente && albaran.cliente.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (albaran.empresa && albaran.empresa.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
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
                                        // ✅ 'key' usa el 'id' (UUID) único
                                        <tr key={albaran.id}>
                                            {/* ✅ Muestra el 'numeroAlbaran' visible */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">{albaran.numeroAlbaran}</td>
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
                                                        {/* ✅ TODAS las acciones usan 'albaran.id' (el UUID) */}
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
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(albaran.id)} disabled={albaran.signed}>
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
                                            No se encontraron albaranes que coincidan con la búsqueda.
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
                    albaranId={selectedAlbaran.numeroAlbaran} // ✅ Pasa el ID visible (ALB-...) al modal
                    onSignatureSave={handleSignatureSave} 
                />
            )}
        </div>
    );
}
