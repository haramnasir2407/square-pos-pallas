import { calculateOrderAction } from '@/app/actions/orders'
import { ORDER_LEVEL_DISCOUNTS, ORDER_LEVEL_TAXES } from '@/shared/constants/order_discounts_taxes'
import type { CartItem } from '@/shared/store/useCartStore'
import { calculateOrderData } from '@/shared/utils/cartDrawerUtils'
import { useState, useTransition, useEffect } from 'react'

export const useOrderSummary = (items: CartItem[], accessToken: string) => {
  const [orderPreview, setOrderPreview] = useState<OrderPreview | null>(null)
  const [error, setError] = useState<Error | null>(null)

  // useTransition gives a pending state instead of manually tracking isLoading
  const [isPending, startTransition] = useTransition()

  const calculateOrder = () => {
    startTransition(async () => {
      try {
        setError(null)
        const orderData = calculateOrderData({
          items,
          orderDiscounts: ORDER_LEVEL_DISCOUNTS,
          orderTaxes: ORDER_LEVEL_TAXES,
        })

        const result = await calculateOrderAction(orderData, accessToken)
        setOrderPreview(result)
      } catch (err) {
        console.error('Error creating order:', err)
        setError(err instanceof Error ? err : new Error('An error occurred'))
      }
    })
  }

  // Run the calculation automatically when items/accessToken change
  // biome-ignore lint/correctness/useExhaustiveDependencies: suppress dependency
  useEffect(() => {
    if (items.length && accessToken) {
      calculateOrder()
    }
  }, [items, accessToken])

  return { orderPreview, isLoading: isPending, error, recalculate: calculateOrder }
}
