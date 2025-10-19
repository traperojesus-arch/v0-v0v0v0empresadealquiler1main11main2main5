// components/facturacion/albaranes-list.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// ✅ Importa los nuevos iconos y hooks
import { MoreHorizontal, Eye, Download, FileText, Edit, Trash2, Search, Signature } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

// ✅ Importa el cliente de Supabase y el nuevo modal
import { createClient } from '@/lib/supabase/client';
import { SignatureModal } from "@/components/facturacion/signature-modal"

// ✅ Interfaz de Albaran (similar a la que tenías antes)
interface Albaran {
    id: string; // El UUID de Supabase
    numeroAlbaran: string; // El ID visible (Ej: ALB-2025-001)
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
    signed: boolean; // Derivado de 'signed_at'
    firmaNombre?: string;
    firmaDNI?: string;
    firma_imagen_url?: string;
    signed_at?: string | null;
}

// ✅ Mapeo de colores de Badge (usando variantes de ShadCN)
const statusColors: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    pendiente: "secondary",
    entregado: "default",
    cancelado: "destructive",
}

const statusLabels: { [key: string]: string } = {
    pendiente: "Pendiente",
    entregado: "Entregado",
    cancelado: "Cancelado", // Añadido por si acaso
}

// ✅ Función de Mapeo (para convertir snake_case de Supabase a camelCase)
const mapSupabaseToAlbaran = (data: any[]): Albaran[] => {
    return data.map(a => ({
        ...a,
        id: a.id,
        numeroAlbaran: a.numero_albaran || a.id,
        fechaEmision: a.fecha_emision || a.fechaEmision,
        fechaEntrega: a.fecha_entrega || a.fechaEntrega,
        numeroFactura: a.numero_factura || a.numeroFactura,
        signed: !!a.signed_at, // true si signed_at no es null
        firmaNombre: a.firma_nombre,
        firmaDNI: a.firma_dni,
    }));
};

export function AlbaranesList() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    
    // ✅ Estado para cargar albaranes desde Supabase
    const [albaranes, setAlbaranes] = useState<Albaran[]>([])
    const [isLoading, setIsLoading] = useState(true)
    
    // ✅ Estado para el modal de firma
    const [showSignatureModal, setShowSignatureModal] = useState(false)
    const [selectedAlbaran, setSelectedAlbaran] = useState<Albaran | null>(null)
    const [isSavingSignature, setIsSavingSignature] = useState(false)

    // ✅ Función para cargar datos
    const fetchAlbaranes = async () => {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('albaranes') // Asegúrate que tu tabla se llama 'albaranes'
            .select('*')
            // 🐞 CORREGIDO: Usa el nombre de columna 'fecha_emision' de la DB
            .order('fecha_emision', { ascending: false })

        if (error) {
            console.error("Error cargando albaranes:", error)
        } else {
            setAlbaranes(mapSupabaseToAlbaran(data))
        }
        setIsLoading(false)
    }

    // ✅ Carga inicial de datos
    useEffect(() => {
        fetchAlbaranes()
    }, [])

    // --- MANEJADORES DE ACCIONES ---

    const handleDescargarPDF = (id: string) => {
        console.log("Descargando PDF de albarán:", id)
        alert(`Generando PDF de ${id}...`)
    }

    const handleGenerarFactura = (albaran: Albaran) => {
        console.log("Generando factura desde albarán:", albaran.id)
        router.push(`/facturacion/nueva-factura?albaran=${albaran.id}`)
    }

    // ✅ Navega a la página de edición
    const handleEdit = (albaranId: string) => {
        router.push(`/facturacion/albaran/editar/${albaranId}`)
    }

    // ✅ Abre el modal de firma
    const handleSign = (albaran: Albaran) => {
        setSelectedAlbaran(albaran)
        setShowSignatureModal(true)
    }

    // ✅ Lógica para guardar la firma
    const handleSignatureSave = async (data: { nombre: string, dni: string, signatureDataUrl: string }) => {
        if (!selectedAlbaran) return

        setIsSavingSignature(true)
        const supabase = createClient()

        try {
            // 1. Convertir Data URL (Base64) a un Blob para subir
            const response = await fetch(data.signatureDataUrl)
            const blob = await response.blob()

            // 2. Subir la imagen a Supabase Storage
            // (Asegúrate de tener un Bucket 'firmas' con acceso público de lectura)
            const filePath = `firmas/${selectedAlbaran.id}-${Date.now()}.png`
            const { data: storageData, error: storageError } = await supabase.storage
                .from('firmas')
                .upload(filePath, blob)

            if (storageError) throw storageError

            // 3. Obtener la URL pública de la imagen subida
            const { data: publicUrlData } = supabase.storage
                .from('firmas')
                .getPublicUrl(filePath)

            // 4. Actualizar la tabla 'albaranes' con los datos y la URL
            const { error: dbError } = await supabase
                .from('albaranes')
                .update({
                    firma_nombre: data.nombre,
                    firma_dni: data.dni,
                    signed_at: new Date().toISOString(),
                    firma_imagen_url: publicUrlData.publicUrl, // Guarda la URL pública
                })
                .eq('id', selectedAlbaran.id) // Usa el UUID real

            if (dbError) throw dbError

            // 5. Éxito: cerrar modal y recargar datos
            alert("Albarán firmado con éxito")
            setShowSignatureModal(false)
            fetchAlbaranes() // Recarga la lista

        } catch (error) {
            console.error("Error al guardar la firma:", error)
            alert("Error al guardar la firma. Inténtalo de nuevo.")
        } finally {
            setIsSavingSignature(false)
        }
    }
    
    // ✅ Filtrado simple (puedes mejorarlo para que use el 'numeroAlbaran')
    const filteredAlbaranes = albaranes.filter(a => 
        a.numeroAlbaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (isLoading) {
        return <div className="text-center p-8">Cargando albaranes...</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Buscar por número de albarán, cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {/* Puedes mantener o quitar los filtros de fecha según necesites */}
                <Input type="date" className="w-48" placeholder="Fecha desde" />
                {/* 🐞 CORREGIDO: 'type_alias' cambiado a 'type' */}
                <Input type="date" className="w-48" placeholder="Fecha hasta" />
            </div>

            <div className="space-y-4">
                {filteredAlbaranes.map((albaran) => (
                    <Card key={albaran.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="font-semibold text-lg">{albaran.numeroAlbaran}</h3>
                                        {/* ✅ Badge de estado con variantes ShadCN */}
                                        <Badge variant={statusColors[albaran.estado as keyof typeof statusColors] || "outline"}>
                                            {statusLabels[albaran.estado as keyof typeof statusLabels] || albaran.estado}
                                        </Badge>
                                        
                                        {/* ✅ Badge de Firma */}
                                        <Badge variant={albaran.signed ? "default" : "secondary"} className={albaran.signed ? "bg-green-600" : "bg-red-600"}>
                                            {albaran.signed ? `Firmado por ${albaran.firmaNombre}` : "Pendiente de Firma"}
                                        </Badge>
                                        
                                        {albaran.facturado && (
                                            <Badge variant="outline" className="bg-blue-50">
                                                Facturado: {albaran.numeroFactura}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {albaran.cliente} • {albaran.empresa}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">Pedido: {albaran.pedido}</p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => router.push(`/facturacion/albaran/detalle/${albaran.id}`)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Ver detalles
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDescargarPDF(albaran.id)}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Descargar PDF
                                        </DropdownMenuItem>
                                        
                                        {/* ✅ Opción de Firmar */}
                                        <DropdownMenuItem onClick={() => handleSign(albaran)} disabled={albaran.signed}>
                                            <Signature className="mr-2 h-4 w-4" />
                                            {albaran.signed ? "Ya firmado" : "Firmar"}
                                        </DropdownMenuItem>
                                        
                                        {!albaran.facturado && albaran.estado === "entregado" && (
                                            <DropdownMenuItem onClick={() => handleGenerarFactura(albaran)}>
                                                <FileText className="mr-2 h-4 w-4" />
                                                Generar Factura
                                            </DropdownMenuItem>
                                        )}
                                        
                                        {/* ✅ Acción de Editar (deshabilitada si está firmado) */}
                                        <DropdownMenuItem onClick={() => handleEdit(albaran.id)} disabled={albaran.signed}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            {albaran.signed ? "Editar (Bloqueado)" : "Editar"}
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuItem className="text-destructive" disabled={albaran.signed}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            {albaran.signed ? "Eliminar (Bloqueado)" : "Eliminar"}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* ... (El resto de tu JSX de la card se mantiene igual) ... */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                                {/* ... tus divs de fecha emisión, entrega, etc ... */}
                            </div>
                            <div className="mb-4">
                                {/* ... tu div de dirección ... */}
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t">
                                {/* ... tu div de estado de factura ... */}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ✅ Renderiza el Modal si un albarán está seleccionado */}
            {selectedAlbaran && (
                <SignatureModal
                    isOpen={showSignatureModal}
                    onClose={() => setShowSignatureModal(false)}
                    albaranId={selectedAlbaran.numeroAlbaran} // Pasa el ID visible
                    isSaving={isSavingSignature}
                    onSignatureSave={handleSignatureSave}
                />
            )}
        </div>
    )
}
