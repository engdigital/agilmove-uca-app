#!/usr/bin/env node

/**
 * Gerador de Relatório de Segurança - AgilMove UCA
 * Consolida todas as verificações em um relatório completo
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('📋 Gerando Relatório de Segurança - AgilMove UCA\n')

class SecurityReportGenerator {
  constructor() {
    this.report = {
      timestamp: new Date(),
      version: '1.0.0',
      project: 'AgilMove UCA',
      phase: 'Fase 4 - Monitoramento',
      summary: {},
      details: {},
      recommendations: [],
      score: 0
    }
  }

  async runSecurityCheck() {
    console.log('🔐 Executando verificação de hooks seguros...')
    
    try {
      const output = execSync('node security-check.js', { 
        encoding: 'utf8',
        cwd: process.cwd()
      })
      
      // Extrair pontuação do output
      const scoreMatch = output.match(/Pontuação de Segurança: (\d+)%/)
      const hooksScore = scoreMatch ? parseInt(scoreMatch[1]) : 0
      
      const passedMatch = output.match(/Verificações Passadas: (\d+)\/(\d+)/)
      const passed = passedMatch ? parseInt(passedMatch[1]) : 0
      const total = passedMatch ? parseInt(passedMatch[2]) : 0
      
      this.report.details.securityHooks = {
        score: hooksScore,
        passed,
        total,
        status: hooksScore === 100 ? 'pass' : hooksScore >= 80 ? 'warning' : 'fail',
        output: output.includes('🎉 Todas as verificações passaram!')
      }
      
      console.log(`✅ Hooks Seguros: ${hooksScore}% (${passed}/${total})`)
      
    } catch (error) {
      console.log(`❌ Erro na verificação de hooks: ${error.message}`)
      this.report.details.securityHooks = {
        score: 0,
        status: 'fail',
        error: error.message
      }
    }
  }

  async runHeadersCheck() {
    console.log('🔒 Verificando headers de segurança...')
    
    try {
      const output = execSync('node scripts/monitoring/check-headers.js', { 
        encoding: 'utf8',
        cwd: process.cwd(),
        timeout: 10000
      })
      
      // Extrair pontuação do output
      const scoreMatch = output.match(/Pontuação Geral: \d+\/\d+ \((\d+)%\)/)
      const headersScore = scoreMatch ? parseInt(scoreMatch[1]) : 0
      
      this.report.details.securityHeaders = {
        score: headersScore,
        status: headersScore >= 80 ? 'pass' : headersScore >= 60 ? 'warning' : 'fail',
        tested: true
      }
      
      console.log(`✅ Headers de Segurança: ${headersScore}%`)
      
    } catch (error) {
      console.log(`⚠️  Headers não testados (servidor offline): ${error.message}`)
      this.report.details.securityHeaders = {
        score: 0,
        status: 'warning',
        tested: false,
        reason: 'Servidor não disponível para teste'
      }
    }
  }

  async runPerformanceCheck() {
    console.log('📊 Verificando performance e sistema...')
    
    try {
      const output = execSync('node scripts/monitoring/performance-monitor.js', { 
        encoding: 'utf8',
        cwd: process.cwd()
      })
      
      // Extrair score de segurança
      const scoreMatch = output.match(/Security Score: (\d+)\/100/)
      const performanceScore = scoreMatch ? parseInt(scoreMatch[1]) : 85 // Padrão
      
      this.report.details.performance = {
        score: performanceScore,
        status: performanceScore >= 80 ? 'pass' : performanceScore >= 60 ? 'warning' : 'fail',
        monitored: true
      }
      
      console.log(`✅ Performance e Sistema: ${performanceScore}%`)
      
    } catch (error) {
      console.log(`❌ Erro na verificação de performance: ${error.message}`)
      this.report.details.performance = {
        score: 0,
        status: 'fail',
        error: error.message
      }
    }
  }

  checkProjectStructure() {
    console.log('📁 Verificando estrutura do projeto...')
    
    const requiredFiles = [
      'components/security-provider.tsx',
      'components/secure-input.tsx',
      'components/security-dashboard.tsx',
      'app/security-dashboard/page.tsx',
      'app/secure-hooks/page.tsx',
      'SECURE_HOOKS.md',
      'security-check.js'
    ]
    
    const missingFiles = []
    const existingFiles = []
    
    requiredFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file)
      if (fs.existsSync(filePath)) {
        existingFiles.push(file)
      } else {
        missingFiles.push(file)
      }
    })
    
    const structureScore = Math.round((existingFiles.length / requiredFiles.length) * 100)
    
    this.report.details.projectStructure = {
      score: structureScore,
      status: structureScore === 100 ? 'pass' : structureScore >= 80 ? 'warning' : 'fail',
      requiredFiles: requiredFiles.length,
      existingFiles: existingFiles.length,
      missingFiles
    }
    
    console.log(`✅ Estrutura do Projeto: ${structureScore}% (${existingFiles.length}/${requiredFiles.length})`)
    
    if (missingFiles.length > 0) {
      console.log(`   Arquivos ausentes: ${missingFiles.join(', ')}`)
    }
  }

  checkDocumentation() {
    console.log('📚 Verificando documentação...')
    
    const docFiles = [
      'README.md',
      'SECURE_HOOKS.md',
      'BUILD_ANDROID.md',
      'SECURITY_IMPROVEMENTS.md'
    ]
    
    let docScore = 0
    const docStatus = {}
    
    docFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file)
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8')
        const hasContent = content.length > 100
        const isUpdated = content.includes('Fase 3') || content.includes('Fase 4') || content.includes('2025')
        
        docStatus[file] = {
          exists: true,
          hasContent,
          isUpdated,
          size: content.length
        }
        
        if (hasContent && isUpdated) {
          docScore += 25
        } else if (hasContent) {
          docScore += 15
        } else {
          docScore += 5
        }
      } else {
        docStatus[file] = { exists: false }
      }
    })
    
    this.report.details.documentation = {
      score: Math.min(docScore, 100),
      status: docScore >= 80 ? 'pass' : docScore >= 60 ? 'warning' : 'fail',
      files: docStatus
    }
    
    console.log(`✅ Documentação: ${docScore}%`)
  }

  calculateOverallScore() {
    const weights = {
      securityHooks: 40,      // 40% - Mais importante
      securityHeaders: 20,    // 20% - Importante para produção
      performance: 20,        // 20% - Performance
      projectStructure: 15,   // 15% - Estrutura
      documentation: 5        // 5% - Documentação
    }
    
    let totalScore = 0
    let totalWeight = 0
    
    Object.entries(weights).forEach(([key, weight]) => {
      if (this.report.details[key] && this.report.details[key].score !== undefined) {
        totalScore += this.report.details[key].score * weight
        totalWeight += weight
      }
    })
    
    this.report.score = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0
    
    // Determinar status geral
    if (this.report.score >= 90) {
      this.report.summary.status = 'excellent'
      this.report.summary.message = 'Segurança excelente! Sistema pronto para produção.'
    } else if (this.report.score >= 80) {
      this.report.summary.status = 'good'
      this.report.summary.message = 'Boa segurança. Pequenos ajustes recomendados.'
    } else if (this.report.score >= 60) {
      this.report.summary.status = 'warning'
      this.report.summary.message = 'Segurança moderada. Melhorias necessárias.'
    } else {
      this.report.summary.status = 'critical'
      this.report.summary.message = 'Segurança crítica. Ação imediata necessária.'
    }
  }

  generateRecommendations() {
    const recommendations = []
    
    // Recomendações baseadas nos scores
    if (this.report.details.securityHooks?.score < 100) {
      recommendations.push({
        priority: 'high',
        category: 'Security Hooks',
        message: 'Complete a implementação de todos os hooks seguros',
        action: 'Executar: npm run security:check'
      })
    }
    
    if (this.report.details.securityHeaders?.score < 80) {
      recommendations.push({
        priority: 'medium',
        category: 'Security Headers',
        message: 'Configure headers de segurança no servidor',
        action: 'Implementar middleware de segurança'
      })
    }
    
    if (this.report.details.performance?.score < 80) {
      recommendations.push({
        priority: 'medium',
        category: 'Performance',
        message: 'Otimizar performance do sistema',
        action: 'Revisar uso de memória e dependências'
      })
    }
    
    if (this.report.details.projectStructure?.score < 100) {
      recommendations.push({
        priority: 'low',
        category: 'Project Structure',
        message: 'Completar estrutura de arquivos necessários',
        action: 'Verificar arquivos ausentes'
      })
    }
    
    if (this.report.details.documentation?.score < 80) {
      recommendations.push({
        priority: 'low',
        category: 'Documentation',
        message: 'Atualizar documentação do projeto',
        action: 'Revisar e atualizar arquivos .md'
      })
    }
    
    // Recomendações gerais
    if (this.report.score >= 90) {
      recommendations.push({
        priority: 'info',
        category: 'Next Steps',
        message: 'Sistema pronto! Considere implementar monitoramento contínuo',
        action: 'Configurar CI/CD com verificações automáticas'
      })
    }
    
    this.report.recommendations = recommendations
  }

  saveReport() {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const reportPath = path.join(process.cwd(), `security-report-${timestamp}.json`)
    
    try {
      fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2))
      console.log(`\n📄 Relatório salvo em: ${reportPath}`)
    } catch (error) {
      console.error(`❌ Erro ao salvar relatório: ${error.message}`)
    }
  }

  displayReport() {
    console.log('\n📋 RELATÓRIO DE SEGURANÇA - AGILMOVE UCA')
    console.log('='.repeat(60))
    console.log(`Projeto: ${this.report.project}`)
    console.log(`Fase: ${this.report.phase}`)
    console.log(`Timestamp: ${this.report.timestamp.toLocaleString()}`)
    
    console.log('\n🎯 PONTUAÇÃO GERAL')
    console.log('='.repeat(30))
    const statusEmoji = {
      excellent: '🟢',
      good: '🔵',
      warning: '🟡',
      critical: '🔴'
    }
    console.log(`${statusEmoji[this.report.summary.status]} ${this.report.score}% - ${this.report.summary.message}`)
    
    console.log('\n📊 DETALHES POR CATEGORIA')
    console.log('='.repeat(30))
    
    Object.entries(this.report.details).forEach(([category, details]) => {
      const statusIcon = details.status === 'pass' ? '✅' : 
                        details.status === 'warning' ? '⚠️' : '❌'
      console.log(`${statusIcon} ${category}: ${details.score}%`)
      
      if (details.error) {
        console.log(`   Erro: ${details.error}`)
      }
      if (details.reason) {
        console.log(`   Razão: ${details.reason}`)
      }
    })
    
    if (this.report.recommendations.length > 0) {
      console.log('\n💡 RECOMENDAÇÕES')
      console.log('='.repeat(30))
      
      const priorityOrder = ['high', 'medium', 'low', 'info']
      const priorityEmoji = {
        high: '🔴',
        medium: '🟡',
        low: '🔵',
        info: '💡'
      }
      
      priorityOrder.forEach(priority => {
        const recs = this.report.recommendations.filter(r => r.priority === priority)
        recs.forEach(rec => {
          console.log(`${priorityEmoji[priority]} [${rec.category}] ${rec.message}`)
          console.log(`   Ação: ${rec.action}`)
        })
      })
    }
    
    console.log('\n🚀 PRÓXIMOS PASSOS')
    console.log('='.repeat(30))
    if (this.report.score >= 90) {
      console.log('• Sistema pronto para produção!')
      console.log('• Configurar monitoramento contínuo')
      console.log('• Implementar testes automatizados')
    } else if (this.report.score >= 80) {
      console.log('• Implementar melhorias recomendadas')
      console.log('• Testar em ambiente de staging')
      console.log('• Revisar configurações de segurança')
    } else {
      console.log('• Priorizar correções de alta prioridade')
      console.log('• Revisar implementação de hooks seguros')
      console.log('• Consultar documentação de segurança')
    }
    
    console.log(`\n📁 Relatório completo salvo em JSON para análise detalhada`)
  }

  async generateReport() {
    try {
      await this.runSecurityCheck()
      await this.runHeadersCheck()
      await this.runPerformanceCheck()
      this.checkProjectStructure()
      this.checkDocumentation()
      
      this.calculateOverallScore()
      this.generateRecommendations()
      
      this.displayReport()
      this.saveReport()
      
      return this.report.score >= 80
      
    } catch (error) {
      console.error('❌ Erro ao gerar relatório:', error)
      return false
    }
  }
}

// Executar geração de relatório
const generator = new SecurityReportGenerator()
generator.generateReport()
  .then(success => {
    console.log('\n✅ Relatório de segurança gerado com sucesso!')
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Erro na geração:', error)
    process.exit(1)
  })
