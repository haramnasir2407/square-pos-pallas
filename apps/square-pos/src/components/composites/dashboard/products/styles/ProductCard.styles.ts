// ProductCard.styles.ts
import { css } from '~/styled-system/css'

export const cardContainer = css({
  height: '100%',
  borderRadius: 'lg',
})

export const productImage = css({
  borderRadius: 'md',
  mb: 'gap.component.md',
})

export const productName = css({
  fontSize: 'sm',
  fontWeight: 'semibold',
})


export const stateTag = (state: string) =>
  css({
    bg: state === 'IN_STOCK' ? 'green.100' : 'red.100',
    color: state === 'IN_STOCK' ? 'green.700' : 'red.700',
  })

export const qtyText = css({
  fontSize: 'sm',
  color: 'gray.700',
  ml: 'gap.inline.xs',
})

export const quantityButton = css({
  color: 'black',
  px: 'padding.inline.xs',
  py: 'padding.block.sm',
  bg: 'gray.200',
  borderRadius: 'md',
})

export const removeButton = css({
  ml: 'gap.inline.md',
  color: 'red.500',
  fontSize: 'sm',
  _hover: {
    bg: 'none',
  },
})

export const addToCartButton = (isOutOfStock: boolean) =>
  css({
    px: 'padding.inline.md',
    py: 'padding.block.md',
    bg: isOutOfStock ? 'gray.200' : 'gray.700',
    color: isOutOfStock ? 'gray.50' : 'white',
    borderRadius: 'md',
    fontWeight: 'medium',
    fontSize: 'md',
    width: '100%',
    _hover: {
      bg: isOutOfStock ? 'gray.100' : 'gray.600',
    },
    cursor: isOutOfStock ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
  })
