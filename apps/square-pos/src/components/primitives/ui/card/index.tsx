// components/primitives/ui/card.tsx
'use client'

import { card } from '~/styled-system/recipes'
import { Flex, type HTMLStyledProps } from '~/styled-system/jsx'

interface CardProps extends HTMLStyledProps<'div'> {
  header?: React.ReactNode
  cardTitle?: React.ReactNode
  cardDescription?: React.ReactNode
  body?: React.ReactNode
  footer?: React.ReactNode
}

export function Card({
  header,
  cardTitle,
  cardDescription,
  body,
  footer,
  children,
  ...props
}: CardProps) {
  const slots = card()

  return (
    <Flex
      direction="column"
      align={{ base: 'center', md: 'normal' }}
      className={slots.root}
      {...props}
    >
      {header && <div className={slots.header}>{header}</div>}
      {cardTitle && <h3 className={slots.title}>{cardTitle}</h3>}
      {cardDescription && <p className={slots.description}>{cardDescription}</p>}
      {body && <div className={slots.body}>{body}</div>}
      {children}
      {footer && <div className={slots.footer}>{footer}</div>}
    </Flex>
  )
}
