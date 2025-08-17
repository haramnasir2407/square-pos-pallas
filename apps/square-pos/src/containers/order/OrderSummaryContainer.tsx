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
  selectedOrderDiscount = null,
  selectedOrderTax = null,
}: OrderSummaryProps) => {
  const { orderPreview, isLoading, error } = useOrderSummary(
    items,
    selectedOrderDiscount,
    selectedOrderTax,
    accessToken,
  )

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
        orderDiscounts={
          selectedOrderDiscount
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
            : []
        }
        orderTaxes={
          selectedOrderTax
            ? [
                {
                  name: selectedOrderTax.name,
                  percentage: selectedOrderTax.percentage.toString().replace('%', '').trim(),
                  scope: 'ORDER',
                  type: 'ADDITIVE',
                  uid: selectedOrderTax.tax_id,
                },
              ]
            : []
        }
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
