import { css } from '~/styled-system/css'
import { Flex } from '~/styled-system/jsx'
import { Spinner } from '../../../primitives/ui/spinner'
import { Paragraph } from '../../../primitives/ui/typography'

export default function HomeLoader() {
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      className={css({
        background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
      })}
    >
      <Flex
        align="center"
        justify="center"
        direction="column"
        gap="gap.component.md"
        className={css({
          textAlign: 'center',
        })}
      >
        <Spinner
          size="lg"
          variant="default"
          color="primary"
          className={css({ margin: '0 auto' })}
        />
        <Paragraph
          size="large"
          color="secondary"
          className={css({
            fontWeight: 'medium',
            color: 'gray.700',
          })}
        >
          Loading...
        </Paragraph>
      </Flex>
    </Flex>
  )
}
