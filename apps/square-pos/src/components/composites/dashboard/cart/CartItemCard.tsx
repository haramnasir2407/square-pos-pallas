'use client'
import { ButtonVariant } from '@/components/primitives/derived/ButtonVariant'
import { Button } from '@/components/primitives/ui/button'
import { Checkbox } from '@/components/primitives/ui/checkbox'
import { Label } from '@/components/primitives/ui/label'
import Modal from '@/components/primitives/ui/modal/modal'
import type { Discount, TaxRate } from '@/shared/store/useCartStore'
import Image from 'next/image'
import { useState } from 'react'
import { FaTrash } from 'react-icons/fa6'
import { FiMinus } from 'react-icons/fi'
import { GoPlus } from 'react-icons/go'
import { MdOutlineDiscount } from 'react-icons/md'
import { MdDiscount } from 'react-icons/md'
import { css } from '~/styled-system/css'
import { Box, Flex, VStack } from '~/styled-system/jsx'
import {
  cardContainer,
  discountCheckbox,
  discountLabel,
  image,
  itemInfo,
  itemName,
  itemPrice,
  optionsContainer,
  qtyButton,
  qtyButtonDisabled,
  qtyRow,
  qtyValue,
  removeButton,
  taxCheckbox,
  taxLabel,
} from './styles/CartItemCard.styles'

export default function CartItemCard({
  item,
  atMaxQty,
  discounts,
  taxes,
  orderLevelDiscount,
  orderLevelTax,
  onQtyChange,
  onRemove,
  onToggleDiscount,
  onToggleTaxRate,
  onExcludeOrderLevelDiscount,
  onExcludeOrderLevelTaxRate,
  onSelectOrderLevelDiscount,
  onSelectOrderLevelTax,
}: CartItemCardProps) {
  const [open, setOpen] = useState(false)

  // Normalize order-level to item-level shapes for display/merge
  const orderLevelTaxAsTaxRate: TaxRate | null = orderLevelTax
    ? {
        name: orderLevelTax.name,
        percentage: orderLevelTax.percentage,
        tax_id: orderLevelTax.tax_id,
      }
    : null
  const orderLevelDiscountAsDiscount: Discount | null = orderLevelDiscount
    ? {
        discount_name: orderLevelDiscount.discount_name,
        discount_value: orderLevelDiscount.discount_value,
        discount_id: orderLevelDiscount.discount_id,
      }
    : null

  const toNumber = (percentage: string | number) =>
    typeof percentage === 'number' ? percentage : percentage ? Number(percentage) : Number.NaN

  const itemTaxes = taxes
  const itemDiscounts = discounts

  return (
    <Flex
      direction="column"
      gap="gap.component.sm"
      bg="white"
      p="padding.inline.md"
      mb="layout.section.sm"
      className={cardContainer}
    >
      <Flex align="center" gap="gap.component.sm">
        <Image src={item.imageUrl} alt={item.name} width={48} height={48} className={image} />
        <Box className={itemInfo}>
          <Box className={itemName}>{item.name}</Box>
          <Box className={itemPrice}>${item.price ? (item.price / 100).toFixed(2) : 'N/A'}</Box>
          {/* <Box className={itemStock}>Qty in stock: {inventory?.quantity ?? '-'}</Box> */}
        </Box>
        <ButtonVariant
          variant="text"
          size="sm"
          className={removeButton}
          onClick={onRemove}
          aria-label="Remove item"
        >
          <FaTrash fill="gray.50" />
        </ButtonVariant>
      </Flex>
      <Box className={qtyRow}>
        <ButtonVariant
          variant="text"
          size="sm"
          className={qtyButton}
          onClick={() => onQtyChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <FiMinus size={14} />
        </ButtonVariant>
        <span className={qtyValue}>{item.quantity}</span>
        <ButtonVariant
          variant="text"
          size="sm"
          className={atMaxQty ? qtyButtonDisabled : qtyButton}
          onClick={() => onQtyChange(item.quantity + 1)}
          disabled={atMaxQty}
        >
          <GoPlus size={14} />
        </ButtonVariant>

        {/* modal*/}
        <Box className={css({ ml: 'auto' })}>
          <Modal.Root open={open} onOpenChange={setOpen}>
            <Modal.Trigger asChild>
              <Button size="sm" variant="outlined" className={css({ fontSize: 'xs' })}>
                <MdOutlineDiscount /> Show options
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
                <Modal.Title>Item-level discounts and taxes</Modal.Title>
                <Modal.Description>
                  You can apply discounts and taxes to this item.
                </Modal.Description>
              </Modal.Header>
              <Flex direction="column" gap="gap.component.sm" className={optionsContainer}>
                {/* Discount */}
                {itemDiscounts.length > 0 && (
                  <Flex direction="column" gap="2">
                    <Label className={discountLabel}>Apply Discounts</Label>
                    {itemDiscounts.map((discount) => {
                      const inputId = `${item.id}-discount-${discount.discount_id}`
                      const isOrderLevel =
                        !!orderLevelDiscountAsDiscount &&
                        discount.discount_name === orderLevelDiscountAsDiscount.discount_name
                      const isExcluded = (item.excludedOrderDiscountNames ?? []).includes(
                        discount.discount_name,
                      )
                      const isSelected =
                        isOrderLevel ||
                        (item.appliedDiscounts ?? []).some(
                          (d: Discount) => d.discount_name === discount.discount_name,
                        ) ||
                        (item.itemDiscount &&
                          item.itemDiscount.discount_name === discount.discount_name)
                      return (
                        <Label
                          htmlFor={inputId}
                          key={discount.discount_id}
                          className={css({
                            fontSize: 'xs',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2',
                          })}
                        >
                          <Checkbox
                            id={inputId}
                            size="sm"
                            className={discountCheckbox}
                            checked={isOrderLevel ? !isExcluded : isSelected}
                            onCheckedChange={(checked) => {
                              if (isOrderLevel) {
                                // toggle exclusion for this item only
                                onExcludeOrderLevelDiscount(
                                  discount.discount_name,
                                  !(checked as boolean),
                                )
                              } else {
                                onToggleDiscount(discount, checked as boolean)
                              }
                            }}
                          />
                          {discount.discount_name}
                        </Label>
                      )
                    })}
                  </Flex>
                )}
                {/* Tax */}
                {itemTaxes.length > 0 && (
                  <Flex direction="column" gap="2">
                    <Label className={taxLabel}>Apply Taxes</Label>
                    {itemTaxes.map((tax) => {
                      const inputId = `${item.id}-tax-${tax.tax_id}`
                      const isOrderLevel =
                        !!orderLevelTaxAsTaxRate &&
                        tax.name === orderLevelTaxAsTaxRate.name &&
                        toNumber(tax.percentage) === toNumber(orderLevelTaxAsTaxRate.percentage)
                      const isExcluded = (item.excludedOrderTaxRates ?? []).some(
                        (t: TaxRate) =>
                          t.name === tax.name &&
                          toNumber(t.percentage) === toNumber(tax.percentage),
                      )
                      const isSelected =
                        isOrderLevel ||
                        (item.appliedTaxRates ?? []).some(
                          (t: TaxRate) =>
                            t.name === tax.name &&
                            toNumber(t.percentage) === toNumber(tax.percentage),
                        )
                      return (
                        <Label
                          htmlFor={inputId}
                          key={tax.tax_id}
                          className={css({
                            fontSize: 'xs',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2',
                          })}
                        >
                          <Checkbox
                            id={inputId}
                            size="sm"
                            className={taxCheckbox}
                            checked={isOrderLevel ? !isExcluded : isSelected}
                            onCheckedChange={(checked) => {
                              if (isOrderLevel) {
                                // toggle exclusion for this item only
                                onExcludeOrderLevelTaxRate(tax, !(checked as boolean))
                              } else {
                                onToggleTaxRate(tax, checked as boolean)
                              }
                            }}
                          />
                          {tax.name} ({tax.percentage}%)
                        </Label>
                      )
                    })}
                  </Flex>
                )}
              </Flex>
              <Modal.Footer>
                <Modal.Cancel>Cancel</Modal.Cancel>
                <Modal.Action asChild>
                  <Button>Continue</Button>
                </Modal.Action>
              </Modal.Footer>
            </Modal.Content>
          </Modal.Root>
        </Box>
      </Box>
      {/* Applied Discount and Tax */}
      {(() => {
        // Build effective applied lists for display
        const appliedTaxes: TaxRate[] = []
        if (item.appliedTaxRates && item.appliedTaxRates.length > 0) {
          appliedTaxes.push(...item.appliedTaxRates)
        }
        if (orderLevelTaxAsTaxRate) {
          const isExcluded = (item.excludedOrderTaxRates ?? []).some(
            (t: TaxRate) =>
              t.name === orderLevelTaxAsTaxRate.name &&
              toNumber(t.percentage) === toNumber(orderLevelTaxAsTaxRate.percentage),
          )
          if (!isExcluded) {
            const exists = appliedTaxes.some(
              (t) =>
                t.name === orderLevelTaxAsTaxRate.name &&
                toNumber(t.percentage) === toNumber(orderLevelTaxAsTaxRate.percentage),
            )
            if (!exists) appliedTaxes.push(orderLevelTaxAsTaxRate)
          }
        }

        const appliedDiscounts: Discount[] = []
        if (item.appliedDiscounts && item.appliedDiscounts.length > 0) {
          appliedDiscounts.push(...item.appliedDiscounts)
        } else if (item.itemDiscount) {
          appliedDiscounts.push(item.itemDiscount)
        }
        if (orderLevelDiscountAsDiscount) {
          const isExcluded = (item.excludedOrderDiscountNames ?? []).includes(
            orderLevelDiscountAsDiscount.discount_name,
          )
          if (!isExcluded) {
            const exists = appliedDiscounts.some(
              (d) => d.discount_name === orderLevelDiscountAsDiscount.discount_name,
            )
            if (!exists) appliedDiscounts.push(orderLevelDiscountAsDiscount)
          }
        }

        const displayDiscounts: Discount[] = appliedDiscounts

        if (appliedTaxes.length === 0 && displayDiscounts.length === 0) return null

        return (
          <VStack gap={1} align="start" mt={1} justify="space-between" w="full">
            {displayDiscounts.length > 0 &&
              displayDiscounts.map((d) => (
                <Box
                  key={`discount-${d.discount_id ?? d.discount_name}`}
                  className={css({ fontSize: 'xs' })}
                >
                  {d.discount_name}
                </Box>
              ))}
            {appliedTaxes.length > 0 &&
              appliedTaxes.map((t) => (
                <Box
                  key={`tax-${t.tax_id ?? `${t.name}-${t.percentage}`}`}
                  className={css({ fontSize: 'xs' })}
                >
                  {t.name} ({t.percentage}%)
                </Box>
              ))}
          </VStack>
        )
      })()}
    </Flex>
  )
}
