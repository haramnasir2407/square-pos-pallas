import DashboardHeader from '@/components/composites/dashboard/header/DashboardHeader'
import { Heading } from '@/components/primitives/ui/typography'
import { Box, Center, Container, VStack } from '~/styled-system/jsx'
import { css } from '~/styled-system/css'
import { auth } from '~/auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // server component
  const session = await auth()
  const userName = session?.user?.name ?? ''

  return (
    // not hydrated on client (static content sent from server, no js bundle attached)
    <Box minH="100vh">
      <DashboardHeader user={userName} />
      <main
        className={css({
          py: 'padding.block.lg',
          mt: 'layout.section.sm',
        })}
      >
        <Container>
          <Center className={css({ maxW: '6xl', mx: 'auto' })}>
            <VStack align="center" justify="center">
              <Box className={css({ textAlign: 'center' })}>
                <Heading
                  className={css({
                    fontSize: '2xl',
                    fontWeight: 'bold',
                    color: 'grey.50.dark',
                    mb: 'layout.section.sm',
                  })}
                >
                  Welcome back, {userName}!
                </Heading>
                <p
                  className={css({
                    fontSize: 'md',
                    color: 'grey.50.dark',
                    mx: 'auto',
                    textAlign: 'center',
                  })}
                >
                  Manage your Square integration, view products, and handle transactions all in one
                  place.
                </p>
              </Box>

              {children}
            </VStack>
          </Center>
        </Container>
      </main>
    </Box>
  )
}
