import { css } from '~/styled-system/css'

export const loadingContainer = css({
  bg: 'white',
  p: 'padding.block.md',
  borderRadius: 'lg',
  textAlign: 'center',
  height: '100vh',
})
export const loadingIcon = css({ color: 'blue.600', fontSize: '2xl', mb: 'gap.component.sm' })
export const loadingTitle = css({ fontSize: 'xl', fontWeight: 'bold', mb: 'gap.component.sm' })
export const loadingText = css({ color: 'gray.600' })

export const errorContainer = css({
  bg: 'white',
  p: 'padding.block.md',
  borderRadius: 'lg',
  boxShadow: 'xl',
  textAlign: 'center',
})
export const errorIcon = css({ color: 'red.600', fontSize: '2xl', mb: 'gap.component.md' })
export const errorTitle = css({ fontSize: 'xl', fontWeight: 'bold', mb: 'gap.component.sm' })
export const errorText = css({ color: 'gray.600', mb: 'gap.component.md' })

export const successContainer = css({
  bg: 'white',
  p: 'padding.block.md',
  borderRadius: 'lg',
  textAlign: 'center',
  maxW: '2xl',
  maxH: '90vh',
  overflowY: 'auto',
})
export const successIcon = css({ color: 'green.600', fontSize: '2xl', mb: 'gap.component.sm' })
export const successTitle = css({ fontSize: 'xl', fontWeight: 'bold', mb: 'gap.component.sm' })
export const orderIdText = css({ color: 'gray.500', fontSize: 'sm', mb: 'gap.component.sm' })

export const goBackButton = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  bg: 'gray.100',
  color: 'gray.800',
  _hover: { bg: 'gray.200' },
})

export const confirmButton = css({
  fontWeight: 'bold',
})

export const summaryContainer = css({
  p: '4',
  borderRadius: 'lg',
  textAlign: 'center',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
})

export const containerStyle = css({
  textAlign: 'left',
  mb: 'gap.component.md',
  mt: 'gap.component.sm',
})

export const titleStyle = css({
  fontSize: 'lg',
  fontWeight: 'bold',
  mb: 'gap.component.md',
  color: 'gray.800',
  letterSpacing: 'tight',
})

export const itemsSectionStyle = css({ mb: 'gap.component.md' })

export const itemsHeadingStyle = css({
  fontSize: 'md',
  fontWeight: 'semibold',
  mb: 'gap.component.sm',
  color: 'gray.700',
})

export const itemsListStyle = css({ spaceY: 'gap.component.sm' })

export const itemCardStyle = css({
  borderRadius: 'md',
})

export const itemNameStyle = css({
  fontWeight: 'medium',
  fontSize: 'sm',
})

export const itemQtyStyle = css({
  color: 'gray.600',
  fontSize: 'xs',
})

export const itemOriginalStyle = css({
  color: 'gray.500',
  fontSize: 'xs',
})

export const itemDiscountStyle = css({
  color: 'green.600',
  fontSize: 'xs',
})

export const itemTaxStyle = css({
  color: 'blue.600',
  fontSize: 'xs',
})

export const itemFinalStyle = css({
  color: 'gray.800',
  fontSize: 'sm',
  fontWeight: 'bold',
})

export const orderSummarySectionStyle = css({
  mt: 'gap.component.md',
  borderTop: '1px solid #eee',
  pt: 'gap.component.md',
})

export const totalDiscountStyle = css({
  color: 'green.700',
  fontSize: 'sm',
  mb: 'gap.component.xs',
})

export const totalTaxStyle = css({
  color: 'blue.700',
  fontSize: 'sm',
  mb: 'gap.component.xs',
})

export const orderTotalStyle = css({
  color: 'gray.900',
  fontSize: 'md',
  fontWeight: 'bold',
})

export const itemDiscountListStyle = css({
  margin: 0,
  paddingLeft: '1rem',
})
