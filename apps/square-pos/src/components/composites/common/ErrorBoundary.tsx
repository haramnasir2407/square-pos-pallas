// * react error boundary
'use client'

import { Button } from '@/components/primitives/ui/button'
import { Heading } from '@/components/primitives/ui/typography'
import { ErrorBoundary as REB } from 'react-error-boundary'
import { MdErrorOutline } from 'react-icons/md'
import { Box } from '~/styled-system/jsx'
import { errorBoundary, errorHeading } from './styles/styles'

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <REB
      fallback={
        <Box className={errorBoundary}>
          <Heading className={errorHeading}>
            <MdErrorOutline fill="red" size={20} /> Something went wrong. Can not load products.
          </Heading>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </Box>
      }
    >
      {children}
    </REB>
  )
}
