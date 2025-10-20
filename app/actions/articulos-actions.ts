// app/actions/articulos-actions.ts
"use server";

import { createServerClient, shouldUseSupabase, isTableNotFoundError } from "@/lib/supabase/server";
import { mockStore } from "@/lib/mock-data-store"; // Asegúrate que mockStore tenga getArticulos
import { revalidatePath } from "next/cache";

export async function getArticulos(filters?: { categoria?: string; estado?: string; search?: string }) {
  console.log("[Action getArticulos] Iniciando. Filtros:", filters);
  const useSupabase = shouldUseSupabase();
  console.log("[Action getArticulos] Usando Supabase:", useSupabase);

  if (!useSupabase) {
    console.log("[Action getArticulos] Devolviendo datos mock.");
    // Lógica Mock (asegúrate que funcione y aplique filtros si es necesario)
    let articulos = mockStore.getArticulos();
    // Aplicar filtros mock si existen...
    return { success: true, data: articulos };
  }

  const supabase = createServerClient();
  if (!supabase) {
    console.error("[Action getArticulos] Error: Cliente Supabase no disponible. Devolviendo mock.");
    // Fallback a mock si el cliente no se crea
    return { success: true, data: mockStore.getArticulos() };
  }

  try {
    console.log("[Action getArticulos] Construyendo query Supabase...");
    let query = supabase.from("articulos").select("*").order("created_at", { ascending: false });

    // Aplicar filtros de Supabase si existen...
    if (filters?.categoria && filters.categoria !== "todas") {
        query = query.eq("categoria", filters.categoria);
        console.log(`[Action getArticulos] Aplicado filtro categoria: ${filters.categoria}`);
    }
     if (filters?.search) {
        query = query.or(`nombre.ilike.%${filters.search}%,codigo.ilike.%${filters.search}%,descripcion.ilike.%${filters.search}%`); // Añadido código a la búsqueda
        console.log(`[Action getArticulos] Aplicado filtro búsqueda: ${filters.search}`);
    }
    // Añade otros filtros si los necesitas (estado, etc.)

    console.log("[Action getArticulos] Ejecutando query...");
    const { data, error, count } = await query;

    if (error) {
        console.error("[Action getArticulos] Error en query Supabase:", error);
        if (isTableNotFoundError(error)) {
            console.warn("[Action getArticulos] Tabla 'articulos' no encontrada. Devolviendo mock.");
            // markTablesAsNonExistent(); // Considera si necesitas esta lógica
            return { success: true, data: mockStore.getArticulos() };
        }
        // Si es otro error, devuélvelo
         return { success: false, error: `Error DB: ${error.message}`, data: [] };
        // O podrías devolver mock como fallback aquí también si prefieres
        // console.warn("[Action getArticulos] Error query, devolviendo mock como fallback.");
        // return { success: true, data: mockStore.getArticulos() };
    }

    console.log(`[Action getArticulos] Query exitosa. ${data?.length ?? 0} artículos encontrados.`);
    return { success: true, data: data || [] };

  } catch (error: any) {
    console.error("[Action getArticulos] Excepción:", error);
    // Fallback a mock en caso de excepción inesperada
    console.warn("[Action getArticulos] Excepción, devolviendo mock como fallback.");
    return { success: true, data: mockStore.getArticulos() };
  }
}

// ... (resto de acciones: createArticulo, updateArticulo, etc.) ...
// Asegúrate de que estas otras acciones también verifiquen shouldUseSupabase()
// y tengan manejo de errores similar si las estás usando.

export async function createArticulo(formData: any) { /* ... */ }
export async function updateArticulo(id: string, formData: any) { /* ... */ }
export async function deleteArticulo(id: string) { /* ... */ }
export async function getArticuloById(id: string) { /* ... */ }
export async function getHistorialArticulo(articuloId: string) { /* ... */ }
