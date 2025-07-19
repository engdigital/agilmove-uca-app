'use client'

import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Bug, 
  Wifi, 
  Database, 
  Settings, 
  Activity, 
  TrendingUp, 
  Users, 
  Eye, 
  Lock, 
  Bell, 
  RefreshCw, 
  Zap 
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSecurityContext, useSecureStorage } from '@/components/security-provider'
import { useErrorLogs } from '@/components/error-boundary'

interface SecurityCheck {
  id: string
  name: string
  status: 'pass' | 'fail' | 'warning'
  description: string
  recommendation?: string
}

interface SecurityEvent {
  id: string
  type: 'storage' | 'notification' | 'input' | 'auth' | 'xss' | 'injection'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: Date
  resolved: boolean
  details?: string
}

interface MonitoringStats {
  cpuUsage: number
  memoryUsage: number
  responseTime: number
  uptime: number
  threats: number
}

interface SecurityMetrics {
  score: number
  checks: SecurityCheck[]
  lastUpdate: Date
  cspViolations: number
  errorCount: number
  totalRequests: number
  blockedAttempts: number
  successRate: number
  activeUsers: number
  errorRate: number
  performanceScore: number
  securityEvents: SecurityEvent[]
  monitoringStats: MonitoringStats
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
          name: 'HTTPS Enabled',
          status: report.https ? 'pass' : 'fail',
          description: report.https ? 'Conexão segura HTTPS ativa' : 'HTTPS não detectado',
          recommendation: !report.https ? 'Configure certificado SSL/TLS' : undefined
        },
        {
          id: 'csp',
          name: 'Content Security Policy',
          status: report.csp ? 'pass' : 'warning',
          description: report.csp ? 'CSP configurado' : 'CSP não encontrado',
          recommendation: !report.csp ? 'Implemente políticas CSP' : undefined
        },
        {
          id: 'localStorage',
          name: 'Local Storage',
          status: report.localStorage ? 'pass' : 'fail',
          description: report.localStorage ? 'localStorage disponível' : 'localStorage não disponível',
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

      // Simular dados de monitoramento
      const mockEvents: SecurityEvent[] = [
        {
          id: '1',
          type: 'input',
          severity: 'medium',
          message: 'Tentativa de script injection bloqueada',
          timestamp: new Date(Date.now() - 300000),
          resolved: true,
          details: 'Script malicioso detectado em campo de entrada'
        },
        {
          id: '2',
          type: 'storage',
          severity: 'low',
          message: 'Dados criptografados salvos com sucesso',
          timestamp: new Date(Date.now() - 600000),
          resolved: true
        },
        {
          id: '3',
          type: 'xss',
          severity: 'high',
          message: 'Tentativa de XSS bloqueada',
          timestamp: new Date(Date.now() - 900000),
          resolved: false,
          details: 'Código JavaScript malicioso em parâmetro URL'
        }
      ]

      const mockMonitoringStats: MonitoringStats = {
        cpuUsage: 45,
        memoryUsage: 62,
        responseTime: 120,
        uptime: 99.8,
        threats: 3
      }

      setMetrics({
        score: report.score,
        checks,
        lastUpdate: new Date(),
        cspViolations,
        errorCount: errorLogs.length,
        totalRequests: 1247,
        blockedAttempts: 23,
        successRate: 95.2,
        activeUsers: 45,
        errorRate: 1.8,
        performanceScore: 88,
        securityEvents: mockEvents,
        monitoringStats: mockMonitoringStats
      })
      
    } catch (error) {
      console.error('❌ Erro ao carregar métricas de segurança:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Settings className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Carregando dashboard de segurança...</p>
        </div>
      </div>
    )
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
        return <Badge variant="outline" className="text-yellow-600">ATENÇÃO</Badge>
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      case 'critical': return 'text-red-800'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${getScoreBg(metrics.score)}`}>
            <Shield className={`w-6 h-6 ${getScoreColor(metrics.score)}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">SecurityDashboard</h1>
            <p className="text-gray-600">Monitoramento de Segurança - AgilMove UCA</p>
          </div>
        </div>
        <Button onClick={loadSecurityMetrics} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
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

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Requisições Totais</p>
                <p className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Bloqueadas</p>
                <p className="text-2xl font-bold text-red-600">{metrics.blockedAttempts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-green-600">{metrics.successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold">{metrics.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Principais */}
      <Tabs defaultValue="checks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checks">Verificações</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Tab: Verificações */}
        <TabsContent value="checks">
          <Card>
            <CardHeader>
              <CardTitle>Verificações de Segurança</CardTitle>
              <CardDescription>
                Status das verificações automáticas de segurança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.checks.map((check) => (
                  <div key={check.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                    {getStatusIcon(check.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{check.name}</span>
                        {getStatusBadge(check.status)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{check.description}</p>
                      {check.recommendation && (
                        <p className="text-sm text-blue-600 mt-1">💡 {check.recommendation}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Eventos */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Eventos de Segurança Recentes</CardTitle>
              <CardDescription>
                Últimas atividades detectadas pelo sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.securityEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <div className={`mt-1 ${getSeverityColor(event.severity)}`}>
                      {event.type === 'storage' && <Database className="h-4 w-4" />}
                      {event.type === 'notification' && <Bell className="h-4 w-4" />}
                      {event.type === 'input' && <Eye className="h-4 w-4" />}
                      {event.type === 'auth' && <Lock className="h-4 w-4" />}
                      {event.type === 'xss' && <Bug className="h-4 w-4" />}
                      {event.type === 'injection' && <AlertTriangle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{event.message}</span>
                        {event.resolved ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{event.timestamp.toLocaleString()}</span>
                        <Badge variant="outline" className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      </div>
                      {event.details && (
                        <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Monitoramento */}
        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Status do Sistema</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>CPU Usage</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={metrics.monitoringStats.cpuUsage} className="w-20 h-2" />
                      <span className="text-sm font-medium">{metrics.monitoringStats.cpuUsage}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Memory Usage</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={metrics.monitoringStats.memoryUsage} className="w-20 h-2" />
                      <span className="text-sm font-medium">{metrics.monitoringStats.memoryUsage}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Response Time</span>
                    <span className="font-bold">{metrics.monitoringStats.responseTime}ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Uptime</span>
                    <span className="font-bold text-green-600">{metrics.monitoringStats.uptime}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Alertas Ativos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.securityEvents.filter(e => !e.resolved).map((event) => (
                    <Alert key={event.id}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex justify-between items-center">
                          <span>{event.message}</span>
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                  {metrics.securityEvents.filter(e => !e.resolved).length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p>Nenhum alerta ativo</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Performance */}
        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Métricas de Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Performance Score</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={metrics.performanceScore} className="w-20 h-2" />
                      <span className="text-lg font-bold">{metrics.performanceScore}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Taxa de Erro</span>
                    <span className="font-bold text-red-600">{metrics.errorRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Threats Blocked</span>
                    <span className="font-bold">{metrics.monitoringStats.threats}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>CSP Violations</span>
                    <span className="font-bold text-yellow-600">{metrics.cspViolations}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.performanceScore < 80 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Performance abaixo do ideal. Considere otimizações.
                      </AlertDescription>
                    </Alert>
                  )}
                  {metrics.errorRate > 2 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Taxa de erro elevada. Verifique logs e implemente correções.
                      </AlertDescription>
                    </Alert>
                  )}
                  {metrics.cspViolations > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Violações de CSP detectadas. Revise políticas de segurança.
                      </AlertDescription>
                    </Alert>
                  )}
                  {metrics.performanceScore >= 80 && metrics.errorRate <= 2 && metrics.cspViolations === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p>Sistema funcionando otimamente</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Última atualização: {metrics.lastUpdate.toLocaleString('pt-BR')}
        </p>
        <p>
          SecurityDashboard v2.0 - AgilMove UCA - Fase 4 Monitoramento
        </p>
      </div>
    </div>
  )
}
