import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const email = "admin@empresa.com"
    const password = "admin123"

    // Intentar crear el usuario
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nombre: "Administrador",
        rol: "admin",
      },
    })

    if (createError) {
      // Si el usuario ya existe, actualizar la contraseña
      if (createError.message.includes("already registered")) {
        const { data: users } = await supabase.auth.admin.listUsers()
        const existingUser = users.users.find((u) => u.email === email)

        if (existingUser) {
          await supabase.auth.admin.updateUserById(existingUser.id, { password })

          return NextResponse.json({
            success: true,
            message: "Usuario ya existía. Contraseña actualizada.",
            credentials: { email, password },
          })
        }
      }
      throw createError
    }

    // Crear perfil si no existe
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userData.user.id,
      nombre: "Administrador",
      email: email,
      rol: "admin",
    })

    if (profileError) {
      console.error("Error creando perfil:", profileError)
    }

    return NextResponse.json({
      success: true,
      message: "Usuario administrador creado exitosamente",
      credentials: { email, password },
    })
  } catch (error: any) {
    console.error("Error:", error)
    return NextResponse.json(
      {
        error: error.message || "Error desconocido",
        details: error,
      },
      { status: 500 },
    )
  }
}
