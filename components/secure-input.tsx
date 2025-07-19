"use client"

import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSecureInput } from '@/components/security-provider'

interface SecureInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: 'text' | 'email' | 'password' | 'url' | 'tel'
  label?: string
  error?: string
  showSecurityIndicator?: boolean
  allowUnsafeInput?: boolean
  maxLength?: number
  onSecureChange?: (value: string, isValid: boolean) => void
  validationRules?: {
    minLength?: number
    requireNumbers?: boolean
    requireSpecialChars?: boolean
    requireUppercase?: boolean
    requireLowercase?: boolean
    customRegex?: RegExp
    customMessage?: string
  }
}

export interface SecureInputRef {
  focus: () => void
  clear: () => void
  getValue: () => string
  isValid: () => boolean
  setSanitizedValue: (value: string) => void
}

export const SecureInput = forwardRef<SecureInputRef, SecureInputProps>(({
  type = 'text',
  label,
  error,
  showSecurityIndicator = true,
  allowUnsafeInput = false,
  maxLength = 500,
  onSecureChange,
  validationRules,
  className,
  ...props
}, ref) => {
  const { sanitizeInput, validateEmail, validateUrl } = useSecureInput()
  const [value, setValue] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('low')
  const [validationError, setValidationError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      setValue('')
      setValidationError(null)
      onSecureChange?.('', false)
    },
    getValue: () => value,
    isValid: () => !validationError && validateInput(value),
    setSanitizedValue: (newValue: string) => {
      const sanitized = sanitizeInput(newValue)
      setValue(sanitized)
      validateAndUpdate(sanitized)
    }
  }))

  const validateInput = (inputValue: string): boolean => {
    if (!inputValue) return false

    // Validação por tipo
    switch (type) {
      case 'email':
        if (!validateEmail(inputValue)) {
          setValidationError('Email inválido')
          return false
        }
        break
      case 'url':
        if (!validateUrl(inputValue)) {
          setValidationError('URL inválida')
          return false
        }
        break
    }

    // Validações personalizadas
    if (validationRules) {
      const { 
        minLength, 
        requireNumbers, 
        requireSpecialChars, 
        requireUppercase, 
        requireLowercase,
        customRegex,
        customMessage
      } = validationRules

      if (minLength && inputValue.length < minLength) {
        setValidationError(`Mínimo ${minLength} caracteres`)
        return false
      }

      if (requireNumbers && !/\d/.test(inputValue)) {
        setValidationError('Deve conter pelo menos um número')
        return false
      }

      if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(inputValue)) {
        setValidationError('Deve conter pelo menos um caractere especial')
        return false
      }

      if (requireUppercase && !/[A-Z]/.test(inputValue)) {
        setValidationError('Deve conter pelo menos uma letra maiúscula')
        return false
      }

      if (requireLowercase && !/[a-z]/.test(inputValue)) {
        setValidationError('Deve conter pelo menos uma letra minúscula')
        return false
      }

      if (customRegex && !customRegex.test(inputValue)) {
        setValidationError(customMessage || 'Formato inválido')
        return false
      }
    }

    setValidationError(null)
    return true
  }

  const calculateSecurityLevel = (inputValue: string): 'low' | 'medium' | 'high' => {
    let score = 0
    
    if (inputValue.length >= 8) score++
    if (/[A-Z]/.test(inputValue)) score++
    if (/[a-z]/.test(inputValue)) score++
    if (/\d/.test(inputValue)) score++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(inputValue)) score++
    if (inputValue.length >= 12) score++

    if (score >= 5) return 'high'
    if (score >= 3) return 'medium'
    return 'low'
  }

  const validateAndUpdate = (inputValue: string) => {
    const isValid = validateInput(inputValue)
    const newSecurityLevel = calculateSecurityLevel(inputValue)
    setSecurityLevel(newSecurityLevel)
    onSecureChange?.(inputValue, isValid)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value

    // Aplicar limite de caracteres
    if (newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength)
    }

    // Sanitizar entrada se não permitir conteúdo inseguro
    if (!allowUnsafeInput) {
      newValue = sanitizeInput(newValue)
    }

    setValue(newValue)
    validateAndUpdate(newValue)
  }

  const getSecurityColor = () => {
    switch (securityLevel) {
      case 'high': return 'text-green-500'
      case 'medium': return 'text-yellow-500'
      default: return 'text-red-500'
    }
  }

  const getSecurityIcon = () => {
    switch (securityLevel) {
      case 'high': return <CheckCircle className="w-4 h-4" />
      case 'medium': return <Shield className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <Input
          ref={inputRef}
          type={inputType}
          value={value}
          onChange={handleChange}
          className={cn(
            'pr-20',
            (error || validationError) && 'border-red-500',
            className
          )}
          {...props}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
          {/* Indicador de segurança */}
          {showSecurityIndicator && value && (
            <div className={cn('flex items-center', getSecurityColor())} title={`Segurança: ${securityLevel}`}>
              {getSecurityIcon()}
            </div>
          )}
          
          {/* Botão mostrar/ocultar senha */}
          {type === 'password' && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mensagem de erro */}
      {(error || validationError) && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {error || validationError}
        </p>
      )}

      {/* Indicador de força da senha */}
      {type === 'password' && value && showSecurityIndicator && (
        <div className="space-y-1">
          <div className="flex space-x-1">
            <div className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              securityLevel === 'low' ? 'bg-red-500' : 'bg-gray-200'
            )} />
            <div className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              securityLevel === 'medium' || securityLevel === 'high' ? 'bg-yellow-500' : 'bg-gray-200'
            )} />
            <div className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              securityLevel === 'high' ? 'bg-green-500' : 'bg-gray-200'
            )} />
          </div>
          <p className="text-xs text-gray-500">
            Força da senha: <span className={getSecurityColor()}>
              {securityLevel === 'low' && 'Fraca'}
              {securityLevel === 'medium' && 'Média'}
              {securityLevel === 'high' && 'Forte'}
            </span>
          </p>
        </div>
      )}

      {/* Contador de caracteres */}
      <div className="text-xs text-gray-400 text-right">
        {value.length}/{maxLength}
      </div>
    </div>
  )
})

SecureInput.displayName = "SecureInput"
