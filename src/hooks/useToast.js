import { useState, useCallback } from 'react'

export function useToast() {
  const [toast,     setToast]     = useState(null)
  const [toastType, setToastType] = useState('info')

  const showToast = useCallback((msg, type = 'info') => {
    setToast(msg)
    setToastType(type)
    setTimeout(() => setToast(null), 3500)
  }, [])

  return { toast, toastType, showToast }
}
