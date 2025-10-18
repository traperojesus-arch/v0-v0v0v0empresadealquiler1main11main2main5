import { createBrowserClient } from "@supabase/ssr"

/**
 * Función que crea y devuelve un cliente de Supabase para usar en el lado del cliente (navegador).
 */
export function createClient() { 
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
