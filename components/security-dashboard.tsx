"use client"

import React, { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, Clock, Bug, Wifi, Database, Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useSecurityContext, useSecureStorage } from '@/components/security-provider'
import { useErrorLogs } from '@/components/error-boundary'

interface SecurityCheck {
  id: string
  name: string
  status: 'pass' | 'fail' | 'warning'
  description: string
  recommendation?: string
}

interface SecurityMetrics {
  score: number
  checks: SecurityCheck[]
  lastUpdate: Date
  cspViolations: number
  errorCount: number
}

export function SecurityDashboard() {
  const { isSecure, cspViolations, lastSecurityCheck, performSecurityCheck } = useSecurityContext()
  const { getErrorLogs } = useErrorLogs()
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadSecurityMetrics()
  }, [])

  const loadSecurityMetrics = async () => {
    setIsLoading(true)
    
    try {
      const report = await performSecurityCheck()
      const errorLogs = getErrorLogs()
      
      const checks: SecurityCheck[] = [
        {
          id: 'https',
          name: 'HTTPS/Secure Connection',
          status: report.https ? 'pass' : 'fail',
          description: report.https ? 'Conexão segura ativa' : 'Conexão não segura detectada',
          recommendation: !report.https ? 'Use HTTPS em produção' : undefined
        },
        {
          id: 'csp',
          name: 'Content Security Policy',
          status: report.csp ? 'pass' : 'warning',
          description: report.csp ? 'CSP configurado' : 'CSP não detectado',
          recommendation: !report.csp ? 'Configure CSP para prevenir XSS' : undefined
        },
        {
          id: 'sw',
          name: 'Service Worker',
          status: report.serviceWorker ? 'pass' : 'warning',
          description: report.serviceWorker ? 'Service Worker ativo' : 'Service Worker não registrado',
          recommendation: !report.serviceWorker ? 'Registre o Service Worker para funcionalidade offline' : undefined
        },
        {
          id: 'storage',
          name: 'Local Storage',
          status: report.localStorage ? 'pass' : 'fail',
          description: report.localStorage ? 'Armazenamento local funcionando' : 'Problemas no armazenamento local',
          recommendation: !report.localStorage ? 'Verifique configurações do navegador' : undefined
        },
        {
          id: 'errors',
          name: 'Error Handling',
          status: errorLogs.length === 0 ? 'pass' : errorLogs.length < 5 ? 'warning' : 'fail',
          description: `${errorLogs.length} erros registrados nas últimas sessões`,
          recommendation: errorLogs.length > 0 ? 'Analise e corrija erros recorrentes' : undefined
        }
      ]

      setMetrics({
        score: report.score,
        checks,
        lastUpdate: new Date(),
        cspViolations,
        errorCount: errorLogs.length
      })
      
    } catch (error) {
      console.error('❌ Erro ao carregar métricas de segurança:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'fail':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">OK</Badge>
      case 'fail':
        return <Badge variant="destructive">FALHA</Badge>
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">ATENÇÃO</Badge>
    }
  }

  if (!metrics) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando métricas de segurança...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${getScoreBg(metrics.score)}`}>
            <Shield className={`w-6 h-6 ${getScoreColor(metrics.score)}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Dashboard de Segurança</h1>
            <p className="text-gray-600">Monitoramento em tempo real</p>
          </div>
        </div>
        <Button onClick={loadSecurityMetrics} disabled={isLoading}>
          <Settings className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pontuação de Segurança</span>
            <span className={`text-3xl font-bold ${getScoreColor(metrics.score)}`}>
              {metrics.score}%
            </span>
          </CardTitle>
          <CardDescription>
            Avaliação geral da segurança da aplicação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={metrics.score} className="h-2" />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Crítico (0-40%)</span>
            <span>Moderado (40-70%)</span>
            <span>Bom (70-90%)</span>
            <span>Excelente (90%+)</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Bug className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{metrics.errorCount}</p>
              <p className="text-sm text-gray-600">Erros Registrados</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{metrics.cspViolations}</p>
              <p className="text-sm text-gray-600">Violações CSP</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Clock className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-bold">
                {metrics.lastUpdate.toLocaleTimeString('pt-BR')}
              </p>
              <p className="text-sm text-gray-600">Última Verificação</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Verificações de Segurança</CardTitle>
          <CardDescription>
            Status detalhado dos componentes de segurança
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.checks.map((check) => (
              <div
                key={check.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <p className="font-medium">{check.name}</p>
                    <p className="text-sm text-gray-600">{check.description}</p>
                    {check.recommendation && (
                      <p className="text-sm text-yellow-700 mt-1">
                        💡 {check.recommendation}
                      </p>
                    )}
                  </div>
                </div>
                {getStatusBadge(check.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Última atualização: {metrics.lastUpdate.toLocaleString('pt-BR')}
        </p>
        <p>
          Dashboard de Segurança v1.0 - AgilMove UCA
        </p>
      </div>
    </div>
  )
}
