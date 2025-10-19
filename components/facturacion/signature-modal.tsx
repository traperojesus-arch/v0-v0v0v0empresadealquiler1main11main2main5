// components/facturacion/signature-modal.tsx
"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SignatureCanvas from "react-signature-canvas"

interface SignatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    albaranId: string;
    isSaving: boolean;
    onSignatureSave: (data: { nombre: string, dni: string, signatureDataUrl: string }) => Promise<void>;
}

export function SignatureModal({ isOpen, onClose, albaranId, isSaving, onSignatureSave }: SignatureModalProps) {
    const [nombre, setNombre] = useState("")
    const [dni, setDni] = useState("")
    const [error, setError] = useState("")
    const sigCanvas = useRef<SignatureCanvas>(null)

    const handleClear = () => {
        sigCanvas.current?.clear()
    }

    // ✅ CORREGIDO
    const handleSave = () => {
        if (!nombre || !dni) {
            setError("El nombre y el DNI son obligatorios.")
            return
        }
        if (sigCanvas.current?.isEmpty()) {
            setError("La firma es obligatoria.")
            return
        }
        
        setError("")
        const signatureDataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png")
        
        if (signatureDataUrl) {
            onSignatureSave({ nombre, dni, signatureDataUrl })
        }
    }

    // ✅ CORREGIDO
    const handleClose = () => {
        // Limpia el formulario al cerrar
        setNombre("")
        setDni("")
        handleClear()
        setError("")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Firmar Albarán: {albaranId}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="nombre">Nombre Completo</Label>
                        <Input
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Quien recibe"
                            disabled={isSaving}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="dni">DNI / Identificación</Label>
                        <Input
                            id="dni"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            placeholder="12345678A"
                            disabled={isSaving}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Firma</Label>
                        <div className="border rounded-md bg-white">
                            <SignatureCanvas
                                ref={sigCanvas}
                                penColor="black"
                                canvasProps={{
                                    width: 450,
                                    height: 200,
                                    className: "sigCanvas"
                                }}
                            />
                        </div>
                        <Button variant="outline" size="sm" onClick={handleClear} disabled={isSaving}>
                            Limpiar Firma
                        </Button>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={handleClose} disabled={isSaving}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Guardando..." : "Guardar Firma"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
