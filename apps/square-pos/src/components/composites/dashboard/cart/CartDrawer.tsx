'use client'

// CSR
import { ButtonVariant } from '@/components/primitives/derived/ButtonVariant'
import { Badge } from '@/components/primitives/ui/badge'
import { Button } from '@/components/primitives/ui/button'
import { Checkbox } from '@/components/primitives/ui/checkbox'
import Drawer from '@/components/primitives/ui/drawer'
import { Label } from '@/components/primitives/ui/label'
import Modal from '@/components/primitives/ui/modal/modal'
import { Skeleton } from '@/components/primitives/ui/skeleton'
import { OrderSummaryContainer } from '@/containers/order/OrderSummaryContainer'
import { useOrderSummary } from '@/containers/order/useOrderSummary'
import { useCartStore } from '@/shared/store/useCartStore'
import { formatMoney, handleOrderLevelChange } from '@/shared/utils/cartDrawerUtils'
import { transformTaxes } from '@/shared/utils/productDataTransformers'
import { useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { MdOutlineDiscount } from 'react-icons/md'
import { css } from '~/styled-system/css'
import { Box } from '~/styled-system/jsx'
import {
  orderSummarySectionStyle,
  orderTotalStyle,
  totalDiscountStyle,
  totalTaxStyle,
} from '../order/styles/styles'
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
  summaryBoxStyle,
  summaryContainerStyle,
} from './styles/CartDrawer.styles'

/**
 * Drawer component for displaying and managing the shopping cart.
 * Handles item-level and order-level discounts/taxes, inventory, and checkout.
 */
export default function CartDrawer({ accessToken, cartInventoryInfo }: CartDrawerProps) {
  // Use zustand store
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const orderLevelDiscounts = useCartStore((state) => state.orderLevelDiscounts)
  const fetchedTaxes = useCartStore((state) => state.fetchedTaxes)
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

  // ? show skeleton for loading state
  const { orderPreview, isLoading, error } = useOrderSummary(
    items,
    selectedOrderDiscount,
    selectedOrderTax,
    accessToken,
  )

  const orderlevelTaxes = transformTaxes(fetchedTaxes)

  // // Auto-select order-level discount when all items share the same item-level discount
  // useEffect(() => {
  //   if (!items || items.length === 0) return
  //   // Build intersection of discount names across all items
  //   const perItemDiscountSets = items.map((item) => {
  //     const names = new Set<string>()
  //     if (item.appliedDiscounts && item.appliedDiscounts.length > 0) {
  //       item.appliedDiscounts.forEach((d) => names.add(d.discount_name))
  //     }
  //     if (item.itemDiscount) {
  //       names.add(item.itemDiscount.discount_name)
  //     }
  //     return names
  //   })
  //   if (perItemDiscountSets.length === 0) return
  //   let commonNames = new Set<string>(perItemDiscountSets[0])
  //   for (let i = 1; i < perItemDiscountSets.length; i++) {
  //     const currentSet = perItemDiscountSets[i]
  //     if (!currentSet) break
  //     commonNames = new Set([...commonNames].filter((n) => currentSet.has(n)))
  //     if (commonNames.size === 0) break
  //   }
  //   if (commonNames.size === 0) return
  //   // Find matching order-level discount option
  //   const candidates = orderLevelDiscounts.filter((d) => commonNames.has(d.discount_name))
  //   if (candidates.length === 1) {
  //     if (!candidates[0]) return
  //     const candidate = candidates[0]
  //     const alreadySelected =
  //       selectedOrderDiscount && selectedOrderDiscount.discount_name === candidate.discount_name
  //     if (!alreadySelected) {
  //       // Clear any per-item exclusions for this order-level discount
  //       items.forEach((it) => {
  //         excludeOrderLevelDiscountForItem(it.id, candidate.discount_name, false)
  //       })
  //       handleOrderLevelChange({
  //         type: 'discount',
  //         value: candidate as SelectedOrderDiscount,
  //         setSelectedOrderDiscount,
  //         setSelectedOrderTax,
  //       })
  //     }
  //   }
  // }, [items, orderLevelDiscounts, selectedOrderDiscount, excludeOrderLevelDiscountForItem])

  // // Auto-select order-level tax when all items share the same item-level tax
  // useEffect(() => {
  //   if (!items || items.length === 0) return
  //   const toNumber = (p: string | number | null | undefined) =>
  //     typeof p === 'number' ? p : p ? Number(p) : Number.NaN
  //   // Build intersection of tax keys (name|percentage) across all items
  //   const perItemTaxSets = items.map((item) => {
  //     const set = new Set<string>()
  //     ;(item.appliedTaxRates ?? []).forEach((t) => {
  //       set.add(`${t.name}|${toNumber(t.percentage)}`)
  //     })
  //     return set
  //   })
  //   if (perItemTaxSets.length === 0) return
  //   let common = new Set<string>(perItemTaxSets[0])
  //   for (let i = 1; i < perItemTaxSets.length; i++) {
  //     const currentSet = perItemTaxSets[i]
  //     if (!currentSet) break
  //     common = new Set([...common].filter((k) => currentSet.has(k)))
  //     if (common.size === 0) break
  //   }
  //   if (common.size === 0) return
  //   // Map intersection to order-level tax options
  //   const candidates = orderlevelTaxes.filter((ot) =>
  //     common.has(`${ot.name}|${toNumber(ot.percentage)}`),
  //   )
  //   if (candidates.length === 1) {
  //     if (!candidates[0]) return
  //     const candidate = candidates[0]
  //     const alreadySelected =
  //       selectedOrderTax &&
  //       selectedOrderTax.name === candidate.name &&
  //       toNumber(selectedOrderTax.percentage) === toNumber(candidate.percentage)
  //     if (!alreadySelected) {
  //       // Clear any per-item exclusions for this order-level tax
  //       items.forEach((it) => {
  //         excludeOrderLevelTaxRateForItem(
  //           it.id,
  //           { tax_id: candidate.tax_id, name: candidate.name, percentage: candidate.percentage },
  //           false,
  //         )
  //       })
  //       handleOrderLevelChange({
  //         type: 'tax',
  //         value: candidate as SelectedOrderTax,
  //         setSelectedOrderDiscount,
  //         setSelectedOrderTax,
  //       })
  //     }
  //   }
  // }, [items, orderlevelTaxes, selectedOrderTax, excludeOrderLevelTaxRateForItem])

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
                      onExcludeOrderLevelDiscount={(discountName, excluded) => {
                        // First, toggle exclusion for this item in the store
                        excludeOrderLevelDiscountForItem(item.id, discountName, excluded)
                        // If user excluded the currently selected order-level discount for this item,
                        // convert the global selection into item-level for all other items and clear the global selection.
                        if (
                          excluded &&
                          selectedOrderDiscount &&
                          selectedOrderDiscount.discount_name === discountName
                        ) {
                          items.forEach((it) => {
                            if (it.id !== item.id) {
                              toggleItemDiscount(
                                it.id,
                                {
                                  discount_id: selectedOrderDiscount.discount_id,
                                  discount_name: selectedOrderDiscount.discount_name,
                                  discount_value: selectedOrderDiscount.discount_value,
                                },
                                true,
                              )
                            }
                          })
                          setSelectedOrderDiscount(null)
                        }
                      }}
                      onExcludeOrderLevelTaxRate={(tax, excluded) => {
                        // First, toggle exclusion for this item in the store
                        excludeOrderLevelTaxRateForItem(item.id, tax, excluded)
                        // If user excluded the currently selected order-level tax for this item,
                        // convert the global selection into item-level for all other items and clear the global selection.
                        const toNumber = (p: string | number | null | undefined) =>
                          typeof p === 'number' ? p : p ? Number(p) : Number.NaN
                        if (
                          excluded &&
                          selectedOrderTax &&
                          selectedOrderTax.name === tax.name &&
                          toNumber(selectedOrderTax.percentage) === toNumber(tax.percentage)
                        ) {
                          items.forEach((it) => {
                            if (it.id !== item.id) {
                              toggleItemTaxRate(it.id, tax, true)
                            }
                          })
                          setSelectedOrderTax(null)
                        }
                      }}
                    />
                  )
                })}
              </Drawer.Body>
            )}

            <Box className={summaryContainerStyle}>
              {items.length > 0 && (
                <Box className={summaryBoxStyle}>
                  {isLoading ? (
                    <Box className={orderSummarySectionStyle}>
                      <Skeleton
                        className={css({
                          h: '5',
                          w: '60',
                          mb: '2',
                          borderRadius: 'sm',
                          bg: 'gray.200',
                        })}
                      />
                      <Skeleton
                        className={css({
                          h: '5',
                          w: '56',
                          mb: '2',
                          borderRadius: 'sm',
                          bg: 'gray.200',
                        })}
                      />
                      <Skeleton
                        className={css({ h: '5', w: '56', borderRadius: 'sm', bg: 'gray.200' })}
                      />
                    </Box>
                  ) : (
                    <Box className={orderSummarySectionStyle}>
                      <Box className={totalDiscountStyle}>
                        <b>Discount:</b>{' '}
                        {formatMoney(orderPreview?.order.total_discount_money?.amount)}
                      </Box>
                      <Box className={totalTaxStyle}>
                        <b>Tax:</b> {formatMoney(orderPreview?.order.total_tax_money?.amount)}
                      </Box>
                      <Box className={orderTotalStyle}>
                        <b>Total:</b> {formatMoney(orderPreview?.order.total_money?.amount)}
                      </Box>
                    </Box>
                  )}
                  {/* Order-level discount/tax controls via modal */}
                  <Modal.Root open={orderOptionsOpen} onOpenChange={setOrderOptionsOpen}>
                    <Modal.Trigger asChild>
                      <Button
                        size="sm"
                        variant="outlined"
                        width="full"
                        className={css({
                          fontSize: 'sm',
                        })}
                      >
                        <MdOutlineDiscount />
                        Add discount and tax
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
                            {orderLevelDiscounts.map((discount) => {
                              const checked =
                                selectedOrderDiscount?.discount_name === discount.discount_name
                              return (
                                <Label
                                  key={discount.discount_name}
                                  htmlFor={`order-discount-${discount.discount_name}`}
                                  className={css({
                                    fontSize: 'xs',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2',
                                  })}
                                >
                                  <Checkbox
                                    id={`order-discount-${discount.discount_name}`}
                                    size="sm"
                                    checked={checked}
                                    onCheckedChange={(checked) => {
                                      const orderDiscount = checked ? discount : null
                                      if (checked) {
                                        // Clear any per-item exclusions for this order-level discount
                                        items.forEach((item) => {
                                          excludeOrderLevelDiscountForItem(
                                            item.id,
                                            discount.discount_name,
                                            false,
                                          )
                                        })
                                      } else {
                                        // Removing order-level discount: also remove any matching item-level applications
                                        items.forEach((it) => {
                                          toggleItemDiscount(it.id, discount, false)
                                        })
                                      }
                                      handleOrderLevelChange({
                                        type: 'discount',
                                        value: orderDiscount as SelectedOrderDiscount,
                                        setSelectedOrderDiscount,
                                        setSelectedOrderTax,
                                      })
                                    }}
                                  />
                                  {discount.discount_name}
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
                            {orderlevelTaxes.map((tax) => {
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
                                    onCheckedChange={(checked) => {
                                      const orderTax = checked ? tax : null
                                      if (checked) {
                                        // Clear any per-item exclusions for this order-level tax
                                        items.forEach((item) => {
                                          excludeOrderLevelTaxRateForItem(item.id, tax, false)
                                        })
                                      } else {
                                        // Removing order-level tax: also remove any matching item-level applications
                                        items.forEach((it) => {
                                          toggleItemTaxRate(it.id, tax, false)
                                        })
                                      }
                                      handleOrderLevelChange({
                                        type: 'tax',
                                        value: orderTax as SelectedOrderTax,
                                        setSelectedOrderDiscount,
                                        setSelectedOrderTax,
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
                Checkout with ({items.length}) items
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
            selectedOrderDiscount={selectedOrderDiscount}
            selectedOrderTax={selectedOrderTax}
          />
        )}
      </Drawer.Content>
      {/* Order-level options modal */}
    </Drawer.Root>
  )
}
