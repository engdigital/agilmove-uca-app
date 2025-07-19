"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Gera um ID único para o erro
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      hasError: true,
      error,
      errorId
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.group('🚨 Error Boundary - Erro Capturado')
    console.error('Erro:', error)
    console.error('Stack:', error.stack)
    console.error('Component Stack:', errorInfo.componentStack)
    console.groupEnd()

    // Salvar erro no localStorage para análise posterior
    this.logErrorToStorage(error, errorInfo)

    // Chamar callback personalizado se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    this.setState({
      error,
      errorInfo
    })
  }

  private logErrorToStorage(error: Error, errorInfo: ErrorInfo) {
    try {
      const errorLog = {
        id: this.state.errorId,
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: 'anonymous' // Pode ser substituído por ID real do usuário
      }

      // Obter logs existentes
      const existingLogs = localStorage.getItem('error_logs')
      const logs = existingLogs ? JSON.parse(existingLogs) : []
      
      // Adicionar novo log
      logs.push(errorLog)
      
      // Manter apenas os últimos 10 erros
      if (logs.length > 10) {
        logs.splice(0, logs.length - 10)
      }
      
      localStorage.setItem('error_logs', JSON.stringify(logs))
      
      console.log('📝 Erro salvo no localStorage:', errorLog.id)
    } catch (storageError) {
      console.error('❌ Falha ao salvar erro no localStorage:', storageError)
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    })
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleReportError = () => {
    const subject = encodeURIComponent(`Bug Report - ${this.state.errorId}`)
    const body = encodeURIComponent(`
Erro ID: ${this.state.errorId}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

Erro: ${this.state.error?.message}

Stack Trace:
${this.state.error?.stack}

Component Stack:
${this.state.errorInfo?.componentStack}
    `)
    
    window.open(`mailto:app-uca@mandara.com.br?subject=${subject}&body=${body}`)
  }

  private getErrorSeverity(): 'low' | 'medium' | 'high' {
    const errorMessage = this.state.error?.message?.toLowerCase() || ''
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'low'
    }
    
    if (errorMessage.includes('chunk') || errorMessage.includes('loading')) {
      return 'medium'
    }
    
    return 'high'
  }

  private getErrorRecommendation(): string {
    const severity = this.getErrorSeverity()
    const errorMessage = this.state.error?.message?.toLowerCase() || ''
    
    if (errorMessage.includes('network')) {
      return 'Verifique sua conexão com a internet e tente novamente.'
    }
    
    if (errorMessage.includes('chunk')) {
      return 'Parece que há uma nova versão disponível. Recarregue a página.'
    }
    
    if (severity === 'high') {
      return 'Ocorreu um erro inesperado. Nossa equipe foi notificada.'
    }
    
    return 'Tente recarregar a página ou voltar à tela inicial.'
  }

  render() {
    if (this.state.hasError) {
      // Se um fallback customizado foi fornecido, use-o
      if (this.props.fallback) {
        return this.props.fallback
      }

      const severity = this.getErrorSeverity()
      const recommendation = this.getErrorRecommendation()

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                severity === 'high' ? 'bg-red-100' : 
                severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  severity === 'high' ? 'text-red-600' : 
                  severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
              </div>
              <CardTitle className="text-xl">Oops! Algo deu errado</CardTitle>
              <CardDescription>
                {recommendation}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Alert>
                <Bug className="h-4 w-4" />
                <AlertDescription>
                  <strong>Erro ID:</strong> {this.state.errorId}
                  <br />
                  <strong>Horário:</strong> {new Date().toLocaleString('pt-BR')}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 gap-2">
                <Button onClick={this.handleRetry} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={this.handleGoHome}
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={this.handleReportError}
                  className="w-full text-sm"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Reportar Erro
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    Detalhes do Erro (Dev)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-40">
                    <div className="text-red-600 font-bold mb-2">
                      {this.state.error?.message}
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {this.state.error?.stack}
                    </div>
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook para acessar logs de erro
export function useErrorLogs() {
  const getErrorLogs = () => {
    try {
      const logs = localStorage.getItem('error_logs')
      return logs ? JSON.parse(logs) : []
    } catch {
      return []
    }
  }

  const clearErrorLogs = () => {
    try {
      localStorage.removeItem('error_logs')
      console.log('🗑️ Logs de erro limpos')
    } catch (error) {
      console.error('❌ Erro ao limpar logs:', error)
    }
  }

  const exportErrorLogs = () => {
    try {
      const logs = getErrorLogs()
      const dataStr = JSON.stringify(logs, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `error_logs_${new Date().toISOString().slice(0, 10)}.json`
      link.click()
      
      URL.revokeObjectURL(url)
      console.log('📁 Logs exportados com sucesso')
    } catch (error) {
      console.error('❌ Erro ao exportar logs:', error)
    }
  }

  return {
    getErrorLogs,
    clearErrorLogs,
    exportErrorLogs
  }
}

// Componente wrapper para facilitar o uso
export function ErrorBoundaryWrapper({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log personalizado para monitoramento
        console.error('🚨 Error captured by boundary:', {
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack
        })
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
