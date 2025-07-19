#!/usr/bin/env node

/**
 * Verificação Contínua Automática - AgilMove UCA
 * Executa verificações periódicas e gera alertas automáticos
 */

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

console.log('🔄 Sistema de Verificação Contínua - AgilMove UCA\n')

class ContinuousMonitor {
  constructor() {
    this.config = {
      checkInterval: 30000, // 30 segundos
      reportThreshold: 85, // Threshold para alertas
      maxFailures: 3, // Máximo de falhas antes de alerta crítico
      logFile: path.join(process.cwd(), 'continuous-monitoring.log')
    }
    this.state = {
      failures: 0,
      lastCheck: null,
      lastScore: 0,
      isRunning: false
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] [${level}] ${message}\n`
    
    console.log(`${this.getLevelIcon(level)} ${message}`)
    
    try {
      fs.appendFileSync(this.config.logFile, logEntry)
    } catch (error) {
      console.error('❌ Erro ao escrever log:', error.message)
    }
  }

  getLevelIcon(level) {
    const icons = {
      'INFO': 'ℹ️',
      'WARN': '⚠️',
      'ERROR': '❌',
      'SUCCESS': '✅',
      'CRITICAL': '🚨'
    }
    return icons[level] || 'ℹ️'
  }

  async runSecurityCheck() {
    return new Promise((resolve) => {
      exec('node scripts/security-check.js', (error, stdout, stderr) => {
        if (error) {
          this.log(`Erro na verificação de segurança: ${error.message}`, 'ERROR')
          resolve({ success: false, score: 0, error: error.message })
        } else {
          // Extrair score do output
          const scoreMatch = stdout.match(/Pontuação:\s*(\d+)%/)
          const score = scoreMatch ? parseInt(scoreMatch[1]) : 0
          
          resolve({ 
            success: true, 
            score, 
            output: stdout,
            warnings: stderr
          })
        }
      })
    })
  }

  async runStoreCheck() {
    return new Promise((resolve) => {
      exec('node scripts/monitoring/store-readiness-autocheck.js', (error, stdout, stderr) => {
        if (error) {
          this.log(`Erro na verificação de store: ${error.message}`, 'ERROR')
          resolve({ success: false, score: 0, error: error.message })
        } else {
          // Extrair score do output
          const scoreMatch = stdout.match(/(\d+)%\)/)
          const score = scoreMatch ? parseInt(scoreMatch[1]) : 0
          
          resolve({ 
            success: true, 
            score, 
            output: stdout,
            warnings: stderr
          })
        }
      })
    })
  }

  async runPerformanceCheck() {
    return new Promise((resolve) => {
      exec('node scripts/monitoring/performance-monitor.js', (error, stdout, stderr) => {
        if (error) {
          this.log(`Erro na verificação de performance: ${error.message}`, 'ERROR')
          resolve({ success: false, score: 0, error: error.message })
        } else {
          // Extrair score do output
          const scoreMatch = stdout.match(/Security Score:\s*(\d+)\/\d+/)
          const score = scoreMatch ? parseInt(scoreMatch[1]) : 0
          
          resolve({ 
            success: true, 
            score, 
            output: stdout,
            warnings: stderr
          })
        }
      })
    })
  }

  async runAllChecks() {
    this.log('Iniciando verificação completa...', 'INFO')
    
    const results = {
      timestamp: new Date(),
      security: await this.runSecurityCheck(),
      store: await this.runStoreCheck(),
      performance: await this.runPerformanceCheck()
    }

    // Calcular score geral
    let totalScore = 0
    let checkCount = 0
    
    Object.values(results).forEach(result => {
      if (result && typeof result.score === 'number') {
        totalScore += result.score
        checkCount++
      }
    })
    
    const averageScore = checkCount > 0 ? Math.round(totalScore / checkCount) : 0
    results.averageScore = averageScore
    
    // Atualizar estado
    this.state.lastCheck = new Date()
    this.state.lastScore = averageScore
    
    // Verificar alertas
    this.checkAlerts(results)
    
    // Salvar resultados
    this.saveResults(results)
    
    return results
  }

  checkAlerts(results) {
    const { averageScore } = results
    
    if (averageScore < this.config.reportThreshold) {
      this.state.failures++
      this.log(`Score baixo detectado: ${averageScore}% (tentativa ${this.state.failures})`, 'WARN')
      
      if (this.state.failures >= this.config.maxFailures) {
        this.log(`ALERTA CRÍTICO: ${this.state.failures} falhas consecutivas!`, 'CRITICAL')
        this.sendCriticalAlert(results)
      }
    } else {
      if (this.state.failures > 0) {
        this.log(`Sistema normalizado após ${this.state.failures} falhas`, 'SUCCESS')
        this.state.failures = 0
      }
    }

    // Verificar issues específicos
    if (results.security && !results.security.success) {
      this.log('Problemas de segurança detectados', 'WARN')
    }
    
    if (results.store && results.store.score < 90) {
      this.log(`App não está pronto para stores: ${results.store.score}%`, 'WARN')
    }
    
    if (results.performance && results.performance.score < 70) {
      this.log(`Performance abaixo do esperado: ${results.performance.score}%`, 'WARN')
    }
  }

  sendCriticalAlert(results) {
    // Criar arquivo de alerta crítico
    const alertPath = path.join(process.cwd(), 'CRITICAL_ALERT.json')
    const alert = {
      timestamp: new Date(),
      message: 'SISTEMA COM PROBLEMAS CRÍTICOS',
      failures: this.state.failures,
      lastScore: results.averageScore,
      details: results,
      actions: [
        'Verificar logs em continuous-monitoring.log',
        'Executar npm run security:full',
        'Revisar configurações de segurança',
        'Contactar equipe de desenvolvimento'
      ]
    }
    
    try {
      fs.writeFileSync(alertPath, JSON.stringify(alert, null, 2))
      this.log(`Alerta crítico salvo em: ${alertPath}`, 'CRITICAL')
    } catch (error) {
      this.log(`Erro ao salvar alerta crítico: ${error.message}`, 'ERROR')
    }
  }

  saveResults(results) {
    const resultsPath = path.join(process.cwd(), 'continuous-monitoring-results.json')
    
    try {
      let history = []
      if (fs.existsSync(resultsPath)) {
        const existingData = JSON.parse(fs.readFileSync(resultsPath, 'utf8'))
        history = existingData.history || []
      }
      
      // Manter apenas os últimos 50 resultados
      history.push(results)
      if (history.length > 50) {
        history = history.slice(-50)
      }
      
      const data = {
        lastUpdate: new Date(),
        currentState: this.state,
        config: this.config,
        latest: results,
        history
      }
      
      fs.writeFileSync(resultsPath, JSON.stringify(data, null, 2))
      this.log(`Resultados salvos: ${results.averageScore}% de score geral`, 'INFO')
      
    } catch (error) {
      this.log(`Erro ao salvar resultados: ${error.message}`, 'ERROR')
    }
  }

  displayStatus() {
    console.log('\n📊 STATUS DO SISTEMA:')
    console.log('='.repeat(50))
    console.log(`🕒 Último check: ${this.state.lastCheck?.toLocaleString() || 'Nunca'}`)
    console.log(`📊 Último score: ${this.state.lastScore}%`)
    console.log(`❌ Falhas consecutivas: ${this.state.failures}`)
    console.log(`🔄 Monitoramento: ${this.state.isRunning ? 'ATIVO' : 'INATIVO'}`)
    console.log(`📝 Log file: ${this.config.logFile}`)
  }

  async startContinuousMonitoring() {
    this.log('Iniciando monitoramento contínuo...', 'INFO')
    this.state.isRunning = true
    
    const runCheck = async () => {
      if (!this.state.isRunning) return
      
      try {
        await this.runAllChecks()
      } catch (error) {
        this.log(`Erro durante verificação: ${error.message}`, 'ERROR')
      }
      
      // Agendar próxima verificação
      setTimeout(runCheck, this.config.checkInterval)
    }
    
    // Executar primeira verificação
    await runCheck()
  }

  stop() {
    this.log('Parando monitoramento contínuo...', 'INFO')
    this.state.isRunning = false
  }

  async runOnce() {
    this.log('Executando verificação única...', 'INFO')
    const results = await this.runAllChecks()
    this.displayStatus()
    return results
  }
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2)
const mode = args[0] || 'once'

const monitor = new ContinuousMonitor()

switch (mode) {
  case 'continuous':
    console.log('🔄 Modo: Monitoramento Contínuo')
    monitor.startContinuousMonitoring()
    
    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Recebido sinal de parada...')
      monitor.stop()
      process.exit(0)
    })
    break
    
  case 'status':
    console.log('📊 Modo: Exibir Status')
    monitor.displayStatus()
    break
    
  default:
    console.log('🔍 Modo: Verificação Única')
    monitor.runOnce()
      .then(results => {
        const success = results.averageScore >= 85
        process.exit(success ? 0 : 1)
      })
      .catch(error => {
        console.error('❌ Erro:', error)
        process.exit(1)
      })
}
