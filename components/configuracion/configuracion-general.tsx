import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ConfiguracionGeneral() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información de la Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre-empresa">Nombre de la Empresa</Label>
              <Input id="nombre-empresa" placeholder="RentPro" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cif">CIF/NIF</Label>
              <Input id="cif" placeholder="B12345678" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input id="direccion" placeholder="Calle Principal 123" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input id="ciudad" placeholder="Madrid" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo-postal">Código Postal</Label>
              <Input id="codigo-postal" placeholder="28001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pais">País</Label>
              <Select defaultValue="espana">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="espana">España</SelectItem>
                  <SelectItem value="francia">Francia</SelectItem>
                  <SelectItem value="portugal">Portugal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Facturación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="iva">IVA por defecto (%)</Label>
              <Input id="iva" type="number" placeholder="21" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moneda">Moneda</Label>
              <Select defaultValue="eur">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eur">Euro (€)</SelectItem>
                  <SelectItem value="usd">Dólar ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="terminos">Términos y Condiciones</Label>
            <Textarea id="terminos" placeholder="Términos y condiciones por defecto..." rows={4} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Guardar Configuración</Button>
      </div>
    </div>
  )
}
