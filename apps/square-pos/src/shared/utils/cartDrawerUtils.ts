// * Utility functions for CartDrawer

import type { CartItem } from '@/shared/store/useCartStore'
import type { Dispatch, SetStateAction } from 'react'
const BOGO_DISCOUNT = 100

function makeScopedUid(baseId: string, scope: 'ORDER' | 'LINE_ITEM') {
  return `${baseId}_${scope}`
}

/**
 * Creates the order data object for submission to the backend API.
 * @param items - Array of cart items (must include variantId, quantity, id)
 * @param orderDiscounts - Optional array of order-level discounts
 * @param orderTaxes - Optional array of order-level taxes
 * @returns Object containing idempotency_key and order payload
 */
export function createOrderData({
  items,
  orderDiscounts,
  orderTaxes,
}: {
  items: CartItem[]
  orderDiscounts?: OrderDiscount[]
  orderTaxes?: OrderTax[]
}) {
  // * create line items for the order using variantId from cart items

  const line_items = items
    .map((item) => {
      const variationId = item.variationId
      if (!variationId) {
        console.warn(`No variation ID found for item ${item.id}`)
        return null
      }

      return {
        quantity: item.quantity.toString(),
        catalog_object_id: variationId,
      }
    })
    .filter(Boolean)

  // * generate a unique idempotency key
  const idempotency_key = crypto.randomUUID()

  // * build order object
  const order: orderData = {
    pricing_options: { auto_apply_discounts: false, auto_apply_taxes: false },
    line_items: line_items as { quantity: string; catalog_object_id: string }[],
    location_id: 'LQT0VHHSADY7Z',
  }

  const discounts = orderDiscounts ?? []
  const taxes = orderTaxes ?? []

  if (discounts.length > 0) {
    order.discounts = discounts
  }

  if (taxes.length > 0) {
    order.taxes = taxes
  }

  return {
    idempotency_key,
    order,
  }
}

/**
 * Calculates the order data for previewing totals, discounts, and taxes.
 * @param items - Array of cart items (must include variantId, quantity, id)
 * @param orderDiscounts - Optional array of order-level discounts
 * @param orderTaxes - Optional array of order-level taxes
 * @returns Object containing idempotency_key and order payload
 */
export function calculateOrderData({
  items,
  orderDiscounts,
  orderTaxes,
}: {
  items: CartItem[]
  orderDiscounts?: OrderDiscount[]
  orderTaxes?: OrderTax[]
}) {
  const Discounts: Record<string, OrderDiscount> = {}
  const Taxes: Record<string, OrderTax> = {}

  console.log('order discounts:', orderDiscounts)
  console.log('order taxes:', orderTaxes)

  // * create line items for the order using variantId from cart items
  const line_items = items
    .map((item) => {
      const variationId = item.variationId
      if (!variationId) {
        console.warn(`No variation ID found for item ${item.id}`)
        return null
      }

      const applied_discounts: { discount_uid: string; uid: string }[] = []
      const applied_taxes: { tax_uid: string; uid: string }[] = []

      // console.log('applied discounts:', item.appliedDiscounts)
      //* attach item-level discounts
      if (item.appliedDiscounts && item.appliedDiscounts.length > 0) {
        item.appliedDiscounts.forEach((discount) => {
          if (!Discounts[discount.discount_id]) {
            Discounts[discount.discount_id] = {
              name: discount.discount_name,
              percentage:
                typeof discount.discount_value === 'string'
                  ? discount.discount_value.replace('%', '').trim()
                  : discount.discount_value?.toString() || '0',
              scope: 'LINE_ITEM',
              type: 'FIXED_PERCENTAGE',
              uid: discount.discount_id,
            }
          }
          applied_discounts.push({ discount_uid: discount.discount_id, uid: crypto.randomUUID() })
        })
      }

      //* attach item-level taxes
      if (item.appliedTaxRates && item.appliedTaxRates.length > 0) {
        item.appliedTaxRates.forEach((tax) => {
          if (!Taxes[tax.tax_id]) {
            Taxes[tax.tax_id] = {
              name: tax.name,
              percentage:
                typeof tax.percentage === 'string'
                  ? tax.percentage.replace('%', '').trim()
                  : tax.percentage?.toString() || '0',
              scope: 'LINE_ITEM',
              type: 'ADDITIVE',
              uid: tax.tax_id,
            }
          }
          applied_taxes.push({ tax_uid: tax.tax_id, uid: crypto.randomUUID() })
        })
      }

      // Build line item - only include applied_discounts/applied_taxes if they exist
      const lineItem: {
        quantity: string
        catalog_object_id: string
        item_type: string
        applied_discounts?: { discount_uid: string; uid: string }[]
        applied_taxes?: { tax_uid: string; uid: string }[]
      } = {
        quantity: item.quantity.toString(),
        catalog_object_id: variationId,
        item_type: 'ITEM',
      }

      if (applied_discounts.length > 0) {
        lineItem.applied_discounts = applied_discounts
      }

      if (applied_taxes.length > 0) {
        lineItem.applied_taxes = applied_taxes
      }

      return lineItem
    })
    .filter((item): item is NonNullable<typeof item> => item !== null) // ? what does this do

  const orderLevelDiscounts = orderDiscounts ?? []
  const orderLevelTaxes = orderTaxes ?? []


  // * build order object
  const order: {
    pricing_options: { auto_apply_discounts: boolean; auto_apply_taxes: boolean }
    line_items: typeof line_items
    location_id: string
    discounts?: OrderDiscount[]
    taxes?: OrderTax[]
  } = {
    pricing_options: { auto_apply_discounts: false, auto_apply_taxes: false },
    line_items,
    location_id: 'LQT0VHHSADY7Z',
  }

  // Combine item-level and order-level discounts/taxes
  const allDiscounts = [...Object.values(Discounts), ...orderLevelDiscounts]
  const allTaxes = [...Object.values(Taxes), ...orderLevelTaxes]

  // Only include discounts/taxes arrays if they have content
  if (allDiscounts.length > 0) {
    order.discounts = allDiscounts
  }

  if (allTaxes.length > 0) {
    order.taxes = allTaxes
  }

  console.log('order:', order)

  return {
    order,
  }
}

// Utility: Handles switching between order-level and item-level discounts/taxes.
export function handleOrderLevelChange({
  type,
  value,
  setSelectedOrderDiscount,
  setSelectedOrderTax,
}: {
  type: 'discount' | 'tax'
  value: SelectedOrderDiscount | SelectedOrderTax | null
  setSelectedOrderDiscount: Dispatch<SetStateAction<SelectedOrderDiscount | null>>
  setSelectedOrderTax: Dispatch<SetStateAction<SelectedOrderTax | null>>
}) {
  if (type === 'discount') {
    setSelectedOrderDiscount(value as SelectedOrderDiscount | null)
  } else {
    setSelectedOrderTax(value as SelectedOrderTax | null)
  }
}

/**
 * Formats a cent value as a dollar string.
 * @param amount - Amount in cents
 * @returns Formatted string in dollars
 */
export const formatMoney = (amount: number | undefined) =>
  typeof amount === 'number' ? `$${(amount / 100).toFixed(2)}` : 'N/A'

/**
 * Gets the tax name by UID from the order object.
 * @param order - OrderPreview or OrderResult object
 * @param uid - Tax UID
 * @returns Tax name or fallback
 */
export const getTaxName = (order: OrderPreview | OrderResult | null, uid: string) =>
  order?.order?.taxes?.find((t) => t.uid === uid)?.name || 'Tax'

/**
 * Gets the discount name by UID from the order object.
 * @param order - OrderPreview or OrderResult object
 * @param uid - Discount UID
 * @returns Discount name or fallback
 */
export const getDiscountName = (order: OrderPreview | OrderResult | null, uid: string) =>
  order?.order?.discounts?.find((d) => d.uid === uid)?.name || 'Discount'
