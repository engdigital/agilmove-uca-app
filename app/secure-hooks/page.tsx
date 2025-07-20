"use client"

import { SecureHooksDemo } from '@/components/secure-hooks-demo'
import { useAndroidBackHandler } from '@/hooks/use-android-back-handler'

export default function SecureHooksPage() {
  // Hook para tratar o botão voltar do Android
  useAndroidBackHandler()
  
  return <SecureHooksDemo />
}
