"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { createAdminUser } from "@/app/actions/setup-actions"

export default function SetupPage() {
  const [email, setEmail] = useState("admin@empresa.com")
  const [password, setPassword] = useState("admin123")
  const [fullName, setFullName] = useState("Administrador")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await createAdminUser(email, password, fullName)

      if (result.success) {
        setSuccess(true)
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
      } else {
        setError(result.error || "Error al crear el usuario")
      }
    } catch (err: any) {
      console.error("[v0] Setup error:", err)
      setError(err.message || "Error al crear el usuario administrador")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Configuración Inicial</CardTitle>
          <CardDescription>Crea el usuario administrador para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Usuario administrador creado exitosamente. Redirigiendo al login...
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSetup} className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-xs">
                  Usa las credenciales predeterminadas o crea las tuyas propias.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creando..." : "Crear Administrador"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <a href="/login" className="text-primary hover:underline">
                  Iniciar sesión
                </a>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
