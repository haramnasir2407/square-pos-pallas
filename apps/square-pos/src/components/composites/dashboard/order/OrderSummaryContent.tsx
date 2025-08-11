import { Heading } from '@/components/primitives/ui/typography'
import { Box, Flex } from '~/styled-system/jsx'
import {
  containerStyle,
  itemCardStyle,
  itemDiscountListStyle,
  itemDiscountStyle,
  itemFinalStyle,
  itemNameStyle,
  itemOriginalStyle,
  itemQtyStyle,
  itemsHeadingStyle,
  itemsListStyle,
  itemsSectionStyle,
  itemTaxStyle,
  orderSummarySectionStyle,
  orderTotalStyle,
  titleStyle,
  totalDiscountStyle,
  totalTaxStyle,
} from './styles/styles'

/**
 * Pure presentational component for displaying order summary content (items, discounts, taxes, totals).
 * Used in both OrderSummary and OrderConfirmation.=
 */
export const OrderSummaryContent = ({
  order,
  formatMoney,
  getTaxName,
  getDiscountName,
  title = 'Order Summary',
}: OrderSummaryContentProps) => {
  return (
    <Box className={containerStyle}>
      <Heading className={titleStyle}>{title}</Heading>

      {/* Items List with old/new values, applied discounts/taxes */}
      <Box className={itemsSectionStyle}>
        <Heading className={itemsHeadingStyle}>
          Items ({order?.order?.line_items?.length || 0})
        </Heading>
        <Box className={itemsListStyle}>
          {order?.order?.line_items?.map((item, index) => (
            <Flex
              key={index}
              direction="column"
              gap="gap.component.sm"
              py="padding.block.sm"
              px="padding.inline.md"
              bg="gray.50"
              mb="gap.component.xs"
              className={itemCardStyle}
            >
              <Box className={itemNameStyle}>{item.name}</Box>
              <Box className={itemQtyStyle}>
                Qty: {item.quantity} × {formatMoney(item.base_price_money?.amount)}
              </Box>
              {/* Old value (before discounts/taxes) */}
              <Box className={itemOriginalStyle}>
                <b>Original:</b> {formatMoney(item.gross_sales_money?.amount)}
              </Box>
              {/* Applied Discounts */}
              {item.applied_discounts && item.applied_discounts.length > 0 && (
                <Box className={itemDiscountStyle}>
                  <b>Discounts:</b>
                  <ul className={itemDiscountListStyle}>
                    {item.applied_discounts.map((d) => (
                      <li key={d.uid}>
                        {getDiscountName(d.discount_uid)}: -{formatMoney(d.applied_money?.amount)}
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
              {/* Applied Taxes */}
              {item.applied_taxes && item.applied_taxes.length > 0 && (
                <Box className={itemTaxStyle}>
                  <b>Taxes:</b>
                  <ul className={itemDiscountListStyle}>
                    {item.applied_taxes.map((t) => (
                      <li key={t.uid}>
                        {getTaxName(t.tax_uid)}: +{formatMoney(t.applied_money?.amount)}
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
              {/* New value (after discounts/taxes) */}
              <Box className={itemFinalStyle}>
                <b>Final:</b> {formatMoney(item.total_money?.amount)}
              </Box>
            </Flex>
          ))}
        </Box>
      </Box>

      {/* Order-level summary */}
      <Box className={orderSummarySectionStyle}>
        <Box className={totalDiscountStyle}>
          <b>Total Discount:</b> {formatMoney(order?.order.total_discount_money?.amount)}
        </Box>
        <Box className={totalTaxStyle}>
          <b>Total Tax:</b> {formatMoney(order?.order.total_tax_money?.amount)}
        </Box>
        <Box className={orderTotalStyle}>
          <b>Order Total:</b> {formatMoney(order?.order.total_money?.amount)}
        </Box>
      </Box>
    </Box>
  )
}
