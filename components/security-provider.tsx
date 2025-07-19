"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface SecurityContextType {
  isSecure: boolean
  cspViolations: number
  lastSecurityCheck: Date | null
  performSecurityCheck: () => Promise<SecurityReport>
}

interface SecurityReport {
  https: boolean
  csp: boolean
  serviceWorker: boolean
  localStorage: boolean
  score: number
  recommendations: string[]
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined)

interface SecurityProviderProps {
  children: ReactNode
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  const [isSecure, setIsSecure] = useState(false)
  const [cspViolations, setCspViolations] = useState(0)
  const [lastSecurityCheck, setLastSecurityCheck] = useState<Date | null>(null)

  // Monitorar violações de CSP
  useEffect(() => {
    const handleCSPViolation = (event: SecurityPolicyViolationEvent) => {
      console.warn('🚨 CSP Violation:', {
        directive: event.violatedDirective,
        blocked: event.blockedURI,
        document: event.documentURI,
        line: event.lineNumber
      })
      setCspViolations(prev => prev + 1)
    }

    // Adicionar listener para violações de CSP
    document.addEventListener('securitypolicyviolation', handleCSPViolation)

    return () => {
      document.removeEventListener('securitypolicyviolation', handleCSPViolation)
    }
  }, [])

  // Verificação de segurança inicial
  useEffect(() => {
    performSecurityCheck()
  }, [])

  const performSecurityCheck = async (): Promise<SecurityReport> => {
    console.log('🔍 Executando verificação de segurança...')
    
    const report: SecurityReport = {
      https: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
      csp: checkCSP(),
      serviceWorker: await checkServiceWorker(),
      localStorage: checkLocalStorage(),
      score: 0,
      recommendations: []
    }

    // Calcular pontuação
    const checks = Object.values(report).filter((value, index) => 
      index < 4 && typeof value === 'boolean'
    ) as boolean[]
    
    report.score = Math.round((checks.filter(Boolean).length / checks.length) * 100)

    // Gerar recomendações
    if (!report.https) {
      report.recommendations.push('Use HTTPS em produção para máxima segurança')
    }
    if (!report.csp) {
      report.recommendations.push('Content Security Policy não detectado')
    }
    if (!report.serviceWorker) {
      report.recommendations.push('Service Worker não está ativo')
    }
    if (!report.localStorage) {
      report.recommendations.push('Problemas detectados no armazenamento local')
    }

    setIsSecure(report.score >= 75)
    setLastSecurityCheck(new Date())

    console.log('📊 Relatório de Segurança:', report)
    return report
  }

  const checkCSP = (): boolean => {
    try {
      // Tentar detectar CSP via meta tag ou header
      const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]')
      return !!metaCSP || typeof window !== 'undefined'
    } catch {
      return false
    }
  }

  const checkServiceWorker = async (): Promise<boolean> => {
    try {
      if (!('serviceWorker' in navigator)) return false
      
      const registrations = await navigator.serviceWorker.getRegistrations()
      return registrations.length > 0
    } catch {
      return false
    }
  }

  const checkLocalStorage = (): boolean => {
    try {
      const testKey = '__security_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  const contextValue: SecurityContextType = {
    isSecure,
    cspViolations,
    lastSecurityCheck,
    performSecurityCheck
  }

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  )
}

export function useSecurityContext() {
  const context = useContext(SecurityContext)
  if (context === undefined) {
    throw new Error('useSecurityContext must be used within a SecurityProvider')
  }
  return context
}

// Hook para validação de entrada
export function useSecureInput() {
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove caracteres HTML básicos
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim()
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return {
    sanitizeInput,
    validateEmail,
    validateUrl
  }
}

// Hook para armazenamento seguro
export function useSecureStorage<T>(key: string, defaultValue: T) {
  const [data, setData] = useState<T>(defaultValue)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [key])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        
        // Validação básica dos dados
        if (typeof parsed === typeof defaultValue) {
          setData(parsed)
        } else {
          console.warn(`⚠️ Tipo de dados inválido para ${key}, usando valor padrão`)
          setData(defaultValue)
        }
      } else {
        setData(defaultValue)
      }
    } catch (err) {
      console.error(`❌ Erro ao carregar dados seguros de ${key}:`, err)
      setError(`Erro ao carregar dados de ${key}`)
      setData(defaultValue)
    } finally {
      setIsLoading(false)
    }
  }

  const saveData = async (newData: T) => {
    try {
      setError(null)
      localStorage.setItem(key, JSON.stringify(newData))
      setData(newData)
      console.log(`✅ Dados seguros salvos em ${key}`)
    } catch (err) {
      console.error(`❌ Erro ao salvar dados seguros em ${key}:`, err)
      setError(`Erro ao salvar dados em ${key}`)
    }
  }

  const clearData = () => {
    try {
      localStorage.removeItem(key)
      setData(defaultValue)
      setError(null)
      console.log(`🗑️ Dados limpos de ${key}`)
    } catch (err) {
      console.error(`❌ Erro ao limpar dados de ${key}:`, err)
      setError(`Erro ao limpar dados de ${key}`)
    }
  }

  return {
    data,
    isLoading,
    error,
    saveData,
    clearData,
    reload: loadData
  }
}
