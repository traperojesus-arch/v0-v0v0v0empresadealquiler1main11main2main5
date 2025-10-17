import { Sidebar } from "@/components/sidebar"
import { NuevoArticuloForm } from "@/components/articulos/nuevo-articulo-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NuevoArticuloPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/articulos">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Nuevo Artículo</h1>
          </div>
          <NuevoArticuloForm />
        </main>
      </div>
    </div>
  )
}
