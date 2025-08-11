import type { ProductSet, UseProductSetsReturn } from '@/shared/types/catalog'
import { useEffect, useState } from 'react'

export function useProductSets(accessToken: string): UseProductSetsReturn {
  const [productSets, setProductSets] = useState<ProductSet[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!accessToken) {
      setProductSets([])
      setError(null)
      setIsLoading(false)
      return
    }

    async function fetchProductSets() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/product-sets', {
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
        setProductSets(data.objects || [])
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        console.error('Failed to fetch product sets:', error)
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductSets()
  }, [accessToken])

  return {
    productSets,
    isLoading,
    error,
  }
}
