import ErrorComponent from '@/components/composites/common/ErrorComponent'
import Authenticated from '@/components/composites/home/auth/Authenticated'
import AuthenticationProcessor from '@/components/composites/home/auth/AuthenticationProcessor'
import HomeLoader from '@/components/composites/home/loader/HomeLoader'
import SignInText from '@/components/composites/home/signin/SignInText'
import { ButtonVariant } from '@/components/primitives/derived/ButtonVariant'
import { Paragraph } from '@/components/primitives/ui/typography'
import { startSquareOAuth } from '@/shared/constants/square-auth'
import type { SignInPageUIProps } from '@/shared/types/catalog'
import Link from 'next/link'
import { Box, Flex } from '~/styled-system/jsx'
import { containerStyle, linkStyle, signInButton, termsMargin } from './styles/styles'

export default function SignInPageUI({
  session,
  status,
  isProcessing,
  error,
  hasOAuthCode,
}: SignInPageUIProps) {
  // if (status === 'loading') {
  //   return <HomeLoader />
  // }

  if (session && !hasOAuthCode && !isProcessing) {
    return <Authenticated session={session} />
  }

  if (isProcessing) {
    return <AuthenticationProcessor />
  }

  return (
    !isProcessing && (
      <Flex align="center" justify="center" minH="100vh" bg="gray.200">
        <Box className={containerStyle}>
          <SignInText />

          {error && <ErrorComponent error={error} />}

          {/* Sign in button */}
          <ButtonVariant variant="default" onClick={startSquareOAuth} className={signInButton}>
            Sign in with Square
          </ButtonVariant>

          <Box className={termsMargin}>
            <Paragraph size="compact" color="tertiary" textAlign="center">
              By signing in, you agree to our&nbsp;
              <Link href="/terms" className={linkStyle}>
                Terms of Service
              </Link>
              &nbsp;and&nbsp;
              <Link href="/policy" className={linkStyle}>
                Privacy Policy
              </Link>
            </Paragraph>
          </Box>
        </Box>
      </Flex>
    )
  )
}
