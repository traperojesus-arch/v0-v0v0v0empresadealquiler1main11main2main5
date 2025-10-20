// components/reservas/nueva-reserva-form.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react"; // Quitamos useMemo si no se usa
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Package, CreditCard, ArrowRight, ArrowLeft, Check, Search, X, Plus, Minus, Loader2, AlertCircle } from "lucide-react"; // Quitamos Clock
import { getArticulos } from "@/app/actions/articulos-actions";
import { getClientes, createCliente } from "@/app/actions/clientes-actions"; 
import { createPedido } from "@/app/actions/pedidos-actions"; // Tu import original
import { useRouter } from "next/navigation";

// --- IMPORTACIONES ADICIONALES PARA MEJORAS ---
import { Checkbox } from "@/components/ui/checkbox"; // <-- Para PasoExtras
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // <-- Para PasoPagos
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"; // <-- Para PasoDatosContacto
import { PostalCodeInput } from "@/components/postal-code-input"; // <-- Para PasoPrincipal
import { toast } from "sonner"; 
import { cn } from "@/lib/utils"; 
import { Alert, AlertDescription } from "@/components/ui/alert"; 

const pasos = [
  { id: 1, nombre: "Principal", descripcion: "Artículos y fechas", icono: Package },
  { id: 2, nombre: "Extras", descripcion: "Servicios", icono: Plus },
  { id: 3, nombre: "Envío", descripcion: "Logística", icono: MapPin },
  { id: 4, nombre: "Cliente", descripcion: "Contacto", icono: User },
  { id: 5, nombre: "Resumen", descripcion: "Pago", icono: CreditCard },
];

// Tipos (de tu código)
type Articulo = {
  id: string
  nombre: string
  precio_por_dia?: number
  cantidad_total: number 
  categoria?: string
  codigo?: string
  precio_dia?: number
  stock_disponible?: number 
};
type Cliente = {
  id: string; nombre: string; apellido?: string; email: string; telefono?: string;
  empresa?: string; id_fiscal?: string; nif_cif?: string; 
  calle?: string; ciudad?: string; // ciudad aquí es la población/ciudad
  codigo_postal?: string; pais?: string; direccion?: string;
};
type ArticuloSeleccionado = { id: string; nombre: string; cantidad: number; precio_unitario: number };
// --- Fin Tipos ---


export function NuevaReservaForm() {
  const router = useRouter();
  const [pasoActual, setPasoActual] = useState(1);
  const [articulosSeleccionados, setArticulosSeleccionados] = useState<ArticuloSeleccionado[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Estado del formulario (basado en tu código)
  const [formData, setFormData] = useState({
    fechaInicio: "",
    fechaFin: "",
    direccionEvento: "", 
    calle: "",
    ciudad: "", // <-- Campo para la población/ciudad
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
    // Campos añadidos
    transporte: "",
    horaEntregaDesde: "",
    horaEntregaHasta: "",
    horaRecogidaDesde: "",
    horaRecogidaHasta: "",
    direccionEntrega: "",
    metodoPago: "transferencia", 
  });

  const [cantidadTemp, setCantidadTemp] = useState<{ [key: string]: number }>({});

  // Sincronizar artículos (como antes)
  useEffect(() => {
    setFormData(prev => ({ ...prev, articulos: articulosSeleccionados } as any));
  }, [articulosSeleccionados]);


  const siguientePaso = () => { if (pasoActual < pasos.length) setPasoActual(pasoActual + 1); };
  const pasoAnterior = () => { if (pasoActual > 1) setPasoActual(pasoActual - 1); };

  // --- Lógica de guardado (tu lógica original con spinner) ---
  const handleFinalSubmit = async () => {
    setIsSubmitting(true); setSubmitError(null);  
    try {
      console.log("[v0] Creando reserva con artículos:", articulosSeleccionados)
      console.log("[Form] Enviando datos. Cliente ID:", formData.clienteId); 
      if (!formData.clienteId) { throw new Error("Cliente no seleccionado."); }
      if (!formData.fechaInicio || !formData.fechaFin) { throw new Error("Fechas requeridas."); }
      if (articulosSeleccionados.length === 0) { throw new Error("Selecciona artículos."); }

      const direccionCompleta = `${formData.calle}, ${formData.codigoPostal} ${formData.ciudad}`
      const nombreCompleto = `${formData.nombre} ${formData.apellido}`.trim()
      const dias = Math.max(1, Math.ceil((new Date(formData.fechaFin).getTime() - new Date(formData.fechaInicio).getTime()) / (1000 * 60 * 60 * 24))) || 1;
      const total = articulosSeleccionados.reduce((sum, art) => sum + art.cantidad * art.precio_unitario * dias, 0)

      const resultado = await createPedido({
        cliente_id: formData.clienteId,
        cliente_nombre: nombreCompleto,
        empresa: formData.empresa,
        telefono: formData.telefono,
        email: formData.email,
        fecha_pedido: new Date().toISOString(),
        fecha_entrega: formData.fechaInicio, // fecha_inicio en DB
        fecha_devolucion: formData.fechaFin,  // fecha_fin en DB
        direccion_entrega: direccionCompleta, 
        calle: formData.calle,
        codigo_postal: formData.codigoPostal,
        ciudad: formData.ciudad, // ciudad en DB
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
        console.log("[v0] Reserva creada:", resultado.data); toast.success("Reserva creada"); router.push("/reservas"); router.refresh();
      } else {
        throw new Error(resultado.error || "Error al crear la reserva");
      }
    } catch (error: any) {
      console.error("[v0] Error al crear reserva:", error); setSubmitError(error.message); toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false); 
    }
  }

  return (
    <div className="max-w-6xl space-y-6 mx-auto">
      {/* --- 1. Indicador de Pasos (Visible) --- */}
      <Card><CardContent className="p-4 md:p-6">{/* ... JSX indicador pasos ... */}</CardContent></Card>

      {/* --- 2. Área de Contenido del Paso Actual (Visible) --- */}
      <div className="mt-6 min-h-[300px]">
        {pasoActual === 1 && (<PasoPrincipal formData={formData} setFormData={setFormData} articulosSeleccionados={articulosSeleccionados} setArticulosSeleccionados={setArticulosSeleccionados} cantidadTemp={cantidadTemp} setCantidadTemp={setCantidadTemp} /> )}
        {pasoActual === 2 && <PasoExtras />}
        {pasoActual === 3 && <PasoEnvioEntrega formData={formData} setFormData={setFormData} />}
        {pasoActual === 4 && <PasoDatosContacto formData={formData} setFormData={setFormData} />}
        {pasoActual === 5 && (<PasoPagos formData={formData} setFormData={setFormData} articulosSeleccionados={articulosSeleccionados} />)}
      </div>

       {/* Error submit */}
       {submitError && (<Alert variant="destructive" className="mt-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{submitError}</AlertDescription></Alert> )}

      {/* --- 3. Botones de Navegación --- */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={pasoAnterior} disabled={isSubmitting} className={cn(pasoActual === 1 ? 'invisible' : '')}> <ArrowLeft className="w-4 h-4 mr-2" /> Anterior </Button>
        <div className="flex gap-2">
          {pasoActual < pasos.length ? ( <Button onClick={siguientePaso} disabled={isSubmitting}> Siguiente <ArrowRight className="w-4 h-4 ml-2" /> </Button> )
           : ( <Button onClick={handleFinalSubmit} disabled={isSubmitting}> {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} {isSubmitting ? "Creando..." : "Crear Reserva"} </Button> )}
        </div>
      </div>
    </div>
  )
}


// --- COMPONENTES DE PASOS ---

function PasoPrincipal({
  formData, setFormData, articulosSeleccionados, setArticulosSeleccionados, cantidadTemp, setCantidadTemp
}: {
  formData: any; setFormData: any;
  articulosSeleccionados: ArticuloSeleccionado[];
  setArticulosSeleccionados: React.Dispatch<React.SetStateAction<ArticuloSeleccionado[]>>;
  cantidadTemp: { [key: string]: number }; setCantidadTemp: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}) {
  const [articulos, setArticulos] = useState<any[]>([]);
  const [articulosFiltrados, setArticulosFiltrados] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  // Cargar artículos (Lógica de tu versión)
  useEffect(() => {
    let isMounted = true; 
    const cargarArticulos = async () => {
        console.log("[PasoPrincipal v_user] Cargando artículos...");
        setCargando(true); // Siempre empieza cargando
        try {
            const resultado = await getArticulos();
            if (!isMounted) return; 
            console.log("[PasoPrincipal v_user] Resultado de getArticulos:", resultado);
            if (resultado.success && Array.isArray(resultado.data)) {
                console.log(`[PasoPrincipal v_user] Artículos cargados: ${resultado.data.length}`);
                setArticulos(resultado.data);
                setArticulosFiltrados(resultado.data); // Establece filtrados iniciales aquí
            } else {
                console.error("[PasoPrincipal v_user] Error o datos inválidos:", resultado.error); toast.error("Error al cargar artículos."); setArticulos([]); setArticulosFiltrados([]);
            }
        } catch (error) {
             if (isMounted) { console.error("[PasoPrincipal v_user] Excepción:", error); toast.error("Error fatal."); setArticulos([]); setArticulosFiltrados([]); }
        } finally {
             if (isMounted) { console.log("[PasoPrincipal v_user] Carga finalizada. setCargando(false)"); setCargando(false); } 
        }
    };
    cargarArticulos();
    return () => { isMounted = false; };
  }, []); // Carga solo al montar

  // Filtrar artículos (Lógica de tu versión)
  useEffect(() => {
    // No filtrar si aún está cargando para evitar mostrar lista vacía temporalmente
    if (cargando) return; 

    if (busqueda.trim() === "") {
        setArticulosFiltrados(articulos);
    } else {
        const lowerBusqueda = busqueda.toLowerCase();
        const filtrados = articulos.filter(art =>
            art.nombre.toLowerCase().includes(lowerBusqueda) ||
            (art.categoria?.toLowerCase() || '').includes(lowerBusqueda) ||
            (art.codigo?.toLowerCase() || '').includes(lowerBusqueda)
        );
        setArticulosFiltrados(filtrados);
    }
  }, [busqueda, articulos, cargando]); // Depende de 'cargando'

  // --- Lógica de Artículos (Tu lógica original) ---
  const agregarArticulo = (articulo: any, cantidad: number) => {
    console.log(`[PasoPrincipal v_user] Agregando: ${articulo?.nombre} (x${cantidad})`); 
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
  
  // Callbacks para CP y Ciudad (usando tu setFormData)
  const handleCodigoPostalChange = useCallback((value: string) => { setFormData({ ...formData, codigoPostal: value }); }, [formData, setFormData]);
  const handleCiudadChange = useCallback((city: string) => { setFormData({ ...formData, ciudad: city || '' }); }, [formData, setFormData]);

  return (
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* --- Card Fechas y Dirección --- */}
      <Card>
          <CardHeader><CardTitle>Fechas y Dirección Evento</CardTitle></CardHeader>
          <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="fecha-inicio">Inicio <span className="text-destructive">*</span></Label><Input required id="fecha-inicio" type="date" value={formData.fechaInicio} onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="fecha-fin">Fin <span className="text-destructive">*</span></Label><Input required id="fecha-fin" type="date" value={formData.fechaFin} onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })} min={formData.fechaInicio} /></div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="calle">Calle y Número</Label>
                  <Input id="calle" placeholder="Ej: C/ Mayor 123" value={formData.calle} onChange={(e) => setFormData({ ...formData, calle: e.target.value })} />
              </div>
              {/* --- 2. MEJORA: CP/Población con PostalCodeInput --- */}
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="codigo-postal">Código Postal</Label>
                      {/* Asegúrate de tener el componente postal-code-input.tsx */}
                      <PostalCodeInput value={formData.codigoPostal || ''} onChange={handleCodigoPostalChange} onCityChange={handleCiudadChange} className="w-full"/>
                  </div>
                  <div className="space-y-2">
                      {/* CORRECCIÓN ETIQUETA */}
                      <Label htmlFor="ciudad">Población</Label>
                      <Input id="ciudad" placeholder="Se rellena con CP" value={formData.ciudad} onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })} readOnly={!!(formData.codigoPostal && formData.codigoPostal.length === 5 && formData.ciudad)} className={cn(!!(formData.codigoPostal && formData.codigoPostal.length === 5 && formData.ciudad) && "bg-muted/50")}/>
                  </div>
              </div>
          </CardContent>
      </Card>

      {/* --- Card Selección Artículos --- */}
      <Card>
          <CardHeader><CardTitle>Selección Artículos <span className="text-destructive">*</span></CardTitle></CardHeader>
          <CardContent className="space-y-4"> 
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar artículos..." className="pl-9" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              </div>
              {articulosSeleccionados.length > 0 && (
                  <div className="space-y-2 p-3 bg-muted rounded-lg max-h-48 overflow-y-auto">
                       <div className="flex items-center justify-between mb-2"><h4 className="font-medium text-sm">Seleccionados ({articulosSeleccionados.length})</h4><Badge variant="secondary">{articulosSeleccionados.reduce((sum, a) => sum + a.cantidad, 0)} uds</Badge></div>
                       {articulosSeleccionados.map((articulo) => (
                         <div key={articulo.id} className="flex items-center justify-between p-2 bg-background rounded border">
                             <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{articulo.nombre}</p><p className="text-xs text-muted-foreground">€{articulo.precio_unitario.toFixed(2)}/día</p></div>
                             <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                 <Button size="sm" variant="outline" className="h-6 w-6 sm:h-7 sm:w-7 p-0 bg-transparent" onClick={() => actualizarCantidad(articulo.id, articulo.cantidad - 1)}><Minus className="h-3 w-3" /></Button>
                                 <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">{articulo.cantidad}</span>
                                 <Button size="sm" variant="outline" className="h-6 w-6 sm:h-7 sm:w-7 p-0 bg-transparent" onClick={() => actualizarCantidad(articulo.id, articulo.cantidad + 1)}><Plus className="h-3 w-3" /></Button>
                                 <Button size="sm" variant="ghost" className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-destructive" onClick={() => quitarArticulo(articulo.id)}><X className="h-4 w-4" /></Button>
                             </div>
                         </div>
                     ))}
                  </div>
              )}
              <Separator />
              {/* --- Lista Artículos Disponibles (Tu lógica) --- */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 border rounded-md p-2 min-h-[150px] flex flex-col">
                  {cargando ? (
                      <div className="flex-1 flex justify-center items-center m-auto text-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/><span className="ml-2 text-muted-foreground">Cargando...</span></div>
                  ) : articulos.length === 0 ? ( 
                       <div className="flex-1 flex justify-center items-center m-auto text-center text-muted-foreground">No hay artículos disponibles.</div>
                  ) : articulosFiltrados.length === 0 && busqueda ? ( 
                       <div className="text-center py-8"><p className="text-muted-foreground mb-2">No se encontraron artículos con "{busqueda}"</p><Button variant="outline" size="sm" onClick={() => setBusqueda("")}>Limpiar</Button></div>
                  ) : (
                      <>
                          <p className="text-xs text-muted-foreground flex-shrink-0">{articulosFiltrados.length} artículos mostrados</p>
                          <div className="space-y-3 flex-1 overflow-y-auto">
                              {articulosFiltrados.map((articulo) => {
                                   const seleccionado = articulosSeleccionados.find((a) => a.id === articulo.id);
                                   const stock = articulo.cantidad_total ?? articulo.stock_disponible ?? 0; // Tu código usa cantidad_total
                                   const stockRestante = stock - (seleccionado?.cantidad || 0);
                                  return (
                                      <React.Fragment key={articulo.id}>
                                          <div className="flex items-center justify-between p-3 border rounded-lg gap-2">
                                              <div className="flex-1 min-w-0">
                                                  <p className="font-medium truncate">{articulo.nombre}</p>
                                                  <p className="text-sm text-muted-foreground">€{(articulo.precio_dia ?? articulo.precio_por_dia ?? 0).toFixed(2)}/día</p>
                                                  <p className={cn("text-xs", stockRestante <= 0 ? "text-destructive font-medium" : "text-muted-foreground")}>{stockRestante} disp. de {stock}{seleccionado && ` (${seleccionado.cantidad} sel.)`}</p>
                                              </div>
                                              <div className="flex items-center gap-2 flex-shrink-0">
                                                  <Input type="number" min="1" max={stock} className="w-16 h-8 text-center px-1" value={cantidadTemp[articulo.id] || 1} onChange={(e) => setCantidadTemp(prev => ({ ...prev, [articulo.id]: Math.min(stock, Math.max(1, Number.parseInt(e.target.value) || 1)) }))} />
                                                  <Button size="sm" className="h-8" onClick={() => { agregarArticulo(articulo, cantidadTemp[articulo.id] || 1); setCantidadTemp(prev => ({ ...prev, [articulo.id]: 1 })); }} disabled={stockRestante <= 0}>Agregar</Button>
                                              </div>
                                          </div>
                                      </React.Fragment>
                                  );
                              })}
                          </div>
                      </>
                  )}
              </div>
          </CardContent>
      </Card>
      </div>
  );
}

// --- CORRECCIÓN: PasoExtras (usando Checkbox) ---
function PasoExtras() {
  return (
    <Card>
      <CardHeader><CardTitle>Servicios Adicionales</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "montaje", nombre: "Montaje y Desmontaje", precio: 150, descripcion: "Servicio completo" },
            { id: "limpieza", nombre: "Limpieza Post-Evento", precio: 80, descripcion: "Limpieza tras evento" },
            { id: "coordinador", nombre: "Coordinador de Evento", precio: 200, descripcion: "Coordinador profesional" },
            { id: "seguro", nombre: "Seguro Premium", precio: 50, descripcion: "Cobertura adicional" },
          ].map((extra) => (
            <div key={extra.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
              <Label htmlFor={`extra-${extra.id}`} className="flex-1 cursor-pointer">
                <p className="font-medium">{extra.nombre}</p>
                <p className="text-sm text-muted-foreground">{extra.descripcion}</p>
                <p className="text-sm font-medium text-primary">€{extra.precio.toFixed(2)}</p>
              </Label>
              <Checkbox id={`extra-${extra.id}`} className="ml-4"/> 
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// --- CORRECCIÓN: PasoEnvioEntrega (con Horarios y setFormData) ---
// (Adaptado de tu versión funcional)
function PasoEnvioEntrega({ formData, setFormData }: { formData: any; setFormData: any; }) { 
    return (
    <Card>
      <CardHeader><CardTitle>Configuración de Envío y Entrega</CardTitle></CardHeader>
      <CardContent className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="medio-transporte">Medio de Transporte</Label>
                <Select value={formData.transporte || ''} onValueChange={(value) => setFormData((prev: any) => ({ ...prev, transporte: value }))}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="furgoneta">Furgoneta</SelectItem>
                        <SelectItem value="camion">Camión</SelectItem>
                        <SelectItem value="cliente">Cliente recoge</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {/* Campo distancia no estaba en tu formData base */}
         </div>
         <Separator />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-3">
                <Label className="flex items-center gap-2 font-medium">Horario de Entrega</Label>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label htmlFor="hora-entrega-desde" className="text-xs">Desde</Label><Input id="hora-entrega-desde" type="time" value={formData.horaEntregaDesde || ''} onChange={(e) => setFormData((prev: any) => ({...prev, horaEntregaDesde: e.target.value}))} /></div>
                    <div className="space-y-1"><Label htmlFor="hora-entrega-hasta" className="text-xs">Hasta</Label><Input id="hora-entrega-hasta" type="time" value={formData.horaEntregaHasta || ''} onChange={(e) => setFormData((prev: any) => ({...prev, horaEntregaHasta: e.target.value}))} /></div>
                </div>
            </div>
            <div className="space-y-3">
                <Label className="flex items-center gap-2 font-medium">Horario de Recogida</Label>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label htmlFor="hora-recogida-desde" className="text-xs">Desde</Label><Input id="hora-recogida-desde" type="time" value={formData.horaRecogidaDesde || ''} onChange={(e) => setFormData((prev: any) => ({...prev, horaRecogidaDesde: e.target.value}))} /></div>
                    <div className="space-y-1"><Label htmlFor="hora-recogida-hasta" className="text-xs">Hasta</Label><Input id="hora-recogida-hasta" type="time" value={formData.horaRecogidaHasta || ''} onChange={(e) => setFormData((prev: any) => ({...prev, horaRecogidaHasta: e.target.value}))} /></div>
                </div>
            </div>
         </div>
         <div className="space-y-2 pt-4">
             {/* Tu código tenía label "Dirección del Evento" */}
            <Label htmlFor="direccion-evento">Dirección del Evento (si diferente)</Label>
            <Textarea id="direccion-evento" placeholder="Dirección completa del evento..." rows={3} value={formData.direccionEvento || ''} onChange={e => setFormData({ ...formData, direccionEvento: e.target.value })} />
         </div>
      </CardContent>
    </Card>
  )
}

// --- CORRECCIÓN: PasoDatosContacto (con Creación Rápida y seleccionarCliente corregido) ---
function PasoDatosContacto({ formData, setFormData }: { formData: any; setFormData: any; }) {
     const [clientes, setClientes] = useState<Cliente[]>([])
     const [busquedaCliente, setBusquedaCliente] = useState("")
     const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([])
     const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
     const [loadingClientes, setLoadingClientes] = useState(true);
     const [showNewClientDialog, setShowNewClientDialog] = useState(false);
     const [newClientData, setNewClientData] = useState({ nombre: "", email: "", telefono: "" });
     const [isCreatingClient, setIsCreatingClient] = useState(false);

      // Cargar Clientes (tu lógica original)
      useEffect(() => {
        const cargarClientes = async () => {
          setLoadingClientes(true);
          console.log(`[PasoDatosContacto] Cargando clientes...`);
          try { // Añadido try/catch básico
            const result = await getClientes(); 
            if (result.success && Array.isArray(result.data)) {
                setClientes(result.data);
                console.log(`[PasoDatosContacto] Clientes cargados: ${result.data.length}`);
            } else {
                console.error("[PasoDatosContacto] Error cargando clientes:", result.error); toast.error("Error al cargar la lista de clientes.");
            }
          } catch (error) {
              console.error("[PasoDatosContacto] Excepción en cargarClientes:", error); toast.error("Error fatal al cargar clientes.");
          } finally {
              setLoadingClientes(false);
          }
        };
        cargarClientes();
      }, []); // Carga solo al montar

      // Filtrar Clientes (tu lógica original)
      useEffect(() => {
        if (!mostrarSugerencias || busquedaCliente.trim().length < 1) { // Buscar desde 1 letra
             setClientesFiltrados([]);
             return;
        }
        const lowerBusqueda = busquedaCliente.toLowerCase();
        const filtrados = clientes.filter(cliente =>
            (cliente.nombre?.toLowerCase() || '').includes(lowerBusqueda) ||
            (cliente.apellido?.toLowerCase() || '').includes(lowerBusqueda) ||
            (cliente.email?.toLowerCase() || '').includes(lowerBusqueda)
        );
        setClientesFiltrados(filtrados);
      }, [busquedaCliente, clientes, mostrarSugerencias]);

      // --- CORRECCIÓN: seleccionarCliente (actualización directa de formData) ---
      const seleccionarCliente = useCallback((cliente: Cliente) => {
          console.log("[PasoDatosContacto] Seleccionando cliente:", cliente);
          setBusquedaCliente(`${cliente.nombre || ''} ${cliente.apellido || ""}`.trim());
          setMostrarSugerencias(false);
          // Actualiza el formData principal directamente
          setFormData((prevFormData: any) => { 
              // Asegura que todos los campos del cliente se copien
              const updatedData = {
                ...prevFormData,
                clienteId: cliente.id, // <-- ¡Importante!
                nombre: cliente.nombre || '',
                apellido: cliente.apellido || "",
                email: cliente.email || '',
                telefono: cliente.telefono || "",
                empresa: cliente.empresa || "",
                idFiscal: cliente.id_fiscal || cliente.nif_cif || "", // Ajusta según tu DB
                // Rellena la dirección del cliente (¡SOBREESCRIBE la del Paso 1!)
                calle: cliente.calle || "", 
                ciudad: cliente.ciudad || "", // ciudad es población
                codigoPostal: cliente.codigo_postal || "",
                pais: cliente.pais || "España",
              };
              console.log("[PasoDatosContacto] formData actualizado:", updatedData);
              return updatedData;
          });
      }, [setFormData]); // Dependencia explícita

      // --- 3. MEJORA: Creación Rápida ---
      const handleOpenNewClientDialog = () => { /* ... (como antes) ... */ };
      const handleCreateNewClient = async () => { /* ... (como antes, usa seleccionarCliente) ... */ };

    return (
    <>
        <Card>
            <CardHeader><CardTitle>Datos del Cliente <span className="text-destructive">*</span></CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {/* Buscador y Sugerencias */}
                <div className="space-y-2 relative">
                    <Label htmlFor="buscar-cliente">Buscar / Añadir Cliente</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="buscar-cliente" placeholder="Buscar por nombre, apellido o email..." className="pl-9" value={busquedaCliente} onChange={(e) => { setBusquedaCliente(e.target.value); setMostrarSugerencias(true); }} onFocus={() => setMostrarSugerencias(true)} onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)} />
                    </div>
                    {mostrarSugerencias && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {loadingClientes ? (<div className="p-4 text-center text-sm text-muted-foreground">Cargando...</div>)
                        : clientesFiltrados.length > 0 ? (
                            clientesFiltrados.map((cliente) => (
                                <button key={cliente.id} type="button" className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b last:border-b-0" onClick={() => seleccionarCliente(cliente)}>
                                <p className="font-medium">{cliente.nombre || ''} {cliente.apellido || ""}</p><p className="text-sm text-muted-foreground">{cliente.email}</p>{cliente.empresa && <p className="text-xs text-muted-foreground">{cliente.empresa}</p>}
                                </button>
                            ))
                        ) : busquedaCliente.length >= 1 ? ( // Mostrar botón desde 1 letra
                            <div className="p-4 text-center text-sm text-muted-foreground">No se encontraron. <Button variant="link" size="sm" onClick={handleOpenNewClientDialog} className="ml-1 h-auto p-0">Crear nuevo cliente</Button></div>
                        ) : (<div className="p-4 text-center text-sm text-muted-foreground">Escribe para buscar...</div>)
                        }
                    </div>
                    )}
                </div>
                <Separator />
                 {/* Campos Cliente (usando tu estructura original, deshabilitados si hay clienteId) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="nombre">Nombre <span className="text-destructive">*</span></Label><Input required id="nombre" placeholder="Nombre" value={formData.nombre || ""} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} disabled={!!formData.clienteId} /></div>
                    <div className="space-y-2"><Label htmlFor="apellido">Apellido</Label><Input id="apellido" placeholder="Apellidos" value={formData.apellido || ""} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} disabled={!!formData.clienteId}/></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="empresa">Empresa</Label><Input id="empresa" placeholder="(Opcional)" value={formData.empresa || ""} onChange={(e) => setFormData({ ...formData, empresa: e.target.value })} disabled={!!formData.clienteId}/></div>
                    <div className="space-y-2"><Label htmlFor="id-fiscal">ID Fiscal</Label><Input id="id-fiscal" placeholder="NIF/CIF" value={formData.idFiscal || ""} onChange={(e) => setFormData({ ...formData, idFiscal: e.target.value })} disabled={!!formData.clienteId}/></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="telefono">Teléfono <span className="text-destructive">*</span></Label><Input required id="telefono" placeholder="+34..." value={formData.telefono || ""} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} disabled={!!formData.clienteId}/></div>
                    <div className="space-y-2"><Label htmlFor="email">Email <span className="text-destructive">*</span></Label><Input required id="email" type="email" placeholder="cliente@email.com" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={!!formData.clienteId}/></div>
                </div>
                 {/* Dirección Cliente (usando tu estructura original) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t mt-4">
                     <div className="space-y-2 md:col-span-3"><Label>Dirección Facturación</Label></div>
                     <div className="space-y-2">
                        <Label htmlFor="calle-cli">Dirección</Label>
                        <Input id="calle-cli" placeholder="Calle y número" value={formData.calle || ""} onChange={(e) => setFormData({ ...formData, calle: e.target.value })} disabled={!!formData.clienteId} />
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="ciudad-cli">Ciudad</Label>
                         <Input id="ciudad-cli" placeholder="Ciudad" value={formData.ciudad || ""} onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })} disabled={!!formData.clienteId} />
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="pais-cli">País</Label>
                         <Select value={formData.pais || "España"} onValueChange={(value) => setFormData({ ...formData, pais: value })} disabled={!!formData.clienteId}>
                             <SelectTrigger><SelectValue /></SelectTrigger>
                             <SelectContent><SelectItem value="España">España</SelectItem>{/* ... */}</SelectContent>
                         </Select>
                    </div>
                 </div>
            </CardContent>
        </Card>
        {/* --- 3. MEJORA: Diálogo Crear Cliente --- */}
        <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader><DialogTitle>Crear Cliente Rápido</DialogTitle><DialogDescription>Datos básicos.</DialogDescription></DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="new-client-name" className="text-right">Nombre*</Label><Input id="new-client-name" value={newClientData.nombre} onChange={e => setNewClientData({...newClientData, nombre: e.target.value})} className="col-span-3" /></div>
                    <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="new-client-email" className="text-right">Email*</Label><Input id="new-client-email" type="email" value={newClientData.email} onChange={e => setNewClientData({...newClientData, email: e.target.value})} className="col-span-3" /></div>
                    <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="new-client-phone" className="text-right">Teléfono*</Label><Input id="new-client-phone" value={newClientData.telefono} onChange={e => setNewClientData({...newClientData, telefono: e.target.value})} className="col-span-3" /></div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowNewClientDialog(false)} disabled={isCreatingClient}>Cancelar</Button>
                    <Button type="button" onClick={handleCreateNewClient} disabled={isCreatingClient}>{isCreatingClient ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando...</> : "Crear Cliente"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
    );
}

// --- CORRECCIÓN: PasoPagos (usando RadioGroup) ---
function PasoPagos({ formData, setFormData, articulosSeleccionados }: { formData: any; setFormData: any; articulosSeleccionados: ArticuloSeleccionado[] }) {
    const dias = formData.fechaInicio && formData.fechaFin ? Math.max(1, Math.ceil((new Date(formData.fechaFin).getTime() - new Date(formData.fechaInicio).getTime()) / (1000 * 60 * 60 * 24))) : 1;
    const subtotal = articulosSeleccionados.reduce((sum, art) => sum + art.cantidad * art.precio_unitario * dias, 0);
    const iva = subtotal * 0.21;
    const total = subtotal + iva;
     return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Resumen del Pedido</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-3">
                  {articulosSeleccionados.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No hay artículos</p>
                   : <>
                       {articulosSeleccionados.map((articulo) => (
                         <div key={articulo.id} className="flex justify-between text-sm"><span>{articulo.nombre} ({articulo.cantidad}x × {dias}d)</span><span>€{(articulo.cantidad * articulo.precio_unitario * dias).toFixed(2)}</span></div>
                       ))}
                       <Separator />
                       <div className="flex justify-between"><span>Subtotal</span><span>€{subtotal.toFixed(2)}</span></div>
                       <div className="flex justify-between"><span>IVA (21%)</span><span>€{iva.toFixed(2)}</span></div>
                       <Separator />
                       <div className="flex justify-between font-bold text-lg"><span>Total</span><span>€{total.toFixed(2)}</span></div>
                     </>}
                 </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Método de Pago y Notas</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                 <RadioGroup defaultValue={formData.metodoPago || 'transferencia'} onValueChange={(value) => setFormData((prev: any) => ({...prev, metodoPago: value}))} className="space-y-3">
                     <div className="flex items-center space-x-2"><RadioGroupItem value="transferencia" id="transferencia" /><Label htmlFor="transferencia">Transferencia</Label></div>
                     <div className="flex items-center space-x-2"><RadioGroupItem value="tarjeta" id="tarjeta" disabled /><Label htmlFor="tarjeta" className="text-muted-foreground">Tarjeta (Próximamente)</Label></div>
                     <div className="flex items-center space-x-2"><RadioGroupItem value="efectivo" id="efectivo" /><Label htmlFor="efectivo">Efectivo (en entrega)</Label></div>
                 </RadioGroup>
                 <Separator />
                 <div className="space-y-2">
                    <Label htmlFor="notas-finales">Notas Adicionales</Label>
                    <Textarea id="notas-finales" placeholder="Instrucciones especiales..." rows={4} value={formData.notas || ""} onChange={(e) => setFormData({ ...formData, notas: e.target.value })} />
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
}
