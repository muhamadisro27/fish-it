// Placeholder hooks/use-toast.ts untuk komponen UI
import { useState } from "react"

export type ToastProps = {
  id?: string
  title?: string
  description?: string
  action?: any
  variant?: "default" | "destructive"
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

let toastCount = 0

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  function toast(props: ToastProps) {
    const id = `toast-${++toastCount}`
    setToasts((prev) => [...prev, { ...props, id, open: true }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  function dismiss(toastId?: string) {
    setToasts((prev) => {
      if (toastId) {
        return prev.filter((t) => t.id !== toastId)
      }
      return []
    })
  }

  return {
    toast,
    toasts,
    dismiss,
  }
}

