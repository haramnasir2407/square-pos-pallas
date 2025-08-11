import { calculateOrderAction, createOrderAction } from '@/app/actions/orders'
import { ORDER_LEVEL_DISCOUNTS, ORDER_LEVEL_TAXES } from '@/shared/constants/order_discounts_taxes'
import type { CartItem } from '@/shared/store/useCartStore'
import { createOrderData } from '@/shared/utils/cartDrawerUtils'
import { startTransition, useEffect, useState, useTransition } from 'react'

export function useOrderConfirmation({
  items,
  accessToken,
  orderDiscounts,
  orderTaxes,
}: {
  items: CartItem[]
  accessToken: string
  orderDiscounts?: OrderDiscount[]
  orderTaxes?: OrderTax[]
}) {
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null)
  const [error, setError] = useState<Error | null>(null)

  // useTransition gives a pending state instead of manually tracking isLoading
  const [isPending, startTransition] = useTransition()

  const createOrder = () => {
    startTransition(async () => {
      try {
        setError(null)
        const orderData = createOrderData({
          items,
          orderDiscounts,
          orderTaxes,
        })

        const result = await createOrderAction(orderData, accessToken)
        setOrderResult(result)
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
      createOrder()
    }
  }, [items, accessToken])

  return { orderResult, isLoading: isPending, error, recalculate: createOrder }
}
