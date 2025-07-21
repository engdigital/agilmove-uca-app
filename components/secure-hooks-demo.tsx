"use client"

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Shield, Save, Trash2, Eye, TestTube } from 'lucide-react'
import { SecureInput, SecureInputRef } from '@/components/secure-input'
import { useSecureStorage, useSecureNotifications } from '@/components/security-provider'
import { toast } from '@/hooks/use-toast'

interface TestData {
  name: string
  email: string
  password: string
  notes: string
}

export function SecureHooksDemo() {
  const [testData, setTestData] = useState<TestData>({
    name: '',
    email: '',
    password: '',
    notes: ''
  })

  // Hook de armazenamento seguro
  const {
    data: storedData,
    isLoading: storageLoading,
    error: storageError,
    saveData,
    clearData,
    saveEncrypted,
    isAvailable
  } = useSecureStorage<TestData>('secure-test-data', {
    name: '',
    email: '',
    password: '',
    notes: ''
  })

  // Hook de notificações seguras
  const {
    permission,
    isSupported,
    error: notificationError,
    requestPermission,
    showNotification,
    scheduleNotification,
    clearAllNotifications,
    canNotify
  } = useSecureNotifications()

  // Refs para os inputs seguros
  const nameRef = useRef<SecureInputRef>(null)
  const emailRef = useRef<SecureInputRef>(null)
  const passwordRef = useRef<SecureInputRef>(null)
  const notesRef = useRef<SecureInputRef>(null)

  const handleSaveData = async () => {
    try {
      await saveData(testData)
      toast({
        title: "Dados Salvos",
        description: "Dados salvos com segurança no localStorage",
      })
    } catch (error) {
      toast({
        title: "Erro ao Salvar",
        description: "Não foi possível salvar os dados",
        variant: "destructive"
      })
    }
  }

  const handleSaveEncrypted = async () => {
    try {
      await saveEncrypted(testData)
      toast({
        title: "Dados Criptografados",
        description: "Dados salvos com criptografia básica",
      })
    } catch (error) {
      toast({
        title: "Erro na Criptografia",
        description: "Não foi possível criptografar os dados",
        variant: "destructive"
      })
    }
  }

  const handleClearData = () => {
    clearData()
    setTestData({ name: '', email: '', password: '', notes: '' })
    nameRef.current?.clear()
    emailRef.current?.clear()
    passwordRef.current?.clear()
    notesRef.current?.clear()
    
    toast({
      title: "Dados Limpos",
      description: "Todos os dados foram removidos",
    })
  }

  const handleTestNotification = async () => {
    const success = await showNotification({
      title: 'Teste de Notificação Segura',
      body: 'Esta é uma notificação enviada através do hook useSecureNotifications',
      icon: '/icon-192x192.png',
      tag: 'test-notification',
      data: {
        testData: true,
        timestamp: Date.now()
      }
    })

    if (success) {
      toast({
        title: "Notificação Enviada",
        description: "Notificação segura enviada com sucesso",
      })
    }
  }

  const handleScheduleNotification = async () => {
    const success = await scheduleNotification({
      title: 'Notificação Agendada',
      body: 'Esta notificação foi agendada para 5 segundos',
      delay: 5000,
      tag: 'scheduled-test'
    })

    if (success) {
      toast({
        title: "Notificação Agendada",
        description: "Notificação será enviada em 5 segundos",
      })
    }
  }

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge variant="default" className="bg-green-500">Permitido</Badge>
      case 'denied':
        return <Badge variant="destructive">Negado</Badge>
      default:
        return <Badge variant="secondary">Padrão</Badge>
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 pt-10 pb-10 min-h-screen bg-gray-50">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Shield className="w-6 h-6 text-blue-500" />
          Demo dos Hooks Seguros
        </h1>
        <p className="text-gray-600">
          Teste das funcionalidades de useSecureStorage, useSecureNotifications e SecureInput
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* SecureInput Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              SecureInput
            </CardTitle>
            <CardDescription>
              Componente de entrada com validação e sanitização automática
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SecureInput
              ref={nameRef}
              label="Nome"
              placeholder="Digite seu nome"
              maxLength={50}
              onSecureChange={(value, isValid) => 
                setTestData(prev => ({ ...prev, name: value }))
              }
              validationRules={{
                minLength: 2
              }}
            />

            <SecureInput
              ref={emailRef}
              type="email"
              label="Email"
              placeholder="Digite seu email"
              onSecureChange={(value, isValid) => 
                setTestData(prev => ({ ...prev, email: value }))
              }
            />

            <SecureInput
              ref={passwordRef}
              type="password"
              label="Senha"
              placeholder="Digite sua senha"
              onSecureChange={(value, isValid) => 
                setTestData(prev => ({ ...prev, password: value }))
              }
              validationRules={{
                minLength: 8,
                requireNumbers: true,
                requireSpecialChars: true,
                requireUppercase: true,
                requireLowercase: true
              }}
            />

            <SecureInput
              ref={notesRef}
              label="Notas"
              placeholder="Digite suas anotações"
              maxLength={200}
              allowUnsafeInput={false}
              onSecureChange={(value, isValid) => 
                setTestData(prev => ({ ...prev, notes: value }))
              }
            />
          </CardContent>
        </Card>

        {/* useSecureStorage Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              useSecureStorage
            </CardTitle>
            <CardDescription>
              Armazenamento local seguro com validação e criptografia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Status:</span>{' '}
                {isAvailable ? (
                  <Badge variant="default" className="bg-green-500">Disponível</Badge>
                ) : (
                  <Badge variant="destructive">Indisponível</Badge>
                )}
              </div>
              <div>
                <span className="font-medium">Loading:</span>{' '}
                {storageLoading ? (
                  <Badge variant="secondary">Carregando</Badge>
                ) : (
                  <Badge variant="default">Pronto</Badge>
                )}
              </div>
            </div>

            {storageError && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                {storageError}
              </div>
            )}

            <div className="space-y-2">
              <Button onClick={handleSaveData} className="w-full" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Salvar Dados
              </Button>
              
              <Button onClick={handleSaveEncrypted} variant="outline" className="w-full" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Salvar Criptografado
              </Button>
              
              <Button onClick={handleClearData} variant="destructive" className="w-full" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Dados
              </Button>
            </div>

            {storedData && (
              <div className="text-xs bg-gray-50 p-2 rounded">
                <strong>Dados Armazenados:</strong>
                <pre className="mt-1 text-xs overflow-hidden">
                  {JSON.stringify(storedData, null, 2).slice(0, 150)}...
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* useSecureNotifications Demo */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              useSecureNotifications
            </CardTitle>
            <CardDescription>
              Sistema de notificações seguras com sanitização e controle de permissões
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Suporte:</span>{' '}
                {isSupported ? (
                  <Badge variant="default" className="bg-green-500">Sim</Badge>
                ) : (
                  <Badge variant="destructive">Não</Badge>
                )}
              </div>
              <div>
                <span className="font-medium">Permissão:</span>{' '}
                {getPermissionBadge()}
              </div>
              <div>
                <span className="font-medium">Pode Notificar:</span>{' '}
                {canNotify ? (
                  <Badge variant="default" className="bg-green-500">Sim</Badge>
                ) : (
                  <Badge variant="secondary">Não</Badge>
                )}
              </div>
            </div>

            {notificationError && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                {notificationError}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button onClick={requestPermission} variant="outline" size="sm">
                Pedir Permissão
              </Button>
              
              <Button onClick={handleTestNotification} size="sm" disabled={!isSupported}>
                <TestTube className="w-4 h-4 mr-1" />
                Teste
              </Button>
              
              <Button onClick={handleScheduleNotification} variant="outline" size="sm" disabled={!isSupported}>
                Agendar
              </Button>
              
              <Button onClick={clearAllNotifications} variant="destructive" size="sm" disabled={!isSupported}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
