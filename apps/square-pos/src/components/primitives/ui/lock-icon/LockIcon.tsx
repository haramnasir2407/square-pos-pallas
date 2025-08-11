import { css } from '~/styled-system/css'
import { Flex } from '~/styled-system/jsx'

export default function LockIcon() {
  return (
    <Flex
      align="center"
      justify="center"
      mb="layout.section.sm"
      bg="blue.500"
      className={css({
        margin: '0 auto',
        height: '64px',
        width: '64px',
        borderRadius: '16px',
        marginBottom: 'layout.section.sm',
      })}
    >
      <svg
        className={css({
          height: '32px',
          width: '32px',
          color: 'white',
        })}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <title>Lock icon</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    </Flex>
  )
}
