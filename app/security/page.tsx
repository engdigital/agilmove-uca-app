"use client"

import { SecurityDashboard } from '@/components/security-dashboard'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAndroidBackHandler } from '@/hooks/use-android-back-handler'

export default function SecurityPage() {
  const router = useRouter()
  
  // Hook para tratar o botão voltar do Android
  useAndroidBackHandler()

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen transition-all duration-300 ease-in-out">
      <div className="min-h-screen bg-gray-50 pt-10 pb-10">
        <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mr-4"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">Segurança</h1>
        </div>

        <SecurityDashboard />
      </div>
    </div>
  )
}
