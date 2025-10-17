"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { createCliente } from "@/app/actions/clientes-actions"

export default function NuevoClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    empresa: "",
    nif_cif: "",
    tipo_cliente: "particular",
    direccion: "",
    codigo_postal: "",
    ciudad: "",
    provincia: "",
    pais: "España",
    notas: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Combinar nombre y apellidos
    const nombreCompleto = `${formData.nombre} ${formData.apellidos}`.trim()

    // Combinar dirección completa
    const direccionCompleta =
      `${formData.direccion}, ${formData.codigo_postal} ${formData.ciudad}, ${formData.provincia}, ${formData.pais}`.trim()

    const result = await createCliente({
      nombre: nombreCompleto,
      email: formData.email,
      telefono: formData.telefono,
      empresa: formData.empresa,
      nif_cif: formData.nif_cif,
      tipo_cliente: formData.tipo_cliente,
      direccion: direccionCompleta,
      notas: formData.notas,
    })

    setLoading(false)

    if (result.success) {
      router.push("/clientes")
    } else {
      alert("Error al crear cliente: " + result.error)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Nuevo Cliente</h1>
              <p className="text-muted-foreground">Completa todos los datos para poder facturar</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Datos Personales */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Datos Personales</CardTitle>
                  <CardDescription>Información básica del cliente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        required
                        value={formData.nombre}
                        onChange={(e) => handleChange("nombre", e.target.value)}
                        placeholder="Juan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellidos">Apellidos *</Label>
                      <Input
                        id="apellidos"
                        required
                        value={formData.apellidos}
                        onChange={(e) => handleChange("apellidos", e.target.value)}
                        placeholder="García Pérez"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="juan@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        required
                        value={formData.telefono}
                        onChange={(e) => handleChange("telefono", e.target.value)}
                        placeholder="666 123 456"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Datos Fiscales */}
              <Card>
                <CardHeader>
                  <CardTitle>Datos Fiscales</CardTitle>
                  <CardDescription>Para facturación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo_cliente">Tipo de Cliente *</Label>
                    <Select
                      value={formData.tipo_cliente}
                      onValueChange={(value) => handleChange("tipo_cliente", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="particular">Particular</SelectItem>
                        <SelectItem value="empresa">Empresa</SelectItem>
                        <SelectItem value="autonomo">Autónomo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.tipo_cliente !== "particular" && (
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Nombre Empresa</Label>
                      <Input
                        id="empresa"
                        value={formData.empresa}
                        onChange={(e) => handleChange("empresa", e.target.value)}
                        placeholder="Eventos García S.L."
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="nif_cif">NIF/CIF *</Label>
                    <Input
                      id="nif_cif"
                      required
                      value={formData.nif_cif}
                      onChange={(e) => handleChange("nif_cif", e.target.value)}
                      placeholder="12345678A"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Dirección */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Dirección de Facturación</CardTitle>
                  <CardDescription>Dirección completa para facturas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Calle y Número *</Label>
                    <Input
                      id="direccion"
                      required
                      value={formData.direccion}
                      onChange={(e) => handleChange("direccion", e.target.value)}
                      placeholder="Calle Mayor, 123, 2º B"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="codigo_postal">Código Postal *</Label>
                      <Input
                        id="codigo_postal"
                        required
                        value={formData.codigo_postal}
                        onChange={(e) => handleChange("codigo_postal", e.target.value)}
                        placeholder="28001"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="ciudad">Ciudad *</Label>
                      <Input
                        id="ciudad"
                        required
                        value={formData.ciudad}
                        onChange={(e) => handleChange("ciudad", e.target.value)}
                        placeholder="Madrid"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provincia">Provincia *</Label>
                      <Input
                        id="provincia"
                        required
                        value={formData.provincia}
                        onChange={(e) => handleChange("provincia", e.target.value)}
                        placeholder="Madrid"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pais">País *</Label>
                    <Input
                      id="pais"
                      required
                      value={formData.pais}
                      onChange={(e) => handleChange("pais", e.target.value)}
                      placeholder="España"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notas">Notas</Label>
                    <Textarea
                      id="notas"
                      value={formData.notas}
                      onChange={(e) => handleChange("notas", e.target.value)}
                      placeholder="Información adicional sobre el cliente..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cliente"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
