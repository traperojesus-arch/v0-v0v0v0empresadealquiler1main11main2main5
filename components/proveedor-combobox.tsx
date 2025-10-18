"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getProveedores, createProveedor, type Proveedor } from "@/app/actions/proveedores-actions"
import { toast } from "sonner"

interface ProveedorComboboxProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function ProveedorCombobox({
  value,
  onValueChange,
  placeholder = "Seleccionar proveedor...",
}: ProveedorComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [proveedores, setProveedores] = React.useState<Proveedor[]>([])
  const [loading, setLoading] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [nuevoProveedor, setNuevoProveedor] = React.useState({
    nombre: "",
    contacto: "",
    telefono: "",
    email: "",
  })

  React.useEffect(() => {
    const cargarProveedores = async () => {
      setLoading(true)
      const result = await getProveedores(search)
      if (result.success) {
        setProveedores(result.data)
      }
      setLoading(false)
    }
    cargarProveedores()
  }, [search])

  const handleCrearProveedor = async () => {
    if (!nuevoProveedor.nombre.trim()) {
      toast.error("El nombre del proveedor es obligatorio")
      return
    }

    const result = await createProveedor(nuevoProveedor)
    if (result.success && result.data) {
      toast.success("Proveedor creado correctamente")
      setProveedores([...proveedores, result.data])
      onValueChange(result.data.nombre)
      setDialogOpen(false)
      setNuevoProveedor({ nombre: "", contacto: "", telefono: "", email: "" })
    } else {
      toast.error(result.error || "Error al crear proveedor")
    }
  }

  const selectedProveedor = proveedores.find((p) => p.nombre === value)

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent"
          >
            {selectedProveedor ? selectedProveedor.nombre : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar proveedor..." value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty>
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-3">No se encontró el proveedor</p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setNuevoProveedor({ ...nuevoProveedor, nombre: search })
                      setDialogOpen(true)
                      setOpen(false)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Crear "{search}"
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {proveedores.map((proveedor) => (
                  <CommandItem
                    key={proveedor.id}
                    value={proveedor.nombre}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === proveedor.nombre ? "opacity-100" : "opacity-0")} />
                    {proveedor.nombre}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
            <DialogDescription>Añade un nuevo proveedor al sistema</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={nuevoProveedor.nombre}
                onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, nombre: e.target.value })}
                placeholder="Nombre del proveedor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contacto">Persona de Contacto</Label>
              <Input
                id="contacto"
                value={nuevoProveedor.contacto}
                onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, contacto: e.target.value })}
                placeholder="Nombre del contacto"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={nuevoProveedor.telefono}
                  onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, telefono: e.target.value })}
                  placeholder="Teléfono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={nuevoProveedor.email}
                  onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, email: e.target.value })}
                  placeholder="email@ejemplo.com"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCrearProveedor}>Crear Proveedor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
