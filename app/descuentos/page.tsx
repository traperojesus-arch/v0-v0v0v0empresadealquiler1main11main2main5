import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Percent, Plus, Calendar, Users } from "lucide-react"

export default function DescuentosPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Descuentos</h1>
              <p className="text-muted-foreground">Gestión de promociones y descuentos</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Descuento
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Descuentos Activos</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Promociones vigentes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ahorro Total</CardTitle>
                <Percent className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">€2,450</div>
                <p className="text-xs text-muted-foreground">Este mes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usos este Mes</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">34</div>
                <p className="text-xs text-muted-foreground">+15% vs mes anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Por Vencer</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">3</div>
                <p className="text-xs text-muted-foreground">Próximos 7 días</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Buscar Descuentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input placeholder="Buscar por código, nombre o descripción..." />
                </div>
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Discounts List */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Descuentos</CardTitle>
              <CardDescription>Todas las promociones y descuentos configurados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    codigo: "BODA2025",
                    nombre: "Descuento Bodas",
                    tipo: "Porcentaje",
                    valor: "15%",
                    validoHasta: "2025-12-31",
                    usos: 12,
                    estado: "activo",
                  },
                  {
                    codigo: "CLIENTE10",
                    nombre: "Cliente Frecuente",
                    tipo: "Porcentaje",
                    valor: "10%",
                    validoHasta: "2025-06-30",
                    usos: 8,
                    estado: "activo",
                  },
                  {
                    codigo: "VERANO50",
                    nombre: "Promoción Verano",
                    tipo: "Fijo",
                    valor: "€50",
                    validoHasta: "2025-08-31",
                    usos: 15,
                    estado: "activo",
                  },
                  {
                    codigo: "PRIMERA",
                    nombre: "Primera Compra",
                    tipo: "Porcentaje",
                    valor: "20%",
                    validoHasta: "2025-12-31",
                    usos: 5,
                    estado: "activo",
                  },
                  {
                    codigo: "NAVIDAD",
                    nombre: "Especial Navidad",
                    tipo: "Porcentaje",
                    valor: "25%",
                    validoHasta: "2024-12-31",
                    usos: 0,
                    estado: "expirado",
                  },
                ].map((descuento, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Percent className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">{descuento.nombre}</h3>
                        <p className="text-sm text-muted-foreground">
                          Código: {descuento.codigo} | {descuento.tipo}: {descuento.valor}
                        </p>
                        <p className="text-xs text-muted-foreground">Válido hasta: {descuento.validoHasta}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{descuento.usos}</p>
                        <p className="text-sm text-muted-foreground">Usos</p>
                      </div>
                      <Badge
                        variant={
                          descuento.estado === "activo"
                            ? "default"
                            : descuento.estado === "expirado"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {descuento.estado === "activo"
                          ? "Activo"
                          : descuento.estado === "expirado"
                            ? "Expirado"
                            : "Pausado"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
