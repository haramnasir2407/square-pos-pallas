import { ButtonVariant } from '@/components/primitives/derived/ButtonVariant'
import { formatMoney, getDiscountName, getTaxName } from '@/shared/utils/cartDrawerUtils'
import { BsHourglassSplit } from 'react-icons/bs'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { Box, Flex } from '~/styled-system/jsx'
import { checkoutButtonStyle } from '../cart/styles/CartDrawer.styles'
import { OrderSummaryContent } from './OrderSummaryContent'
import {
  errorContainer,
  errorIcon,
  errorText,
  errorTitle,
  goBackButton,
  loadingContainer,
  loadingIcon,
  loadingText,
  loadingTitle,
  summaryContainer,
} from './styles/styles'

type OrderSummaryUIProps = {
  orderPreview: OrderPreview | null
  isLoading: boolean
  error: Error | null
  onGoBack: () => void
  onPlaceOrder: () => void
}

export const OrderSummary = ({
  orderPreview,
  isLoading,
  error,
  onGoBack,
  onPlaceOrder,
}: OrderSummaryUIProps) => {
  if (isLoading) {
    return (
      <Flex direction="column" align="center" justify="center" className={loadingContainer}>
        <Box className={loadingIcon}>
          <BsHourglassSplit />
        </Box>
        <h2 className={loadingTitle}>Calculating Order...</h2>
        <p className={loadingText}>Please wait while we prepare your order summary</p>
      </Flex>
    )
  }

  if (error) {
    return (
      <Box className={errorContainer}>
        <Box className={errorIcon}>✗</Box>
        <h2 className={errorTitle}>Order Failed</h2>
        <p className={errorText}>{error.message}</p>
      </Box>
    )
  }

  return (
    <Box className={summaryContainer}>
      <OrderSummaryContent
        order={orderPreview}
        formatMoney={formatMoney}
        getTaxName={(uid) => getTaxName(orderPreview, uid)}
        getDiscountName={(uid) => getDiscountName(orderPreview, uid)}
      />
      <Flex direction="column" gap="gap.component.sm" mt="auto">
        <ButtonVariant variant="outlined" onClick={onGoBack} className={goBackButton}>
          <RiArrowGoBackFill /> Go back
        </ButtonVariant>
        <ButtonVariant variant="primary" onClick={onPlaceOrder} className={checkoutButtonStyle}>
          Confirm and place order
        </ButtonVariant>
      </Flex>
    </Box>
  )
}
