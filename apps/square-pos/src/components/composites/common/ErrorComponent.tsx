import { Box, Flex } from '~/styled-system/jsx'
import { ButtonVariant } from '../../primitives/derived/ButtonVariant'

import { Paragraph } from '../../primitives/ui/typography'
import { errorBox, errorButton, errorIcon } from './styles/styles'

export default function ErrorComponent({ error }: ErrorProps) {
  return (
    <Box className={errorBox}>
      <Flex align="center" justify="center" gap="gap.component.sm">
        <svg className={errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <title>Error icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <Paragraph color="error" size="base">
          {error}&nbsp;
          <ButtonVariant
            variant="text"
            size="sm"
            className={errorButton}
            onClick={() => {
              window.location.href = '/signin'
            }}
          >
            Try again
          </ButtonVariant>
        </Paragraph>
      </Flex>
    </Box>
  )
}
