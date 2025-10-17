"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Users, UserPlus, Phone, Mail, Building2, MapPin } from "lucide-react"
import { getClientes } from "@/app/actions/clientes-actions"
import { useRouter } from "next/navigation"

export default function ClientesPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const cargarClientes = async () => {
      setLoading(true)
      const result = await getClientes()
      if (result.success) {
        setClientes(result.data)
      }
      setLoading(false)
    }
    cargarClientes()
  }, [])

  const clientesFiltrados = clientes.filter((cliente) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      cliente.nombre?.toLowerCase().includes(query) ||
      cliente.email?.toLowerCase().includes(query) ||
      cliente.empresa?.toLowerCase().includes(query) ||
      cliente.telefono?.includes(query)
    )
  })

  const totalClientes = clientes.length
  const clientesActivos = clientes.filter((c) => c.estado !== "inactivo").length

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
              <p className="text-muted-foreground">Gestión de clientes y contactos</p>
            </div>
            <Button onClick={() => router.push("/clientes/nuevo")}>
              <UserPlus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalClientes}</div>
                <p className="text-xs text-muted-foreground">Clientes registrados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clientesActivos}</div>
                <p className="text-xs text-muted-foreground">Con pedidos recientes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nuevos este mes</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    clientes.filter((c) => {
                      const created = new Date(c.created_at || Date.now())
                      const now = new Date()
                      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                    }).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Registrados en {new Date().toLocaleDateString("es-ES", { month: "long" })}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email, empresa o teléfono..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Clients List */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>
                Mostrando {clientesFiltrados.length} de {totalClientes} clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando clientes...</p>
                  </div>
                </div>
              ) : clientesFiltrados.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No se encontraron clientes</p>
                  <Button className="mt-4" onClick={() => router.push("/clientes/nuevo")}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Crear primer cliente
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {clientesFiltrados.map((cliente) => (
                    <div
                      key={cliente.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/clientes/${cliente.id}`)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{cliente.nombre}</h3>
                          {cliente.empresa && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {cliente.empresa}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {cliente.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {cliente.telefono}
                          </div>
                          {cliente.direccion && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {cliente.direccion}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
