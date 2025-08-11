'use client'
import { Button } from '@/components/primitives/ui/button'
import { Box } from '~/styled-system/jsx'
import { flex } from '~/styled-system/patterns'
import { MdErrorOutline } from 'react-icons/md'
import { Heading } from '@/components/primitives/ui/typography'

// Error boundaries must be Client Components
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Box
      className={flex({
        justify: 'center',
        align: 'center',
        h: '50vh',
        gap: 'gap.inline.lg',
      })}
    >
      <Heading
        className={flex({ alignItems: 'center', gap: 'gap.inline.sm', fontWeight: 'base' })}
      >
        <MdErrorOutline fill="red" size={20} /> Something went wrong! {error.message}{' '}
      </Heading>
      <Button variant="outlined" onClick={() => reset()}>
        Try again
      </Button>
    </Box>
  )
}
