'use client'
import { ButtonVariant } from '@/components/primitives/derived/ButtonVariant'
import { FiMinus } from 'react-icons/fi'
import { GoPlus } from 'react-icons/go'
import { Flex } from '~/styled-system/jsx'

interface ControlsProps {
  quantity: number
  minQty?: number
  atMaxQty?: boolean
  onIncrement: () => void
  onDecrement: () => void
  onRemove?: () => void
  onAdd?: () => void
  showAddButton?: boolean
  isOutOfStock?: boolean
  disabled?: boolean
}

export function Controls({
  quantity,
  minQty = 1,
  atMaxQty,
  onIncrement,
  onDecrement,
  onRemove,
  disabled = false,
}: ControlsProps) {
  return (
    <Flex align="center" gap="gap.inline.xs">
      <ButtonVariant
        variant="text"
        size="icon"
        onClick={onDecrement}
        disabled={quantity <= minQty || disabled}
      >
        <FiMinus size={14} />
      </ButtonVariant>
      <span>{quantity}</span>
      <ButtonVariant
        variant="text"
        size="icon"
        onClick={onIncrement}
        disabled={atMaxQty || disabled}
      >
        <GoPlus size={14} />
      </ButtonVariant>
      {onRemove && (
        <ButtonVariant variant="text" size="icon" onClick={onRemove} disabled={disabled}>
          Remove
        </ButtonVariant>
      )}
    </Flex>
  )
}
