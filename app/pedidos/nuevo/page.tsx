import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NuevoPedidoPage() {
  return (
    <div className="flex min-h-screen bg-background">
     <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Nuevo Pedido</h1>
              <p className="text-muted-foreground">Crear un nuevo pedido de alquiler</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información del Pedido</CardTitle>
              <CardDescription>Complete los datos del nuevo pedido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cliente1">María García</SelectItem>
                      <SelectItem value="cliente2">Juan Pérez</SelectItem>
                      <SelectItem value="cliente3">Ana López</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha-evento">Fecha del Evento</Label>
                  <Input type="date" id="fecha-evento" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hora-inicio">Hora de Inicio</Label>
                  <Input type="time" id="hora-inicio" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hora-fin">Hora de Fin</Label>
                  <Input type="time" id="hora-fin" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección del Evento</Label>
                <Input id="direccion" placeholder="Dirección completa del evento" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas">Notas Adicionales</Label>
                <Textarea id="notas" placeholder="Notas o instrucciones especiales" />
              </div>

              <div className="flex gap-4">
                <Button>Crear Pedido</Button>
                <Button variant="outline">Cancelar</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
