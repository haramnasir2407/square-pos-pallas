import { Spinner } from '@/components/primitives/ui/spinner'
import { Paragraph } from '@/components/primitives/ui/typography'
import { css } from '~/styled-system/css'
import { Box, Flex } from '~/styled-system/jsx'

export default function AuthenticationProcessor() {
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      className={css({
        background: 'gray.200',
      })}
    >
      <Flex
        align="center"
        justify="center"
        direction="column"
        gap="gap.component.lg"
        className={css({
          textAlign: 'center',
        })}
      >
        <Box
          className={css({
            position: 'relative',
          })}
        >
          <Spinner
            size="lg"
            variant="default"
            color="primary"
            className={css({ margin: '0 auto' })}
          />
        </Box>
        <Box>
          <Paragraph
            textAlign="center"
            size="large"
            color="secondary"
            className={css({
              fontWeight: 'bold',
              marginBottom: 'gap.block.xs',
            })}
          >
            Processing Authentication
          </Paragraph>
          <Paragraph textAlign="center" size="large" color="secondary">
            Please wait while we complete your sign-in...
          </Paragraph>
        </Box>
      </Flex>
    </Flex>
  )
}
