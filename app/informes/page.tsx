import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, FileText, Download, TrendingUp, DollarSign, Package, Users } from "lucide-react"

export default function InformesPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Informes</h1>
              <p className="text-muted-foreground">Análisis y reportes del negocio</p>
            </div>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Exportar Informe
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€12,450</div>
                <p className="text-xs text-muted-foreground">+18% vs mes anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos Completados</CardTitle>
                <Package className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">89</div>
                <p className="text-xs text-muted-foreground">+12% vs mes anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">15</div>
                <p className="text-xs text-muted-foreground">+25% vs mes anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasa de Ocupación</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">78%</div>
                <p className="text-xs text-muted-foreground">+5% vs mes anterior</p>
              </CardContent>
            </Card>
          </div>

          {/* Report Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros de Informe</CardTitle>
              <CardDescription>Selecciona el período y tipo de informe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Período</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="este-mes">Este mes</SelectItem>
                      <SelectItem value="mes-anterior">Mes anterior</SelectItem>
                      <SelectItem value="trimestre">Último trimestre</SelectItem>
                      <SelectItem value="año">Este año</SelectItem>
                      <SelectItem value="personalizado">Período personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Informe</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ventas">Ventas e Ingresos</SelectItem>
                      <SelectItem value="inventario">Inventario</SelectItem>
                      <SelectItem value="clientes">Clientes</SelectItem>
                      <SelectItem value="productos">Productos más alquilados</SelectItem>
                      <SelectItem value="completo">Informe completo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <BarChart className="w-4 h-4 mr-2" />
                    Generar Informe
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informes Rápidos</CardTitle>
                <CardDescription>Reportes predefinidos más utilizados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { nombre: "Resumen Mensual", descripcion: "Ingresos, pedidos y clientes del mes", icono: FileText },
                  { nombre: "Productos Top", descripcion: "Artículos más alquilados", icono: TrendingUp },
                  { nombre: "Análisis de Clientes", descripcion: "Comportamiento y preferencias", icono: Users },
                  { nombre: "Estado de Inventario", descripcion: "Stock y disponibilidad", icono: Package },
                ].map((informe, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <informe.icono className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{informe.nombre}</h4>
                        <p className="text-sm text-muted-foreground">{informe.descripcion}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Generar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gráfico de Ingresos</CardTitle>
                <CardDescription>Evolución de ingresos en los últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <BarChart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Gráfico de ingresos</p>
                    <p className="text-sm text-muted-foreground">Los datos se cargarán aquí</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
