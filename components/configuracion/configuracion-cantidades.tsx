"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ConfiguracionCantidades() {
  const [categorias, setCategorias] = useState([
    { id: 1, nombre: "Mobiliario", descripcion: "Mesas, sillas, sofás", color: "blue" },
    { id: 2, nombre: "Iluminación", descripcion: "Focos, lámparas, proyectores", color: "yellow" },
    { id: 3, nombre: "Sonido", descripcion: "Altavoces, micrófonos, equipos", color: "green" },
    { id: 4, nombre: "Decoración", descripcion: "Flores, centros, ornamentos", color: "pink" },
    { id: 5, nombre: "Catering", descripcion: "Vajilla, cristalería, mantelería", color: "purple" },
    { id: 6, nombre: "Tecnología", descripcion: "Pantallas, ordenadores, cables", color: "gray" },
  ])

  const [unidadesMedida, setUnidadesMedida] = useState([
    { id: 1, nombre: "Unidad", abreviacion: "ud", tipo: "cantidad" },
    { id: 2, nombre: "Metro", abreviacion: "m", tipo: "longitud" },
    { id: 3, nombre: "Metro Cuadrado", abreviacion: "m²", tipo: "superficie" },
    { id: 4, nombre: "Kilogramo", abreviacion: "kg", tipo: "peso" },
    { id: 5, nombre: "Litro", abreviacion: "l", tipo: "volumen" },
  ])

  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false)
  const [isNewUnitOpen, setIsNewUnitOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)

  const agregarCategoria = (nuevaCategoria: any) => {
    setCategorias([...categorias, { ...nuevaCategoria, id: Date.now() }])
    setIsNewCategoryOpen(false)
  }

  const eliminarCategoria = (id: number) => {
    setCategorias(categorias.filter((cat) => cat.id !== id))
  }

  const agregarUnidad = (nuevaUnidad: any) => {
    setUnidadesMedida([...unidadesMedida, { ...nuevaUnidad, id: Date.now() }])
    setIsNewUnitOpen(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Categorías de Artículos
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Gestiona las categorías para organizar tus artículos de alquiler
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${categoria.color}-500`}></div>
                    <h3 className="font-medium">{categoria.nombre}</h3>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setEditingCategory(categoria)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive"
                      onClick={() => eliminarCategoria(categoria.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{categoria.descripcion}</p>
              </div>
            ))}
          </div>

          <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Nueva Categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva Categoría</DialogTitle>
                <DialogDescription>Crea una nueva categoría para organizar tus artículos</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre-categoria">Nombre</Label>
                  <Input id="nombre-categoria" placeholder="Ej: Mobiliario" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion-categoria">Descripción</Label>
                  <Input id="descripcion-categoria" placeholder="Ej: Mesas, sillas, sofás" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color-categoria">Color</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Azul</SelectItem>
                      <SelectItem value="green">Verde</SelectItem>
                      <SelectItem value="yellow">Amarillo</SelectItem>
                      <SelectItem value="red">Rojo</SelectItem>
                      <SelectItem value="purple">Morado</SelectItem>
                      <SelectItem value="pink">Rosa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      agregarCategoria({ nombre: "Nueva Categoría", descripcion: "Descripción", color: "blue" })
                    }
                    className="flex-1"
                  >
                    Crear Categoría
                  </Button>
                  <Button variant="outline" onClick={() => setIsNewCategoryOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unidades de Medida</CardTitle>
          <p className="text-sm text-muted-foreground">
            Define las unidades de medida para las cantidades de tus artículos
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unidadesMedida.map((unidad) => (
              <div key={unidad.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{unidad.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    {unidad.abreviacion} • {unidad.tipo}
                  </p>
                </div>
                <Badge variant="secondary">{unidad.abreviacion}</Badge>
              </div>
            ))}
          </div>

          <Dialog open={isNewUnitOpen} onOpenChange={setIsNewUnitOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Nueva Unidad
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva Unidad de Medida</DialogTitle>
                <DialogDescription>Define una nueva unidad para medir cantidades</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre-unidad">Nombre</Label>
                  <Input id="nombre-unidad" placeholder="Ej: Metro Cúbico" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abreviacion-unidad">Abreviación</Label>
                  <Input id="abreviacion-unidad" placeholder="Ej: m³" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo-unidad">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cantidad">Cantidad</SelectItem>
                      <SelectItem value="longitud">Longitud</SelectItem>
                      <SelectItem value="superficie">Superficie</SelectItem>
                      <SelectItem value="volumen">Volumen</SelectItem>
                      <SelectItem value="peso">Peso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => agregarUnidad({ nombre: "Nueva Unidad", abreviacion: "nu", tipo: "cantidad" })}
                    className="flex-1"
                  >
                    Crear Unidad
                  </Button>
                  <Button variant="outline" onClick={() => setIsNewUnitOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Guardar Configuración</Button>
      </div>
    </div>
  )
}
