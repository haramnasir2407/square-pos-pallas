'use client'

import Authenticated from '@/components/composites/home/auth/Authenticated'
import HomeLoader from '@/components/composites/home/loader/HomeLoader'
import SignInButton from '@/components/composites/home/signin/SignInButton'

import SignInText from '@/components/composites/home/signin/SignInText'
import { useSession } from 'next-auth/react'
import { css } from '~/styled-system/css'

export default function HomePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <HomeLoader />
  }

  if (session) {
    return <Authenticated session={session} />
  }

  return (
    <main>
      <div
        className={css({
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff, #f3e8ff)',
          padding: '16px',
        })}
      >
        <div
          className={css({
            maxWidth: '448px',
            width: '100%',
          })}
        >
          <div
            className={css({
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '32px',
            })}
          >
            <SignInText />

            <SignInButton />

            <div
              className={css({
                marginTop: '32px',
                textAlign: 'center',
              })}
            >
              <p
                className={css({
                  fontSize: '14px',
                  color: '#6b7280',
                })}
              >
                By signing in, you agree to our{' '}
                <a
                  href="/"
                  className={css({
                    color: '#2563eb',
                    _hover: {
                      color: '#1d4ed8',
                    },
                    fontWeight: '500',
                  })}
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/"
                  className={css({
                    color: '#2563eb',
                    _hover: {
                      color: '#1d4ed8',
                    },
                    fontWeight: '500',
                  })}
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
