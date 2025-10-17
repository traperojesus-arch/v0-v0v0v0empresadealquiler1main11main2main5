"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LogOut,
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
  roles?: Array<Profile["role"]> // Si no se define, es para todos
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Artículos", href: "/articulos", icon: Package },
  { name: "Reservas", href: "/reservas", icon: Calendar },
  { name: "Pedidos", href: "/pedidos", icon: ShoppingCart },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Disponibilidad", href: "/disponibilidad", icon: Calendar },
  { name: "Facturación", href: "/facturacion", icon: FileText, roles: ["admin", "premium"] },
  { name: "Informes", href: "/informes", icon: BarChart3, roles: ["admin", "premium"] },
  { name: "Ventas", href: "/ventas", icon: TrendingUp, roles: ["admin"] },
  { name: "Gestión de Usuarios", href: "/admin/usuarios", icon: Users, roles: ["admin"] },
  { name: "Configuración", href: "/configuracion", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("id, full_name, role")
          .eq("id", user.id)
          .single()

        if (error) {
          console.error("Error fetching user profile:", error.message)
        }

        if (profileData) {
          setProfile(profileData)
        }
      }
      setLoading(false)
    }

    fetchUserAndProfile()
  }, []) // Eliminamos 'supabase' de las dependencias, ya que es estable.

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  if (loading) {
    return (
      <aside className="w-64 flex-shrink-0 border-r bg-background flex flex-col p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="space-y-2 mt-8">
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </div>
      </aside>
    )
  }

  const visibleNavItems = navigation.filter((item) => !item.roles || (profile && item.roles.includes(profile.role)))

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-background flex flex-col">
      <div className="p-4">
        <h2 className="text-xl font-bold">Mi Empresa</h2>
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {visibleNavItems.map((item) => (
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
        {user && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{profile?.full_name || user.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}
