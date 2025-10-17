import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function shouldUseSupabase(): boolean {
  return process.env.NEXT_PUBLIC_USE_SUPABASE_TABLES === "true"
}

export function isTableNotFoundError(error: any): boolean {
  return error?.code === "42P01" || error?.message?.includes("does not exist")
}

export function markTablesAsNonExistent(): void {
  // This is a no-op function for compatibility
  // In a real implementation, you might want to cache this information
}

export function createServerClient() {
  if (!shouldUseSupabase()) {
    return null
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("[v0] Supabase environment variables not configured")
    return null
  }

  return createSupabaseServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      async getAll() {
        const cookieStore = await cookies()
        return cookieStore.getAll()
      },
      async setAll(cookiesToSet) {
        try {
          const cookieStore = await cookies()
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export async function createClient() {
  const cookieStore = await cookies()

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables not configured")
  }

  return createSupabaseServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
