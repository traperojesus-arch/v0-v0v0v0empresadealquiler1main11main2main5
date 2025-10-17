"use server"

import { createClient } from "@supabase/supabase-js"

export async function createAdminUser(email: string, password: string, fullName: string) {
  try {
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUsers?.users.some((u) => u.email === email)

    if (userExists) {
      return {
        success: false,
        error: "Este email ya está registrado. Intenta iniciar sesión.",
      }
    }

    // Create user with admin role using service role (bypasses email confirmation)
    const { data: authData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
        role: "admin",
      },
    })

    if (signUpError) {
      console.error("[v0] Sign up error:", signUpError)
      return {
        success: false,
        error: signUpError.message,
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: "No se pudo crear el usuario",
      }
    }

    // Wait a bit for the trigger to create the profile
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Ensure profile exists with admin role
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
      {
        id: authData.user.id,
        full_name: fullName,
        role: "admin",
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      },
    )

    if (profileError) {
      console.error("[v0] Profile error:", profileError)
      // Don't fail if profile creation fails, user is already created
    }

    return {
      success: true,
      message: "Usuario administrador creado exitosamente",
    }
  } catch (error: any) {
    console.error("[v0] Setup error:", error)
    return {
      success: false,
      error: error.message || "Error desconocido al crear el usuario",
    }
  }
}
