// 'use client'
import { ButtonVariant } from '@/components/primitives/derived/ButtonVariant'
import { Badge } from '@/components/primitives/ui/badge'
import { Button } from '@/components/primitives/ui/button'
import { Heading, Paragraph } from '@/components/primitives/ui/typography'
import { useCartStore } from '@/shared/store/useCartStore'
import type { ProductCardProps } from '@/shared/types/catalog'
import Image from 'next/image'
import { FiMinus } from 'react-icons/fi'
import { GoPlus } from 'react-icons/go'
import { css } from '~/styled-system/css'
import { Flex } from '~/styled-system/jsx'
import {
  addToCartButton,
  cardContainer,
  productImage,
  productName,
  qtyText,
  quantityButton,
  removeButton,
  stateTag,
} from './styles/ProductCard.styles'

/**
 * Card component for displaying product information and cart controls.
 * Handles inventory, pricing, and add/remove/update cart actions.
 */
export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  state,
  quantity,
  variationId,
  discounts,
  taxes,
}: ProductCardProps) {
  // * Use zustand store
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)

  const cartItem = items.find((item) => item.id === id) // Find the cart item by id (zustand uses array)
  const inventoryQty = typeof quantity === 'string' ? Number(quantity) : (quantity ?? 0) // available inventory quantity
  const isOutOfStock = !inventoryQty || inventoryQty <= 0
  const atMaxQty = cartItem && cartItem.quantity >= inventoryQty

  return (
    <Flex
      direction="column"
      p={{ base: 'layout.internal.sm', lg: 'layout.internal.md' }}
      className={cardContainer}
      align={{ base: 'center', md: 'normal' }}
    >
      <Image
        priority={true}
        src={imageUrl ?? ''}
        alt={name}
        width={180}
        height={180}
        style={{ objectFit: 'contain', maxHeight: '100%' }}
        className={productImage}
      />

      <Heading className={productName}>{name}</Heading>

      <Paragraph size="base" color="tertiary">
        {price !== null ? `$${(price / 100).toFixed(2)}` : 'Price not available'}
      </Paragraph>

      <Flex align="center" mt="gap.component.sm" gap="gap.component.sm">
        <Badge size="md" className={stateTag(state ?? 'Unknown')}>
          {state ?? 'Unknown'}
        </Badge>
        <span className={qtyText}>Qty: {quantity ?? '-'}</span>
      </Flex>
      <Flex align="center" mt="gap.component.md">
        {cartItem ? (
          <Flex align="center" gap="gap.inline.xs">
            <ButtonVariant
              variant="text"
              size="icon"
              className={quantityButton}
              onClick={() => updateQuantity(id, cartItem.quantity - 1)}
              disabled={cartItem.quantity <= 1}
            >
              <FiMinus size={14} />
            </ButtonVariant>
            <span className={css({ px: 'padding.inline.xs' })}>{cartItem.quantity}</span>
            <ButtonVariant
              variant="text"
              size="icon"
              className={quantityButton}
              onClick={() => updateQuantity(id, cartItem.quantity + 1)}
              disabled={atMaxQty}
            >
              <GoPlus size={14} />
            </ButtonVariant>
            <ButtonVariant
              variant="text"
              size="icon"
              className={removeButton}
              onClick={() => removeItem(id)}
            >
              Remove
            </ButtonVariant>
          </Flex>
        ) : (
          <ButtonVariant
            variant="primary"
            className={addToCartButton(isOutOfStock)}
            disabled={isOutOfStock}
            onClick={() =>
              addItem({
                id,
                name,
                price,
                imageUrl,
                quantity: 1,
                is_taxable: false,
                variationId,
                discounts,
                taxes,
              })
            }
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </ButtonVariant>
        )}
      </Flex>
    </Flex>
  )
}
