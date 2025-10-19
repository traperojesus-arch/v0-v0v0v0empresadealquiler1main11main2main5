import { createBrowserClient } from '@supabase/ssr'

/**
 * Inicializa y devuelve un cliente de Supabase para usar en el lado del cliente (navegador).
 *
 * NOTA: Este cliente debe usarse en componentes marcados con "use client".
 * Para el uso en el lado del servidor o en Server Components, usa el cliente adecuado.
 */
export function createClient() {
  return createBrowserClient(
    // Las variables de entorno deben estar disponibles en el navegador.
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
