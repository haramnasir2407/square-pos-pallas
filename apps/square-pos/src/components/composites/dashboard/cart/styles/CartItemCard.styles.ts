import { css } from '~/styled-system/css'
import { flex } from '~/styled-system/patterns'

export const cardContainer = css({
  boxShadow: 'sm',
  borderRadius: 'lg',
})

export const image = css({ borderRadius: 'md' })

export const itemInfo = css({ flex: 1 })
export const itemName = css({
  fontWeight: 'semibold',
  fontSize: { base: 'xs', md: 'xs', lg: 'sm' },
})
export const itemPrice = css({ color: 'gray.600', fontSize: 'xs' })
export const itemStock = css({ color: 'gray.400', fontSize: 'xs' })

export const removeButton = css({
  fontSize: 'lg',
  ml: '2',
  bg: 'none',
  border: 'none',
  cursor: 'pointer',
})

export const qtyRow = flex({
  alignItems: 'center',
  gap: '2',
  mt: '2',
})

export const qtyButton = css({
  px: '2',
  py: '0.5',
  bg: 'gray.200',
  borderRadius: 'md',
  fontWeight: '400',
  fontSize: 'sm',
  cursor: 'pointer',
})

export const qtyButtonDisabled = css({
  px: '2',
  py: '0.5',
  bg: 'gray.100',
  borderRadius: 'md',
  color: 'gray.400',
  cursor: 'not-allowed',
  fontWeight: '400',
  fontSize: 'sm',
})

export const qtyValue = css({ px: '2', fontWeight: '400' })

export const moreOptionsButton = css({
  ml: 'auto',
  fontSize: 'xs',
  color: 'blue.500',
  bg: 'none',
  border: 'none',
  cursor: 'pointer',
  textDecoration: 'underline',
})

export const optionsContainer = css({
  mt: '3',
  bg: 'gray.50',
  borderRadius: 'md',
  p: 'padding.inline.md',
})

export const taxRow = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
})

export const taxLabel = css({
  fontSize: 'xs',
  display: 'flex',
  alignItems: 'center',
  gap: '1',
})

export const taxCheckbox = css({ mr: '1' })
export const taxSelect = css({ minW: '32' })

export const discountLabel = css({
  fontSize: 'xs',
  display: 'flex',
  alignItems: 'center',
  gap: '1',
})

export const discountCheckbox = css({ mr: '1' })
export const discountSelect = css({ minW: '32' })
