import { css } from '~/styled-system/css'
import { circle } from '~/styled-system/patterns'

// Success icon wrapper
export const authSuccessIconWrapper = css({
  margin: '0 auto',
  borderRadius: '50%',
})

// Success icon SVG
export const authSuccessIcon = css({
  height: '32px',
  width: '32px',
  color: 'blue.100',
})

// User initial
export const authUserInitial = css({
  color: 'blue.100',
  fontWeight: '600',
  fontSize: '18px',
})

export const merchantInfo = css({
  bgColor: 'white',
  rounded: 'xl',
  boxShadow: 'md',
  border: '1px solid white',
  py: 'gap.component.md',
  px: 'padding.inline.lg',
})

export const avatar = circle({
  size: '10',
  bg: 'gray.100',
})

export const heading = css({
  fontSize: '3xl',
  fontWeight: 'bold',
  mb: 'gap.component.sm',
})
