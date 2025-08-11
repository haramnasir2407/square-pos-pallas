// 'use client'

import HomeLoader from '@/components/composites/home/loader/HomeLoader'
import { SignInContainer } from '@/containers/signin'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// lazy loading to reduce javascipt bundle on client
// const SignInContainer = dynamic(() => import('@/containers/signin/SignInContainer'), {
//   ssr: false,
// })

export default function SignInPage() {
  return (
    <Suspense fallback={<HomeLoader />}>
      <SignInContainer />
    </Suspense>
  )
}
