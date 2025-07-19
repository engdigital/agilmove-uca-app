#!/usr/bin/env node

/**
 * Monitoramento Contínuo - AgilMove UCA
 * Sistema de monitoramento em tempo real
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🔄 Iniciando Monitoramento Contínuo - AgilMove UCA\n')

class ContinuousMonitor {
  constructor() {
    this.isRunning = false
    this.intervalId = null
    this.metrics = []
    this.config = {
      interval: 30000, // 30 segundos
      maxMetrics: 100, // Manter últimas 100 medições
      alertThresholds: {
        memoryUsage: 90,     // 90% memoria
        securityScore: 70,   // Score mínimo 70%
        errorRate: 5,        // 5% de erro
        responseTime: 2000   // 2 segundos
      },
      enableAlerts: true,
      saveMetrics: true
    }
    this.alerts = []
  }

  async collectMetrics() {
    const timestamp = new Date()
    const metrics = {
      timestamp,
      security: {},
      performance: {},
      system: {},
      alerts: []
    }

    try {
      // Métricas de sistema
      const memUsage = process.memoryUsage()
      metrics.system = {
        memory: {
          rss: Math.round(memUsage.rss / 1024 / 1024),
          heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
          heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024)
        },
        uptime: Math.round(process.uptime()),
        cpu: process.cpuUsage()
      }

      // Verificar alertas de sistema
      const memoryPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100
      if (memoryPercent > this.config.alertThresholds.memoryUsage) {
        metrics.alerts.push({
          type: 'memory',
          severity: 'warning',
          message: `Alto uso de memória: ${memoryPercent.toFixed(2)}%`,
          threshold: this.config.alertThresholds.memoryUsage
        })
      }

      // Verificações de segurança (mais leves)
      try {
        const securityCheck = await this.quickSecurityCheck()
        metrics.security = securityCheck
        
        if (securityCheck.score < this.config.alertThresholds.securityScore) {
          metrics.alerts.push({
            type: 'security',
            severity: 'high',
            message: `Score de segurança baixo: ${securityCheck.score}%`,
            threshold: this.config.alertThresholds.securityScore
          })
        }
      } catch (error) {
        metrics.security = { error: error.message, score: 0 }
        metrics.alerts.push({
          type: 'security',
          severity: 'critical',
          message: `Erro na verificação de segurança: ${error.message}`
        })
      }

      // Verificações de arquivos críticos
      const criticalFiles = [
        'components/security-provider.tsx',
        'components/security-dashboard.tsx',
        'security-check.js'
      ]

      let filesOk = 0
      criticalFiles.forEach(file => {
        if (fs.existsSync(path.join(process.cwd(), file))) {
          filesOk++
        }
      })

      metrics.performance = {
        criticalFiles: {
          total: criticalFiles.length,
          existing: filesOk,
          percentage: Math.round((filesOk / criticalFiles.length) * 100)
        }
      }

      if (filesOk < criticalFiles.length) {
        metrics.alerts.push({
          type: 'files',
          severity: 'medium',
          message: `Arquivos críticos ausentes: ${criticalFiles.length - filesOk}`,
          missing: criticalFiles.length - filesOk
        })
      }

      // Adicionar à coleção
      this.metrics.push(metrics)
      
      // Manter apenas as últimas medições
      if (this.metrics.length > this.config.maxMetrics) {
        this.metrics = this.metrics.slice(-this.config.maxMetrics)
      }

      // Processar alertas
      if (this.config.enableAlerts && metrics.alerts.length > 0) {
        this.processAlerts(metrics.alerts)
      }

      // Salvar métricas se habilitado
      if (this.config.saveMetrics) {
        this.saveCurrentMetrics(metrics)
      }

      return metrics

    } catch (error) {
      console.error(`❌ Erro ao coletar métricas: ${error.message}`)
      return null
    }
  }

  async quickSecurityCheck() {
    // Verificação rápida sem executar scripts externos
    const checks = {
      securityProvider: fs.existsSync(path.join(process.cwd(), 'components/security-provider.tsx')),
      secureInput: fs.existsSync(path.join(process.cwd(), 'components/secure-input.tsx')),
      dashboard: fs.existsSync(path.join(process.cwd(), 'components/security-dashboard.tsx')),
      securityCheck: fs.existsSync(path.join(process.cwd(), 'security-check.js')),
      documentation: fs.existsSync(path.join(process.cwd(), 'SECURE_HOOKS.md'))
    }

    const passedChecks = Object.values(checks).filter(Boolean).length
    const totalChecks = Object.keys(checks).length
    const score = Math.round((passedChecks / totalChecks) * 100)

    return {
      score,
      checks,
      passed: passedChecks,
      total: totalChecks
    }
  }

  processAlerts(newAlerts) {
    newAlerts.forEach(alert => {
      // Verificar se é um alerta duplicado recente
      const recentDuplicate = this.alerts.find(existing => 
        existing.type === alert.type && 
        existing.message === alert.message &&
        (Date.now() - existing.timestamp) < 300000 // 5 minutos
      )

      if (!recentDuplicate) {
        alert.timestamp = Date.now()
        alert.id = `${alert.type}-${alert.timestamp}`
        this.alerts.push(alert)
        
        // Limitar número de alertas
        if (this.alerts.length > 50) {
          this.alerts = this.alerts.slice(-50)
        }

        // Log do alerta
        const severityEmoji = {
          low: '🔵',
          medium: '🟡',
          warning: '⚠️',
          high: '🔶',
          critical: '🔴'
        }
        
        console.log(`${severityEmoji[alert.severity]} ALERTA [${alert.type.toUpperCase()}]: ${alert.message}`)
      }
    })
  }

  saveCurrentMetrics(metrics) {
    const metricsDir = path.join(process.cwd(), 'monitoring-data')
    if (!fs.existsSync(metricsDir)) {
      fs.mkdirSync(metricsDir, { recursive: true })
    }

    // Salvar métricas atuais
    const currentPath = path.join(metricsDir, 'current-metrics.json')
    try {
      fs.writeFileSync(currentPath, JSON.stringify(metrics, null, 2))
    } catch (error) {
      console.error(`❌ Erro ao salvar métricas: ${error.message}`)
    }

    // Salvar histórico diário
    const date = new Date().toISOString().slice(0, 10)
    const historyPath = path.join(metricsDir, `metrics-${date}.json`)
    
    try {
      let history = []
      if (fs.existsSync(historyPath)) {
        history = JSON.parse(fs.readFileSync(historyPath, 'utf8'))
      }
      
      history.push(metrics)
      
      // Manter apenas últimas 1000 entradas por dia
      if (history.length > 1000) {
        history = history.slice(-1000)
      }
      
      fs.writeFileSync(historyPath, JSON.stringify(history, null, 2))
    } catch (error) {
      console.error(`❌ Erro ao salvar histórico: ${error.message}`)
    }
  }

  generateSummary() {
    if (this.metrics.length === 0) {
      return 'Nenhuma métrica coletada ainda.'
    }

    const latest = this.metrics[this.metrics.length - 1]
    const summary = []

    summary.push(`📊 Monitoramento Ativo (${this.metrics.length} medições)`)
    summary.push(`🕒 Última atualização: ${latest.timestamp.toLocaleString()}`)
    
    if (latest.system) {
      summary.push(`💾 Memória: ${latest.system.memory.heapUsed}MB/${latest.system.memory.heapTotal}MB`)
      summary.push(`⏱️  Uptime: ${latest.system.uptime}s`)
    }

    if (latest.security) {
      summary.push(`🔒 Segurança: ${latest.security.score || 0}%`)
    }

    if (latest.performance) {
      summary.push(`📁 Arquivos críticos: ${latest.performance.criticalFiles?.percentage || 0}%`)
    }

    const recentAlerts = this.alerts.filter(alert => 
      (Date.now() - alert.timestamp) < 600000 // Últimos 10 minutos
    )
    
    if (recentAlerts.length > 0) {
      summary.push(`⚠️  Alertas recentes: ${recentAlerts.length}`)
    } else {
      summary.push(`✅ Sem alertas recentes`)
    }

    return summary.join('\n')
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️  Monitoramento já está em execução')
      return
    }

    console.log(`🚀 Iniciando monitoramento contínuo...`)
    console.log(`📊 Intervalo: ${this.config.interval / 1000}s`)
    console.log(`🔔 Alertas: ${this.config.enableAlerts ? 'Habilitados' : 'Desabilitados'}`)
    console.log(`💾 Salvar métricas: ${this.config.saveMetrics ? 'Sim' : 'Não'}`)
    console.log('\nPressione Ctrl+C para parar\n')

    this.isRunning = true

    // Primeira coleta imediata
    this.collectMetrics()

    // Configurar intervalo
    this.intervalId = setInterval(async () => {
      try {
        await this.collectMetrics()
        
        // Mostrar resumo a cada 10 medições
        if (this.metrics.length % 10 === 0) {
          console.log('\n' + '='.repeat(50))
          console.log(this.generateSummary())
          console.log('='.repeat(50) + '\n')
        } else {
          // Mostrar apenas timestamp
          process.stdout.write(`⏱️  ${new Date().toLocaleTimeString()} `)
        }
        
      } catch (error) {
        console.error(`❌ Erro no monitoramento: ${error.message}`)
      }
    }, this.config.interval)

    // Configurar handler para parada graceful
    process.on('SIGINT', () => {
      this.stop()
    })

    process.on('SIGTERM', () => {
      this.stop()
    })
  }

  stop() {
    if (!this.isRunning) {
      return
    }

    console.log('\n🛑 Parando monitoramento...')
    
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    
    this.isRunning = false

    // Salvar resumo final
    console.log('\n📋 Resumo Final:')
    console.log('='.repeat(30))
    console.log(this.generateSummary())
    
    if (this.alerts.length > 0) {
      console.log('\n⚠️  Alertas gerados durante o monitoramento:')
      this.alerts.slice(-10).forEach(alert => {
        console.log(`  - [${alert.type}] ${alert.message}`)
      })
    }

    console.log('\n✅ Monitoramento finalizado')
    process.exit(0)
  }
}

// Configurar e iniciar monitor
const monitor = new ContinuousMonitor()

// Processar argumentos da linha de comando
const args = process.argv.slice(2)
if (args.includes('--interval') && args[args.indexOf('--interval') + 1]) {
  monitor.config.interval = parseInt(args[args.indexOf('--interval') + 1]) * 1000
}

if (args.includes('--no-alerts')) {
  monitor.config.enableAlerts = false
}

if (args.includes('--no-save')) {
  monitor.config.saveMetrics = false
}

if (args.includes('--help')) {
  console.log('🔄 Monitoramento Contínuo - AgilMove UCA')
  console.log('\nOpções:')
  console.log('  --interval <segundos>  Intervalo entre verificações (padrão: 30)')
  console.log('  --no-alerts          Desabilitar alertas')
  console.log('  --no-save            Não salvar métricas em arquivo')
  console.log('  --help               Mostrar esta ajuda')
  console.log('\nExemplos:')
  console.log('  node continuous-monitor.js')
  console.log('  node continuous-monitor.js --interval 60')
  console.log('  node continuous-monitor.js --no-alerts')
  process.exit(0)
}

// Iniciar monitoramento
monitor.start()
