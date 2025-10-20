// components/postal-code-input.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostalCodeInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
  onCityChange?: (city: string) => void;
  className?: string;
  disabled?: boolean;
}

export function PostalCodeInput({ value, onChange, onCityChange, className, disabled: parentDisabled }: PostalCodeInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const isDisabled = parentDisabled || isLoading;

  useEffect(() => {
    const fetchCity = async () => {
      const currentCP = value || '';
      if (currentCP.length === 5 && /^\d{5}$/.test(currentCP)) {
          setIsLoading(true);
          setError(undefined);
          try {
            const response = await fetch(`https://api.zippopotam.us/es/${currentCP}`);
             if (!response.ok) {
              if (response.status === 404) { setError("CP no encontrado"); } else { throw new Error(`Error API: ${response.status}`); }
              setCity(undefined); if (onCityChange) onCityChange(''); return;
            }
            const data = await response.json();
             if (data.places && data.places.length > 0) {
              const cityName = data.places[0]["place name"];
              setCity(cityName); setError(undefined); if (onCityChange) { onCityChange(cityName); }
            } else {
              setError("CP no encontrado (API vacía)"); setCity(undefined); if (onCityChange) onCityChange('');
            }
          } catch (err: any) {
            console.error("[PostalCodeInput] Error buscando CP:", err); setError("Error al buscar CP"); setCity(undefined); if (onCityChange) onCityChange('');
          } finally { setIsLoading(false); }
      } else {
         setCity(undefined); setError(undefined);
          if(onCityChange && currentCP) { onCityChange(''); }
      }
    };
    const timeoutId = setTimeout(fetchCity, 300);
    return () => clearTimeout(timeoutId);
  }, [value, onCityChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const newValue = rawValue.replace(/\D/g, "").slice(0, 5);
      onChange(newValue);
  };

  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          type="text"
          placeholder="Ej: 28001"
          value={value || ''}
          onChange={handleInputChange}
          className={cn(className, error && "border-destructive")}
          disabled={isDisabled}
          maxLength={5}
          inputMode="numeric"
          pattern="\d{5}"
        />
        {isLoading && (<div className="absolute right-3 top-1/2 -translate-y-1/2"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>)}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {city && !error && (<p className="text-xs text-muted-foreground">Población: <span className="font-medium text-foreground">{city}</span></p>)}
    </div>
  );
}
