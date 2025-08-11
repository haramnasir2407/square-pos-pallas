/**
 * Props for CartItemCard
 */
interface CartItemCardProps {
  item: CartItem
  inventory: { state: string; quantity: string } | null
  atMaxQty: boolean
  selectedDiscount: Discount
  selectedTax: TaxRate
  discounts: Discount[]
  taxes: TaxRate[]
  onQtyChange: (qty: number) => void
  onRemove: () => void
  onDiscountToggle: (checked: boolean) => void
  onDiscountSelect: (discount: Discount) => void
  onTaxToggle: (checked: boolean) => void
  onTaxSelect: (value: string) => void
}

/**
 * Props for the CartDrawer component.
 * @property {string} [accessToken] - Optional access token for API calls.
 * @property {Record<string, { state: string; quantity: string }>} cartInventoryInfo - Inventory info for cart items.
 * @property {TaxRate[]} taxes_data - List of available tax rates.
 * @property {string[]} itemVariationIds - List of item variation IDs.
 */

interface CartDrawerProps {
  accessToken?: string
  cartInventoryInfo: Record<string, { state: string; quantity: string }>
  itemVariationIds: string[]
}

/**
 * Represents the selected tax state for an item.
 * @property {number} [itemTaxRate] - Selected tax rate for the item.
 * @property {boolean} [enabled] - Whether tax is enabled for the item.
 */

type SelectedDiscount = {
  discount_name: string
  discount_value: string | number | null
}

type SelectedTax = {
  itemTaxRate?: number
  enabled?: boolean
}

type SelectedOrderDiscount = {
  name: string
  percentage: string
}

type SelectedOrderTax = {
  name: string
  percentage: string
}
