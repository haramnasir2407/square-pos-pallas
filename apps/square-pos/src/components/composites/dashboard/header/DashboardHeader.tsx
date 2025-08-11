import { css } from '~/styled-system/css'
import { DashboardSignOutButton } from '../signout/DashboardSignOutButton'
import { Container, Flex } from '~/styled-system/jsx'
import { Badge } from '@/components/primitives/ui/badge'


// * server component and statically rendered 
export default function DashboardHeader({ user }: { user: string }) {
  console.log("dashboard header is server component")
  return (
    <header
      className={css({
        bg: 'white',
        py: 'padding.block.lg',
        shadow: 'sm',
      })}
    >
      <Container>
        <Flex justify="between" align="center" gap="gap.inline.sm">
          {user === 'Default Test Account' ? (
            <Badge variant="default" size="md">
              Haram Nasir
            </Badge>
          ) : null}

          <DashboardSignOutButton />
        </Flex>
      </Container>
    </header>
  )
}
