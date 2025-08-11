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
  is_taxable?: boolean
  itemTaxRate?: number
  category?: string
  itemDiscount?: Discount
  variationId?: string
  discounts?: Discount[]
  taxes?: TaxRate[]
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

          // Apply discount if present
          if (item.itemDiscount) {
            appliedDiscounts.push(item.itemDiscount)
            itemDiscountValue = calculateItemDiscountValue(item, itemSubtotal)
          }
          const discountedSubtotal = itemSubtotal - itemDiscountValue
          discountAmount += itemDiscountValue

          // Apply tax if present and enabled
          if (item.is_taxable && item.itemTaxRate !== undefined) {
            appliedTaxRates.push({
              name:
                item.taxes?.find((t) => Number(t.percentage) === item.itemTaxRate)?.name || 'Tax',
              percentage: item.itemTaxRate,
            })
            itemTaxValue = (discountedSubtotal * item.itemTaxRate) / 100
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
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }), // only persist 'items'
    },
  ),
)
