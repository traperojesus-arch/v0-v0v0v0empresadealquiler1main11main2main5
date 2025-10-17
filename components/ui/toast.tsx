"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning"
  duration?: number
}

const variantStyles = {
  default: "bg-background border-border",
  success: "bg-green-50 border-green-200 text-green-900",
  error: "bg-red-50 border-red-200 text-red-900",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
}

export function Toast({
  id,
  title,
  description,
  variant = "default",
  onClose,
}: ToastProps & { onClose: (id: string) => void }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [id, onClose])

  return (
    <div className={cn("pointer-events-auto w-full max-w-sm rounded-lg border p-4 shadow-lg", variantStyles[variant])}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && <div className="font-semibold">{title}</div>}
          {description && <div className="text-sm mt-1">{description}</div>}
        </div>
        <button onClick={() => onClose(id)} className="rounded-md p-1 hover:bg-black/5 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: ToastProps[]
  onClose: (id: string) => void
}) {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}
