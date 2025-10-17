import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, History, TrendingUp, Package, Calendar, User } from "lucide-react"
import Link from "next/link"

export default function ArticuloDetallePage({ params }: { params: { id: string } }) {
  // Datos de ejemplo - en producción vendrían de la base de datos
  const articulo = {
    id: params.id,
    nombre: "Mesa Redonda Madera",
    codigo: "MESA-001",
    categoria: "Mobiliario",
    descripcion: "Mesa redonda de madera maciza para eventos",
    costeCompra: 450.0,
    fechaCompra: "2024-01-15",
    proveedor: "Muebles García S.L.",
    amortizacionTotal: 1250.0,
    vecesAlquilado: 15,
    rentabilidad: 177.8,
    estado: "disponible",
    imagen: "/mesa-redonda-madera.jpg",
  }

  const historial = [
    {
      id: 1,
      fecha: "2024-12-20",
      tipo: "alquiler_fin",
      descripcion: "Alquiler completado - Boda García-López",
      cliente: "María García",
      importe: 85.0,
      estado: "Completado",
    },
    {
      id: 2,
      fecha: "2024-12-15",
      tipo: "alquiler_inicio",
      descripcion: "Alquiler iniciado - Boda García-López",
      cliente: "María García",
      importe: 0,
      estado: "En servicio",
    },
    {
      id: 3,
      fecha: "2024-12-01",
      tipo: "mantenimiento",
      descripcion: "Limpieza y barnizado",
      cliente: "-",
      importe: -25.0,
      estado: "Mantenimiento",
    },
    {
      id: 4,
      fecha: "2024-11-28",
      tipo: "alquiler_fin",
      descripción: "Alquiler completado - Evento Corporativo",
      cliente: "Empresa XYZ",
      importe: 120.0,
      estado: "Completado",
    },
    {
      id: 5,
      fecha: "2024-01-15",
      tipo: "compra",
      descripcion: "Compra inicial del artículo",
      cliente: "-",
      importe: -450.0,
      estado: "Adquirido",
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/articulos">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{articulo.nombre}</h1>
              <p className="text-muted-foreground">
                Código: {articulo.codigo} | {articulo.categoria}
              </p>
            </div>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información Principal */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información del Artículo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={articulo.imagen || "/placeholder.svg"}
                      alt={articulo.nombre}
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <div className="flex-1 space-y-2">
                      <p className="text-sm text-muted-foreground">{articulo.descripcion}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={articulo.estado === "disponible" ? "default" : "secondary"}>
                          {articulo.estado === "disponible" ? "Disponible" : "En uso"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="historial" className="w-full">
                <TabsList>
                  <TabsTrigger value="historial">
                    <History className="w-4 h-4 mr-2" />
                    Historial Completo
                  </TabsTrigger>
                  <TabsTrigger value="alquileres">
                    <Calendar className="w-4 h-4 mr-2" />
                    Alquileres
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="historial" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Historial Completo</CardTitle>
                      <CardDescription>Todos los eventos desde la compra del artículo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {historial.map((evento) => (
                          <div key={evento.id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{evento.descripcion}</h4>
                                <span className="text-sm text-muted-foreground">{evento.fecha}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {evento.cliente !== "-" && (
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {evento.cliente}
                                  </div>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {evento.tipo.replace("_", " ")}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-medium ${evento.importe > 0 ? "text-green-600" : evento.importe < 0 ? "text-red-600" : "text-muted-foreground"}`}
                              >
                                {evento.importe !== 0 ? `€${Math.abs(evento.importe).toFixed(2)}` : "-"}
                              </p>
                              <p className="text-xs text-muted-foreground">{evento.estado}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="alquileres" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Historial de Alquileres</CardTitle>
                      <CardDescription>Solo eventos de alquiler completados</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {historial
                          .filter((h) => h.tipo === "alquiler_fin")
                          .map((alquiler) => (
                            <div key={alquiler.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-4">
                                <Calendar className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <h4 className="font-medium">{alquiler.descripcion}</h4>
                                  <p className="text-sm text-muted-foreground">Cliente: {alquiler.cliente}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-green-600">€{alquiler.importe.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">{alquiler.fecha}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Panel Lateral */}
            <div className="space-y-6">
              {/* Estadísticas Financieras */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Análisis Financiero
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Coste de Compra</span>
                      <span className="font-medium text-red-600">€{articulo.costeCompra.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Amortización Total</span>
                      <span className="font-medium text-green-600">€{articulo.amortizacionTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Rentabilidad</span>
                      <span className="font-medium text-blue-600">{articulo.rentabilidad.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Veces Alquilado</span>
                      <span className="font-medium">{articulo.vecesAlquilado}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Beneficio Neto</span>
                      <span className="font-bold text-green-600">
                        €{(articulo.amortizacionTotal - articulo.costeCompra).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información de Compra */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Información de Compra
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de Compra</p>
                    <p className="font-medium">{articulo.fechaCompra}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Proveedor</p>
                    <p className="font-medium">{articulo.proveedor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Días en Inventario</p>
                    <p className="font-medium">
                      {Math.floor(
                        (new Date().getTime() - new Date(articulo.fechaCompra).getTime()) / (1000 * 60 * 60 * 24),
                      )}{" "}
                      días
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
