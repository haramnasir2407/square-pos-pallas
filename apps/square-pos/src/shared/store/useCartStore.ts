import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { calculateItemDiscountValue } from '../utils/cartDrawerUtils'

export type Discount = {
  discount_name: string
  discount_value: string | number | null
}

export type TaxRate = {
  name: string
  percentage: string | number | null
}

export type CartItem = {
  id: string
  name: string
  price: number | null
  imageUrl: string | undefined
  quantity: number
  // legacy single-select fields (kept for backward compatibility)
  is_taxable?: boolean
  itemTaxRate?: number
  category?: string
  // legacy single-select field (kept for backward compatibility)
  itemDiscount?: Discount
  variationId?: string
  discounts?: Discount[]
  taxes?: TaxRate[]
  // new multi-select fields
  appliedDiscounts?: Discount[]
  appliedTaxRates?: TaxRate[]
}

type CartState = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  applyItemDiscount: (itemId: string, discount: Discount) => void
  removeItemDiscount: (itemId: string) => void
  toggleItemTax: (itemId: string, enabled: boolean) => void
  setItemTaxRate: (itemId: string, taxRate: TaxRate) => void
  // multi-select toggles
  toggleItemDiscount: (itemId: string, discount: Discount, enabled: boolean) => void
  toggleItemTaxRate: (itemId: string, taxRate: TaxRate, enabled: boolean) => void
  getOrderSummary: () => OrderSummary
}

export type OrderSummary = {
  subtotal: number // * sub-total before discounts and taxes
  discountAmount: number
  taxAmount: number
  total: number
  appliedDiscounts: Discount[]
  appliedTaxRates: TaxRate[]
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: CartItem) => {
        set((state: CartState) => {
          const existing = state.items.find((i: CartItem) => i.id === item.id)
          if (existing) {
            // If item exists, update quantity and merge properties
            return {
              items: state.items.map((i: CartItem) =>
                i.id === item.id
                  ? {
                      ...i,
                      ...item,
                      quantity: i.quantity + (item.quantity || 1),
                    }
                  : i,
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },
      removeItem: (id: string) =>
        set((state: CartState) => ({
          items: state.items.filter((item: CartItem) => item.id !== id),
        })),
      updateQuantity: (id: string, quantity: number) =>
        set((state: CartState) => {
          const item = state.items.find((i: CartItem) => i.id === id)
          if (!item) return state
          if (quantity <= 0) {
            return { items: state.items.filter((i: CartItem) => i.id !== id) }
          }
          return {
            items: state.items.map((i: CartItem) => (i.id === id ? { ...i, quantity } : i)),
          }
        }),
      getOrderSummary: () => {
        const items = get().items
        let subtotal = 0
        let discountAmount = 0
        let taxAmount = 0
        const appliedDiscounts: Discount[] = []
        const appliedTaxRates: TaxRate[] = []

        for (const item of items) {
          const itemPrice = item.price ?? 0
          const itemSubtotal = itemPrice * item.quantity
          let itemDiscountValue = 0
          let itemTaxValue = 0

          // Multi-discount support
          const effectiveDiscounts: Discount[] =
            (item.appliedDiscounts && item.appliedDiscounts.length > 0)
              ? item.appliedDiscounts
              : item.itemDiscount
                ? [item.itemDiscount]
                : []

          // Collect applied discounts for summary
          appliedDiscounts.push(...effectiveDiscounts)

          // Calculate combined discount value
          if (effectiveDiscounts.length > 0) {
            // BOGO first
            const hasBogo = effectiveDiscounts.some(
              (d) => typeof d.discount_name === 'string' && d.discount_name.toLowerCase().includes('buy one get one'),
            )
            if (hasBogo && item.quantity >= 2) {
              const freeItems = Math.floor(item.quantity / 2)
              itemDiscountValue += freeItems * itemPrice
            }
            // Percentage discounts next (sum of percents on remaining subtotal)
            const percentSum = effectiveDiscounts
              .map((d) => (typeof d.discount_value === 'string' && d.discount_value.includes('%')
                ? Number.parseFloat(d.discount_value)
                : undefined))
              .filter((v): v is number => typeof v === 'number' && !Number.isNaN(v))
              .reduce((acc, v) => acc + v, 0)
            if (percentSum > 0) {
              const remainingAfterBogo = Math.max(itemSubtotal - itemDiscountValue, 0)
              itemDiscountValue += (remainingAfterBogo * percentSum) / 100
            }
            // Fixed-amount discounts (numbers or numeric strings)
            const fixedSumPerUnit = effectiveDiscounts
              .map((d) => {
                if (typeof d.discount_value === 'number') return d.discount_value
                if (typeof d.discount_value === 'string' && !d.discount_value.includes('%')) {
                  const num = Number.parseFloat(d.discount_value)
                  return Number.isNaN(num) ? 0 : num
                }
                return 0
              })
              .reduce((acc, v) => acc + v, 0)
            if (fixedSumPerUnit > 0) {
              itemDiscountValue += fixedSumPerUnit * item.quantity
            }
          }

          const discountedSubtotal = Math.max(itemSubtotal - itemDiscountValue, 0)
          discountAmount += itemDiscountValue

          // Multi-tax support
          const effectiveTaxes: TaxRate[] =
            (item.appliedTaxRates && item.appliedTaxRates.length > 0)
              ? item.appliedTaxRates
              : item.is_taxable && item.itemTaxRate !== undefined
                ? [{
                    name: item.taxes?.find((t) => Number(t.percentage) === item.itemTaxRate)?.name || 'Tax',
                    percentage: item.itemTaxRate,
                  }]
                : []

          appliedTaxRates.push(...effectiveTaxes)

          if (effectiveTaxes.length > 0) {
            const percentSum = effectiveTaxes
              .map((t) => (typeof t.percentage === 'number' ? t.percentage : Number(t.percentage)))
              .filter((v) => typeof v === 'number' && !Number.isNaN(v)) as number[]
            const taxPercents = (percentSum as unknown as number[]) // satisfy linter with explicit grouping
            const totalPercent = taxPercents.reduce((acc: number, v: number) => acc + v, 0)
            itemTaxValue = (discountedSubtotal * totalPercent) / 100
          }

          taxAmount += itemTaxValue
          subtotal += discountedSubtotal
        }
        const total = subtotal + taxAmount
        return {
          subtotal,
          discountAmount,
          taxAmount,
          total,
          appliedDiscounts,
          appliedTaxRates,
        }
      },
      clearCart: () => set(() => ({ items: [] })),
      applyItemDiscount: (itemId: string, discount: Discount) =>
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) =>
            item.id === itemId ? { ...item, itemDiscount: discount } : item,
          ),
        })),
      removeItemDiscount: (itemId: string) =>
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) => {
            if (item.id === itemId) {
              const { itemDiscount, ...rest } = item
              return rest
            }
            return item
          }),
        })),
      toggleItemTax: (itemId: string, enabled: boolean) =>
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) =>
            item.id === itemId ? { ...item, is_taxable: enabled } : item,
          ),
        })),
      setItemTaxRate: (itemId: string, taxRate: TaxRate) =>
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) =>
            item.id === itemId
              ? {
                  ...item,
                  itemTaxRate:
                    typeof taxRate.percentage === 'number'
                      ? taxRate.percentage
                      : taxRate.percentage
                        ? Number(taxRate.percentage)
                        : undefined,
                }
              : item,
          ),
        })),
      // Multi-select toggles
      toggleItemDiscount: (itemId: string, discount: Discount, enabled: boolean) =>
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) => {
            if (item.id !== itemId) return item
            const current = item.appliedDiscounts ?? []
            const exists = current.some((d) => d.discount_name === discount.discount_name)
            if (enabled && !exists) {
              return { ...item, appliedDiscounts: [...current, discount] }
            }
            if (!enabled && exists) {
              return {
                ...item,
                appliedDiscounts: current.filter((d) => d.discount_name !== discount.discount_name),
              }
            }
            return item
          }),
        })),
      toggleItemTaxRate: (itemId: string, taxRate: TaxRate, enabled: boolean) =>
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) => {
            if (item.id !== itemId) return item
            const current = item.appliedTaxRates ?? []
            const toNumber = (p: string | number | null) =>
              typeof p === 'number' ? p : p ? Number(p) : Number.NaN
            const exists = current.some(
              (t) => t.name === taxRate.name && toNumber(t.percentage) === toNumber(taxRate.percentage),
            )
            if (enabled && !exists) {
              return { ...item, appliedTaxRates: [...current, taxRate] }
            }
            if (!enabled && exists) {
              return {
                ...item,
                appliedTaxRates: current.filter(
                  (t) => !(t.name === taxRate.name && toNumber(t.percentage) === toNumber(taxRate.percentage)),
                ),
              }
            }
            return item
          }),
        })),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }), // only persist 'items'
    },
  ),
)
