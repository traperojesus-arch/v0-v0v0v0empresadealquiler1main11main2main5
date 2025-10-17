import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Package, AlertTriangle, TrendingUp } from "lucide-react"

export default function InventarioPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
              <p className="text-muted-foreground">Gestión y control de stock de artículos</p>
            </div>
            <Button>
              <Package className="w-4 h-4 mr-2" />
              Actualizar Stock
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Artículos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">142</div>
                <p className="text-xs text-muted-foreground">91% del inventario</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Alquiler</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">14</div>
                <p className="text-xs text-muted-foreground">9% del inventario</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">3</div>
                <p className="text-xs text-muted-foreground">Requieren atención</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Buscar en Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input placeholder="Buscar por nombre, código o categoría..." />
                </div>
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Inventory List */}
          <Card>
            <CardHeader>
              <CardTitle>Artículos en Inventario</CardTitle>
              <CardDescription>Lista completa de artículos con estado de stock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    nombre: "Mesa Redonda Madera",
                    codigo: "MES001",
                    categoria: "Mobiliario",
                    stock: 8,
                    disponible: 6,
                    estado: "normal",
                  },
                  {
                    nombre: "Silla Chiavari Dorada",
                    codigo: "SIL001",
                    categoria: "Mobiliario",
                    stock: 50,
                    disponible: 45,
                    estado: "normal",
                  },
                  {
                    nombre: "Foco LED Profesional",
                    codigo: "ILU001",
                    categoria: "Iluminación",
                    stock: 12,
                    disponible: 10,
                    estado: "normal",
                  },
                  {
                    nombre: "Equipo de Sonido",
                    codigo: "SON001",
                    categoria: "Audio",
                    stock: 3,
                    disponible: 1,
                    estado: "bajo",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.nombre}</h3>
                        <p className="text-sm text-muted-foreground">
                          Código: {item.codigo} | {item.categoria}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          {item.disponible}/{item.stock}
                        </p>
                        <p className="text-sm text-muted-foreground">Disponible/Total</p>
                      </div>
                      <Badge variant={item.estado === "bajo" ? "destructive" : "secondary"}>
                        {item.estado === "bajo" ? "Stock Bajo" : "Normal"}
                      </Badge>
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
