'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cx } from '@styled-system/css'
import { styled } from '@styled-system/jsx'
import { type CheckboxVariantProps, checkbox, icon } from '@styled-system/recipes'
import { Check, Minus } from 'lucide-react'
import * as React from 'react'

const checkboxToIconSize = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  icon: 'md',
} as const

const BaseCheckbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & CheckboxVariantProps
>(({ size, className, ...props }, ref) => {
  const styles = checkbox({ size })
  const iconSize =
    typeof size === 'string' && size in checkboxToIconSize
      ? checkboxToIconSize[size as keyof typeof checkboxToIconSize]
      : 'md'

  return (
    <CheckboxPrimitive.Root ref={ref} className={cx(styles.root, className)} {...props}>
      <CheckboxPrimitive.Indicator className={styles.indicator}>
        {props.checked === 'indeterminate' ? (
          <Minus className={icon({ size: iconSize })} />
        ) : (
          <Check className={icon({ size: iconSize })} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
BaseCheckbox.displayName = CheckboxPrimitive.Root.displayName

export const Checkbox = styled(BaseCheckbox)
