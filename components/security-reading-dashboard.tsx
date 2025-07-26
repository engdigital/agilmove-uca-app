// components/security-reading-dashboard.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Smartphone
} from "lucide-react"
import { SecureReadingService } from "@/lib/secure-reading-service"
import { db, type ReadingEntry } from "@/lib/db"
import { useLiveQuery } from "dexie-react-hooks"

interface SecurityStats {
  totalReadings: number
  suspiciousReadings: number
  averageTrustScore: number
  deviceChanges: number
  chainIntegrity: boolean
}

export function SecurityReadingDashboard() {
  const [securityStats, setSecurityStats] = useState<SecurityStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Usar live query para reagir a mudanças no banco
  const allReadings = useLiveQuery(() => db.readings.toArray(), [])

  // Atualizar estatísticas quando as leituras mudarem
  useEffect(() => {
    const updateStats = async () => {
      setIsLoading(true)
      try {
        const stats = await SecureReadingService.getSecurityStats()
        setSecurityStats(stats)
        setLastUpdate(new Date())
      } catch (error) {
        console.error('Erro ao carregar estatísticas de segurança:', error)
      } finally {
        setIsLoading(false)
      }
    }

    updateStats()
  }, [allReadings])

  const suspiciousReadings = allReadings?.filter(reading => reading.suspicious) || []
  const recentReadings = allReadings?.slice(-10) || []

  const validateIntegrity = async () => {
    if (!allReadings) return
    
    setIsLoading(true)
    try {
      // Validar integridade de todos os pergaminhos
      const scrollIds = Array.from(new Set(allReadings.map(r => r.scrollId)))
      
      for (const scrollId of scrollIds) {
        const result = await SecureReadingService.validateScrollIntegrity(scrollId)
        console.log(`Integridade do pergaminho ${scrollId}:`, result)
      }
      
      // Atualizar estatísticas
      const stats = await SecureReadingService.getSecurityStats()
      setSecurityStats(stats)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Erro ao validar integridade:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getRiskLevel = (score: number) => {
    if (score >= 80) return "Baixo"
    if (score >= 60) return "Médio"
    return "Alto"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard de Segurança</h2>
          <p className="text-muted-foreground">
            Monitoramento da integridade das leituras
          </p>
        </div>
        <Button onClick={validateIntegrity} disabled={isLoading}>
          <ShieldCheck className="mr-2 h-4 w-4" />
          Validar Integridade
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leituras</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStats?.totalReadings || 0}</div>
            <p className="text-xs text-muted-foreground">
              {suspiciousReadings.length} suspeitas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score de Confiança</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRiskColor(securityStats?.averageTrustScore || 0)}`}>
              {securityStats?.averageTrustScore || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Risco {getRiskLevel(securityStats?.averageTrustScore || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integridade</CardTitle>
            {securityStats?.chainIntegrity ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${securityStats?.chainIntegrity ? 'text-green-600' : 'text-red-600'}`}>
              {securityStats?.chainIntegrity ? 'OK' : 'ERRO'}
            </div>
            <p className="text-xs text-muted-foreground">
              Cadeia blockchain
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dispositivos</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(securityStats?.deviceChanges || 0) + 1}</div>
            <p className="text-xs text-muted-foreground">
              {securityStats?.deviceChanges || 0} mudanças
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {securityStats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score de Confiança Geral</CardTitle>
            <CardDescription>
              Baseado no padrão de leituras e validações de segurança
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress 
                value={securityStats.averageTrustScore} 
                className="w-full" 
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span className={getRiskColor(securityStats.averageTrustScore)}>
                  {securityStats.averageTrustScore}%
                </span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      {suspiciousReadings.length > 0 && (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Atividade Suspeita Detectada</AlertTitle>
          <AlertDescription>
            {suspiciousReadings.length} leitura(s) foram marcadas como suspeitas. 
            Verifique se o horário do dispositivo não foi alterado.
          </AlertDescription>
        </Alert>
      )}

      {securityStats && !securityStats.chainIntegrity && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Integridade Comprometida</AlertTitle>
          <AlertDescription>
            A cadeia de integridade foi comprometida. Algumas leituras podem ter sido alteradas.
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Readings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Leituras Recentes</CardTitle>
          <CardDescription>
            Últimas 10 leituras com informações de segurança
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {recentReadings.map((reading, index) => (
                <div key={reading.id || index}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Pergaminho {reading.scrollId} - {reading.period === 'morning' ? 'Manhã' : reading.period === 'afternoon' ? 'Tarde' : 'Noite'}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(reading.timestamp).toLocaleString('pt-BR')}</span>
                        {reading.sequence && (
                          <>
                            <span>•</span>
                            <span>Seq: {reading.sequence}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {reading.trustScore && (
                        <Badge variant={reading.trustScore >= 80 ? "default" : reading.trustScore >= 60 ? "secondary" : "destructive"}>
                          {reading.trustScore}%
                        </Badge>
                      )}
                      {reading.suspicious ? (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Suspeita
                        </Badge>
                      ) : (
                        <Badge variant="default">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          OK
                        </Badge>
                      )}
                    </div>
                  </div>
                  {index < recentReadings.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Last Update */}
      {lastUpdate && (
        <p className="text-xs text-muted-foreground text-center">
          Última atualização: {lastUpdate.toLocaleString('pt-BR')}
        </p>
      )}
    </div>
  )
}
