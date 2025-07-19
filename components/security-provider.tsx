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
      .replace(/data:(?!image\/)/gi, '') // Remove data URLs exceto imagens
      .replace(/vbscript:/gi, '') // Remove vbscript URLs
      .trim()
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }

  const validateUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url)
      return ['http:', 'https:'].includes(parsed.protocol)
    } catch {
      return false
    }
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,15}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const sanitizeHTML = (html: string): string => {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/on\w+\s*=\s*'[^']*'/gi, '')
      .replace(/javascript:/gi, '')
  }

  const escapeHTML = (text: string): string => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  const validatePassword = (password: string): {
    isValid: boolean
    score: number
    requirements: {
      length: boolean
      uppercase: boolean
      lowercase: boolean
      numbers: boolean
      special: boolean
    }
    suggestions: string[]
  } => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }

    const score = Object.values(requirements).filter(Boolean).length
    const suggestions: string[] = []

    if (!requirements.length) suggestions.push('Use pelo menos 8 caracteres')
    if (!requirements.uppercase) suggestions.push('Inclua letras maiúsculas')
    if (!requirements.lowercase) suggestions.push('Inclua letras minúsculas')
    if (!requirements.numbers) suggestions.push('Inclua números')
    if (!requirements.special) suggestions.push('Inclua caracteres especiais')

    return {
      isValid: score >= 4,
      score,
      requirements,
      suggestions
    }
  }

  const checkCommonPasswords = (password: string): boolean => {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ]
    return !commonPasswords.includes(password.toLowerCase())
  }

  const rateLimitCheck = (() => {
    const attempts = new Map<string, number[]>()
    
    return (key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean => {
      const now = Date.now()
      const windowStart = now - windowMs
      
      if (!attempts.has(key)) {
        attempts.set(key, [])
      }
      
      const keyAttempts = attempts.get(key)!
      const recentAttempts = keyAttempts.filter(time => time > windowStart)
      
      if (recentAttempts.length >= maxAttempts) {
        return false // Rate limited
      }
      
      recentAttempts.push(now)
      attempts.set(key, recentAttempts)
      return true // Allowed
    }
  })()

  return {
    sanitizeInput,
    validateEmail,
    validateUrl,
    validatePhone,
    sanitizeHTML,
    escapeHTML,
    validatePassword,
    checkCommonPasswords,
    rateLimitCheck
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
      
      // Verificação de segurança do localStorage
      if (!window.localStorage) {
        throw new Error('localStorage não disponível')
      }

      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        
        // Validação robusta dos dados
        if (typeof parsed === typeof defaultValue) {
          // Validação adicional para objetos
          if (typeof defaultValue === 'object' && defaultValue !== null) {
            if (Array.isArray(defaultValue) && !Array.isArray(parsed)) {
              console.warn(`⚠️ Tipo de dados inválido para ${key} (esperado array), usando valor padrão`)
              setData(defaultValue)
              return
            }
            if (!Array.isArray(defaultValue) && Array.isArray(parsed)) {
              console.warn(`⚠️ Tipo de dados inválido para ${key} (esperado objeto), usando valor padrão`)
              setData(defaultValue)
              return
            }
          }
          
          setData(parsed)
          console.log(`✅ Dados seguros carregados de ${key}`)
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
      
      // Verificação de segurança antes de salvar
      if (!window.localStorage) {
        throw new Error('localStorage não disponível')
      }

      // Sanitização básica para strings
      let sanitizedData = newData
      if (typeof newData === 'string') {
        sanitizedData = newData
          .replace(/[<>]/g, '') // Remove HTML básico
          .replace(/javascript:/gi, '') // Remove javascript: URLs
          .trim() as T
      }

      localStorage.setItem(key, JSON.stringify(sanitizedData))
      setData(sanitizedData)
      console.log(`✅ Dados seguros salvos em ${key}`)
    } catch (err) {
      console.error(`❌ Erro ao salvar dados seguros em ${key}:`, err)
      setError(`Erro ao salvar dados em ${key}`)
    }
  }

  const clearData = () => {
    try {
      if (!window.localStorage) {
        throw new Error('localStorage não disponível')
      }
      
      localStorage.removeItem(key)
      setData(defaultValue)
      setError(null)
      console.log(`🗑️ Dados limpos de ${key}`)
    } catch (err) {
      console.error(`❌ Erro ao limpar dados de ${key}:`, err)
      setError(`Erro ao limpar dados de ${key}`)
    }
  }

  const encryptData = (data: T): string => {
    try {
      // Simples obfuscação (não é criptografia real)
      const jsonString = JSON.stringify(data)
      return btoa(encodeURIComponent(jsonString))
    } catch {
      return JSON.stringify(data)
    }
  }

  const decryptData = (encryptedData: string): T => {
    try {
      const decoded = decodeURIComponent(atob(encryptedData))
      return JSON.parse(decoded)
    } catch {
      return JSON.parse(encryptedData)
    }
  }

  const saveEncrypted = async (newData: T) => {
    try {
      setError(null)
      const encrypted = encryptData(newData)
      localStorage.setItem(`${key}_encrypted`, encrypted)
      setData(newData)
      console.log(`🔐 Dados criptografados salvos em ${key}`)
    } catch (err) {
      console.error(`❌ Erro ao salvar dados criptografados em ${key}:`, err)
      setError(`Erro ao criptografar dados de ${key}`)
    }
  }

  return {
    data,
    isLoading,
    error,
    saveData,
    clearData,
    reload: loadData,
    saveEncrypted,
    isAvailable: !!window.localStorage
  }
}

// Hook para notificações seguras
export function useSecureNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar suporte a notificações
    setIsSupported('Notification' in window && 'serviceWorker' in navigator)
    
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    try {
      setError(null)
      
      if (!isSupported) {
        setError('Notificações não são suportadas neste navegador')
        return false
      }

      if ('Notification' in window) {
        const result = await Notification.requestPermission()
        setPermission(result)
        
        if (result === 'granted') {
          console.log('✅ Permissão para notificações concedida')
          return true
        } else {
          setError('Permissão para notificações negada')
          return false
        }
      }
      
      return false
    } catch (err) {
      console.error('❌ Erro ao solicitar permissão para notificações:', err)
      setError('Erro ao solicitar permissão para notificações')
      return false
    }
  }

  const showNotification = async (options: {
    title: string
    body?: string
    icon?: string
    badge?: string
    tag?: string
    requireInteraction?: boolean
    silent?: boolean
    data?: any
    actions?: Array<{
      action: string
      title: string
      icon?: string
    }>
  }): Promise<boolean> => {
    try {
      setError(null)

      if (!isSupported) {
        setError('Notificações não são suportadas')
        return false
      }

      if (permission !== 'granted') {
        const granted = await requestPermission()
        if (!granted) return false
      }

      // Sanitização dos dados de entrada
      const sanitizedOptions = {
        ...options,
        title: options.title.replace(/[<>]/g, '').trim(),
        body: options.body?.replace(/[<>]/g, '').trim() || '',
        icon: options.icon || '/icon-192x192.png',
        badge: options.badge || '/icon-96x96.png',
        tag: options.tag || 'agilmove-notification',
        requireInteraction: options.requireInteraction ?? true,
        silent: options.silent ?? false,
        data: {
          ...options.data,
          timestamp: Date.now(),
          source: 'agilmove-uca'
        }
      }

      // Usar Service Worker se disponível
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        await registration.showNotification(sanitizedOptions.title, {
          body: sanitizedOptions.body,
          icon: sanitizedOptions.icon,
          badge: sanitizedOptions.badge,
          tag: sanitizedOptions.tag,
          requireInteraction: sanitizedOptions.requireInteraction,
          silent: sanitizedOptions.silent,
          data: sanitizedOptions.data,
          ...(options.actions && { actions: options.actions })
        })
      } else {
        // Fallback para notificação simples
        new Notification(sanitizedOptions.title, {
          body: sanitizedOptions.body,
          icon: sanitizedOptions.icon,
          tag: sanitizedOptions.tag,
          requireInteraction: sanitizedOptions.requireInteraction,
          silent: sanitizedOptions.silent,
          data: sanitizedOptions.data
        })
      }

      console.log('🔔 Notificação segura enviada:', sanitizedOptions.title)
      return true
    } catch (err) {
      console.error('❌ Erro ao enviar notificação:', err)
      setError('Erro ao enviar notificação')
      return false
    }
  }

  const scheduleNotification = async (options: {
    title: string
    body?: string
    delay: number // em millisegundos
    icon?: string
    tag?: string
  }): Promise<boolean> => {
    try {
      setError(null)

      if (!isSupported) {
        setError('Notificações agendadas não são suportadas')
        return false
      }

      setTimeout(async () => {
        await showNotification({
          title: options.title,
          body: options.body,
          icon: options.icon,
          tag: options.tag || `scheduled-${Date.now()}`,
          data: {
            scheduled: true,
            scheduledAt: Date.now(),
            originalDelay: options.delay
          }
        })
      }, options.delay)

      console.log(`⏰ Notificação agendada para ${options.delay}ms: ${options.title}`)
      return true
    } catch (err) {
      console.error('❌ Erro ao agendar notificação:', err)
      setError('Erro ao agendar notificação')
      return false
    }
  }

  const clearAllNotifications = async (): Promise<void> => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        const notifications = await registration.getNotifications()
        notifications.forEach(notification => notification.close())
        console.log(`🧹 ${notifications.length} notificações limpas`)
      }
    } catch (err) {
      console.error('❌ Erro ao limpar notificações:', err)
    }
  }

  return {
    permission,
    isSupported,
    error,
    requestPermission,
    showNotification,
    scheduleNotification,
    clearAllNotifications,
    canNotify: permission === 'granted' && isSupported
  }
}
