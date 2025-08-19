import type { Tax, UseTaxesReturn } from '@/shared/types/catalog'
import { useEffect, useState } from 'react'

export function useTaxes(accessToken: string): UseTaxesReturn {
  const [taxes, setTaxes] = useState<Tax[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!accessToken) {
      setTaxes([])
      setError(null)
      setIsLoading(false)
      return
    }

    async function fetchTaxes() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/taxes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken,
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setTaxes(data.objects || [])
      } catch (err: unknown) {
        console.error('Failed to fetch taxes:', err)
        setError(
          err && typeof err === 'object' && 'message' in err
            ? new Error((err as { message?: string }).message || 'Failed to fetch taxes')
            : new Error('Failed to fetch taxes'),
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchTaxes()
  }, [accessToken])

  return {
    taxes,
    isLoading,
    error,
  }
}
