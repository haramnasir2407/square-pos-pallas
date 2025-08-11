import { css } from '~/styled-system/css'
import { token } from '~/styled-system/tokens'

export const containerStyle = css({
  bg: 'white',
  rounded: 'xl',
  shadow: 'md',
  p: 'layout.default.sm',
  maxW: { base: '90vw', sm: '60vw', md: '40vw', lg: '30vw' },
  w: '100%',
})

export const signInButton = css({
  color: 'white',
  bg: 'blue.500',
  _hover: {
    bg: 'blue.600',
    transform: 'scale(1.02)',
  },
  fontWeight: 'medium',
  fontSize: 'md',
  width: '100%',
  transition: 'all 0.2s',
  cursor: 'pointer',
})

export const signInButtonBg = `linear-gradient(to right, ${token('colors.blue.50')}, ${token('colors.purple.50')})`
export const signInButtonHoverBg = `linear-gradient(to right, ${token('colors.blue.100')}, ${token('colors.purple.100')})`

export const termsMargin = css({
  mt: 'layout.section.sm',
})

export const linkStyle = css({
  color: 'blue.100',
})
