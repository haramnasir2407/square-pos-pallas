// default imports help to import single export

import handleOAuthCallback from '@/containers/signin/handleAuthService'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react' // named imports help to import multiple exports

export default function useSignInPageLogic() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const processedCodes = useRef<Set<string>>(new Set())

  // CSR
  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (code && !isProcessing && !processedCodes.current.has(code)) {
      processedCodes.current.add(code)
      setIsProcessing(true)
      handleOAuthCallback({ code, setError, setIsProcessing })
    } else if (error) {
      setError(`OAuth error: ${error}`)
    }
  }, [searchParams, isProcessing])

  const hasOAuthCode = searchParams.get('code')

  return {
    session,
    status,
    isProcessing,
    error,
    hasOAuthCode,
    setError,
    setIsProcessing,
  }
}
