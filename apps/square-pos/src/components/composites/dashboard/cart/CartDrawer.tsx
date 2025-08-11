'use client'

// CSR

import { ButtonVariant } from '@/components/primitives/derived/ButtonVariant'
import { Badge } from '@/components/primitives/ui/badge'
import Drawer from '@/components/primitives/ui/drawer'
import { Label } from '@/components/primitives/ui/label'
import Select from '@/components/primitives/ui/select'
import { OrderSummaryContainer } from '@/containers/order/OrderSummaryContainer'
import { ORDER_LEVEL_DISCOUNTS, ORDER_LEVEL_TAXES } from '@/shared/constants/order_discounts_taxes'
import { useCartStore } from '@/shared/store/useCartStore'
import {
  getDrawerOrderSummary,
  handleDiscountSelect,
  handleDiscountToggle,
  handleOrderLevelChange,
  handleTaxSelect,
  handleTaxToggle,
} from '@/shared/utils/cartDrawerUtils'
import { useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { css } from '~/styled-system/css'
import { Box } from '~/styled-system/jsx'
import CartItemCard from './CartItemCard'
import {
  cartCountStyle,
  checkoutButtonStyle,
  clearCartButtonStyle,
  drawerBodyStyle,
  drawerCloseStyle,
  drawerContentStyle,
  drawerTitleStyle,
  drawerTriggerStyle,
  emptyCartTextStyle,
  labelStyle,
  orderLevelInfoStyle,
  summaryBoxStyle,
  summaryContainerStyle,
  totalTextStyle,
} from './styles/CartDrawer.styles'

/**
 * Drawer component for displaying and managing the shopping cart.
 * Handles item-level and order-level discounts/taxes, inventory, and checkout.
 */
export default function CartDrawer({ accessToken, cartInventoryInfo }: CartDrawerProps) {
  // Use zustand store instead of CartContext
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const toggleItemTax = useCartStore((state) => state.toggleItemTax)
  const getOrderSummary = useCartStore((state) => state.getOrderSummary)
  const clearCart = useCartStore((state) => state.clearCart)
  const applyItemDiscount = useCartStore((state) => state.applyItemDiscount)
  const removeItemDiscount = useCartStore((state) => state.removeItemDiscount)
  const setItemTaxRate = useCartStore((state) => state.setItemTaxRate)

  const [open, setOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // * store selected discount per item
  const [selectedDiscounts, setSelectedDiscounts] = useState<Record<string, SelectedDiscount>>({})
  // * store selected taxes per item
  const [selectedTaxes, setSelectedTaxes] = useState<Record<string, SelectedTax>>({})
  // * store selected order-level discount/tax
  const [selectedOrderDiscount, setSelectedOrderDiscount] = useState<SelectedOrderDiscount | null>(
    null,
  )
  const [selectedOrderTax, setSelectedOrderTax] = useState<SelectedOrderTax | null>(null)

  const drawerOrderSummary = getDrawerOrderSummary({
    isOrderLevelActive: !!selectedOrderDiscount || !!selectedOrderTax,
    isItemLevelActive: !!selectedDiscounts || !!selectedTaxes,
    items,
    selectedOrderDiscount,
    selectedOrderTax,
    getOrderSummary,
  })

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen && showConfirmation) {
          clearCart()
          setShowConfirmation(false)
          setShowCheckout(false)
        }
      }}
      side="right"
    >
      <Drawer.Trigger className={drawerTriggerStyle}>
        <FaShoppingCart size={30} fill="gray.100" />
        <Badge size="sm" variant="default" className={cartCountStyle}>
          {items.length}
        </Badge>
      </Drawer.Trigger>

      <Drawer.Content className={drawerContentStyle}>
        <Drawer.Close
          className={drawerCloseStyle}
          onClick={() => {
            setOpen(false)
            if (showConfirmation) {
              clearCart()
              setShowConfirmation(false)
              setShowCheckout(false)
              setOpen(false)
            }
          }}
        >
          &times;
        </Drawer.Close>

        {!showCheckout ? (
          <>
            <Drawer.Title className={drawerTitleStyle}>Shopping Cart</Drawer.Title>
            {items.length === 0 ? (
              <p className={emptyCartTextStyle}>Your cart is empty.</p>
            ) : (
              <Drawer.Body className={drawerBodyStyle}>
                {items.map((item, idx) => {
                  const inventory = cartInventoryInfo[item.id]
                  const quantity = inventory?.quantity ?? '-'
                  const discounts = item.discounts || []
                  const taxes = item.taxes || []
                  const inventoryQty =
                    typeof quantity === 'string' ? Number.parseInt(quantity, 10) : (quantity ?? 0)
                  const atMaxQty = item.quantity >= inventoryQty
                  return (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      inventory={inventory ?? null}
                      atMaxQty={atMaxQty}
                      selectedDiscount={selectedDiscounts[item.id]}
                      selectedTax={{
                        name: item.name,
                        percentage: selectedTaxes[item.id]?.itemTaxRate ?? 0,
                      }}
                      discounts={discounts}
                      taxes={taxes}
                      onQtyChange={(qty) => updateQuantity(item.id, qty)}
                      onRemove={() => removeItem(item.id)}
                      onDiscountToggle={(checked) =>
                        handleDiscountToggle({
                          item,
                          checked,
                          selectedDiscounts,
                          applyItemDiscount,
                          removeItemDiscount,
                        })
                      }
                      onDiscountSelect={(discount) =>
                        handleDiscountSelect({
                          setSelectedDiscounts,
                          item,
                          discount,
                        })
                      }
                      onTaxToggle={(checked) =>
                        handleTaxToggle({
                          item,
                          checked,
                          toggleItemTax,
                        })
                      }
                      onTaxSelect={(value) =>
                        handleTaxSelect({
                          setSelectedTaxes,
                          item,
                          value,
                          setItemTaxRate,
                        })
                      }
                    />
                  )
                })}
              </Drawer.Body>
            )}

            <Box className={summaryContainerStyle}>
              {items.length > 0 && (
                <Box className={summaryBoxStyle}>
                  {/* Order-level discount/tax controls */}
                  <Label htmlFor="order-discount" className={labelStyle}>
                    Order Discount:
                  </Label>
                  <Select.Root
                    size="sm"
                    value={selectedOrderDiscount?.name || ''}
                    onValueChange={(value) => {
                      const discount = ORDER_LEVEL_DISCOUNTS.find((d) => d.name === value) || null
                      handleOrderLevelChange({
                        type: 'discount',
                        value: discount as SelectedOrderDiscount,
                        setSelectedOrderDiscount,
                        setSelectedOrderTax,
                        items,
                      })
                    }}
                  >
                    <Select.Trigger className={css({ fontSize: 'xs' })}>
                      <Select.Value placeholder="Select Discount" />
                    </Select.Trigger>
                    <Select.Content
                      position="popper"
                      sideOffset={5}
                      className={css({
                        zIndex: 1000,
                        fontSize: 'xs',
                      })}
                    >
                      <Select.Group>
                        <Select.Label>Discounts</Select.Label>
                        {ORDER_LEVEL_DISCOUNTS.map((discount) => (
                          <Select.Item
                            key={discount.name}
                            value={discount.name}
                            className={css({ fontSize: 'xs' })}
                          >
                            {discount.name} ({discount.percentage}%)
                          </Select.Item>
                        ))}
                        <Select.Item
                          key="none"
                          value="none"
                          className={css({ fontSize: 'xs', color: 'gray.500' })}
                        >
                          Remove Discount
                        </Select.Item>
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>

                  <Label htmlFor="order-tax" className={labelStyle}>
                    Order Tax:
                  </Label>
                  <Select.Root
                    size="sm"
                    value={selectedOrderTax?.name || ''}
                    onValueChange={(value) => {
                      const tax = ORDER_LEVEL_TAXES.find((t) => t.name === value) || null
                      handleOrderLevelChange({
                        type: 'tax',
                        value: tax,
                        setSelectedOrderDiscount,
                        setSelectedOrderTax,
                        items,
                      })
                    }}
                  >
                    <Select.Trigger className={css({ fontSize: 'xs' })}>
                      <Select.Value placeholder="Select Tax" />
                    </Select.Trigger>
                    <Select.Content
                      position="popper"
                      sideOffset={5}
                      className={css({
                        zIndex: 1000,
                        fontSize: 'xs',
                      })}
                    >
                      <Select.Group>
                        <Select.Label>Taxes</Select.Label>

                        {ORDER_LEVEL_TAXES.map((tax) => (
                          <Select.Item
                            key={tax.name}
                            value={tax.name}
                            className={css({ fontSize: 'xs' })}
                          >
                            {tax.name} ({tax.percentage}%)
                          </Select.Item>
                        ))}
                        <Select.Item
                          key="none"
                          value="none"
                          className={css({ fontSize: 'xs', color: 'gray.500' })}
                        >
                          Remove Tax
                        </Select.Item>
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>

                  {/* Show order-level discount/tax if active */}
                  {!!selectedOrderDiscount || !!selectedOrderTax ? (
                    <Box className={orderLevelInfoStyle}>
                      {selectedOrderDiscount && (
                        <Box>
                          <b>Order Discount:</b> {selectedOrderDiscount.name} (-
                          {selectedOrderDiscount.percentage}%)
                        </Box>
                      )}
                      {selectedOrderTax && (
                        <Box>
                          <b>Order Tax:</b> {selectedOrderTax.name} (+
                          {selectedOrderTax.percentage}%)
                        </Box>
                      )}
                    </Box>
                  ) : null}
                  <Box className={totalTextStyle}>
                    Total: ${(drawerOrderSummary.total / 100).toFixed(2)}
                  </Box>
                </Box>
              )}
              <ButtonVariant
                variant="outlined"
                className={clearCartButtonStyle}
                disabled={items.length === 0}
                onClick={() => {
                  clearCart()
                }}
              >
                Clear Cart
              </ButtonVariant>
              <ButtonVariant
                variant="primary"
                className={checkoutButtonStyle}
                disabled={items.length === 0}
                onClick={() => setShowCheckout(true)}
              >
                Proceed to Checkout
              </ButtonVariant>
            </Box>
          </>
        ) : (
          <OrderSummaryContainer
            items={items}
            accessToken={accessToken || ''}
            onGoBack={() => setShowCheckout(false)}
            clearCart={clearCart}
            setShowCheckout={setShowCheckout}
            showCheckout={showCheckout}
            setShowConfirmation={setShowConfirmation}
            showConfirmation={showConfirmation}
            setOpen={setOpen}
          />
        )}
      </Drawer.Content>
    </Drawer.Root>
  )
}
