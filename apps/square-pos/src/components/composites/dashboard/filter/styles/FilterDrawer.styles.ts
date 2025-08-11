import { css } from '~/styled-system/css'
import { flex } from '~/styled-system/patterns'

export const trigger = flex({
  borderRadius: 'md',
  alignItems: 'center',
  justifyContent: 'space-between',
  py: 'padding.block.md',
  px: 'padding.inline.md',
  gap: 'gap.inline.sm',
  color: 'black',
  fontWeight: 'normal',
  cursor: 'pointer',
  boxShadow: 'sm',
  bg: 'gray.100',
})

export const content = flex({
  justify: 'center',
  w: { base: '90vw', sm: '60vw', md: '30vw', lg: '20vw' },
  direction: 'column',
  py: { base: '4', md: '8' },
  px: { base: '2', md: '6' },
})

export const close = css({
  alignSelf: 'flex-end',
  mb: '4',
  color: 'gray.600',
  fontSize: 'xl',
  cursor: 'pointer',
})

export const title = css({ fontWeight: 'bold', fontSize: 'xl' })

export const body = flex({
  direction: 'column',
  gap: { base: '2', md: 'gap.inline.sm' },
  overflowY: 'auto',
})

export const label = flex({
  fontSize: 'md',
  alignItems: 'center',
  gap: 'gap.component.sm',
  cursor: 'pointer',
})

export const checkbox = css({ cursor: 'pointer' })

export const footer = flex({ direction: 'column', gap: { base: '2', md: 'gap.component.sm' } })
