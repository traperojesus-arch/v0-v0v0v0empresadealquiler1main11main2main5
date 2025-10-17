"use client"

import { Sidebar } from "@/components/sidebar"
import { ArticulosHeader } from "@/components/articulos/articulos-header"
import { ArticulosList } from "@/components/articulos/articulos-list"
import { useState } from "react"

export default function ArticulosPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 space-y-6">
          <ArticulosHeader onSearchChange={setSearchQuery} />
          <ArticulosList searchQuery={searchQuery} />
        </main>
      </div>
    </div>
  )
}
