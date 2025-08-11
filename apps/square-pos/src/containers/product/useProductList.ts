import { fetchProducts } from '@/shared/services/productService'
// this is a hook that fetches products from the Square API

import { useQuery } from '@tanstack/react-query'
import type { ParamsType } from '../../shared/types/catalog'

/**
 * Check if the query object has meaningful search/filter values
 */
export function hasValidQuery(query: ParamsType['query']): boolean {
  if (!query) return false
  if (typeof query === 'string') return (query as string).length > 0
  if (typeof query === 'object' && query !== null) {
    const q = query as {
      text_query?: { keywords?: string[] }
      set_query?: { attribute_values?: string[] }
    }
    const text = q.text_query?.keywords?.length
    const set = q.set_query?.attribute_values?.length
    return Boolean(text || set)
  }
  return false
}

/**
 * Hook to fetch products from the Square API
 * @param access_token - The access token for the Square API
 * @param params - The parameters for the query
 * @returns The products
 */
export function useProductList(access_token: string, params?: ParamsType) {
  // * useQuery is used for get requests
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(access_token, params),
    enabled: !!access_token && hasValidQuery(params?.query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
