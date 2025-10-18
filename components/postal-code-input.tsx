"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PostalCodeInputProps {
  value: string
  onChange: (value: string) => void
  onCityChange?: (city: string) => void
  className?: string
  disabled?: boolean
}

export function PostalCodeInput({ value, onChange, onCityChange, className, disabled }: PostalCodeInputProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [city, setCity] = useState<string>()

  useEffect(() => {
    const fetchCity = async () => {
      // Solo buscar si tenemos exactamente 5 dígitos
      if (value.length !== 5 || !/^\d{5}$/.test(value)) {
        setCity(undefined)
        setError(undefined)
        return
      }

      setIsLoading(true)
      setError(undefined)

      try {
        // Usar la API de Zippopotam para códigos postales españoles
        const response = await fetch(`https://api.zippopotam.us/es/${value}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError("Código postal no encontrado")
            setCity(undefined)
          } else {
            throw new Error("Error al buscar código postal")
          }
          return
        }

        const data = await response.json()

        if (data.places && data.places.length > 0) {
          const cityName = data.places[0]["place name"]
          setCity(cityName)
          setError(undefined)

          // Notificar al componente padre
          if (onCityChange) {
            onCityChange(cityName)
          }
        } else {
          setError("Código postal no encontrado")
          setCity(undefined)
        }
      } catch (err) {
        console.error("[v0] Error buscando código postal:", err)
        setError("Error al buscar código postal")
        setCity(undefined)
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce la búsqueda
    const timeoutId = setTimeout(fetchCity, 500)
    return () => clearTimeout(timeoutId)
  }, [value, onCityChange])

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="28001"
          value={value}
          onChange={(e) => {
            const newValue = e.target.value.replace(/\D/g, "").slice(0, 5)
            onChange(newValue)
          }}
          className={cn(className, error && "border-destructive")}
          disabled={disabled}
          maxLength={5}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {city && !error && (
        <p className="text-xs text-muted-foreground">
          Población: <span className="font-medium text-foreground">{city}</span>
        </p>
      )}
    </div>
  )
}
