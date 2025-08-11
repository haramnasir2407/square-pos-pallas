import { ButtonVariant } from '@/components/primitives/derived/ButtonVariant'
import { Heading } from '@/components/primitives/ui/typography'
import { formatMoney, getDiscountName, getTaxName } from '@/shared/utils/cartDrawerUtils'
import { BsHourglassSplit } from 'react-icons/bs'
import { Box, Flex } from '~/styled-system/jsx'
import { OrderSummaryContent } from './OrderSummaryContent'
import {
  errorContainer,
  errorIcon,
  errorText,
  errorTitle,
  loadingContainer,
  loadingIcon,
  loadingText,
  loadingTitle,
  orderIdText,
  successContainer,
  successIcon,
  successTitle,
} from './styles/styles'

/**
 * Handles order creation and displays the result (success or error) with a summary.
 * Shows loading, error, and success states for order processing.
 */
export const OrderConfirmation = ({
  isProcessing,
  orderResult,
  error,
  onClose,
}: OrderConfirmationProps) => {
  if (isProcessing) {
    // * Loading state UI
    return (
      <Flex direction="column" align="center" justify="center" className={loadingContainer}>
        <Box className={loadingIcon}>
          <BsHourglassSplit />
        </Box>
        <h2 className={loadingTitle}>Processing Order...</h2>
        <p className={loadingText}>Please wait while we create your order</p>
      </Flex>
    )
  }

  if (error) {
    // * Error state UI
    return (
      <Box className={errorContainer}>
        <Box className={errorIcon}>✗</Box>
        <h2 className={errorTitle}>Order Failed</h2>
        <p className={errorText}>{error.message}</p>
        <ButtonVariant variant="outlined" onClick={onClose}>
          Close
        </ButtonVariant>
      </Box>
    )
  }

  return (
    !isProcessing && (
      <Box className={successContainer}>
        <Box className={successIcon}>✓</Box>
        <Heading className={successTitle}>Order Successful!</Heading>
        {/* Order Summary */}
        <OrderSummaryContent
          order={orderResult}
          formatMoney={formatMoney}
          getTaxName={(uid) => getTaxName(orderResult, uid)}
          getDiscountName={(uid) => getDiscountName(orderResult, uid)}
        />
        {orderResult?.order?.id && <p className={orderIdText}>Order ID: {orderResult.order.id}</p>}
        <ButtonVariant variant="primary" onClick={onClose}>
          Continue Shopping
        </ButtonVariant>
      </Box>
    )
  )
}
