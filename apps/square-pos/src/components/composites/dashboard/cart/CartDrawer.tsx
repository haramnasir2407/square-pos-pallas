'use client'

// CSR

import { ButtonVariant } from '@/components/primitives/derived/ButtonVariant'
import { Badge } from '@/components/primitives/ui/badge'
import { Button } from '@/components/primitives/ui/button'
import { Checkbox } from '@/components/primitives/ui/checkbox'
import Drawer from '@/components/primitives/ui/drawer'
import { Label } from '@/components/primitives/ui/label'
import Modal from '@/components/primitives/ui/modal/modal'
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
  const getOrderSummary = useCartStore((state) => state.getOrderSummary)
  const clearCart = useCartStore((state) => state.clearCart)
  const toggleItemDiscount = useCartStore((state) => state.toggleItemDiscount)
  const toggleItemTaxRate = useCartStore((state) => state.toggleItemTaxRate)
  const excludeOrderLevelDiscountForItem = useCartStore(
    (state) => state.excludeOrderLevelDiscountForItem,
  )
  const excludeOrderLevelTaxRateForItem = useCartStore(
    (state) => state.excludeOrderLevelTaxRateForItem,
  )

  const [open, setOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [orderOptionsOpen, setOrderOptionsOpen] = useState(false)

  // * store selected order-level discount/tax
  const [selectedOrderDiscount, setSelectedOrderDiscount] = useState<SelectedOrderDiscount | null>(
    null,
  )
  const [selectedOrderTax, setSelectedOrderTax] = useState<SelectedOrderTax | null>(null)

  const drawerOrderSummary = getDrawerOrderSummary({
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
                      discounts={discounts}
                      taxes={taxes}
                      orderLevelDiscount={selectedOrderDiscount}
                      orderLevelTax={selectedOrderTax}
                      onQtyChange={(qty) => updateQuantity(item.id, qty)}
                      onRemove={() => removeItem(item.id)}
                      onToggleDiscount={(discount, checked) => {
                        toggleItemDiscount(item.id, discount, checked)
                      }}
                      onToggleTaxRate={(tax, checked) => {
                        toggleItemTaxRate(item.id, tax, checked)
                      }}
                      onExcludeOrderLevelDiscount={(discountName, excluded) =>
                        excludeOrderLevelDiscountForItem(item.id, discountName, excluded)
                      }
                      onExcludeOrderLevelTaxRate={(tax, excluded) =>
                        excludeOrderLevelTaxRateForItem(item.id, tax, excluded)
                      }
                    />
                  )
                })}
              </Drawer.Body>
            )}

            <Box className={summaryContainerStyle}>
              {items.length > 0 && (
                <Box className={summaryBoxStyle}>
                  {/* Order-level discount/tax controls via modal */}

                  <Modal.Root open={orderOptionsOpen} onOpenChange={setOrderOptionsOpen}>
                    <Modal.Trigger asChild>
                      <Button size="sm" variant="outlined" width="full">
                        Order Discounts/Taxes
                      </Button>
                    </Modal.Trigger>
                    <Modal.Content
                      className={css({
                        width: { base: '90vw', sm: '80vw', md: '40vw' },
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1000,
                      })}
                    >
                      <Modal.Header>
                        <Modal.Title>Order-level discounts and taxes</Modal.Title>
                        <Modal.Description>
                          Apply a discount or tax to the entire order. You can opt out per item from
                          each card.
                        </Modal.Description>
                      </Modal.Header>
                      <Box className={css({ display: 'flex', flexDir: 'column', gap: '3' })}>
                        {/* Discounts */}
                        <Box>
                          <Label className={labelStyle}>Order Discounts</Label>
                          <Box
                            className={css({
                              mt: '2',
                              display: 'flex',
                              flexDir: 'column',
                              gap: '2',
                            })}
                          >
                            {ORDER_LEVEL_DISCOUNTS.map((discount) => {
                              const checked = selectedOrderDiscount?.name === discount.name
                              return (
                                <Label
                                  key={discount.name}
                                  htmlFor={`order-discount-${discount.name}`}
                                  className={css({
                                    fontSize: 'xs',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2',
                                  })}
                                >
                                  <Checkbox
                                    id={`order-discount-${discount.name}`}
                                    size="sm"
                                    checked={checked}
                                    onCheckedChange={(c) => {
                                      const orderDiscount = c ? discount : null
                                      handleOrderLevelChange({
                                        type: 'discount',
                                        value: orderDiscount as SelectedOrderDiscount,
                                        setSelectedOrderDiscount,
                                        setSelectedOrderTax,
                                        items,
                                      })
                                    }}
                                  />
                                  {discount.name}
                                </Label>
                              )
                            })}
                          </Box>
                        </Box>
                        {/* Taxes */}
                        <Box>
                          <Label className={labelStyle}>Order Taxes</Label>
                          <Box
                            className={css({
                              mt: '2',
                              display: 'flex',
                              flexDir: 'column',
                              gap: '2',
                            })}
                          >
                            {ORDER_LEVEL_TAXES.map((tax) => {
                              const checked = selectedOrderTax?.name === tax.name
                              return (
                                <Label
                                  key={tax.name}
                                  htmlFor={`order-tax-${tax.name}`}
                                  className={css({
                                    fontSize: 'xs',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2',
                                  })}
                                >
                                  <Checkbox
                                    id={`order-tax-${tax.name}`}
                                    size="sm"
                                    checked={checked}
                                    onCheckedChange={(c) => {
                                      const orderTax = c ? tax : null
                                      handleOrderLevelChange({
                                        type: 'tax',
                                        value: orderTax as SelectedOrderTax,
                                        setSelectedOrderDiscount,
                                        setSelectedOrderTax,
                                        items,
                                      })
                                    }}
                                  />
                                  {tax.name} ({tax.percentage}%)
                                </Label>
                              )
                            })}
                          </Box>
                        </Box>
                      </Box>
                      <Modal.Footer>
                        <Modal.Cancel>Cancel</Modal.Cancel>
                        <Modal.Action asChild>
                          <Button onClick={() => setOrderOptionsOpen(false)}>Done</Button>
                        </Modal.Action>
                      </Modal.Footer>
                    </Modal.Content>
                  </Modal.Root>

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
      {/* Order-level options modal */}
    </Drawer.Root>
  )
}
