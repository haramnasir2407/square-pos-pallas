// * Utility functions for CartDrawer

import type { CartItem } from '@/shared/store/useCartStore'
import type { Dispatch, SetStateAction } from 'react'
const BOGO_DISCOUNT = 100

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
    pricing_options: { auto_apply_discounts: true, auto_apply_taxes: true },
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
    .filter(Boolean) // * removes null values from the filtered array

  // * generate a unique idempotency key
  const idempotency_key = crypto.randomUUID()

  // * build order object
  const order: orderData = {
    pricing_options: { auto_apply_discounts: true, auto_apply_taxes: true },
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
 * Toggles the taxable status of a cart item.
 * @param itemId - The ID of the item to toggle
 * @param is_taxable - Whether the item should be taxable
 * @param toggleItemTax - Callback to update the item's tax status
 */
export function handleItemTaxToggleUtil({
  itemId,
  is_taxable,
  toggleItemTax,
}: {
  itemId: string
  is_taxable: boolean
  toggleItemTax: (itemId: string, enabled: boolean) => void
}) {
  // * toggle the taxable status of the item
  toggleItemTax(itemId, is_taxable)
}

// Utility: Handles switching between order-level and item-level discounts/taxes.
export function handleOrderLevelChange({
  type,
  value,
  setSelectedOrderDiscount,
  setSelectedOrderTax,
  items,
}: {
  type: 'discount' | 'tax'
  value: SelectedOrderDiscount | SelectedOrderTax | null
  setSelectedOrderDiscount: Dispatch<SetStateAction<SelectedOrderDiscount | null>>
  setSelectedOrderTax: Dispatch<SetStateAction<SelectedOrderTax | null>>
  items: CartItem[]
}) {
  if (type === 'discount') {
    setSelectedOrderDiscount(value as SelectedOrderDiscount | null)
  } else {
    setSelectedOrderTax(value as SelectedOrderTax | null)
  }
}

// Utility: Calculates the order summary for the drawer, considering order-level discounts/taxes if selected.
export function getDrawerOrderSummary({
  isOrderLevelActive,
  isItemLevelActive,
  items,
  selectedOrderDiscount,
  selectedOrderTax,
  getOrderSummary,
}: {
  isOrderLevelActive: boolean
  isItemLevelActive: boolean
  items: CartItem[]
  selectedOrderDiscount: SelectedOrderDiscount | null
  selectedOrderTax: SelectedOrderTax | null
  getOrderSummary: () => {
    subtotal: number
    discountAmount: number
    taxAmount: number
    total: number
  }
}) {
  const itemSummary = getOrderSummary()

  let subtotal = itemSummary.subtotal
  let discountAmount = itemSummary.discountAmount
  let taxAmount = itemSummary.taxAmount

  if (isOrderLevelActive) {
    // Apply order-level discount on top of item-level subtotal
    let orderDiscountAmount = 0
    if (selectedOrderDiscount) {
      const percent = Number.parseFloat(selectedOrderDiscount.percentage)
      if (!Number.isNaN(percent)) {
        orderDiscountAmount = (subtotal * percent) / 100
      }
    }

    subtotal -= orderDiscountAmount
    discountAmount += orderDiscountAmount

    // Apply order-level tax on top of already discounted subtotal
    let orderTaxAmount = 0
    if (selectedOrderTax) {
      const percent = Number.parseFloat(selectedOrderTax.percentage)
      if (!Number.isNaN(percent)) {
        orderTaxAmount = (subtotal * percent) / 100
      }
    }

    taxAmount += orderTaxAmount
  }

  const total = subtotal + taxAmount

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total,
  }
}

// Utility: Handles toggling of item-level discounts.
/**
 * Handles toggling of item-level discounts.
 * @param {any} item - The cart item.
 * @param {boolean} checked - Whether the discount is applied.
 */
export function handleDiscountToggle({
  item,
  checked,
  selectedDiscounts,
  applyItemDiscount,
  removeItemDiscount,
}: {
  item: CartItem
  checked: boolean

  selectedDiscounts: Record<string, SelectedDiscount>
  applyItemDiscount: (id: string, discount: SelectedDiscount) => void
  removeItemDiscount: (id: string) => void
}) {
  if (checked && selectedDiscounts[item.id]) {
    applyItemDiscount(item.id, selectedDiscounts[item.id] as SelectedDiscount)
  } else {
    removeItemDiscount(item.id)
  }
}

/**
 * Handles selection of a discount for an item.
 * @param {any} item - The cart item.
 * @param {any} discount - The selected discount.
 */
// Utility: Handles selection of a discount for an item.
export function handleDiscountSelect({
  setSelectedDiscounts,
  item,
  discount,
}: {
  setSelectedDiscounts: Dispatch<SetStateAction<Record<string, SelectedDiscount>>>
  item: CartItem
  discount: SelectedDiscount
}) {
  setSelectedDiscounts((prev) => ({
    ...prev,
    [item.id]: discount,
  }))
}

/**
 * Handles toggling of item-level taxes.
 * @param {any} item - The cart item.
 * @param {boolean} checked - Whether the tax is applied.
 */
// Utility: Handles toggling of item-level taxes.
export function handleTaxToggle({
  item,
  checked,
  toggleItemTax,
}: {
  item: CartItem
  checked: boolean
  toggleItemTax: (id: string, enabled: boolean) => void
}) {
  toggleItemTax(item.id, checked)
}

/**
 * Handles selection of a tax rate for an item.
 * @param {any} item - The cart item.
 * @param {string} value - The selected tax rate value.
 */
// Utility: Handles selection of a tax rate for an item.
export function handleTaxSelect({
  setSelectedTaxes,
  item,
  value,
  setItemTaxRate,
}: {
  setSelectedTaxes: Dispatch<SetStateAction<Record<string, SelectedTax>>>
  item: CartItem
  value: string
  setItemTaxRate: (id: string, rate: { name: string; percentage: number }) => void
}) {
  const taxRate = value === '' ? undefined : Number.parseFloat(value)
  setSelectedTaxes((prev) => ({
    ...prev,
    [item.id]: {
      ...prev[item.id],
      itemTaxRate: taxRate,
    },
  }))
  if (typeof taxRate === 'number') {
    setItemTaxRate(item.id, {
      name: item.name,
      percentage: taxRate,
    })
  }
}

export function calculateItemDiscountValue(item: CartItem, itemSubtotal: number): number {
  const value = item.itemDiscount?.discount_value
  if (!value) return 0

  // BOGO: 100% off for every second item
  if (value === `${BOGO_DISCOUNT}%` || value === BOGO_DISCOUNT) {
    if (item.quantity >= 2) {
      const freeItems = Math.floor(item.quantity / 2)
      return freeItems * (item.price ?? 0)
    }
    return 0
  }
  // Percentage discount
  if (typeof value === 'string' && value.includes('%')) {
    const percent = Number.parseFloat(value)
    return !Number.isNaN(percent) ? (itemSubtotal * percent) / 100 : 0
  }
  // Fixed amount discount (number)
  if (typeof value === 'number') {
    return value * item.quantity
  }
  // Fixed amount discount (string that parses to number)
  if (typeof value === 'string') {
    const num = Number.parseFloat(value)
    return !Number.isNaN(num) ? num * item.quantity : 0
  }
  return 0
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
