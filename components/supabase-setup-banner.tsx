"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function SupabaseSetupBanner() {
  const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE_TABLES === "true"

  if (useSupabase) {
    return null
  }

  return (
    <Alert className="mb-6 border-amber-500 bg-amber-50">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-900">Modo de demostración</AlertTitle>
      <AlertDescription className="text-amber-800">
        <p className="mb-2">La aplicación está usando datos de ejemplo. Para usar tu base de datos de Supabase:</p>
        <ol className="list-decimal list-inside space-y-1 mb-3 text-sm">
          <li>
            Ejecuta los scripts SQL en la carpeta <code className="bg-amber-100 px-1 rounded">scripts/</code>
          </li>
          <li>
            Agrega la variable de entorno <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_USE_SUPABASE_TABLES=true</code>
          </li>
        </ol>
        <Button
          variant="outline"
          size="sm"
          className="border-amber-600 text-amber-900 hover:bg-amber-100 bg-transparent"
          onClick={() => {
            // Abrir el panel de variables de entorno
            window.open("https://vercel.com/docs/projects/environment-variables", "_blank")
          }}
        >
          Ver documentación
        </Button>
      </AlertDescription>
    </Alert>
  )
}
