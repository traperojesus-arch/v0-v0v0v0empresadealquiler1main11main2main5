import { createBrowserClient } from "@supabase/ssr"

/**
 * Función que crea y devuelve un cliente de Supabase para usar en el lado del cliente (navegador).
 */
export function createClient() { // Exportación nombrada
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Exportación por defecto para satisfacer a los loaders que lo requieran
export default createClient;
