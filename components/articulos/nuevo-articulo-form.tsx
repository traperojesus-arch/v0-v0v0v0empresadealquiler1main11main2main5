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
import { X, Plus, Minus, Camera, Eye, Star, Upload, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { createArticulo } from "@/app/actions/articulos-actions"
import { uploadImage } from "@/app/actions/upload-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ProveedorCombobox } from "@/components/proveedor-combobox"
import { PostalCodeInput } from "@/components/postal-code-input"
import { articuloSchema } from "@/lib/validations/articulo-schema"
import { z } from "zod"

interface ImageFile {
  file: File
  url: string
  name: string
  size: number
  uploaded?: boolean
  uploadedUrl?: string
}

interface ValidationErrors {
  nombre?: string
  categoria?: string
  cantidad?: string
  precios?: string
  general?: string
}

export function NuevoArticuloForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})

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

  const [direccion, setDireccion] = useState("")
  const [poblacion, setPoblacion] = useState("")
  const [codigoPostal, setCodigoPostal] = useState("")
  const [transporte, setTransporte] = useState("")
  const [horarioDesde, setHorarioDesde] = useState("")
  const [horarioHasta, setHorarioHasta] = useState("")

  const [precios, setPrecios] = useState({
    metro: { activo: false, valor: 0 },
    hora: { activo: false, valor: 0 },
    dia: { activo: true, valor: 0 },
    diaCalendario: { activo: false, valor: 0 },
    noche: { activo: false, valor: 0 },
  })

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    try {
      articuloSchema.parse({
        nombre,
        categoria,
        subtitulo,
        descripcion,
        cantidad,
        costeCompra,
        fechaCompra,
        proveedor,
        precios,
        imagenes,
      })
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          const path = err.path.join(".")
          if (path.startsWith("precios")) {
            newErrors.precios = err.message
          } else {
            newErrors[path as keyof ValidationErrors] = err.message
          }
        })
      }
      setErrors(newErrors)
      return false
    }
  }

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
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} excede el tamaño máximo de 10MB`)
          return
        }

        const url = URL.createObjectURL(file)
        nuevasImagenes.push({
          file,
          url,
          name: file.name,
          size: file.size,
          uploaded: false,
        })
      }
    })

    if (imagenes.length + nuevasImagenes.length > 10) {
      toast.error("Máximo 10 imágenes permitidas")
      return
    }

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

  const subirImagenes = async () => {
    const imagenesNoSubidas = imagenes.filter((img) => !img.uploaded)
    if (imagenesNoSubidas.length === 0) return []

    setUploadingImages(true)
    const urlsSubidas: string[] = []

    try {
      for (const imagen of imagenesNoSubidas) {
        const formData = new FormData()
        formData.append("file", imagen.file)

        const result = await uploadImage(formData)
        if (result.success && result.url) {
          urlsSubidas.push(result.url)
          setImagenes((prev) =>
            prev.map((img) => (img.url === imagen.url ? { ...img, uploaded: true, uploadedUrl: result.url } : img)),
          )
        } else {
          console.error("[v0] Error subiendo imagen:", result.error)
          toast.error(`Error subiendo ${imagen.name}`)
        }
      }
    } finally {
      setUploadingImages(false)
    }

    return urlsSubidas
  }

  const handleCrearArticulo = async () => {
    console.log("[v0] Validando formulario...")

    if (!validateForm()) {
      toast.error("Por favor, completa todos los campos requeridos correctamente")
      return
    }

    setIsLoading(true)

    try {
      let urlsImagenes: string[] = []
      if (imagenes.length > 0) {
        toast.info("Subiendo imágenes...")
        urlsImagenes = await subirImagenes()

        if (imagenPrincipal > 0 && urlsImagenes.length > imagenPrincipal) {
          const principal = urlsImagenes[imagenPrincipal]
          urlsImagenes.splice(imagenPrincipal, 1)
          urlsImagenes.unshift(principal)
        }
      }

      const precioActivo = Object.entries(precios).find(([_, config]) => config.activo && config.valor > 0)
      const precioDia = precioActivo ? precioActivo[1].valor : 0

      const result = await createArticulo({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || subtitulo.trim(),
        categoria,
        precio_alquiler: precioDia,
        cantidad_disponible: cantidad,
        cantidad_total: cantidad,
        estado: "disponible",
        imagen_url: urlsImagenes.length > 0 ? urlsImagenes[0] : undefined,
        imagenes: urlsImagenes,
        coste_compra: costeCompra > 0 ? costeCompra : undefined,
        fecha_compra: fechaCompra || undefined,
        proveedor: proveedor || undefined,
        entidades: entidades.length > 0 ? entidades : undefined,
      })

      if (result.success) {
        console.log("[v0] Artículo creado exitosamente:", result.data)

        if (entidades.length > 0) {
          toast.success(`${nombre} creado con ${entidades.length} unidades individuales`)
        } else {
          toast.success(`${nombre} ha sido creado exitosamente`)
        }

        router.push("/articulos")
        router.refresh()
      } else {
        throw new Error(result.error || "Error al crear artículo")
      }
    } catch (error) {
      console.error("[v0] Error al crear artículo:", error)
      toast.error("No se pudo crear el artículo. Por favor, intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Por favor, corrige los errores en el formulario antes de continuar.</AlertDescription>
        </Alert>
      )}

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
                  <Label htmlFor="nombre">
                    Nombre del Artículo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    placeholder="Ej: Mesa Redonda 150cm"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value)
                      const nuevoPrefijo = generarPrefijoAutomatico(e.target.value)
                      setPrefijo(nuevoPrefijo)
                      if (errors.nombre) {
                        setErrors({ ...errors, nombre: undefined })
                      }
                    }}
                    className={cn(errors.nombre && "border-destructive")}
                    required
                  />
                  {errors.nombre && <p className="text-sm text-destructive">{errors.nombre}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">
                    Categoría <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={categoria}
                    onValueChange={(value) => {
                      setCategoria(value)
                      if (errors.categoria) {
                        setErrors({ ...errors, categoria: undefined })
                      }
                    }}
                    required
                  >
                    <SelectTrigger className={cn(errors.categoria && "border-destructive")}>
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
                  {errors.categoria && <p className="text-sm text-destructive">{errors.categoria}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitulo">Subtítulo</Label>
                <Input
                  id="subtitulo"
                  placeholder="Descripción breve del artículo"
                  value={subtitulo}
                  onChange={(e) => setSubtitulo(e.target.value)}
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground">{subtitulo.length}/300 caracteres</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Descripción detallada del artículo..."
                  rows={4}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground">{descripcion.length}/1000 caracteres</p>
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
                        disabled={isLoading || imagenes.length >= 10}
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

                            {imagen.uploaded && (
                              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                                <Upload className="w-3 h-3 text-white" />
                              </div>
                            )}

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
                <ProveedorCombobox value={proveedor} onValueChange={setProveedor} />
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
              <CardTitle>
                Configuración de Precios <span className="text-destructive">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {errors.precios && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.precios}</AlertDescription>
                </Alert>
              )}

              {Object.entries(precios).map(([tipo, config]) => (
                <div key={tipo} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={config.activo}
                      onCheckedChange={(checked) => {
                        setPrecios({
                          ...precios,
                          [tipo]: { ...config, activo: checked },
                        })
                        if (errors.precios) {
                          setErrors({ ...errors, precios: undefined })
                        }
                      }}
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
                        onChange={(e) => {
                          setPrecios({
                            ...precios,
                            [tipo]: { ...config, valor: Number.parseFloat(e.target.value) || 0 },
                          })
                          if (errors.precios) {
                            setErrors({ ...errors, precios: undefined })
                          }
                        }}
                        className="w-24"
                        required
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
              <p className="text-sm text-muted-foreground">
                Genera códigos únicos para cada unidad y realiza un seguimiento individual de rentabilidad
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cantidad">
                    Cantidad Total <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCantidad(Math.max(1, cantidad - 1))
                        if (errors.cantidad) {
                          setErrors({ ...errors, cantidad: undefined })
                        }
                      }}
                      disabled={isLoading}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="cantidad"
                      type="number"
                      min="1"
                      max="1000"
                      value={cantidad}
                      onChange={(e) => {
                        setCantidad(Number.parseInt(e.target.value) || 1)
                        if (errors.cantidad) {
                          setErrors({ ...errors, cantidad: undefined })
                        }
                      }}
                      className={cn("text-center", errors.cantidad && "border-destructive")}
                      required
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCantidad(cantidad + 1)
                        if (errors.cantidad) {
                          setErrors({ ...errors, cantidad: undefined })
                        }
                      }}
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.cantidad && <p className="text-sm text-destructive">{errors.cantidad}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prefijo">Prefijo de Código</Label>
                  <Input
                    id="prefijo"
                    value={prefijo}
                    onChange={(e) => setPrefijo(e.target.value.toUpperCase())}
                    placeholder="Ej: MESA"
                    maxLength={10}
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
                  <div className="flex items-center justify-between">
                    <Label>Códigos Únicos Generados ({entidades.length})</Label>
                    <Badge variant="outline" className="text-xs">
                      Cada unidad se puede alquilar y rastrear individualmente
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-4 border rounded-lg bg-muted/50">
                    {entidades.map((codigo, index) => (
                      <Badge key={index} variant="secondary" className="justify-center">
                        {codigo}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Estos códigos se crearán como entidades individuales para seguimiento de rentabilidad por unidad
                  </p>
                </div>
              )}

              {entidades.length === 0 && cantidad > 1 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Genera códigos únicos para crear {cantidad} entidades individuales y poder rastrear la rentabilidad
                    de cada unidad
                  </AlertDescription>
                </Alert>
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
                  <Input
                    id="direccion"
                    placeholder="Calle y número"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poblacion">Población</Label>
                  <Input
                    id="poblacion"
                    placeholder="Ciudad o pueblo"
                    value={poblacion}
                    onChange={(e) => setPoblacion(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo-postal">Código Postal</Label>
                  <PostalCodeInput
                    value={codigoPostal}
                    onChange={setCodigoPostal}
                    onCityChange={(city) => {
                      setPoblacion(city)
                      toast.success(`Población actualizada: ${city}`)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transporte">Medio de Transporte</Label>
                  <Select value={transporte} onValueChange={setTransporte}>
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
                  <Input
                    id="horario-desde"
                    type="time"
                    value={horarioDesde}
                    onChange={(e) => setHorarioDesde(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horario-hasta">Horario Hasta</Label>
                  <Input
                    id="horario-hasta"
                    type="time"
                    value={horarioHasta}
                    onChange={(e) => setHorarioHasta(e.target.value)}
                  />
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
        <Button onClick={handleCrearArticulo} disabled={isLoading || uploadingImages}>
          {isLoading ? "Creando..." : uploadingImages ? "Subiendo imágenes..." : "Crear Artículo"}
        </Button>
      </div>
    </div>
  )
}
