"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function uploadImage(formData: FormData) {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Supabase no configurado" }
  }

  try {
    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "No se proporcionó archivo" }
    }

    // Generar nombre único para el archivo
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `articulos/${fileName}`

    // Subir archivo a Supabase Storage
    const { data, error } = await supabase.storage.from("imagenes").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("[v0] Error subiendo imagen:", error)
      return { success: false, error: error.message }
    }

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from("imagenes").getPublicUrl(filePath)

    return { success: true, url: publicUrl, path: filePath }
  } catch (error: any) {
    console.error("[v0] Error en uploadImage:", error)
    return { success: false, error: error.message || "Error al subir imagen" }
  }
}

export async function deleteImage(path: string) {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Supabase no configurado" }
  }

  try {
    const { error } = await supabase.storage.from("imagenes").remove([path])

    if (error) {
      console.error("[v0] Error eliminando imagen:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error en deleteImage:", error)
    return { success: false, error: error.message || "Error al eliminar imagen" }
  }
}
