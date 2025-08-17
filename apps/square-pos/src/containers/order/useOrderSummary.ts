import { calculateOrderAction } from '@/app/actions/orders'
import { ORDER_LEVEL_DISCOUNTS, ORDER_LEVEL_TAXES } from '@/shared/constants/order_discounts_taxes'
import type { CartItem } from '@/shared/store/useCartStore'
import { calculateOrderData } from '@/shared/utils/cartDrawerUtils'
import { useEffect, useState, useTransition } from 'react'

export const useOrderSummary = (
  items: CartItem[],
  selectedOrderDiscount: SelectedOrderDiscount | null,
  selectedOrderTax: SelectedOrderTax | null,
  accessToken: string,
) => {
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
          orderDiscounts: selectedOrderDiscount
            ? [
                {
                  name: selectedOrderDiscount.discount_name,
                  percentage: selectedOrderDiscount.discount_value
                    ?.toString()
                    .replace('%', '')
                    .trim(),
                  scope: 'ORDER',
                  type: 'FIXED_PERCENTAGE',
                  uid: selectedOrderDiscount.discount_id,
                },
              ]
            : [],
          orderTaxes: selectedOrderTax
            ? [
                {
                  name: selectedOrderTax.name,
                  percentage: selectedOrderTax.percentage.toString().replace('%', '').trim(),
                  scope: 'ORDER',
                  type: 'ADDITIVE',
                  uid: selectedOrderTax.tax_id,
                },
              ]
            : [],
        })

        const result = await calculateOrderAction(orderData, accessToken)
        console.log('result:', result)
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
  }, [items, accessToken, selectedOrderDiscount, selectedOrderTax])

  return { orderPreview, isLoading: isPending, error, recalculate: calculateOrder }
}
