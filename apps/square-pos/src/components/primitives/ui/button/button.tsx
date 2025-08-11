import { Slot } from '@radix-ui/react-slot'
import { css, cx } from '@styled-system/css'
import { styled } from '@styled-system/jsx'
import { type ButtonVariantProps, button, icon, spinner } from '@styled-system/recipes'
import type { SystemStyleObject } from '@styled-system/types'
import React, { cloneElement, isValidElement } from 'react'

export type ButtonProps = ButtonVariantProps & //exported for toast
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean
    icon?: React.ReactElement<{ className?: string }>
    iconPosition?: 'start' | 'end'
    css?: SystemStyleObject
    asChild?: boolean
  }

const Spinner = styled('div', spinner)

// Map button sizes to icon recipe sizes
const buttonToIconSize = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  icon: 'md',
} as const

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      isLoading,
      disabled,
      icon: iconProp,
      iconPosition = 'start',
      variant,
      size,
      shape,
      width,
      css: cssProp,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    // Apply icon recipe styles to the icon
    const iconElement =
      iconProp && isValidElement(iconProp)
        ? cloneElement(iconProp, {
            className: cx(
              icon({ size: buttonToIconSize[size as keyof typeof buttonToIconSize] }),
              css({ flexShrink: 0 }),
              iconProp.props.className,
            ),
          })
        : iconProp

    return (
      <Comp
        ref={ref}
        disabled={disabled || isLoading}
        className={cx(button({ variant, size, width, shape }), cssProp && css(cssProp), className)}
        {...props}
      >
        <span data-slot="button-content-wrapper">
          {iconPosition === 'start' &&
            (isLoading ? <Spinner size="sm" variant="thin" /> : iconElement)}
          {children}
          {iconPosition === 'end' &&
            (isLoading ? <Spinner size="sm" variant="thin" /> : iconElement)}
        </span>
      </Comp>
    )
  },
)

Button.displayName = 'Button'
