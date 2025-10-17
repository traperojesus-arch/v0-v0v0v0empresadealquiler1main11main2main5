"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { AlertCircle, Info } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [needsSetup, setNeedsSetup] = useState(false)
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [setupMessage, setSetupMessage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAdminExists()
  }, [])

  const checkAdminExists = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("profiles").select("id").eq("role", "admin").limit(1)

    if (error || !data || data.length === 0) {
      setNeedsSetup(true)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickSetup = async () => {
    setIsSettingUp(true)
    setSetupMessage(null)
    setError(null)

    try {
      const response = await fetch("/api/setup-admin")
      const data = await response.json()

      if (data.success) {
        setSetupMessage(data.message)
        setNeedsSetup(false)
        setEmail("admin@empresa.com")
        setPassword("admin123")
      } else {
        setError(data.error || "Error al crear usuario")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsSettingUp(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>Introduce tu email y contraseña para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          {needsSetup && (
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="space-y-2">
                  <p>
                    <strong>Primera vez aquí?</strong> Crea el usuario administrador:
                  </p>
                  <Button onClick={handleQuickSetup} disabled={isSettingUp} className="w-full" size="sm">
                    {isSettingUp ? "Creando..." : "Crear Admin (admin@empresa.com)"}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {setupMessage && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                {setupMessage} Ahora puedes iniciar sesión.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@empresa.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              ¿Primera vez?{" "}
              <a href="/setup" className="text-primary hover:underline font-medium">
                Crear administrador
              </a>
            </div>

            {!needsSetup && (
              <div className="mt-4 p-3 bg-muted rounded-md text-xs space-y-1">
                <p className="font-semibold">Credenciales de prueba:</p>
                <p>
                  Email: <span className="font-mono">admin@empresa.com</span>
                </p>
                <p>
                  Contraseña: <span className="font-mono">admin123</span>
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
