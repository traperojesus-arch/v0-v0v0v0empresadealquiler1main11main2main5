"use client"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { mockDataStore } from "@/lib/mock-data-store"
import { NuevoArticuloForm } from "@/components/articulos/nuevo-articulo-form"

export default function EditarArticuloPage() {
  const params = useParams()
  const router = useRouter()
  const [articulo, setArticulo] = useState<any>(null)

  useEffect(() => {
    const id = params.id as string
    const articuloData = mockDataStore.getArticulo(id)
    if (articuloData) {
      setArticulo(articuloData)
    } else {
      router.push("/articulos")
    }
  }, [params.id, router])

  if (!articulo) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

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
            <div>
              <h1 className="text-3xl font-bold text-foreground">Editar Artículo</h1>
              <p className="text-muted-foreground mt-1">Modifica los datos del artículo</p>
            </div>
          </div>

          <NuevoArticuloForm articuloInicial={articulo} />
        </main>
      </div>
    </div>
  )
}
