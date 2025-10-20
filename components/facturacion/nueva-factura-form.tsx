// components/facturacion/nueva-factura-form.tsx
"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Save, FileText, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
// Importa las nuevas acciones y la de clientes
import { getClientes } from "@/app/actions/clientes-actions";
// ¡¡RUTA CORREGIDA AQUÍ!!
import { getAlbaranesPendientes, createFactura } from "@/app/actions/facturas-actions";
// Importa o define Checkbox
import { Checkbox } from "@/components/ui/checkbox"; // Asegúrate que este componente exista
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils"; // Importa cn si usas clases condicionales

// Define una interfaz para los albaranes que cargas
interface AlbaranPendiente {
  id: string;
  numero_albaran: string;
  fecha_entrega: string;
  direccion_entrega: string;
  articulos_json: Array<{
    articulo_id?: string | null;
    descripcion: string;
    cantidad: number;
    precio_unitario?: number; // Precio unitario DEBERÍA estar aquí
  }> | null;
}

// Define una interfaz para las líneas de la factura
interface LineaFactura {
  articulo_id?: string | null;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  subtotal: number; // Calculado
  origen_albaran?: string; // Para saber de qué albarán vino (opcional)
}

// Asegúrate de tener el componente Checkbox si no lo has creado/instalado
// Ejemplo simple si no lo tienes:
// import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
// import { Check } from "lucide-react";
// const Checkbox = React.forwardRef<any, any>(({ className, ...props }, ref) => (
//     <CheckboxPrimitive.Root ref={ref} className={cn("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className)} {...props}>
//         <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
//             <Check className="h-4 w-4" />
//         </CheckboxPrimitive.Indicator>
//     </CheckboxPrimitive.Root>
// ));
// Checkbox.displayName = CheckboxPrimitive.Root.displayName;
// export { Checkbox }; // Asegúrate de exportarlo si lo defines aquí

export function NuevaFacturaForm() {
  const router = useRouter();

  // Estados del formulario principal
  const [formData, setFormData] = useState({
    numeroFactura: `FAC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
    clienteId: "",
    fechaEmision: new Date().toISOString().split("T")[0],
    fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    metodoPago: "",
    notas: "",
  });
  const [lineas, setLineas] = useState<LineaFactura[]>([]);

  // Estados para la selección de cliente y albaranes
  const [clientes, setClientes] = useState<any[]>([]);
  const [albaranesPendientes, setAlbaranesPendientes] = useState<AlbaranPendiente[]>([]);
  const [albaranesSeleccionadosIds, setAlbaranesSeleccionadosIds] = useState<string[]>([]);

  // Estados de carga y error
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingAlbaranes, setLoadingAlbaranes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- EFECTOS ---

  useEffect(() => {
    const cargarClientesInicial = async () => {
      setLoadingClientes(true);
      const resultClientes = await getClientes();
      if (resultClientes.success) {
        setClientes(resultClientes.data);
      } else {
        setError("Error al cargar clientes.");
        console.error("Error getClientes:", resultClientes.error);
      }
      setLoadingClientes(false);
    };
    cargarClientesInicial();
  }, []);

  useEffect(() => {
    const cargarAlbaranesCliente = async () => {
      if (!formData.clienteId) {
        setAlbaranesPendientes([]);
        setAlbaranesSeleccionadosIds([]);
        setLineas([]);
        setError(null); // Limpia error si se quita el cliente
        return;
      }
      setLoadingAlbaranes(true);
      setError(null);
      setAlbaranesSeleccionadosIds([]);
      setLineas([]);

      const result = await getAlbaranesPendientes(formData.clienteId);
      if (result.success) {
        setAlbaranesPendientes(result.data);
         if (result.data.length === 0) {
            // No es un error, solo informa
             setError(`El cliente seleccionado no tiene albaranes pendientes de facturar.`);
        }
      } else {
        setError(`Error al cargar albaranes: ${result.error}`);
        console.error("Error getAlbaranesPendientes:", result.error);
        setAlbaranesPendientes([]);
      }
      setLoadingAlbaranes(false);
    };
    cargarAlbaranesCliente();
  }, [formData.clienteId]);

  useEffect(() => {
    if (albaranesSeleccionadosIds.length === 0) {
      setLineas([]);
      return;
    }

    const lineasAgrupadas: { [descripcion: string]: LineaFactura } = {};

    albaranesSeleccionadosIds.forEach(id => {
      const albaran = albaranesPendientes.find(alb => alb.id === id);
      if (albaran && albaran.articulos_json) {
        albaran.articulos_json.forEach((item) => {
          const descripcionKey = item.descripcion.toLowerCase().trim();
          const precioUnitario = item.precio_unitario || 0; // !! Necesita obtener el precio correcto !!

          if (precioUnitario <= 0) {
              console.warn(`Artículo "${item.descripcion}" del albarán ${albaran.numero_albaran} no tiene precio unitario definido.`);
              // Podrías poner un precio placeholder o marcar la línea como inválida
          }


          if (lineasAgrupadas[descripcionKey]) {
            lineasAgrupadas[descripcionKey].cantidad += item.cantidad;
            lineasAgrupadas[descripcionKey].subtotal = lineasAgrupadas[descripcionKey].cantidad * lineasAgrupadas[descripcionKey].precio_unitario * (1 - lineasAgrupadas[descripcionKey].descuento / 100);
             if (lineasAgrupadas[descripcionKey].origen_albaran && !lineasAgrupadas[descripcionKey].origen_albaran?.includes(albaran.numero_albaran)) {
                 lineasAgrupadas[descripcionKey].origen_albaran += `, ${albaran.numero_albaran}`;
             }
          } else {
            lineasAgrupadas[descripcionKey] = {
              articulo_id: item.articulo_id || null,
              descripcion: item.descripcion,
              cantidad: item.cantidad,
              precio_unitario: precioUnitario,
              descuento: 0,
              subtotal: item.cantidad * precioUnitario,
              origen_albaran: albaran.numero_albaran,
            };
          }
        });
      }
    });

    setLineas(Object.values(lineasAgrupadas));

  }, [albaranesSeleccionadosIds, albaranesPendientes]);

  // --- MANEJADORES ---

   const handleAlbaranSelectionChange = (albaranId: string, isChecked: boolean | 'indeterminate') => {
       // Convertir 'indeterminate' a false para simplificar
       const checked = typeof isChecked === 'boolean' ? isChecked : false;

       setAlbaranesSeleccionadosIds(prev =>
           checked
               ? [...prev, albaranId]
               : prev.filter(id => id !== albaranId)
       );
   };


  const actualizarLinea = (index: number, campo: keyof LineaFactura, valor: any) => {
    const nuevasLineas = [...lineas];
    const linea = nuevasLineas[index];
    if (!linea) return;

    // Convertir a número si es necesario
    let valorNumerico: number | undefined = undefined;
    if (campo === 'cantidad' || campo === 'precio_unitario' || campo === 'descuento' || campo === 'subtotal') {
        valorNumerico = campo === 'descuento' ? parseFloat(valor) : parseFloat(valor);
        if (isNaN(valorNumerico)) valorNumerico = 0; // Default a 0 si no es número válido
    }

    (linea[campo] as any) = valorNumerico !== undefined ? valorNumerico : valor; // Asignar número o valor original

    // Recalcular subtotal
    if (campo === 'cantidad' || campo === 'precio_unitario' || campo === 'descuento') {
        const cantidad = Number(linea.cantidad) || 0;
        const precio = Number(linea.precio_unitario) || 0;
        const descuento = Number(linea.descuento) || 0;
        linea.subtotal = cantidad * precio * (1 - Math.min(100, Math.max(0, descuento)) / 100); // Asegura descuento 0-100
    }

    setLineas(nuevasLineas);
  };

  // --- CÁLCULOS ---
  const { subtotal, iva, total } = useMemo(() => {
    const sub = lineas.reduce((sum, linea) => sum + (linea.subtotal || 0), 0);
    const taxRate = 0.21; // Asume 21%
    const tax = sub * taxRate;
    const tot = sub + tax;
    return { subtotal: sub, iva: tax, total: tot };
  }, [lineas]);


  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.clienteId) { setError("Debes seleccionar un cliente."); return; }
    if (albaranesSeleccionadosIds.length === 0) { setError("Debes seleccionar al menos un albarán."); return; }
    if (lineas.some(l => l.precio_unitario <= 0 || l.cantidad <= 0)) { setError("Hay líneas con cantidad o precio inválido."); return; }

    setIsSubmitting(true);

    const datosFactura = {
        numero_factura: formData.numeroFactura,
        cliente_id: formData.clienteId,
        fecha_emision: formData.fechaEmision,
        fecha_vencimiento: formData.fechaVencimiento,
        metodo_pago: formData.metodoPago || null,
        notas: formData.notas || null,
        subtotal: subtotal,
        iva: iva,
        total: total,
        descuento: 0, // Añadir si tienes descuento general
        lineas: lineas.map(l => ({
             descripcion: l.descripcion,
             cantidad: l.cantidad,
             precio_unitario: l.precio_unitario,
             descuento: l.descuento,
             subtotal: l.subtotal,
        })),
    };

    try {
        console.log("Enviando a createFactura:", datosFactura, albaranesSeleccionadosIds);
        const result = await createFactura(datosFactura, albaranesSeleccionadosIds);

        if (result.success) {
            alert("Factura creada exitosamente");
            console.log("Factura creada:", result.data);
            router.push("/facturacion");
            router.refresh();
        } else {
            throw new Error(result.error || "Error desconocido al crear la factura.");
        }
    } catch (error: any) {
        console.error("Error en handleSubmit:", error);
        setError(`Error al crear factura: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };


  // --- RENDER ---
  const clienteSeleccionado = clientes.find(c => c.id === formData.clienteId);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
          <Link href="/facturacion">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Nueva Factura desde Albarán</h1>
            <p className="text-muted-foreground mt-1">
              Selecciona un cliente para ver sus albaranes pendientes
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Información General y Cliente</CardTitle></CardHeader>
          <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numeroFactura">Número de Factura <span className="text-destructive">*</span></Label>
                  <Input id="numeroFactura" value={formData.numeroFactura} onChange={(e) => setFormData({ ...formData, numeroFactura: e.target.value })} required />
                </div>
                 <div>
                  <Label htmlFor="fechaEmision">Fecha de Emisión <span className="text-destructive">*</span></Label>
                  <Input id="fechaEmision" type="date" value={formData.fechaEmision} onChange={(e) => setFormData({ ...formData, fechaEmision: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="fechaVencimiento">Fecha de Vencimiento <span className="text-destructive">*</span></Label>
                  <Input id="fechaVencimiento" type="date" value={formData.fechaVencimiento} onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })} required />
                </div>
              </div>

            <div>
              <Label htmlFor="clienteId">Cliente <span className="text-destructive">*</span></Label>
              <Select
                value={formData.clienteId}
                onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
                disabled={loadingClientes}
                required
              >
                <SelectTrigger className={cn(!formData.clienteId && error?.includes("cliente") && "border-destructive")}>
                  <SelectValue placeholder={loadingClientes ? "Cargando clientes..." : "Seleccionar cliente"} />
                </SelectTrigger>
                <SelectContent>
                  {!loadingClientes && clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre} {cliente.empresa ? `- ${cliente.empresa}` : ""} ({cliente.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
               {clienteSeleccionado && (
                   <p className="text-xs text-muted-foreground mt-1">
                       Dirección: {clienteSeleccionado.direccion || `${clienteSeleccionado.calle || ''}, ${clienteSeleccionado.codigo_postal || ''} ${clienteSeleccionado.ciudad || ''}`.trim()} | NIF: {clienteSeleccionado.nif_cif || clienteSeleccionado.nif || 'N/A'}
                   </p>
               )}
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metodoPago">Método de Pago</Label>
                  <Select value={formData.metodoPago} onValueChange={(value) => setFormData({ ...formData, metodoPago: value })}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar método" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta de Crédito</SelectItem>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="notas">Notas</Label>
                <Textarea id="notas" value={formData.notas} onChange={(e) => setFormData({ ...formData, notas: e.target.value })} placeholder="Notas adicionales para la factura..." rows={2} />
              </div>
          </CardContent>
        </Card>

        {formData.clienteId && (
          <Card>
            <CardHeader>
              <CardTitle>Albaranes Pendientes de Facturar <span className="text-destructive">*</span></CardTitle>
               <p className="text-sm text-muted-foreground">Selecciona los albaranes que deseas incluir en esta factura.</p>
            </CardHeader>
            <CardContent>
              {loadingAlbaranes ? (
                <div className="flex items-center justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /><span className="ml-2 text-muted-foreground">Cargando...</span></div>
              ) : albaranesPendientes.length > 0 ? (
                <div className={cn("space-y-3 max-h-60 overflow-y-auto pr-2 border rounded-md p-3", error?.includes("albarán") && "border-destructive")}>
                  {albaranesPendientes.map((albaran) => (
                    <div key={albaran.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded">
                       <Checkbox
                           id={`albaran-${albaran.id}`}
                           checked={albaranesSeleccionadosIds.includes(albaran.id)}
                           onCheckedChange={(checked) => handleAlbaranSelectionChange(albaran.id, checked)}
                       />
                      <Label htmlFor={`albaran-${albaran.id}`} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                           <span className="font-medium">{albaran.numero_albaran}</span>
                           <span className="text-xs text-muted-foreground">
                             Entrega: {new Date(albaran.fecha_entrega).toLocaleDateString()}
                           </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{albaran.direccion_entrega}</p>
                         <p className="text-xs text-muted-foreground mt-1">
                             Artículos: {albaran.articulos_json?.length || 0}
                         </p>
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                 <p className="text-center text-muted-foreground py-6">{error || "No hay albaranes pendientes para este cliente."}</p>
              )}
               {error?.includes("albarán") && <p className="text-sm text-destructive mt-2">{error}</p>}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle>Líneas de Factura</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {lineas.length === 0 ? (
                 <p className="text-center text-muted-foreground py-6">Selecciona al menos un albarán para generar las líneas.</p>
            ) : (
                lineas.map((linea, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                      <div className="md:col-span-2 space-y-1">
                        <Label>Descripción</Label>
                        <Input value={linea.descripcion} readOnly className="bg-muted/50"/>
                        {linea.origen_albaran && <p className="text-xs text-muted-foreground">Origen: {linea.origen_albaran}</p>}
                      </div>
                      <div className="space-y-1">
                        <Label>Cantidad</Label>
                        <Input type="number" value={linea.cantidad} readOnly className="bg-muted/50"/>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`precio-${index}`}>Precio Unit. (€) <span className="text-destructive">*</span></Label>
                        <Input
                          id={`precio-${index}`} type="number" step="0.01" min="0" required
                          value={linea.precio_unitario}
                          onChange={(e) => actualizarLinea(index, "precio_unitario", e.target.value)} // Pasa el valor como string inicialmente
                          className={cn(linea.precio_unitario <= 0 && error?.includes("precio inválido") && "border-destructive")}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`descuento-${index}`}>Desc. (%)</Label>
                        <Input
                          id={`descuento-${index}`} type="number" step="0.01" min="0" max="100"
                          value={linea.descuento}
                          onChange={(e) => actualizarLinea(index, "descuento", e.target.value)} // Pasa el valor como string
                        />
                      </div>
                    </div>
                    <div className="flex justify-end font-medium">Subtotal Línea: €{linea.subtotal.toFixed(2)}</div>
                  </div>
                ))
            )}
             {error?.includes("precio inválido") && <p className="text-sm text-destructive mt-2">{error}</p>}
          </CardContent>
        </Card>

         {lineas.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Resumen Total</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-lg"><span>Subtotal:</span><span className="font-medium">€{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-lg"><span>IVA (21%):</span><span className="font-medium">€{iva.toFixed(2)}</span></div>
                <div className="flex justify-between text-2xl font-bold pt-3 border-t mt-2"><span>Total Factura:</span><span className="text-primary">€{total.toFixed(2)}</span></div>
              </CardContent>
            </Card>
         )}

        <div className="flex justify-end gap-3 mt-6 items-center">
           {error && !error.includes("cliente") && !error.includes("albarán") && !error.includes("precio inválido") && (
                <Alert variant="destructive" className="flex-1 text-sm py-2 px-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
           )}
          <Button type="button" variant="outline" onClick={() => router.push("/facturacion")} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting || lineas.length === 0 || albaranesSeleccionadosIds.length === 0 || !!error}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSubmitting ? "Creando..." : "Crear Factura"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Asegúrate de importar o definir el componente Checkbox
// import { Checkbox } from "@/components/ui/checkbox";
