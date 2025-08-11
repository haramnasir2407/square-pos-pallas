import { css } from '~/styled-system/css'
import { flex } from '~/styled-system/patterns'

export const drawerTriggerStyle = flex({
  position: 'fixed',
  top: { base: '2', sm: '2' },
  right: { base: '5', sm: '5' },
  zIndex: 50,
  cursor: 'pointer',
  px: 'padding.inline.lg',
  py: 'padding.block.sm',
  borderRadius: 'md',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'gap.inline.xs',
})

export const cartCountStyle = css({
  color: 'gray.500',
  bg: 'gray.100',
  position: 'absolute',
  top: '2',
  right: '2',
  zIndex: 60,
  transform: 'translate(50%, -50%)',
})

export const drawerContentStyle = css({
  height: '100vh',
  width: { base: '100vw', sm: '60vw', md: '40vw', lg: '30vw' },
  bg: 'white',
  boxShadow: 'lg',
  display: 'flex',
  flexDirection: 'column',
  p: { base: 'layout.section.sm', sm: 'layout.section.sm', md: 'layout.section.sm' },
})

export const drawerCloseStyle = css({
  alignSelf: 'flex-end',
  mb: '4',
  color: 'gray.600',
  fontSize: 'xl',
  cursor: 'pointer',
})

export const drawerTitleStyle = css({
  fontSize: { base: 'lg', md: '2xl' },
  fontWeight: 'bold',
  mb: 'gap.component.sm',
})

export const emptyCartTextStyle = css({ color: 'gray.500' })

export const drawerBodyStyle = css({ flex: 1, overflowY: 'auto', position: 'relative' })

export const summaryContainerStyle = css({
  mt: 'auto',
  pt: 'layout.internal.md',
  borderTop: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 'gap.component.sm',
})

export const summaryBoxStyle = css({
  bg: 'white',
  boxShadow: 'sm',
  borderRadius: 'lg',
  px: { base: 'padding.inline.sm', md: 'padding.inline.md' },
  py: { base: 'padding.block.sm', md: 'padding.block.md' },
  // mb: 'layout.internal.sm',
  display: 'flex',
  flexDirection: 'column',
  gap: 'gap.component.sm',
})

export const labelStyle = css({
  fontSize: 'sm',
  fontWeight: 'bold',
  mr: 'gap.component.sm',
})

export const warningTextStyle = css({
  color: 'red.500',
  fontSize: 'xs',
  // ml: 'gap.component.sm',
})

export const orderLevelInfoStyle = css({
  fontSize: 'xs',
  color: 'gray.700',
  // mb: 'gap.component.sm',
})

export const totalTextStyle = css({
  fontWeight: 'bold',
  fontSize: 'lg',
  // mb: 'gap.component.sm',
})

export const clearCartButtonStyle = css({
  w: 'full',
  bg: 'gray.200',
  color: 'black',
  py: 'padding.block.sm',
  fontWeight: 'semibold',
  fontSize: 'sm',
  _hover: { bg: 'gray.300' },
})

export const checkoutButtonStyle = css({
  py: 'padding.block.lg',
  px: 'padding.inline.md',
  fontWeight: 'bold',
  fontSize: 'md',
})
