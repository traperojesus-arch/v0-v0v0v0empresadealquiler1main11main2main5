import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"
import { ToastProvider } from "@/components/toast-provider"

export const metadata: Metadata = {
  title: "Sistema de Alquiler",
  description: "Aplicación de gestión de alquiler de equipos",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <ToastProvider>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando...</div>}>
            {children}
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  )
}
