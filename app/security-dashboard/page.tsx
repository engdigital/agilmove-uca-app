"use client"

import { SecurityDashboard } from '@/components/security-dashboard'
import { useAndroidBackHandler } from '@/hooks/use-android-back-handler'

export default function SecurityDashboardPage() {
  // Hook para tratar o botão voltar do Android
  useAndroidBackHandler()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <SecurityDashboard />
    </div>
  )
}
