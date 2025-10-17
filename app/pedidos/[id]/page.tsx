import { getPedidoById } from "@/app/actions/pedidos-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, MapPin, Phone, Mail, Building2, Package } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

const estadoColors = {
  pendiente: "bg-yellow-500",
  confirmado: "bg-blue-500",
  en_preparacion: "bg-purple-500",
  entregado: "bg-green-500",
  completado: "bg-gray-500",
  cancelado: "bg-red-500",
}

const estadoLabels = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  en_preparacion: "En Preparación",
  entregado: "Entregado",
  completado: "Completado",
  cancelado: "Cancelado",
}

export default async function PedidoDetailPage({ params }: { params: { id: string } }) {
  const result = await getPedidoById(params.id)

  if (!result.success || !result.data) {
    notFound()
  }

  const pedido = result.data

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/pedidos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Pedido {pedido.numero_pedido || pedido.numeroPedido}</h1>
            <p className="text-muted-foreground">Detalles completos del pedido</p>
          </div>
        </div>
        <Badge className={estadoColors[pedido.estado as keyof typeof estadoColors]}>
          {estadoLabels[pedido.estado as keyof typeof estadoLabels]}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información del Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
            <CardDescription>Datos de contacto y ubicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{pedido.cliente_nombre || pedido.cliente}</p>
                {pedido.empresa && <p className="text-sm text-muted-foreground">{pedido.empresa}</p>}
              </div>
            </div>

            {pedido.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm">{pedido.email}</p>
              </div>
            )}

            {pedido.telefono && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm">{pedido.telefono}</p>
              </div>
            )}

            {(pedido.ubicacion || pedido.calle) && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  {pedido.ubicacion ? (
                    <p>{pedido.ubicacion}</p>
                  ) : (
                    <>
                      {pedido.calle && <p>{pedido.calle}</p>}
                      {(pedido.codigo_postal || pedido.ciudad) && (
                        <p className="text-muted-foreground">
                          {pedido.codigo_postal} {pedido.ciudad}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información de Fechas */}
        <Card>
          <CardHeader>
            <CardTitle>Fechas del Servicio</CardTitle>
            <CardDescription>Programación de entrega y recogida</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Fecha de Pedido</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(pedido.fecha_pedido || pedido.fecha_desde).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Fecha de Entrega</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(pedido.fecha_entrega || pedido.fecha_desde || pedido.fechaInicio).toLocaleDateString(
                    "es-ES",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Fecha de Recogida</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(pedido.fecha_recogida || pedido.fecha_hasta || pedido.fechaFin).toLocaleDateString(
                    "es-ES",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Artículos del Pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Artículos del Pedido
          </CardTitle>
          <CardDescription>Lista completa de artículos incluidos en este pedido</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pedido.articulos && pedido.articulos.length > 0 ? (
              <>
                {pedido.articulos.map((articulo: any, index: number) => (
                  <div key={index}>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex-1">
                        <p className="font-medium">{articulo.nombre}</p>
                        <p className="text-sm text-muted-foreground">
                          Cantidad: {articulo.cantidad} × {articulo.precio_unitario.toFixed(2)}€
                        </p>
                      </div>
                      <p className="font-semibold">{(articulo.cantidad * articulo.precio_unitario).toFixed(2)}€</p>
                    </div>
                    {index < pedido.articulos.length - 1 && <Separator />}
                  </div>
                ))}

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{(pedido.subtotal || pedido.total).toFixed(2)}€</span>
                  </div>
                  {pedido.iva && (
                    <div className="flex justify-between text-sm">
                      <span>IVA (21%)</span>
                      <span>{pedido.iva.toFixed(2)}€</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{pedido.total.toFixed(2)}€</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-8">No hay artículos en este pedido</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notas */}
      {pedido.notas && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{pedido.notas}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
