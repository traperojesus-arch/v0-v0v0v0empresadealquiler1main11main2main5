// app/actions/facturas-actions.ts
"use server";

import { createServerClient, shouldUseSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { mockStore } from "@/lib/mock-data-store"; // Asegúrate que mockStore tenga lógica para albaranes si la usas

// --- OBTENER ALBARANES PENDIENTES DE FACTURAR POR CLIENTE ---
export async function getAlbaranesPendientes(clienteId: string) {
  console.log(`[Action] Buscando albaranes pendientes para cliente: ${clienteId}`);

  // Lógica Mock
  if (!shouldUseSupabase()) {
    console.log("[v0] Usando mock data para getAlbaranesPendientes");
    // Asume que mockStore tiene getAlbaranes y updateAlbaran
    const albaranesMock = mockStore.getAlbaranes()
      .filter(a => a.cliente_id === clienteId && a.estado !== 'facturado');
    return { success: true, data: albaranesMock };
  }

  // Lógica Supabase
  const supabase = createServerClient();
  if (!supabase) {
    console.error("Supabase client no disponible en getAlbaranesPendientes");
    return { success: false, error: "Supabase no configurado", data: [] };
  }

  try {
    const { data, error } = await supabase
      .from('albaranes') // Nombre de tu tabla de albaranes
      .select('id, numero_albaran, fecha_entrega, direccion_entrega, articulos_json') // Incluye articulos_json
      .eq('cliente_id', clienteId)
      .neq('estado', 'facturado') // Solo los no facturados
      .is('factura_id', null) // Otra forma de asegurar que no están facturados
      .order('fecha_entrega', { ascending: false });

    if (error) {
      console.error("Error Supabase getAlbaranesPendientes:", error);
      throw error;
    }

    console.log(`[Action] Encontrados ${data?.length || 0} albaranes pendientes`);
    return { success: true, data: data || [] };

  } catch (error: any) {
    console.error("Catch Error getAlbaranesPendientes:", error);
    return { success: false, error: error.message || "Error al obtener albaranes", data: [] };
  }
}

// --- CREAR FACTURA Y ACTUALIZAR ALBARANES ---
// Ajusta 'any' a un tipo más específico para facturaData si lo tienes
export async function createFactura(facturaData: any, albaranIds: string[]) {
  console.log(`[Action] Creando factura para albaranes: ${albaranIds.join(', ')}`);

   // Lógica Mock
  if (!shouldUseSupabase()) {
    console.log("[v0] Mock createFactura");
    const newFacturaMock = mockStore.addFactura({ // Necesitas implementar addFactura
        numero: facturaData.numero_factura || `F-MOCK-${Date.now()}`,
        cliente_id: facturaData.cliente_id,
        cliente_nombre: facturaData.cliente_nombre || "Cliente Mock",
        fecha_emision: facturaData.fecha_emision,
        fecha_vencimiento: facturaData.fecha_vencimiento,
        estado: 'pendiente',
        articulos: facturaData.lineas?.map((l:any) => ({
            descripcion: l.descripcion,
            cantidad: l.cantidad,
            precio_unitario: l.precio_unitario,
            total: l.subtotal
        })) || [],
        subtotal: facturaData.subtotal,
        iva: facturaData.iva,
        total: facturaData.total,
        albaran_id: albaranIds.length > 0 ? albaranIds[0] : undefined // Mock asume solo uno?
    });
    // Simular actualización de albaranes en mock
    albaranIds.forEach(id => mockStore.updateAlbaran(id, { estado: 'facturado' })); // Necesitas updateAlbaran
    revalidatePath("/facturacion");
    return { success: true, data: newFacturaMock };
  }

  // Lógica Supabase
  const supabase = createServerClient();
  if (!supabase) {
    console.error("Supabase client no disponible en createFactura");
    return { success: false, error: "Supabase no configurado" };
  }

  try {
    // 1. Insertar la factura principal
    const datosFacturaInsertar = {
        numero_factura: facturaData.numero_factura,
        cliente_id: facturaData.cliente_id,
        fecha_emision: facturaData.fecha_emision,
        fecha_vencimiento: facturaData.fecha_vencimiento,
        subtotal: facturaData.subtotal,
        iva: facturaData.iva,
        descuento: facturaData.descuento || 0,
        total: facturaData.total,
        estado: 'pendiente',
        metodo_pago: facturaData.metodo_pago || null,
        notas: facturaData.notas || null,
        albaran_ids: albaranIds, // Guardar el array de IDs
    };

    const { data: nuevaFactura, error: facturaError } = await supabase
      .from('facturas')
      .insert([datosFacturaInsertar])
      .select()
      .single();

    if (facturaError) {
      console.error("Error Supabase al insertar factura:", facturaError);
      throw facturaError;
    }
     console.log(`[Action] Factura ${nuevaFactura.numero_factura} (ID: ${nuevaFactura.id}) creada.`);

    // 2. Insertar las líneas de la factura (si tienes tabla 'lineas_factura')
     if (facturaData.lineas && facturaData.lineas.length > 0) {
        const lineasParaInsertar = facturaData.lineas.map((linea: any) => ({
            factura_id: nuevaFactura.id,
            descripcion: linea.descripcion,
            cantidad: linea.cantidad,
            precio_unitario: linea.precio_unitario,
            descuento: linea.descuento || 0,
            subtotal: linea.subtotal,
        }));

        const { error: lineasError } = await supabase
            .from('lineas_factura')
            .insert(lineasParaInsertar);

         if (lineasError) {
             console.error("Error Supabase al insertar líneas de factura:", lineasError);
             // Considera qué hacer aquí
         } else {
              console.log(`[Action] Insertadas ${lineasParaInsertar.length} líneas para factura ${nuevaFactura.id}`);
         }
     }

    // 3. Actualizar el estado de los albaranes a 'facturado' y asociar la factura_id
    console.log(`[Action] Actualizando ${albaranIds.length} albaranes a estado 'facturado'...`);
    const { data: updateData, error: updateError } = await supabase
      .from('albaranes')
      .update({
          estado: 'facturado',
          factura_id: nuevaFactura.id // Asocia la factura creada al albarán
        })
      .in('id', albaranIds)
      .select('id, numero_albaran');

    if (updateError) {
      console.warn(`[Action] Factura ${nuevaFactura.numero_factura} creada, PERO error al actualizar albaranes:`, updateError);
      // Podrías devolver un error específico aquí
    } else {
        console.log(`[Action] Albaranes actualizados:`, updateData?.map(a => a.numero_albaran).join(', '));
    }

    revalidatePath("/facturacion");
    return { success: true, data: nuevaFactura };

  } catch (error: any) {
    console.error("Catch Error createFactura:", error);
    return { success: false, error: error.message || "Error inesperado al crear la factura" };
  }
}
