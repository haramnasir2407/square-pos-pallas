import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Tax } from '../types/catalog'

export type Discount = {
  discount_id: string
  discount_name: string
  discount_value: string | number
}

export type TaxRate = {
  tax_id: string
  name: string
  percentage: string | number
}

export type CartItem = {
  id: string
  name: string
  price: number | null
  imageUrl: string | undefined
  quantity: number
  is_taxable?: boolean
  itemTaxRate?: number
  category?: string
  itemDiscount?: Discount
  variationId?: string
  discounts?: Discount[]
  taxes?: TaxRate[]
  appliedDiscounts?: Discount[]
  appliedTaxRates?: TaxRate[]
  excludedOrderDiscountNames?: string[]
  excludedOrderTaxRates?: TaxRate[]
}

type CartState = {
  items: CartItem[]
  orderLevelDiscounts: Array<{
    discount_id: string
    discount_name: string
    discount_value: string | number
  }>
  // Add new state for fetched taxes and discounts
  fetchedTaxes: Tax[]
  fetchedDiscounts: Discount[]
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
  // per-item opt-outs for order-level selections
  excludeOrderLevelDiscountForItem: (
    itemId: string,
    discountName: string,
    excluded: boolean,
  ) => void
  excludeOrderLevelTaxRateForItem: (itemId: string, taxRate: TaxRate, excluded: boolean) => void
  // order-level discount management
  setOrderLevelDiscounts: (
    discounts: Array<{
      discount_id: string
      discount_name: string
      discount_value: string | number
    }>,
  ) => void
  // Add new actions for setting fetched data
  setFetchedTaxes: (taxes: Tax[]) => void
  setFetchedDiscounts: (discounts: Discount[]) => void
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
      orderLevelDiscounts: [],
      // Add new state for fetched taxes and discounts
      fetchedTaxes: [],
      fetchedDiscounts: [],
      addItem: (item: CartItem) => {
        set((state: CartState) => {
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
      // applyItemTax: (itemId: string, tax: TaxRate) =>
      //   set((state: CartState) => ({
      //     items: state.items.map((item: CartItem) =>
      //       item.id === itemId ? { ...item, itemTaxRate: tax } : item,
      //     ),
      //   })),
      removeItemTax: (itemId: string) =>
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) => {
            if (item.id === itemId) {
              const { itemTaxRate, ...rest } = item
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
              (t) =>
                t.name === taxRate.name && toNumber(t.percentage) === toNumber(taxRate.percentage),
            )
            if (enabled && !exists) {
              return { ...item, appliedTaxRates: [...current, taxRate] }
            }
            if (!enabled && exists) {
              return {
                ...item,
                appliedTaxRates: current.filter(
                  (t) =>
                    !(
                      t.name === taxRate.name &&
                      toNumber(t.percentage) === toNumber(taxRate.percentage)
                    ),
                ),
              }
            }
            return item
          }),
        })),
      excludeOrderLevelDiscountForItem: (itemId: string, discountName: string, excluded: boolean) =>
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) => {
            if (item.id !== itemId) return item
            const list = item.excludedOrderDiscountNames ?? []
            const exists = list.includes(discountName)
            if (excluded && !exists) {
              return { ...item, excludedOrderDiscountNames: [...list, discountName] }
            }
            if (!excluded && exists) {
              return {
                ...item,
                excludedOrderDiscountNames: list.filter((n) => n !== discountName),
              }
            }
            return item
          }),
        })),
      excludeOrderLevelTaxRateForItem: (itemId: string, taxRate: TaxRate, excluded: boolean) =>
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) => {
            if (item.id !== itemId) return item
            const toNumber = (p: string | number | null) =>
              typeof p === 'number' ? p : p ? Number(p) : Number.NaN
            const list = item.excludedOrderTaxRates ?? []
            const exists = list.some(
              (t) =>
                t.name === taxRate.name && toNumber(t.percentage) === toNumber(taxRate.percentage),
            )
            if (excluded && !exists) {
              return { ...item, excludedOrderTaxRates: [...list, taxRate] }
            }
            if (!excluded && exists) {
              return {
                ...item,
                excludedOrderTaxRates: list.filter(
                  (t) =>
                    !(
                      t.name === taxRate.name &&
                      toNumber(t.percentage) === toNumber(taxRate.percentage)
                    ),
                ),
              }
            }
            return item
          }),
        })),
      setOrderLevelDiscounts: (discounts) =>
        set(() => ({
          orderLevelDiscounts: discounts,
        })),
      // Add new actions for setting fetched data
      setFetchedTaxes: (taxes) =>
        set(() => ({
          fetchedTaxes: taxes,
        })),
      setFetchedDiscounts: (discounts) =>
        set(() => ({
          fetchedDiscounts: discounts,
        })),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }), // only persist 'items'
    },
  ),
)
