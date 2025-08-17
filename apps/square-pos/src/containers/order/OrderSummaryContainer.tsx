import { OrderSummary } from '@/components/composites/dashboard/order/OrderSummary'
import { ORDER_LEVEL_DISCOUNTS, ORDER_LEVEL_TAXES } from '@/shared/constants/order_discounts_taxes'
import { OrderConfirmationContainer } from './OrderConfirmationContainer'
import { useOrderSummary } from './useOrderSummary'

export const OrderSummaryContainer = ({
  items,
  accessToken,
  onGoBack,
  clearCart,
  setOpen,
  setShowCheckout,
  setShowConfirmation,
  showConfirmation,
}: OrderSummaryProps) => {
  const { orderPreview, isLoading, error } = useOrderSummary(items, accessToken)

  const handleCloseConfirmation = () => {
    clearCart()
    setShowCheckout(false)
    setShowConfirmation(false)
    setOpen(false)
  }

  if (showConfirmation) {
    return (
      <OrderConfirmationContainer
        items={items}
        accessToken={accessToken}
        orderDiscounts={ORDER_LEVEL_DISCOUNTS}
        orderTaxes={ORDER_LEVEL_TAXES}
        onClose={handleCloseConfirmation}
      />
    )
  }

  return (
    <OrderSummary
      orderPreview={orderPreview}
      isLoading={isLoading}
      error={error}
      onGoBack={onGoBack}
      onPlaceOrder={() => setShowConfirmation(true)}
    />
  )
}
