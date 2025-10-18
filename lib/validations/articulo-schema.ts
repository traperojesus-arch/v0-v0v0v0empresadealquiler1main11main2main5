import { z } from "zod"

export const articuloSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(200, "El nombre es demasiado largo"),
  categoria: z.string().min(1, "La categoría es requerida"),
  subtitulo: z.string().max(300, "El subtítulo es demasiado largo").optional(),
  descripcion: z.string().max(1000, "La descripción es demasiado larga").optional(),
  cantidad: z.number().int().min(1, "La cantidad debe ser al menos 1").max(1000, "Cantidad máxima excedida"),
  costeCompra: z.number().min(0, "El coste no puede ser negativo").optional(),
  fechaCompra: z.string().optional(),
  proveedor: z.string().optional(),
  precios: z
    .object({
      metro: z.object({
        activo: z.boolean(),
        valor: z.number().min(0, "El precio no puede ser negativo"),
      }),
      hora: z.object({
        activo: z.boolean(),
        valor: z.number().min(0, "El precio no puede ser negativo"),
      }),
      dia: z.object({
        activo: z.boolean(),
        valor: z.number().min(0, "El precio no puede ser negativo"),
      }),
      diaCalendario: z.object({
        activo: z.boolean(),
        valor: z.number().min(0, "El precio no puede ser negativo"),
      }),
      noche: z.object({
        activo: z.boolean(),
        valor: z.number().min(0, "El precio no puede ser negativo"),
      }),
    })
    .refine(
      (precios) => {
        // Al menos un precio debe estar activo con valor mayor a 0
        return Object.values(precios).some((precio) => precio.activo && precio.valor > 0)
      },
      {
        message: "Debes configurar al menos un precio mayor a 0",
      },
    ),
  imagenes: z.array(z.any()).max(10, "Máximo 10 imágenes permitidas").optional(),
})

export type ArticuloFormData = z.infer<typeof articuloSchema>
