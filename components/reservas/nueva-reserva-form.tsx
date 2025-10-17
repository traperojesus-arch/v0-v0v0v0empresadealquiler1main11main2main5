"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { MapPin, User, Package, CreditCard, ArrowRight, ArrowLeft, Check, Search, X, Plus, Minus } from "lucide-react"
import { getArticulos } from "@/app/actions/articulos-actions"
import { getClientes } from "@/app/actions/clientes-actions"
import { createPedido } from "@/app/actions/pedidos-actions"
import { useRouter } from "next/navigation"

const pasos = [
  { id: 1, nombre: "Paso principal", descripcion: "Selección de artículos y fechas", icono: Package },
  { id: 2, nombre: "Extras", descripcion: "Servicios adicionales", icono: Package },
  { id: 3, nombre: "Envío y entrega", descripcion: "Configuración de logística", icono: MapPin },
  { id: 4, nombre: "Datos de contacto", descripcion: "Información del cliente", icono: User },
  { id: 5, nombre: "Pagos", descripcion: "Método de pago y facturación", icono: CreditCard },
]

type Articulo = {
  id: string
  nombre: string
  precio_por_dia?: number
  cantidad_total: number
  categoria?: string
  codigo?: string
  precio_dia?: number
  stock_disponible?: number
}

type Cliente = {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono?: string
  empresa?: string
  id_fiscal?: string
  calle?: string
  ciudad?: string
  codigo_postal?: string
  pais?: string
}

export function NuevaReservaForm() {
  const router = useRouter()
  const [pasoActual, setPasoActual] = useState(1)
  const [articulosSeleccionados, setArticulosSeleccionados] = useState<
    Array<{
      id: string
      nombre: string
      cantidad: number
      precio_unitario: number
    }>
  >([])

  const [formData, setFormData] = useState({
    fechaInicio: "",
    fechaFin: "",
    direccionEvento: "",
    calle: "",
    ciudad: "",
    codigoPostal: "",
    clienteId: "",
    notas: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    empresa: "",
    idFiscal: "",
    pais: "España",
  })

  const [cantidadTemp, setCantidadTemp] = useState<{ [key: string]: number }>({})

  const siguientePaso = () => {
    if (pasoActual < pasos.length) {
      setPasoActual(pasoActual + 1)
    }
  }

  const pasoAnterior = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1)
    }
  }

  const crearReserva = async () => {
    try {
      console.log("[v0] Creando reserva con artículos:", articulosSeleccionados)

      const direccionCompleta = `${formData.calle}, ${formData.codigoPostal} ${formData.ciudad}`
      const nombreCompleto = `${formData.nombre} ${formData.apellido}`.trim()

      const dias = Math.ceil(
        (new Date(formData.fechaFin).getTime() - new Date(formData.fechaInicio).getTime()) / (1000 * 60 * 60 * 24),
      )
      const total = articulosSeleccionados.reduce((sum, art) => sum + art.cantidad * art.precio_unitario * dias, 0)

      const resultado = await createPedido({
        cliente_id: formData.clienteId,
        cliente_nombre: nombreCompleto,
        empresa: formData.empresa,
        telefono: formData.telefono,
        email: formData.email,
        fecha_pedido: new Date().toISOString(),
        fecha_entrega: formData.fechaInicio,
        fecha_devolucion: formData.fechaFin,
        direccion_entrega: direccionCompleta,
        calle: formData.calle,
        codigo_postal: formData.codigoPostal,
        ciudad: formData.ciudad,
        estado: "pendiente",
        notas: formData.notas,
        articulos: articulosSeleccionados.map((art) => ({
          articulo_id: art.id,
          nombre: art.nombre,
          cantidad: art.cantidad,
          precio_unitario: art.precio_unitario,
        })),
        total: total,
      })

      if (resultado.success) {
        console.log("[v0] Reserva creada exitosamente:", resultado.data)
        router.push("/reservas")
      } else {
        console.error("[v0] Error al crear reserva:", resultado.error)
        alert("Error al crear la reserva: " + resultado.error)
      }
    } catch (error) {
      console.error("[v0] Error al crear reserva:", error)
      alert("Error al crear la reserva")
    }
  }

  return (
    <div className="max-w-6xl space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {pasos.map((paso, index) => (
              <div key={paso.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      paso.id < pasoActual
                        ? "bg-green-500 border-green-500 text-white"
                        : paso.id === pasoActual
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-background border-muted-foreground text-muted-foreground"
                    }`}
                  >
                    {paso.id < pasoActual ? <Check className="w-5 h-5" /> : <paso.icono className="w-5 h-5" />}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p
                      className={`text-sm font-medium ${
                        paso.id <= pasoActual ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {paso.nombre}
                    </p>
                    <p className="text-xs text-muted-foreground">{paso.descripcion}</p>
                  </div>
                </div>
                {index < pasos.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-muted-foreground mx-4 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {pasoActual === 1 && (
        <PasoPrincipal
          formData={formData}
          setFormData={setFormData}
          articulosSeleccionados={articulosSeleccionados}
          setArticulosSeleccionados={setArticulosSeleccionados}
          cantidadTemp={cantidadTemp}
          setCantidadTemp={setCantidadTemp}
        />
      )}
      {pasoActual === 2 && <PasoExtras />}
      {pasoActual === 3 && <PasoEnvioEntrega />}
      {pasoActual === 4 && <PasoDatosContacto formData={formData} setFormData={setFormData} />}
      {pasoActual === 5 && (
        <PasoPagos formData={formData} setFormData={setFormData} articulosSeleccionados={articulosSeleccionados} />
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={pasoAnterior} disabled={pasoActual === 1}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">Guardar Borrador</Button>
          {pasoActual < pasos.length ? (
            <Button onClick={siguientePaso}>
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={crearReserva}>Crear Reserva</Button>
          )}
        </div>
      </div>
    </div>
  )
}

function PasoPrincipal({
  formData,
  setFormData,
  articulosSeleccionados,
  setArticulosSeleccionados,
  cantidadTemp,
  setCantidadTemp,
}: {
  formData: any
  setFormData: any
  articulosSeleccionados: Array<{ id: string; nombre: string; cantidad: number; precio_unitario: number }>
  setArticulosSeleccionados: any
  cantidadTemp: any
  setCantidadTemp: any
}) {
  const [articulos, setArticulos] = useState<any[]>([])
  const [articulosFiltrados, setArticulosFiltrados] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarArticulos()
  }, [])

  useEffect(() => {
    if (busqueda.trim() === "") {
      setArticulosFiltrados(articulos)
    } else {
      const filtrados = articulos.filter(
        (art) =>
          art.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          art.categoria?.toLowerCase().includes(busqueda.toLowerCase()) ||
          art.codigo?.toLowerCase().includes(busqueda.toLowerCase()),
      )
      setArticulosFiltrados(filtrados)
    }
  }, [busqueda, articulos])

  const cargarArticulos = async () => {
    console.log("[v0] Cargando artículos...")
    setCargando(true)
    const resultado = await getArticulos()
    console.log("[v0] Resultado de getArticulos:", resultado)
    if (resultado.success && resultado.data) {
      console.log("[v0] Artículos cargados:", resultado.data.length)
      setArticulos(resultado.data)
      setArticulosFiltrados(resultado.data)
    } else {
      console.log("[v0] Error cargando artículos:", resultado.error)
    }
    setCargando(false)
  }

  const agregarArticulo = (articulo: any, cantidad: number) => {
    if (cantidad <= 0) return

    const existe = articulosSeleccionados.find((a) => a.id === articulo.id)
    if (existe) {
      setArticulosSeleccionados(
        articulosSeleccionados.map((a) => (a.id === articulo.id ? { ...a, cantidad: a.cantidad + cantidad } : a)),
      )
    } else {
      setArticulosSeleccionados([
        ...articulosSeleccionados,
        {
          id: articulo.id,
          nombre: articulo.nombre,
          cantidad: cantidad,
          precio_unitario: articulo.precio_dia || articulo.precio_por_dia || 0,
        },
      ])
    }
  }

  const quitarArticulo = (articuloId: string) => {
    setArticulosSeleccionados(articulosSeleccionados.filter((a) => a.id !== articuloId))
  }

  const actualizarCantidad = (articuloId: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      quitarArticulo(articuloId)
    } else {
      setArticulosSeleccionados(
        articulosSeleccionados.map((a) => (a.id === articuloId ? { ...a, cantidad: nuevaCantidad } : a)),
      )
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Fechas y Dirección del Evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha-inicio">Fecha de Inicio</Label>
              <Input
                id="fecha-inicio"
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha-fin">Fecha de Fin</Label>
              <Input
                id="fecha-fin"
                type="date"
                value={formData.fechaFin}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="calle">Calle y Número</Label>
            <Input
              id="calle"
              placeholder="Ej: Calle Mayor 123, 2º A"
              value={formData.calle}
              onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo-postal">Código Postal</Label>
              <Input
                id="codigo-postal"
                placeholder="28001"
                value={formData.codigoPostal}
                onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                placeholder="Madrid"
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selección de Artículos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar artículos por nombre, código o categoría..."
                className="pl-9"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {articulosSeleccionados.length > 0 && (
              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Artículos Seleccionados ({articulosSeleccionados.length})</h4>
                  <Badge variant="secondary">
                    {articulosSeleccionados.reduce((sum, a) => sum + a.cantidad, 0)} unidades
                  </Badge>
                </div>
                {articulosSeleccionados.map((articulo) => (
                  <div key={articulo.id} className="flex items-center justify-between p-2 bg-background rounded border">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{articulo.nombre}</p>
                      <p className="text-xs text-muted-foreground">€{articulo.precio_unitario}/día</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0 bg-transparent"
                        onClick={() => actualizarCantidad(articulo.id, articulo.cantidad - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{articulo.cantidad}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0 bg-transparent"
                        onClick={() => actualizarCantidad(articulo.id, articulo.cantidad + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive"
                        onClick={() => quitarArticulo(articulo.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Separator />

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cargando ? (
                <p className="text-center text-muted-foreground py-8">Cargando artículos...</p>
              ) : articulosFiltrados.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-2">
                    {articulos.length === 0
                      ? "No hay artículos disponibles"
                      : "No se encontraron artículos con ese criterio"}
                  </p>
                  {busqueda && (
                    <Button variant="outline" size="sm" onClick={() => setBusqueda("")}>
                      Limpiar búsqueda
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Mostrando {articulosFiltrados.length} de {articulos.length} artículos
                  </p>
                  {articulosFiltrados.map((articulo) => {
                    const seleccionado = articulosSeleccionados.find((a) => a.id === articulo.id)

                    return (
                      <div key={articulo.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{articulo.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            €{articulo.precio_por_dia || articulo.precio_dia || 0}/día
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {articulo.cantidad_total || articulo.stock_disponible || 0} disponibles
                            {seleccionado && ` (${seleccionado.cantidad} seleccionados)`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            max={articulo.cantidad_total || articulo.stock_disponible || 0}
                            className="w-20"
                            value={cantidadTemp[articulo.id] || 1}
                            onChange={(e) =>
                              setCantidadTemp({ ...cantidadTemp, [articulo.id]: Number.parseInt(e.target.value) || 1 })
                            }
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              agregarArticulo(articulo, cantidadTemp[articulo.id] || 1)
                              setCantidadTemp({ ...cantidadTemp, [articulo.id]: 1 })
                            }}
                          >
                            Agregar
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PasoExtras() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Servicios Adicionales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { nombre: "Montaje y Desmontaje", precio: 150, descripcion: "Servicio completo de instalación" },
            { nombre: "Limpieza Post-Evento", precio: 80, descripcion: "Limpieza después del evento" },
            { nombre: "Coordinador de Evento", precio: 200, descripcion: "Coordinador profesional durante el evento" },
            { nombre: "Seguro Premium", precio: 50, descripcion: "Cobertura adicional para el evento" },
          ].map((extra, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{extra.nombre}</p>
                <p className="text-sm text-muted-foreground">{extra.descripcion}</p>
                <p className="text-sm font-medium text-primary">€{extra.precio}</p>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PasoEnvioEntrega() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de Envío y Entrega</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="medio-transporte">Medio de Transporte</Label>
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
          <div className="space-y-2">
            <Label htmlFor="distancia">Distancia (km)</Label>
            <Input id="distancia" type="number" placeholder="Ej: 25" />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">Horario de Entrega</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hora-entrega-desde">Desde</Label>
                <Input id="hora-entrega-desde" type="time" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora-entrega-hasta">Hasta</Label>
                <Input id="hora-entrega-hasta" type="time" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Horario de Recogida</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hora-recogida-desde">Desde</Label>
                <Input id="hora-recogida-desde" type="time" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora-recogida-hasta">Hasta</Label>
                <Input id="hora-recogida-hasta" type="time" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="direccion-evento">Dirección del Evento</Label>
          <Textarea id="direccion-evento" placeholder="Dirección completa del evento..." rows={3} />
        </div>
      </CardContent>
    </Card>
  )
}

function PasoDatosContacto({ formData, setFormData }: { formData: any; setFormData: any }) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [busquedaCliente, setBusquedaCliente] = useState("")
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([])
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)

  useEffect(() => {
    cargarClientes()
  }, [])

  useEffect(() => {
    if (busquedaCliente.trim() === "") {
      setClientesFiltrados([])
    } else {
      const filtrados = clientes.filter(
        (cliente) =>
          cliente.nombre?.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
          cliente.apellido?.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
          cliente.email?.toLowerCase().includes(busquedaCliente.toLowerCase()),
      )
      setClientesFiltrados(filtrados)
    }
  }, [busquedaCliente, clientes])

  const cargarClientes = async () => {
    const resultado = await getClientes()
    if (resultado.success) {
      setClientes(resultado.data)
    }
  }

  const seleccionarCliente = (cliente: Cliente) => {
    setClienteSeleccionado(cliente)
    setBusquedaCliente(`${cliente.nombre} ${cliente.apellido || ""}`)
    setMostrarSugerencias(false)

    setFormData({
      ...formData,
      clienteId: cliente.id,
      nombre: cliente.nombre,
      apellido: cliente.apellido || "",
      email: cliente.email,
      telefono: cliente.telefono || "",
      empresa: cliente.empresa || "",
      idFiscal: cliente.id_fiscal || "",
      calle: cliente.calle || "",
      ciudad: cliente.ciudad || "",
      codigoPostal: cliente.codigo_postal || "",
      pais: cliente.pais || "España",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 relative">
          <Label htmlFor="buscar-cliente">Buscar Cliente Existente</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="buscar-cliente"
              placeholder="Buscar por nombre, apellido o email..."
              className="pl-9"
              value={busquedaCliente}
              onChange={(e) => {
                setBusquedaCliente(e.target.value)
                setMostrarSugerencias(true)
              }}
              onFocus={() => setMostrarSugerencias(true)}
            />
          </div>

          {mostrarSugerencias && clientesFiltrados.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {clientesFiltrados.map((cliente) => (
                <button
                  key={cliente.id}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b last:border-b-0"
                  onClick={() => seleccionarCliente(cliente)}
                >
                  <p className="font-medium">
                    {cliente.nombre} {cliente.apellido || ""}
                  </p>
                  <p className="text-sm text-muted-foreground">{cliente.email}</p>
                  {cliente.empresa && <p className="text-xs text-muted-foreground">{cliente.empresa}</p>}
                </button>
              ))}
            </div>
          )}
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Nombre del cliente"
              value={formData.nombre || ""}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              id="apellido"
              placeholder="Apellidos del cliente"
              value={formData.apellido || ""}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa</Label>
            <Input
              id="empresa"
              placeholder="Nombre de la empresa (opcional)"
              value={formData.empresa || ""}
              onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="id-fiscal">ID Fiscal</Label>
            <Input
              id="id-fiscal"
              placeholder="NIF/CIF"
              value={formData.idFiscal || ""}
              onChange={(e) => setFormData({ ...formData, idFiscal: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              placeholder="+34 666 123 456"
              value={formData.telefono || ""}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="cliente@email.com"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="calle">Dirección</Label>
            <Input
              id="calle"
              placeholder="Calle y número"
              value={formData.calle || ""}
              onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ciudad">Ciudad</Label>
            <Input
              id="ciudad"
              placeholder="Ciudad"
              value={formData.ciudad || ""}
              onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pais">País</Label>
            <Select
              value={formData.pais || "España"}
              onValueChange={(value) => setFormData({ ...formData, pais: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="España">España</SelectItem>
                <SelectItem value="Francia">Francia</SelectItem>
                <SelectItem value="Portugal">Portugal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PasoPagos({
  formData,
  setFormData,
  articulosSeleccionados,
}: {
  formData: any
  setFormData: any
  articulosSeleccionados: Array<{ id: string; nombre: string; cantidad: number; precio_unitario: number }>
}) {
  const dias =
    formData.fechaInicio && formData.fechaFin
      ? Math.max(
          1,
          Math.ceil(
            (new Date(formData.fechaFin).getTime() - new Date(formData.fechaInicio).getTime()) / (1000 * 60 * 60 * 24),
          ),
        )
      : 1

  const subtotal = articulosSeleccionados.reduce((sum, art) => sum + art.cantidad * art.precio_unitario * dias, 0)
  const iva = subtotal * 0.21
  const total = subtotal + iva

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {articulosSeleccionados.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No hay artículos seleccionados</p>
              ) : (
                <>
                  {articulosSeleccionados.map((articulo) => (
                    <div key={articulo.id} className="flex justify-between text-sm">
                      <span>
                        {articulo.nombre} ({articulo.cantidad}x × {dias} días)
                      </span>
                      <span>€{(articulo.cantidad * articulo.precio_unitario * dias).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (21%)</span>
                    <span>€{iva.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Método de Pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input type="radio" id="efectivo" name="pago" value="efectivo" />
                <Label htmlFor="efectivo">Efectivo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="transferencia" name="pago" value="transferencia" />
                <Label htmlFor="transferencia">Transferencia Bancaria</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="tarjeta" name="pago" value="tarjeta" />
                <Label htmlFor="tarjeta">Tarjeta de Crédito</Label>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="notas">Notas del Pedido</Label>
              <Textarea
                id="notas"
                placeholder="Notas adicionales para este pedido..."
                rows={4}
                value={formData.notas || ""}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
