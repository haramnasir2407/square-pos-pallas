import { css } from '~/styled-system/css'
import { Flex } from '~/styled-system/jsx'
import { Spinner } from '../../../primitives/ui/spinner'
import { Paragraph } from '../../../primitives/ui/typography'

export default function DashboardLoader() {
  return (
    <Flex minH="30vh" align="center" justify="center">
      <Flex
        align="center"
        direction="column"
        gap="layout.section.sm"
        className={css({
          textAlign: 'center',
        })}
      >
        <Spinner
          size="lg"
          variant="default"
          color="default"
          className={css({ margin: '0 auto', border: '4px solid black' })}
        />
        <Paragraph
          size="large"
          color="secondary"
          className={css({
            fontWeight: 'medium',
          })}
        >
          Loading...
        </Paragraph>
      </Flex>
    </Flex>
  )
}
