// app/actions/reservas-actions.ts
"use server";

import { createServerClient, shouldUseSupabase } from "@/lib/supabase/server";
import { mockStore } from "@/lib/mock-data-store";
import { revalidatePath } from "next/cache";

// --- Interfaz (debe coincidir con la de pedidos-actions) ---
interface ReservaFormData {
  clienteId: string;
  nombre?: string;
  apellido?: string;
  empresa?: string;
  telefono?: string;
  email?: string;
  fechaInicio: string;
  fechaFin: string;
  calle?: string;
  codigoPostal?: string;
  ciudad?: string;
  notas?: string;
  articulos: Array<{ id: string; nombre: string; cantidad: number; precio_unitario: number }>;
}


// --- CREAR RESERVA ---
// Esta acción crea una entrada en la tabla 'reservas'
export async function createReserva(formData: ReservaFormData) {
  const useSupabase = shouldUseSupabase();
  console.log(`[Action createReserva] Iniciando. Usando Supabase: ${useSupabase}`);

  if (!useSupabase) {
    console.log("[v0] Usando datos mock para createReserva");
    const newMockReserva = mockStore.addReserva({ /* ... (lógica mock) ... */ });
    revalidatePath("/reservas");
    return { success: true, data: newMockReserva };
  }

  const supabase = createServerClient();
  if (!supabase) return { success: false, error: "Supabase no config." };

  try {
    const year = new Date().getFullYear();
    const { count, error: countError } = await supabase.from("reservas").select('*', { count: 'exact', head: true });
    if (countError) throw countError;
    const numeroReserva = `RES-${year}-${String((count || 0) + 1).padStart(4, "0")}`;

    const dias = Math.max(1, Math.ceil((new Date(formData.fechaFin).getTime() - new Date(formData.fechaInicio).getTime()) / (1000 * 60 * 60 * 24))) || 1;
    const subtotal = formData.articulos.reduce((sum, art) => sum + (art.cantidad * art.precio_unitario * dias), 0);
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    // 1. Insertar la reserva
    const { data: reservaData, error: reservaError } = await supabase
      .from("reservas")
      .insert([{
        numero_reserva: numeroReserva,
        cliente_id: formData.clienteId,
        cliente_nombre: `${formData.nombre || ''} ${formData.apellido || ''}`.trim(),
        cliente_empresa: formData.empresa,
        cliente_telefono: formData.telefono,
        cliente_email: formData.email,
        fecha_inicio: formData.fechaInicio,
        fecha_fin: formData.fechaFin,
        calle: formData.calle,
        codigo_postal: formData.codigoPostal,
        ciudad: formData.ciudad,
        estado: 'pendiente',
        notas: formData.notas,
        subtotal: subtotal,
        iva: iva,
        total: total,
      }])
      .select()
      .single();

    if (reservaError) throw reservaError;

    // 2. Insertar los items
    if (formData.articulos.length > 0) {
      const itemsData = formData.articulos.map(art => ({
        reserva_id: reservaData.id,
        articulo_id: art.id,
        articulo_nombre: art.nombre,
        cantidad: art.cantidad,
        precio_unitario: art.precio_unitario * dias, // Precio total por días
        subtotal: art.cantidad * art.precio_unitario * dias,
      }));
      const { error: itemsError } = await supabase.from("items_reserva").insert(itemsData);
      if (itemsError) { console.error("Error insertando items_reserva:", itemsError); }
    }

    revalidatePath("/reservas");
    return { success: true, data: reservaData };

  } catch (error: any) {
    console.error("[Action createReserva] Excepción:", error);
    return { success: false, error: error.message };
  }
}

// --- OBTENER RESERVAS ---
export async function getReservas(filters?: { estado?: string; search?: string }) {
  if (!shouldUseSupabase()) {
    return { success: true, data: mockStore.getReservas() };
  }
  const supabase = createServerClient();
  if (!supabase) return { success: false, error: "Supabase no config.", data: [] };
  try {
    let query = supabase.from("reservas").select("*").order("fecha_reserva", { ascending: false });
    if (filters?.estado && filters.estado !== 'todos') query = query.eq('estado', filters.estado);
    if (filters?.search) query = query.or(`numero_reserva.ilike.%${filters.search}%,cliente_nombre.ilike.%${filters.search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error("Error getReservas:", error);
    return { success: false, error: error.message, data: [] };
  }
}

// --- OBTENER RESERVA POR ID ---
export async function getReservaById(id: string) {
   if (!shouldUseSupabase()) {
       const reserva = mockStore.getReservas().find(r => r.id === id);
       return { success: true, data: reserva ? {...reserva, items: reserva.articulos} : null }; // Simula items
   }
    const supabase = createServerClient();
    if (!supabase) return { success: false, error: "Supabase no config.", data: null };
    try {
        const { data, error } = await supabase
            .from('reservas')
            .select('*, items:items_reserva(*)') // Carga los items asociados
            .eq('id', id)
            .single();
        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
         console.error(`Error getReservaById (${id}):`, error);
         return { success: false, error: error.message, data: null };
    }
}

// --- ELIMINAR RESERVA ---
export async function deleteReserva(id: string) {
  if (!shouldUseSupabase()) {
    revalidatePath("/reservas");
    return { success: true };
  }
  const supabase = createServerClient();
  if (!supabase) return { success: false, error: "Supabase no config." };
  try {
    // Borrado en cascada debería eliminar items_reserva
    const { error } = await supabase.from("reservas").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/reservas");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleteReserva:", error);
    return { success: false, error: error.message };
  }
}
