"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Calendar,
  Users,
  BarChart3,
  Settings,
  ShoppingCart,
  FileText,
  TrendingUp,
} from "lucide-react"

type NavItem = {
  name: string
  href: string
  icon: React.ElementType
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Artículos", href: "/articulos", icon: Package },
  { name: "Reservas", href: "/reservas", icon: Calendar },
  { name: "Pedidos", href: "/pedidos", icon: ShoppingCart },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Disponibilidad", href: "/disponibilidad", icon: Calendar },
  { name: "Facturación", href: "/facturacion", icon: FileText },
  { name: "Informes", href: "/informes", icon: BarChart3 },
  { name: "Ventas", href: "/ventas", icon: TrendingUp },
  { name: "Gestión de Usuarios", href: "/admin/usuarios", icon: Users },
  { name: "Configuración", href: "/configuracion", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-background flex flex-col">
      <div className="p-4">
        <h2 className="text-xl font-bold">Mi Empresa</h2>
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 mt-auto border-t">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Modo Sin Autenticación</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
