// lib/database.ts
import { shouldUseSupabase, createServerClient } from "./supabase/server";
import { mockDataStore } from "./mock-data-store";

export const articulosDB = {
  async getAll() {
    if (shouldUseSupabase()) {
      const supabase = createServerClient();
      // Added null check for supabase client
      if (!supabase) return mockDataStore.getArticulos();

      const { data, error } = await supabase.from("articulos").select("*").order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } else {
      return mockDataStore.getArticulos();
    }
  },
  async create(articulo: any) {
    if (shouldUseSupabase()) {
      const supabase = createServerClient();
      // Added null check for supabase client
      if (!supabase) return mockDataStore.addArticulo(articulo);

      const { data, error } = await supabase.from("articulos").insert(articulo).select().single();

      if (error) throw error;
      return data;
    } else {
      return mockDataStore.addArticulo(articulo);
    }
  },
};

export const pedidosDB = {
  async getAll() {
    if (shouldUseSupabase()) {
      const supabase = createServerClient();
       // Added null check for supabase client
      if (!supabase) return mockDataStore.getPedidos();

      const { data, error } = await supabase.from("pedidos").select("*").order("fecha_pedido", { ascending: false });

      if (error) throw error;
      return data;
    } else {
      return mockDataStore.getPedidos();
    }
  },
  // Esta función hace inserción directa, no llama a la Server Action `createPedidoDirecto`.
  // Si querías llamar a la Server Action desde aquí, tendrías que importarla y llamarla.
  // La lógica actual es correcta si prefieres la inserción directa en este punto.
  async create(pedido: any) {
    if (shouldUseSupabase()) {
      const supabase = createServerClient();
      // Added null check for supabase client
      if (!supabase) return mockDataStore.addPedido(pedido); // Asume addPedido en mock

      const { data, error } = await supabase.from("pedidos").insert(pedido).select().single();

      if (error) throw error;
      return data;
    } else {
      return mockDataStore.addPedido(pedido); // Asume addPedido en mock
    }
  },
};

export const usuariosDB = {
  async getAll() {
    if (shouldUseSupabase()) {
      const supabase = createServerClient();
      // Added null check for supabase client
      if (!supabase) return mockDataStore.getClientes();

      // Corregido: Asumiendo que los clientes están en 'usuarios' con rol 'cliente'
      const { data, error } = await supabase.from("usuarios").select("*").eq('rol', 'cliente').order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } else {
      return mockDataStore.getClientes();
    }
  },
  async create(usuario: any) {
    if (shouldUseSupabase()) {
      const supabase = createServerClient();
      // Added null check for supabase client
      if (!supabase) return mockDataStore.addCliente(usuario); // Asume addCliente en mock

      // Corregido: Asumiendo inserción en 'usuarios'
      const { data, error } = await supabase.from("usuarios").insert(usuario).select().single();

      if (error) throw error;
      return data;
    } else {
      return mockDataStore.addCliente(usuario); // Asume addCliente en mock
    }
  },
};
