import { Button } from '@/components/primitives/ui/button'
import { css } from '~/styled-system/css'

export const ButtonVariant = ({
  children,
  onClick,
  variant,
  bg,
  hover,
  disabled,
  className,
  size,
}: {
  children: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'outlined' | 'primary' | 'text'
  disabled?: boolean
  bg?: string
  hover?: { bg: string; transform?: string }
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'icon'
}) => {
  return (
    <Button
      variant={variant}
      size={size ? size : 'lg'}
      className={
        className
          ? className
          : css({
              w: 'full',
              bg: bg,
              fontWeight: 'medium',
              fontSize: 'md',
              width: '100%',
              _hover: {
                bg: hover?.bg,
                transform: hover?.transform || 'scale(1.02)',
              },
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            })
      }
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
