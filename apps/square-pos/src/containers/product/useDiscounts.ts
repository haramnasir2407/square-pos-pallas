import type { Discount, UseDiscountsReturn } from '@/shared/types/catalog'
import { useEffect, useState } from 'react'

export function useDiscounts(accessToken: string): UseDiscountsReturn {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!accessToken) {
      setDiscounts([])
      setError(null)
      setIsLoading(false)
      return
    }

    async function fetchDiscounts() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/discounts', {
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
        setDiscounts(data.objects || [])
      } catch (err: unknown) {
        console.error('Failed to fetch discounts:', err)
        setError(
          err && typeof err === 'object' && 'message' in err
            ? new Error((err as { message?: string }).message || 'Failed to fetch discounts')
            : new Error('Failed to fetch discounts'),
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiscounts()
  }, [accessToken])

  return {
    discounts,
    isLoading,
    error,
  }
}
