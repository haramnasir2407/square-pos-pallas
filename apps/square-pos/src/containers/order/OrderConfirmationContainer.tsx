import { OrderConfirmation } from '@/components/composites/dashboard/order/OrderConfirmation'
import { useOrderConfirmation } from './useOrderConfirmation'

/**
 * Handles order creation and displays the result (success or error) with a summary.
 * Shows loading, error, and success states for order processing.
 */
export const OrderConfirmationContainer = ({
  items,
  accessToken,
  orderDiscounts,
  orderTaxes,
  onClose,
}: OrderConfirmationContainerProps) => {
  const { orderResult, isLoading, error } = useOrderConfirmation({
    items,
    accessToken,
    orderDiscounts,
    orderTaxes,
  })

  return (
    <OrderConfirmation
      isProcessing={isLoading}
      orderResult={orderResult}
      error={error}
      onClose={onClose}
    />
  )
}
