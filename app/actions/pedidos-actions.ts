// app/actions/pedidos-actions.ts
"use server";

import { createServerClient, shouldUseSupabase } from "@/lib/supabase/server";
import { mockStore } from "@/lib/mock-data-store";
import { revalidatePath } from "next/cache";
// Importar la acción de borrar reserva
import { deleteReserva } from "./reservas-actions"; // Asegúrate que este archivo exista (Paso 4)

// --- Interfaz para datos del formulario ---
// (Basada en tu formulario anterior)
interface PedidoFormData {
  cliente_id: string;
  cliente_nombre?: string;
  empresa?: string;
  telefono?: string;
  email?: string;
  fecha_pedido: string;
  fecha_entrega: string; // Usaremos esta como fecha_inicio
  fecha_devolucion: string; // Usaremos esta como fecha_fin
  direccion_entrega?: string; // Construida
  calle?: string;
  codigo_postal?: string;
  ciudad?: string;
  estado: string; // 'pendiente' para reservas, 'confirmado' para pedidos
  notas?: string;
  articulos?: Array<{ articulo_id: string; cantidad: number; precio_unitario: number; nombre?: string }>;
  total?: number;
  reserva_origen_id?: string | null; // Para trazabilidad
}

// --- CREAR PEDIDO (La función que tu formulario buscaba) ---
export async function createPedido(formData: PedidoFormData) {
  const useSupabase = shouldUseSupabase();
  console.log(`[Action createPedido] Iniciando. Usando Supabase: ${useSupabase}`);

  if (!useSupabase) {
    console.log("[v0] Usando datos mock para crear pedido/reserva");
    const newMockPedido = mockStore.addPedido({ // O addReserva si tu mock lo prefiere
        id: Date.now().toString(),
        numeroPedido: `MOCK-${Date.now()}`,
        cliente_id: formData.cliente_id,
        cliente: formData.cliente_nombre || "Cliente Mock",
        fecha_desde: formData.fecha_entrega,
        fecha_hasta: formData.fecha_devolucion,
        fechaInicio: formData.fecha_entrega,
        fechaFin: formData.fecha_devolucion,
        estado: formData.estado as any, // 'pendiente'
        articulos: formData.articulos || [],
        total: formData.total || 0,
        // ... (otros campos mock)
    });
    revalidatePath(formData.estado === 'pendiente' ? "/reservas" : "/pedidos");
    return { success: true, data: newMockPedido };
  }

  const supabase = createServerClient();
  if (!supabase) return { success: false, error: "Supabase no configurado" };

  try {
    // Generar número de pedido
    const year = new Date().getFullYear();
    const { count, error: countError } = await supabase.from("pedidos").select('*', { count: 'exact', head: true });
    if (countError) throw countError;
    const numeroPedido = `PED-${year}-${String((count || 0) + 1).padStart(4, "0")}`;

    // 1. Preparar datos para tabla 'pedidos'
    const pedidoData = {
        numero_pedido: numeroPedido,
        cliente_id: formData.cliente_id,
        cliente_nombre: formData.cliente_nombre,
        cliente_empresa: formData.empresa,
        cliente_telefono: formData.telefono,
        cliente_email: formData.email,
        fecha_pedido: formData.fecha_pedido,
        fecha_inicio: formData.fecha_entrega, // Mapeo
        fecha_fin: formData.fecha_devolucion,  // Mapeo
        calle: formData.calle,
        codigo_postal: formData.codigo_postal,
        ciudad: formData.ciudad,
        estado: formData.estado, // 'pendiente'
        notas: formData.notas,
        subtotal: (formData.total || 0) / 1.21, // Asume 21% IVA
        iva: (formData.total || 0) - ((formData.total || 0) / 1.21),
        total: formData.total,
        reserva_origen_id: formData.reserva_origen_id,
    };

    const { data: nuevoPedido, error: pedidoError } = await supabase
      .from("pedidos")
      .insert([pedidoData])
      .select()
      .single();

    if (pedidoError) throw pedidoError;

    // 2. Preparar e insertar 'items_pedido'
    if (formData.articulos && formData.articulos.length > 0) {
      const itemsData = formData.articulos.map(art => ({
        pedido_id: nuevoPedido.id,
        articulo_id: art.articulo_id,
        articulo_nombre: art.nombre,
        cantidad: art.cantidad,
        precio_unitario: art.precio_unitario, // Asume que este es el precio por día
        subtotal: art.cantidad * art.precio_unitario // Ajustar si el precio es total
      }));
      const { error: itemsError } = await supabase.from("items_pedido").insert(itemsData);
      if (itemsError) {
         console.error("Error insertando items_pedido:", itemsError);
         // Considerar si revertir
      }
    }

    // Revalidar ambas rutas por si acaso
    revalidatePath("/reservas");
    revalidatePath("/pedidos");

    return { success: true, data: nuevoPedido };

  } catch (error: any) {
    console.error("[Action createPedido] Excepción:", error);
    return { success: false, error: error.message };
  }
}

// --- RESTO DE ACCIONES (getPedidos, getPedidoById, etc.) ---
// (Estas funciones son necesarias para listar y ver detalles)

export async function getPedidos(filters?: { estado?: string; search?: string }) {
  if (!shouldUseSupabase()) {
    return { success: true, data: mockStore.getPedidos() };
  }
  const supabase = createServerClient();
  if (!supabase) return { success: false, data: [], error: "Supabase no config." };
  try {
    let query = supabase.from("pedidos").select("*, cliente:cliente_id(nombre)").order("fecha_pedido", { ascending: false });
    if (filters?.estado && filters.estado !== 'todos') query = query.eq('estado', filters.estado);
    if (filters?.search) query = query.or(`numero_pedido.ilike.%${filters.search}%,cliente_nombre.ilike.%${filters.search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error("Error getPedidos:", error);
    return { success: false, data: [], error: error.message };
  }
}

export async function getPedidoById(id: string) {
    if (!shouldUseSupabase()) {
        const pedido = mockStore.getPedidos().find(p => p.id === id); // Asume mockStore.getPedidos
        // Simular la estructura de datos que espera el detalle
        const dataSimulada = pedido ? {
            ...pedido,
            numero_pedido: pedido.numeroPedido,
            cliente_nombre: pedido.cliente,
            fecha_pedido: pedido.fecha_desde,
            fecha_entrega: pedido.fecha_desde,
            fecha_recogida: pedido.fecha_hasta,
            usuarios: { nombre: pedido.cliente, email: pedido.email },
        } : null;
        return { success: true, data: dataSimulada };
    }
    const supabase = createServerClient();
    if (!supabase) return { success: false, error: "Supabase no config.", data: null };
    try {
        const { data, error } = await supabase
            .from('pedidos')
            .select('*, items:items_pedido(*), usuarios:cliente_id(*)') // Carga items y cliente
            .eq('id', id)
            .single();
        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error(`Error getPedidoById (${id}):`, error);
        return { success: false, error: error.message, data: null };
    }
}

export async function updatePedido(id: string, updates: Partial<PedidoFormData>) {
    if (!shouldUseSupabase()) {
        const updated = mockStore.updatePedido(id, updates); // Asume mockStore.updatePedido
        revalidatePath("/pedidos");
        revalidatePath("/reservas");
        return { success: true, data: updated };
    }
    const supabase = createServerClient();
    if (!supabase) return { success: false, error: "Supabase no config." };
    try {
        const { data, error } = await supabase.from('pedidos').update(updates).eq('id', id).select().single();
        if (error) throw error;
        revalidatePath("/pedidos");
        revalidatePath("/reservas");
        return { success: true, data };
    } catch (error: any) {
        console.error(`Error updatePedido (${id}):`, error);
        return { success: false, error: error.message };
    }
}

export async function deletePedido(id: string) {
    if (!shouldUseSupabase()) {
        // mockStore.deletePedido(id); // Asume
        revalidatePath("/pedidos");
        return { success: true };
    }
    const supabase = createServerClient();
    if (!supabase) return { success: false, error: "Supabase no config." };
    try {
        const { error } = await supabase.from('pedidos').delete().eq('id', id);
        if (error) throw error;
        revalidatePath("/pedidos");
        return { success: true };
    } catch (error: any) {
        console.error(`Error deletePedido (${id}):`, error);
        return { success: false, error: error.message };
    }
}

// --- CONVERTIR RESERVA A PEDIDO (Mueve los datos y borra la reserva) ---
export async function convertirReservaAPedido(reservaId: string) {
   console.log(`[Action] Convirtiendo reserva ${reservaId} a pedido...`);
   if (!shouldUseSupabase()) {
        // Simular conversión
        console.log("[v0] Mock convertirReservaAPedido");
        revalidatePath("/reservas");
        revalidatePath("/pedidos");
        return { success: true, data: { id: Date.now().toString(), numero_pedido: "PED-MOCK-1" } };
   }
   
   const supabase = createServerClient();
   if (!supabase) return { success: false, error: "Supabase no config." };

   try {
       // 1. Obtener la reserva y sus items
       const { data: reserva, error: reservaError } = await supabase
           .from('reservas')
           .select('*, items:items_reserva(*)')
           .eq('id', reservaId)
           .single();

       if (reservaError || !reserva) { throw new Error(`Reserva no encontrada: ${reservaError?.message || 'No data'}`); }
       if (reserva.estado !== 'pendiente' && reserva.estado !== 'confirmado') { throw new Error(`La reserva ya está en estado ${reserva.estado}`); }
       if (!reserva.calle || !reserva.codigo_postal || !reserva.ciudad) { throw new Error("Faltan datos de dirección en la reserva. Edítala primero."); }

       // 2. Generar número de pedido
       const year = new Date().getFullYear();
       const { count, error: countError } = await supabase.from("pedidos").select('*', { count: 'exact', head: true });
       if (countError) throw countError;
       const numeroPedido = `PED-${year}-${String((count || 0) + 1).padStart(4, "0")}`;
       
       // 3. Crear el nuevo Pedido
       const { data: nuevoPedido, error: pedidoError } = await supabase
           .from('pedidos')
           .insert([{
               numero_pedido: numeroPedido,
               reserva_origen_id: reserva.id,
               cliente_id: reserva.cliente_id,
               cliente_nombre: reserva.cliente_nombre,
               cliente_email: reserva.cliente_email,
               cliente_telefono: reserva.cliente_telefono,
               cliente_empresa: reserva.cliente_empresa,
               cliente_nif: reserva.cliente_nif,
               fecha_pedido: new Date().toISOString(),
               fecha_inicio: reserva.fecha_inicio,
               fecha_fin: reserva.fecha_fin,
               calle: reserva.calle,
               codigo_postal: reserva.codigo_postal,
               ciudad: reserva.ciudad,
               estado: 'confirmado', // Estado inicial del pedido
               subtotal: reserva.subtotal,
               iva: reserva.iva,
               total: reserva.total,
               notas: reserva.notas,
           }])
           .select()
           .single();
        
       if (pedidoError) throw pedidoError;

       // 4. Mover los items de reserva a items_pedido
       if (reserva.items && reserva.items.length > 0) {
           const itemsParaPedido = reserva.items.map((item: any) => ({
               pedido_id: nuevoPedido.id,
               articulo_id: item.articulo_id,
               articulo_codigo: item.articulo_codigo,
               articulo_nombre: item.articulo_nombre,
               cantidad: item.cantidad,
               precio_unitario: item.precio_unitario,
               subtotal: item.subtotal,
           }));
           const { error: itemsError } = await supabase.from('items_pedido').insert(itemsParaPedido);
           if (itemsError) { console.warn("Pedido creado, pero error al mover items:", itemsError.message); }
       }

       // 5. Eliminar la reserva original (¡Transaccional sería ideal!)
       const { error: deleteError } = await deleteReserva(reservaId); // Llama a la acción de borrar
       if (deleteError) { console.warn("Pedido creado, pero error al borrar reserva:", deleteError); }

       revalidatePath("/reservas");
       revalidatePath("/pedidos");
       toast.success(`Reserva ${reserva.numero_reserva} convertida a Pedido ${nuevoPedido.numero_pedido}`);
       return { success: true, data: nuevoPedido };

   } catch (error: any) {
       console.error("[Action convertirReservaAPedido] Excepción:", error);
       return { success: false, error: error.message };
   }
}
