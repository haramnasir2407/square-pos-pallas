import { Box, Flex } from '~/styled-system/jsx'

import { Skeleton } from '@/components/primitives/ui/skeleton'
import { css } from '~/styled-system/css'
import { summaryContainer } from '../styles/styles'

export const OrderSummarySkeleton = () => {
  return (
    <Box className={summaryContainer}>
      <Box className={summaryContainer}>
        {/* Title */}
        <Skeleton
          className={css({ h: '8', w: '48', mb: 'gap.component.md', borderRadius: 'md' })}
        />

        {/* Items skeleton */}
        <Box className={css({ mb: 'gap.component.lg' })}>
          <Skeleton
            className={css({ h: '6', w: '40', mb: 'gap.component.sm', borderRadius: 'sm' })}
          />
          <Box>
            {Array.from({ length: 3 }).map((_, i) => (
              <Box
                key={i}
                className={css({
                  bg: 'gray.50',
                  borderRadius: 'lg',
                  px: 'padding.inline.md',
                  py: 'padding.block.sm',
                  mb: 'gap.component.xs',
                })}
              >
                <Skeleton className={css({ h: '5', w: '56', mb: '2', borderRadius: 'sm' })} />
                <Skeleton className={css({ h: '4', w: '40', mb: '2', borderRadius: 'sm' })} />
                <Skeleton className={css({ h: '4', w: '64', mb: '2', borderRadius: 'sm' })} />
                <Skeleton className={css({ h: '4', w: '52', borderRadius: 'sm' })} />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Order-level summary skeleton */}
        <Box>
          <Skeleton className={css({ h: '5', w: '60', mb: '2', borderRadius: 'sm' })} />
          <Skeleton className={css({ h: '5', w: '56', mb: '2', borderRadius: 'sm' })} />
          <Skeleton className={css({ h: '6', w: '64', borderRadius: 'sm' })} />
        </Box>

        {/* Actions skeleton */}
        <Flex direction="column" gap="gap.component.sm" mt="auto">
          <Skeleton className={css({ h: '10', w: 'full', borderRadius: 'md' })} />
          <Skeleton className={css({ h: '10', w: 'full', borderRadius: 'md' })} />
        </Flex>
      </Box>
    </Box>
  )
}
