'use client'

import { SecurityReadingDashboard } from "@/components/security-reading-dashboard"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SecurityDashboardPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Segurança das Leituras</h1>
          <p className="text-muted-foreground">
            Monitoramento e validação da integridade das leituras
          </p>
        </div>
      </div>
      
      <SecurityReadingDashboard />
    </div>
  )
}
