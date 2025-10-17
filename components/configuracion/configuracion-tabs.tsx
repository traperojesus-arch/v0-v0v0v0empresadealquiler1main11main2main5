"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HorariosOperacion } from "./horarios-operacion"
import { ConfiguracionGeneral } from "./configuracion-general"
import { ConfiguracionCantidades } from "./configuracion-cantidades"
import { ConfiguracionTransporte } from "./configuracion-transporte"
import { ConfiguracionUbicaciones } from "./configuracion-ubicaciones"

export function ConfiguracionTabs() {
  return (
    <Tabs defaultValue="horarios" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="horarios">Horarios</TabsTrigger>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="cantidades">Cantidades</TabsTrigger>
        <TabsTrigger value="transporte">Transporte</TabsTrigger>
        <TabsTrigger value="ubicaciones">Ubicaciones</TabsTrigger>
        <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
      </TabsList>

      <TabsContent value="horarios" className="space-y-6">
        <HorariosOperacion />
      </TabsContent>

      <TabsContent value="general" className="space-y-6">
        <ConfiguracionGeneral />
      </TabsContent>

      <TabsContent value="cantidades" className="space-y-6">
        <ConfiguracionCantidades />
      </TabsContent>

      <TabsContent value="transporte" className="space-y-6">
        <ConfiguracionTransporte />
      </TabsContent>

      <TabsContent value="ubicaciones" className="space-y-6">
        <ConfiguracionUbicaciones />
      </TabsContent>

      <TabsContent value="notificaciones" className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Configuración de notificaciones próximamente</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
