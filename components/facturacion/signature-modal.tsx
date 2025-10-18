// components/facturacion/signature-modal.tsx
"use client"

import { useState, useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog" // Asume que tienes un Dialog/Modal
import { Eraser, Check } from "lucide-react"

// NOTA: En un proyecto real, necesitarías el cliente Supabase aquí para subir la imagen 
// de la firma a Storage y actualizar la base de datos de albaranes.

export function SignatureModal({ albaranId, onClose, onSuccess }: { albaranId: string, onClose: () => void, onSuccess: (id: string) => void }) {
    const [nombre, setNombre] = useState('');
    const [dni, setDni] = useState('');
    const sigCanvas = useRef<any>(null); // Usamos 'any' para simplificar la referencia

    const clearSignature = () => sigCanvas.current?.clear();
    
    const handleSave = async () => {
        if (!nombre || !dni) return alert('Por favor, rellena tu nombre y DNI.');
        if (!sigCanvas.current || sigCanvas.current.isEmpty()) return alert('Por favor, firma el albarán con el ratón o el dedo.');

        // 1. Obtener la imagen de la firma como Base64
        const signatureImageBase64 = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        
        // 2. *** LÓGICA DE ACTUALIZACIÓN (Simulada) ***
        console.log(`[v0] Firmando albarán ${albaranId}`);
        console.log(`Firma de: ${nombre}, DNI: ${dni}`);
        // En un entorno real, aquí harías una llamada a Supabase:
        /* const { error } = await supabase
            .from('albaranes')
            .update({
                firma_nombre: nombre,
                firma_dni: dni,
                firma_imagen_base64: signatureImageBase64, // O subir a Storage y guardar la URL
                signed_at: new Date().toISOString(),
            })
            .eq('id', albaranId);
        */
        
        alert(`Albarán ${albaranId} firmado y bloqueado con éxito.`);
        onSuccess(albaranId);
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] p-0">
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl">Firmar Albarán: {albaranId}</CardTitle>
                        <CardDescription>
                            Introduce tus datos y firma. Una vez aceptado, este documento quedará bloqueado.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <Input 
                            placeholder="Nombre Completo del Receptor" 
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                        <Input 
                            placeholder="DNI / NIF" 
                            value={dni} 
                            onChange={(e) => setDni(e.target.value)}
                            required
                        />
                        
                        <div className="border border-input rounded-lg overflow-hidden">
                            <div className="p-2 bg-gray-50 flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Área de Firma</span>
                                <Button variant="ghost" size="sm" onClick={clearSignature} type="button">
                                    <Eraser className="w-4 h-4 mr-1" /> Borrar
                                </Button>
                            </div>
                            {/* Lienzo para la firma, optimizado para móvil (táctil) y ratón */}
                            <SignatureCanvas
                                ref={sigCanvas}
                                canvasProps={{ 
                                    width: 448, 
                                    height: 200, 
                                    className: 'sigCanvas w-full cursor-crosshair' 
                                }}
                                penColor='black'
                                minWidth={1}
                                maxWidth={2}
                            />
                        </div>
                        
                        <Button onClick={handleSave} disabled={!nombre || !dni} className="w-full">
                            <Check className="w-4 h-4 mr-2" />
                            Aceptar y Firmar Albarán
                        </Button>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
}
