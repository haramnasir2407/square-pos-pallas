'use client'

import SignInPageUI from '@/components/composites/home/signin/SignInPageUI'
import useSignInPageLogic from './useSignInPage'

export default function SignInContainer() {
  const logic = useSignInPageLogic()
  return <SignInPageUI {...logic} />
}
