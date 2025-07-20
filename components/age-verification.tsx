"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSecureStorage } from "@/components/security-provider"
import { useRouter } from "next/navigation"

interface AgeVerificationModalProps {
  isOpen: boolean
  onVerified: () => void
}

export function AgeVerificationModal({ isOpen, onVerified }: AgeVerificationModalProps) {
  const [birthYear, setBirthYear] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLinkClick = (path: string) => {
    // Abrir o link em uma nova aba/janela
    window.open(path, '_blank', 'noopener,noreferrer')
  }

  const validateAge = (year: string) => {
    const currentYear = new Date().getFullYear()
    const yearNum = parseInt(year)
    
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
      setError("Por favor, insira um ano válido")
      setIsValid(false)
      return
    }
    
    const age = currentYear - yearNum
    if (age < 13) {
      setError("Você deve ter pelo menos 13 anos para usar este aplicativo")
      setIsValid(false)
      return
    }
    
    setError("")
    setIsValid(true)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = e.target.value
    setBirthYear(year)
    if (year.length === 4) {
      validateAge(year)
    } else {
      setError("")
      setIsValid(false)
    }
  }

  const handleVerify = () => {
    if (isValid) {
      // Salvar verificação localmente
      localStorage.setItem('ageVerified', 'true')
      localStorage.setItem('ageVerifiedDate', new Date().toISOString())
      onVerified()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Verificação de Idade
          </h2>
          <p className="text-sm text-gray-600">
            Para continuar, precisamos verificar que você tem pelo menos 13 anos de idade.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 mb-1">
              Ano de nascimento
            </label>
            <input
              id="birthYear"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={birthYear}
              onChange={handleYearChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 1990"
            />
            {error && (
              <p className="text-red-600 text-xs mt-1">{error}</p>
            )}
          </div>

          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-xs text-blue-800">
              <strong>Proteção de Privacidade:</strong> Esta informação é armazenada apenas no seu dispositivo 
              e não é compartilhada com terceiros.
            </p>
          </div>

          <div className="bg-yellow-50 p-3 rounded-md">
            <p className="text-xs text-yellow-800">
              <strong>Para menores de 18 anos:</strong> É recomendável a supervisão de pais ou responsáveis 
              durante o uso do aplicativo.
            </p>
          </div>

          <Button
            onClick={handleVerify}
            disabled={!isValid}
            className={`w-full ${
              isValid 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isValid ? 'Continuar' : 'Digite seu ano de nascimento'}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Ao continuar, você aceita nossos{' '}
              <button 
                type="button"
                onClick={() => handleLinkClick('/terms-of-use')}
                className="text-blue-600 underline hover:text-blue-800 cursor-pointer bg-transparent border-none p-0"
              >
                Termos de Uso
              </button>{' '}
              e{' '}
              <button 
                type="button"
                onClick={() => handleLinkClick('/privacy-policy')}
                className="text-blue-600 underline hover:text-blue-800 cursor-pointer bg-transparent border-none p-0"
              >
                Política de Privacidade
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AgeVerificationWrapper({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se já foi verificado (válido por 30 dias)
    const verified = localStorage.getItem('ageVerified')
    const verifiedDate = localStorage.getItem('ageVerifiedDate')
    
    if (verified === 'true' && verifiedDate) {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      if (new Date(verifiedDate) > thirtyDaysAgo) {
        setIsVerified(true)
      } else {
        // Expirou, limpar e pedir nova verificação
        localStorage.removeItem('ageVerified')
        localStorage.removeItem('ageVerifiedDate')
      }
    }
    
    setIsLoading(false)
  }, [])

  const handleVerified = () => {
    setIsVerified(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <AgeVerificationModal 
        isOpen={!isVerified} 
        onVerified={handleVerified} 
      />
      {isVerified && children}
    </>
  )
}
