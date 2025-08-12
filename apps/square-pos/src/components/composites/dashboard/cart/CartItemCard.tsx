'use client'

import { ButtonVariant } from '@/components/primitives/derived/ButtonVariant'
import { Button } from '@/components/primitives/ui/button'
import { Checkbox } from '@/components/primitives/ui/checkbox'
import { Label } from '@/components/primitives/ui/label'
import Modal from '@/components/primitives/ui/modal/modal'
// removed Select dropdown in favor of checkbox lists
import type { Discount, TaxRate } from '@/shared/store/useCartStore'
import Image from 'next/image'
import { useState } from 'react'
import { FaTrash } from 'react-icons/fa6'
import { FiMinus } from 'react-icons/fi'
import { GoPlus } from 'react-icons/go'
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
  itemStock,
  optionsContainer,
  qtyButton,
  qtyButtonDisabled,
  qtyRow,
  qtyValue,
  removeButton,
  taxCheckbox,
  taxLabel,
  taxRow,
} from './styles/CartItemCard.styles'

export default function CartItemCard({
  item,
  inventory,
  atMaxQty,
  discounts,
  taxes,
  orderLevelDiscount,
  orderLevelTax,
  onQtyChange,
  onRemove,
  onToggleDiscount,
  onToggleTaxRate,
}: CartItemCardProps) {
  const [open, setOpen] = useState(false)
  // Normalize order-level to item-level shapes for display/merge
  const orderLevelTaxAsTaxRate: TaxRate | null = orderLevelTax
    ? { name: orderLevelTax.name, percentage: orderLevelTax.percentage }
    : null
  const orderLevelDiscountAsDiscount: Discount | null = orderLevelDiscount
    ? {
        discount_name: orderLevelDiscount.name,
        discount_value: `${orderLevelDiscount.percentage}%`,
      }
    : null

  const toNumber = (p: string | number | null) =>
    typeof p === 'number' ? p : p ? Number(p) : Number.NaN
  const mergeUniqueTaxes = (list: TaxRate[], extra: TaxRate | null) => {
    const base = [...list]
    if (extra) {
      const exists = base.some(
        (t) => t.name === extra.name && toNumber(t.percentage) === toNumber(extra.percentage),
      )
      if (!exists) base.push(extra)
    }
    return base
  }
  const mergeUniqueDiscounts = (list: Discount[], extra: Discount | null) => {
    const base = [...list]
    if (extra) {
      const exists = base.some((d) => d.discount_name === extra.discount_name)
      if (!exists) base.push(extra)
    }
    return base
  }

  const taxesForList = mergeUniqueTaxes(taxes, orderLevelTaxAsTaxRate)
  const discountsForList = mergeUniqueDiscounts(discounts, orderLevelDiscountAsDiscount)

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
              <Button size="sm" variant="primary">
                Show options
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
                <Modal.Title>Apply item-level discounts and taxes</Modal.Title>
                <Modal.Description>
                  You can apply discounts and taxes to this item.
                </Modal.Description>
              </Modal.Header>
              <Flex direction="column" gap="gap.component.sm" className={optionsContainer}>
                {/* Tax */}
                {taxesForList.length > 0 && (
                  <Flex direction="column" gap="2">
                    <Label className={taxLabel}>Apply Taxes</Label>
                    {taxesForList.map((tax) => {
                      const isOrderLevel =
                        !!orderLevelTaxAsTaxRate &&
                        tax.name === orderLevelTaxAsTaxRate.name &&
                        toNumber(tax.percentage) === toNumber(orderLevelTaxAsTaxRate.percentage)
                      const isSelected =
                        isOrderLevel ||
                        (item.appliedTaxRates ?? []).some(
                          (t: TaxRate) =>
                            t.name === tax.name &&
                            toNumber(t.percentage) === toNumber(tax.percentage),
                        )
                      return (
                        <Label
                          htmlFor={tax.name}
                          key={tax.name}
                          className={css({
                            fontSize: 'xs',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2',
                          })}
                        >
                          <Checkbox
                            id={tax.name}
                            size="sm"
                            className={taxCheckbox}
                            checked={isSelected}
                            disabled={isOrderLevel}
                            onCheckedChange={(checked) => {
                              onToggleTaxRate(tax, Boolean(checked))
                            }}
                          />
                          {tax.name} ({tax.percentage}%)
                        </Label>
                      )
                    })}
                  </Flex>
                )}
                {/* Discount */}
                {discountsForList.length > 0 && (
                  <Flex direction="column" gap="2">
                    <Label className={discountLabel}>Apply Discounts</Label>
                    {discountsForList.map((discount) => {
                      const isOrderLevel =
                        !!orderLevelDiscountAsDiscount &&
                        discount.discount_name === orderLevelDiscountAsDiscount.discount_name
                      const isSelected =
                        isOrderLevel ||
                        (item.appliedDiscounts ?? []).some(
                          (d: Discount) => d.discount_name === discount.discount_name,
                        ) ||
                        (item.itemDiscount &&
                          item.itemDiscount.discount_name === discount.discount_name)
                      return (
                        <Label
                          htmlFor={discount.discount_name}
                          key={discount.discount_name}
                          className={css({
                            fontSize: 'xs',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2',
                          })}
                        >
                          <Checkbox
                            id={discount.discount_name}
                            size="sm"
                            className={discountCheckbox}
                            checked={isSelected}
                            disabled={isOrderLevel}
                            onCheckedChange={(checked) => {
                              onToggleDiscount(discount as Discount, Boolean(checked))
                            }}
                          />
                          {discount.discount_name}
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
        } else if (item.is_taxable && item.itemTaxRate !== undefined) {
          const legacy = {
            name:
              item.taxes?.find((t: TaxRate) => Number(t.percentage) === item.itemTaxRate)?.name ||
              'Tax',
            percentage: item.itemTaxRate,
          }
          appliedTaxes.push(legacy)
        }
        if (orderLevelTaxAsTaxRate) {
          const exists = appliedTaxes.some(
            (t) =>
              t.name === orderLevelTaxAsTaxRate.name &&
              toNumber(t.percentage) === toNumber(orderLevelTaxAsTaxRate.percentage),
          )
          if (!exists) appliedTaxes.push(orderLevelTaxAsTaxRate)
        }

        const appliedDiscounts: Discount[] = []
        if (item.appliedDiscounts && item.appliedDiscounts.length > 0) {
          appliedDiscounts.push(...item.appliedDiscounts)
        } else if (item.itemDiscount) {
          appliedDiscounts.push(item.itemDiscount)
        }
        if (orderLevelDiscountAsDiscount) {
          const exists = appliedDiscounts.some(
            (d) => d.discount_name === orderLevelDiscountAsDiscount.discount_name,
          )
          if (!exists) appliedDiscounts.push(orderLevelDiscountAsDiscount)
        }

        if (appliedTaxes.length === 0 && appliedDiscounts.length === 0) return null

        return (
          <VStack gap={1} align="start" mt={1}>
            {appliedTaxes.length > 0 && (
              <Box className={css({ fontSize: 'xs' })}>
                Tax:&nbsp;
                {appliedTaxes.map((t) => `${t.name} (${t.percentage}%)`).join(', ')}
              </Box>
            )}
            {appliedDiscounts.length > 0 && (
              <Box className={css({ fontSize: 'xs' })}>
                Discount:&nbsp;
                {appliedDiscounts.map((d) => d.discount_name).join(', ')}
              </Box>
            )}
          </VStack>
        )
      })()}
    </Flex>
  )
}
