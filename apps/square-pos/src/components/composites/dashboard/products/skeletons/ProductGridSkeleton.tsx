import { Skeleton } from '@/components/primitives/ui/skeleton'
import type { Item } from '@/shared/types/catalog'
import { css } from '~/styled-system/css'
import { Box, Grid } from '~/styled-system/jsx'

export default function ProductGridSkeleton() {
  return (
    <Box className={css({ w: 'full', mt: '2' })}>
      {/* Product grid skeleton */}
      <Grid
        gap="gap.component.sm"
        w="full"
        className={css({
          gridTemplateColumns: ['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)'], // responsive: 1/2/3 columns
        })}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className={css({
              h: '72',
              borderRadius: 'lg',
              w: '56',
            })}
          />
        ))}
      </Grid>
    </Box>
  )
}
