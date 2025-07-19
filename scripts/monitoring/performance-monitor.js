#!/usr/bin/env node

/**
 * Script de Monitoramento de Performance - AgilMove UCA
 * Monitora métricas de performance e segurança em tempo real
 */

const fs = require('fs')
const path = require('path')

console.log('📊 Monitoramento de Performance - AgilMove UCA\n')

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      timestamp: new Date(),
      performance: {},
      security: {},
      errors: [],
      warnings: []
    }
    this.thresholds = {
      memoryUsage: 100 * 1024 * 1024, // 100MB
      cpuUsage: 80, // 80%
      responseTime: 1000, // 1s
      errorRate: 5 // 5%
    }
  }

  collectSystemMetrics() {
    const used = process.memoryUsage()
    const cpuUsage = process.cpuUsage()
    
    this.metrics.performance = {
      memory: {
        rss: Math.round(used.rss / 1024 / 1024), // MB
        heapTotal: Math.round(used.heapTotal / 1024 / 1024),
        heapUsed: Math.round(used.heapUsed / 1024 / 1024),
        external: Math.round(used.external / 1024 / 1024)
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      uptime: Math.round(process.uptime()),
      nodeVersion: process.version
    }

    // Verificar thresholds
    if (used.rss > this.thresholds.memoryUsage) {
      this.metrics.warnings.push({
        type: 'memory',
        message: `Uso de memória alto: ${this.metrics.performance.memory.rss}MB`,
        threshold: Math.round(this.thresholds.memoryUsage / 1024 / 1024)
      })
    }
  }

  checkFileSystemSecurity() {
    const securityChecks = []
    
    // Verificar permissões de arquivos sensíveis
    const sensitiveFiles = [
      'package.json',
      '.env',
      '.env.local',
      'security-check.js'
    ]

    sensitiveFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file)
      if (fs.existsSync(filePath)) {
        try {
          const stats = fs.statSync(filePath)
          const permissions = (stats.mode & parseInt('777', 8)).toString(8)
          
          securityChecks.push({
            file,
            exists: true,
            permissions,
            size: stats.size,
            modified: stats.mtime
          })

          // Verificar se .env está muito permissivo
          if (file.startsWith('.env') && permissions !== '600') {
            this.metrics.warnings.push({
              type: 'file_permissions',
              message: `Arquivo ${file} com permissões ${permissions} (recomendado: 600)`,
              file
            })
          }
        } catch (error) {
          securityChecks.push({
            file,
            exists: true,
            error: error.message
          })
        }
      } else {
        securityChecks.push({
          file,
          exists: false
        })
      }
    })

    this.metrics.security.fileSystem = securityChecks
  }

  checkDependencySecurity() {
    try {
      const packagePath = path.join(process.cwd(), 'package.json')
      if (fs.existsSync(packagePath)) {
        const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
        
        const dependencies = {
          production: Object.keys(packageContent.dependencies || {}),
          development: Object.keys(packageContent.devDependencies || {})
        }

        // Verificar dependências conhecidas por problemas de segurança
        const riskyDependencies = ['eval', 'exec', 'unsafe-eval']
        const foundRiskyDeps = []

        dependencies.production.forEach(dep => {
          if (riskyDependencies.some(risky => dep.includes(risky))) {
            foundRiskyDeps.push(dep)
          }
        })

        if (foundRiskyDeps.length > 0) {
          this.metrics.warnings.push({
            type: 'risky_dependencies',
            message: `Dependências potencialmente arriscadas: ${foundRiskyDeps.join(', ')}`,
            dependencies: foundRiskyDeps
          })
        }

        this.metrics.security.dependencies = {
          total: dependencies.production.length + dependencies.development.length,
          production: dependencies.production.length,
          development: dependencies.development.length,
          risky: foundRiskyDeps
        }
      }
    } catch (error) {
      this.metrics.errors.push({
        type: 'dependency_check',
        message: `Erro ao verificar dependências: ${error.message}`
      })
    }
  }

  checkNetworkSecurity() {
    // Verificações de rede aprimoradas
    const networkChecks = {
      localhost: {
        port3000: false,
        port3001: false,
        port443: false,
        port80: false
      },
      ssl: {
        configured: false,
        validCertificate: false,
        strongCiphers: false
      },
      headers: {
        csp: false,
        hsts: false,
        frameOptions: false,
        contentTypeOptions: false
      }
    }

    // Verificar se portas estão abertas
    const openPorts = []
    if (process.env.PORT || process.env.NODE_ENV === 'development') {
      openPorts.push(process.env.PORT || 3000)
      networkChecks.localhost.port3000 = true
    }

    // Verificar configuração de headers no next.config.mjs
    try {
      const nextConfigPath = path.join(process.cwd(), 'next.config.mjs')
      if (fs.existsSync(nextConfigPath)) {
        const configContent = fs.readFileSync(nextConfigPath, 'utf8')
        
        networkChecks.headers.csp = configContent.includes('Content-Security-Policy')
        networkChecks.headers.hsts = configContent.includes('Strict-Transport-Security')
        networkChecks.headers.frameOptions = configContent.includes('X-Frame-Options')
        networkChecks.headers.contentTypeOptions = configContent.includes('X-Content-Type-Options')
        
        const headersConfigured = Object.values(networkChecks.headers).filter(Boolean).length
        if (headersConfigured < 4) {
          this.metrics.warnings.push({
            type: 'missing_security_headers',
            message: `${4 - headersConfigured} headers de segurança não configurados`,
            configured: headersConfigured,
            total: 4
          })
        }
      }
    } catch (error) {
      this.metrics.errors.push({
        type: 'header_check',
        message: `Erro ao verificar headers: ${error.message}`
      })
    }

    this.metrics.security.network = {
      openPorts,
      checks: networkChecks,
      timestamp: new Date()
    }
  }

  generateSecurityScore() {
    let score = 100
    let deductions = []

    // Deduzir pontos por warnings
    this.metrics.warnings.forEach(warning => {
      switch (warning.type) {
        case 'memory':
          score -= 5
          deductions.push('Alto uso de memória (-5)')
          break
        case 'file_permissions':
          score -= 10
          deductions.push('Permissões de arquivo inseguras (-10)')
          break
        case 'risky_dependencies':
          score -= 15
          deductions.push('Dependências arriscadas (-15)')
          break
        case 'missing_security_headers':
          score -= (warning.total - warning.configured) * 5
          deductions.push(`Headers de segurança faltando (-${(warning.total - warning.configured) * 5})`)
          break
      }
    })

    // Deduzir pontos por errors
    this.metrics.errors.forEach(error => {
      score -= 10
      deductions.push(`${error.type} (-10)`)
    })

    // Bonificações por boas práticas
    let bonuses = []
    if (this.metrics.security.network?.checks?.headers) {
      const headersConfigured = Object.values(this.metrics.security.network.checks.headers).filter(Boolean).length
      if (headersConfigured === 4) {
        bonuses.push('Todos os headers de segurança configurados (+5)')
        score += 5
      }
    }

    this.metrics.security.score = Math.max(0, Math.min(100, score))
    this.metrics.security.deductions = deductions
    this.metrics.security.bonuses = bonuses
    this.metrics.security.maxScore = 100
  }

  saveMetrics() {
    const metricsPath = path.join(process.cwd(), 'monitoring-metrics.json')
    try {
      fs.writeFileSync(metricsPath, JSON.stringify(this.metrics, null, 2))
      console.log(`📁 Métricas salvas em: ${metricsPath}`)
    } catch (error) {
      console.error(`❌ Erro ao salvar métricas: ${error.message}`)
    }
  }

  displayReport() {
    console.log('📊 Relatório de Monitoramento:')
    console.log('='.repeat(50))
    
    // Performance
    console.log('\n🚀 Performance:')
    console.log(`Memory Usage: ${this.metrics.performance.memory.rss}MB (Heap: ${this.metrics.performance.memory.heapUsed}MB)`)
    console.log(`Uptime: ${this.metrics.performance.uptime}s`)
    console.log(`Node Version: ${this.metrics.performance.nodeVersion}`)

    // Security
    console.log('\n🔒 Segurança:')
    console.log(`Security Score: ${this.metrics.security.score}/${this.metrics.security.maxScore}`)
    
    if (this.metrics.security.dependencies) {
      console.log(`Dependencies: ${this.metrics.security.dependencies.total} total (${this.metrics.security.dependencies.production} prod)`)
    }

    // Headers de Segurança
    if (this.metrics.security.network?.checks?.headers) {
      const headers = this.metrics.security.network.checks.headers
      const headersConfigured = Object.values(headers).filter(Boolean).length
      console.log(`Security Headers: ${headersConfigured}/4 configurados`)
      
      console.log('  Headers Status:')
      console.log(`    CSP: ${headers.csp ? '✅' : '❌'}`)
      console.log(`    HSTS: ${headers.hsts ? '✅' : '❌'}`)
      console.log(`    Frame-Options: ${headers.frameOptions ? '✅' : '❌'}`)
      console.log(`    Content-Type-Options: ${headers.contentTypeOptions ? '✅' : '❌'}`)
    }

    // Warnings
    if (this.metrics.warnings.length > 0) {
      console.log('\n⚠️  Warnings:')
      this.metrics.warnings.forEach(warning => {
        console.log(`  - ${warning.message}`)
      })
    }

    // Errors
    if (this.metrics.errors.length > 0) {
      console.log('\n❌ Errors:')
      this.metrics.errors.forEach(error => {
        console.log(`  - ${error.message}`)
      })
    }

    // Bonuses
    if (this.metrics.security.bonuses && this.metrics.security.bonuses.length > 0) {
      console.log('\n🎉 Bonificações:')
      this.metrics.security.bonuses.forEach(bonus => {
        console.log(`  + ${bonus}`)
      })
    }

    // Recommendations
    console.log('\n💡 Recomendações:')
    if (this.metrics.security.score < 70) {
      console.log('  - Score de segurança baixo, revisar warnings')
    }
    if (this.metrics.performance.memory.rss > 50) {
      console.log('  - Considerar otimização de memória')
    }
    if (this.metrics.security.network?.checks?.headers) {
      const headers = this.metrics.security.network.checks.headers
      if (!headers.csp) console.log('  - Configurar Content Security Policy (CSP)')
      if (!headers.hsts) console.log('  - Configurar HTTP Strict Transport Security (HSTS)')
      if (!headers.frameOptions) console.log('  - Configurar X-Frame-Options')
      if (!headers.contentTypeOptions) console.log('  - Configurar X-Content-Type-Options')
    }
    if (this.metrics.warnings.length === 0 && this.metrics.errors.length === 0) {
      console.log('  - Sistema funcionando bem! 🎉')
    }

    console.log(`\n🕒 Timestamp: ${this.metrics.timestamp.toLocaleString()}`)
  }

  async run() {
    console.log('🔄 Coletando métricas...')
    
    this.collectSystemMetrics()
    this.checkFileSystemSecurity()
    this.checkDependencySecurity()
    this.checkNetworkSecurity()
    this.generateSecurityScore()
    
    this.displayReport()
    this.saveMetrics()
    
    return this.metrics.security.score >= 70
  }
}

// Executar monitoramento
const monitor = new PerformanceMonitor()
monitor.run()
  .then(success => {
    console.log('\n✅ Monitoramento concluído')
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Erro no monitoramento:', error)
    process.exit(1)
  })
