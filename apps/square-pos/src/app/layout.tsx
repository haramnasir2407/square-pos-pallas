import './globals.css'
import { QueryProvider } from '@/shared/providers/QueryProvider'
import { SessionProviders } from '@/shared/providers/SessionProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { Metadata } from 'next'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Square POS App',
  description: 'A NextJs app for managing your square point-of-scale.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviders>
          <QueryProvider>
            {children} <ReactQueryDevtools initialIsOpen={false} />
          </QueryProvider>
        </SessionProviders>
      </body>
    </html>
  )
}
