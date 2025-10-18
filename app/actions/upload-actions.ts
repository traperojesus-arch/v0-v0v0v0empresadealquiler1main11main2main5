"use server"

import { createClient } from "@/lib/supabase/server"

export async function uploadImage(formData: FormData) {
  try {
    const supabase = await createClient()

    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "No se proporcionó archivo" }
    }

    console.log("[v0] Subiendo imagen:", file.name, "Tamaño:", file.size)

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
      console.error("[v0] Error subiendo imagen a Supabase Storage:", error)
      return { success: false, error: error.message }
    }

    console.log("[v0] Imagen subida exitosamente:", data)

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from("imagenes").getPublicUrl(filePath)

    console.log("[v0] URL pública generada:", publicUrl)

    return { success: true, url: publicUrl, path: filePath }
  } catch (error: any) {
    console.error("[v0] Error en uploadImage:", error)
    return { success: false, error: error.message || "Error al subir imagen" }
  }
}

export async function deleteImage(path: string) {
  try {
    const supabase = await createClient()

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
