"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Minus, Camera, Eye, Star } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { createArticulo } from "@/app/actions/articulos-actions"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface ImageFile {
  file: File
  url: string
  name: string
  size: number
}

export function NuevoArticuloForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [nombre, setNombre] = useState("")
  const [categoria, setCategoria] = useState("")
  const [subtitulo, setSubtitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")

  const [imagenes, setImagenes] = useState<ImageFile[]>([])
  const [imagenPrincipal, setImagenPrincipal] = useState<number>(0)
  const [cantidad, setCantidad] = useState(1)
  const [entidades, setEntidades] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [prefijo, setPrefijo] = useState("ART")
  const [costeCompra, setCosteCompra] = useState(0)
  const [fechaCompra, setFechaCompra] = useState("")
  const [proveedor, setProveedor] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [precios, setPrecios] = useState({
    metro: { activo: false, valor: 0 },
    hora: { activo: false, valor: 0 },
    dia: { activo: true, valor: 0 },
    diaCalendario: { activo: false, valor: 0 },
    noche: { activo: false, valor: 0 },
  })

  const generarCodigosUnicos = (cantidad: number, prefijo: string) => {
    const nuevasEntidades = []
    for (let i = 1; i <= cantidad; i++) {
      nuevasEntidades.push(`${prefijo}-${String(i).padStart(3, "0")}`)
    }
    setEntidades(nuevasEntidades)
  }

  const generarPrefijoAutomatico = (nombre: string) => {
    if (!nombre) return "ART"

    const palabras = nombre.toUpperCase().split(" ")
    if (palabras.length >= 2) {
      return palabras
        .slice(0, 2)
        .map((p) => p.substring(0, 2))
        .join("")
    }
    return palabras[0].substring(0, 3) || "ART"
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    const nuevasImagenes: ImageFile[] = []

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file)
        nuevasImagenes.push({
          file,
          url,
          name: file.name,
          size: file.size,
        })
      }
    })

    setImagenes((prev) => [...prev, ...nuevasImagenes])

    if (imagenes.length === 0 && nuevasImagenes.length > 0) {
      setImagenPrincipal(0)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    handleImageUpload(files)
  }

  const eliminarImagen = (index: number) => {
    const imagenAEliminar = imagenes[index]
    URL.revokeObjectURL(imagenAEliminar.url)

    const nuevasImagenes = imagenes.filter((_, i) => i !== index)
    setImagenes(nuevasImagenes)

    if (imagenPrincipal === index) {
      setImagenPrincipal(0)
    } else if (imagenPrincipal > index) {
      setImagenPrincipal(imagenPrincipal - 1)
    }
  }

  const establecerImagenPrincipal = (index: number) => {
    setImagenPrincipal(index)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleCrearArticulo = async () => {
    console.log("[v0] Creando artículo...")

    // Validar campos requeridos
    if (!nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre del artículo es requerido",
        variant: "destructive",
      })
      return
    }

    if (!categoria) {
      toast({
        title: "Error",
        description: "La categoría es requerida",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Obtener el precio activo
      const precioActivo = Object.entries(precios).find(([_, config]) => config.activo)
      const precioDia = precioActivo ? precioActivo[1].valor : 0

      // Crear el artículo usando la acción del servidor
      const result = await createArticulo({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || subtitulo.trim(),
        categoria,
        precio_alquiler: precioDia,
        cantidad_disponible: cantidad,
        cantidad_total: cantidad,
        estado: "disponible",
        imagen_url: imagenes.length > 0 ? imagenes[imagenPrincipal].url : undefined,
      })

      if (result.success) {
        console.log("[v0] Artículo creado exitosamente:", result.data)

        toast({
          title: "Artículo creado",
          description: `${nombre} ha sido creado exitosamente`,
        })

        // Redirigir a la lista de artículos
        router.push("/articulos")
        router.refresh()
      } else {
        throw new Error(result.error || "Error al crear artículo")
      }
    } catch (error) {
      console.error("[v0] Error al crear artículo:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el artículo. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="compra">Compra</TabsTrigger>
          <TabsTrigger value="precios">Precios</TabsTrigger>
          <TabsTrigger value="cantidades">Cantidades</TabsTrigger>
          <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Artículo</Label>
                  <Input
                    id="nombre"
                    placeholder="Ej: Mesa Redonda 150cm"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value)
                      const nuevoPrefijo = generarPrefijoAutomatico(e.target.value)
                      setPrefijo(nuevoPrefijo)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select value={categoria} onValueChange={setCategoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mobiliario">Mobiliario</SelectItem>
                      <SelectItem value="iluminacion">Iluminación</SelectItem>
                      <SelectItem value="sonido">Sonido</SelectItem>
                      <SelectItem value="decoracion">Decoración</SelectItem>
                      <SelectItem value="catering">Catering</SelectItem>
                      <SelectItem value="tecnologia">Tecnología</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitulo">Subtítulo</Label>
                <Input
                  id="subtitulo"
                  placeholder="Descripción breve del artículo"
                  value={subtitulo}
                  onChange={(e) => setSubtitulo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Descripción detallada del artículo..."
                  rows={4}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Imágenes del Artículo</Label>

                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 transition-colors",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50",
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium">
                        {isDragging ? "Suelta las imágenes aquí" : "Arrastra imágenes aquí"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        o{" "}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-primary hover:underline font-medium"
                        >
                          selecciona archivos
                        </button>
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF hasta 10MB • Máximo 10 imágenes</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                    />
                  </div>
                </div>

                {imagenes.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {imagenes.length} imagen{imagenes.length !== 1 ? "es" : ""} cargada
                        {imagenes.length !== 1 ? "s" : ""}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar más
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {imagenes.map((imagen, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-muted hover:border-primary/50 transition-colors">
                            <img
                              src={imagen.url || "/placeholder.svg"}
                              alt={imagen.name}
                              className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <img
                                    src={imagen.url || "/placeholder.svg"}
                                    alt={imagen.name}
                                    className="w-full h-auto max-h-[70vh] object-contain"
                                  />
                                </DialogContent>
                              </Dialog>

                              <Button
                                size="sm"
                                variant={imagenPrincipal === index ? "default" : "secondary"}
                                className="h-8 w-8 p-0"
                                onClick={() => establecerImagenPrincipal(index)}
                              >
                                <Star className="h-4 w-4" />
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 w-8 p-0"
                                onClick={() => eliminarImagen(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            {imagenPrincipal === index && (
                              <Badge className="absolute top-2 left-2 text-xs bg-primary">
                                <Star className="w-3 h-3 mr-1" />
                                Principal
                              </Badge>
                            )}
                          </div>

                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-medium truncate" title={imagen.name}>
                              {imagen.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(imagen.size)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compra" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coste-compra">Coste de Compra (€)</Label>
                  <Input
                    id="coste-compra"
                    type="number"
                    step="0.01"
                    min="0"
                    value={costeCompra}
                    onChange={(e) => setCosteCompra(Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha-compra">Fecha de Compra</Label>
                  <Input
                    id="fecha-compra"
                    type="date"
                    value={fechaCompra}
                    onChange={(e) => setFechaCompra(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proveedor">Proveedor</Label>
                <Input
                  id="proveedor"
                  placeholder="Nombre del proveedor o tienda"
                  value={proveedor}
                  onChange={(e) => setProveedor(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Amortización Actual</p>
                    <p className="text-2xl font-bold text-green-600">€0.00</p>
                    <p className="text-xs text-muted-foreground">0 alquileres</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Rentabilidad</p>
                    <p className="text-2xl font-bold text-blue-600">0%</p>
                    <p className="text-xs text-muted-foreground">Coste recuperado</p>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="precios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Precios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(precios).map(([tipo, config]) => (
                <div key={tipo} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={config.activo}
                      onCheckedChange={(checked) =>
                        setPrecios({
                          ...precios,
                          [tipo]: { ...config, activo: checked },
                        })
                      }
                    />
                    <div>
                      <Label className="text-sm font-medium">
                        Por {tipo === "diaCalendario" ? "Día Calendario" : tipo}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {tipo === "metro" && "Precio por metro lineal o cuadrado"}
                        {tipo === "hora" && "Precio por hora de alquiler"}
                        {tipo === "dia" && "Precio por día (24 horas)"}
                        {tipo === "diaCalendario" && "Precio por día calendario"}
                        {tipo === "noche" && "Precio por noche"}
                      </p>
                    </div>
                  </div>
                  {config.activo && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">€</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={config.valor}
                        onChange={(e) =>
                          setPrecios({
                            ...precios,
                            [tipo]: { ...config, valor: Number.parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-24"
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cantidades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Cantidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cantidad">Cantidad Total</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      disabled={isLoading}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="cantidad"
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(e) => setCantidad(Number.parseInt(e.target.value) || 1)}
                      className="text-center"
                    />
                    <Button variant="outline" size="sm" onClick={() => setCantidad(cantidad + 1)} disabled={isLoading}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prefijo">Prefijo de Código</Label>
                  <Input
                    id="prefijo"
                    value={prefijo}
                    onChange={(e) => setPrefijo(e.target.value.toUpperCase())}
                    placeholder="Ej: MESA"
                  />
                  <p className="text-xs text-muted-foreground">Se genera automáticamente del nombre</p>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => generarCodigosUnicos(cantidad, prefijo)}
                    className="w-full"
                    disabled={isLoading}
                  >
                    Generar Códigos
                  </Button>
                </div>
              </div>

              {entidades.length > 0 && (
                <div className="space-y-2">
                  <Label>Códigos Únicos Generados</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-4 border rounded-lg bg-muted/50">
                    {entidades.map((codigo, index) => (
                      <Badge key={index} variant="secondary" className="justify-center">
                        {codigo}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ubicacion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ubicación de Servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" placeholder="Calle y número" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poblacion">Población</Label>
                  <Input id="poblacion" placeholder="Ciudad o pueblo" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo-postal">Código Postal</Label>
                  <Input id="codigo-postal" placeholder="28001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transporte">Medio de Transporte</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar transporte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="furgoneta">Furgoneta</SelectItem>
                      <SelectItem value="camion">Camión</SelectItem>
                      <SelectItem value="trailer">Tráiler</SelectItem>
                      <SelectItem value="cliente">Cliente recoge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horario-desde">Horario Desde</Label>
                  <Input id="horario-desde" type="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horario-hasta">Horario Hasta</Label>
                  <Input id="horario-hasta" type="time" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => router.push("/articulos")} disabled={isLoading}>
          Cancelar
        </Button>
        <Button variant="outline" disabled={isLoading}>
          Guardar como Borrador
        </Button>
        <Button onClick={handleCrearArticulo} disabled={isLoading}>
          {isLoading ? "Creando..." : "Crear Artículo"}
        </Button>
      </div>
    </div>
  )
}
