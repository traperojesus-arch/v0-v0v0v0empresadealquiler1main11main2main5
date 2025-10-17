"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlbaranesList } from "./albaranes-list"
import { FacturasList } from "./facturas-list"

export function FacturacionTabs() {
  return (
    <Tabs defaultValue="facturas" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="facturas">Facturas</TabsTrigger>
        <TabsTrigger value="albaranes">Albaranes</TabsTrigger>
      </TabsList>
      <TabsContent value="facturas" className="mt-6">
        <FacturasList />
      </TabsContent>
      <TabsContent value="albaranes" className="mt-6">
        <AlbaranesList />
      </TabsContent>
    </Tabs>
  )
}
