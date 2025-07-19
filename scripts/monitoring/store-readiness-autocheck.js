#!/usr/bin/env node

/**
 * Verificação Automática Refinada para Stores - AgilMove UCA
 * Verifica especificamente os itens obrigatórios para publicação nas stores
 */

const fs = require('fs')
const path = require('path')

console.log('🏪 Verificação Automática para Stores - AgilMove UCA\n')

class StoreReadinessChecker {
  constructor() {
    this.results = {
      timestamp: new Date(),
      items: {},
      score: 0,
      maxScore: 0,
      readyForStores: false,
      criticalIssues: [],
      improvements: []
    }
  }

  checkManifestPWA() {
    console.log('📱 Verificando Manifest.json otimizado para PWA...')
    
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json')
    let score = 0
    const maxScore = 20
    const issues = []
    
    if (!fs.existsSync(manifestPath)) {
      issues.push('Arquivo manifest.json não encontrado')
      this.results.criticalIssues.push('Manifest.json ausente')
    } else {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
        
        // Verificações obrigatórias
        if (manifest.name) score += 3
        else issues.push('Campo "name" ausente')
        
        if (manifest.short_name) score += 2
        else issues.push('Campo "short_name" ausente')
        
        if (manifest.icons && manifest.icons.length >= 2) score += 5
        else issues.push('Ícones insuficientes (mínimo 2)')
        
        if (manifest.start_url) score += 2
        else issues.push('Campo "start_url" ausente')
        
        if (manifest.display === 'standalone' || manifest.display === 'fullscreen') score += 3
        else issues.push('Display mode não otimizado para PWA')
        
        if (manifest.theme_color) score += 2
        else issues.push('Campo "theme_color" ausente')
        
        if (manifest.background_color) score += 2
        else issues.push('Campo "background_color" ausente')
        
        if (manifest.screenshots && manifest.screenshots.length > 0) score += 1
        else this.results.improvements.push('Adicionar screenshots para app stores')
        
        console.log(`   ✅ Manifest: ${score}/${maxScore} pontos`)
        if (issues.length > 0) {
          console.log('   ⚠️  Problemas encontrados:')
          issues.forEach(issue => console.log(`      - ${issue}`))
        }
        
      } catch (error) {
        issues.push(`Erro ao ler manifest.json: ${error.message}`)
        this.results.criticalIssues.push('Manifest.json inválido')
      }
    }
    
    this.results.items.manifest = {
      score,
      maxScore,
      issues,
      status: score >= maxScore * 0.8 ? 'pass' : 'fail'
    }
    this.results.score += score
    this.results.maxScore += maxScore
  }

  checkIcons() {
    console.log('🎨 Verificando ícones em todas as resoluções...')
    
    const requiredSizes = [72, 96, 128, 144, 152, 192, 384, 512]
    const publicPath = path.join(process.cwd(), 'public')
    
    let score = 0
    const maxScore = 16 // 2 pontos por ícone
    const issues = []
    const foundIcons = []
    
    requiredSizes.forEach(size => {
      const iconPath = path.join(publicPath, `icon-${size}x${size}.png`)
      if (fs.existsSync(iconPath)) {
        score += 2
        foundIcons.push(size)
      } else {
        issues.push(`Ícone ${size}x${size} não encontrado`)
      }
    })
    
    // Verificar ícones adicionais importantes
    const additionalIcons = ['favicon.png', 'apple-touch-icon.png']
    additionalIcons.forEach(icon => {
      const iconPath = path.join(publicPath, icon)
      if (fs.existsSync(iconPath)) {
        foundIcons.push(icon)
      } else {
        this.results.improvements.push(`Adicionar ${icon}`)
      }
    })
    
    console.log(`   ✅ Ícones: ${foundIcons.length}/${requiredSizes.length + additionalIcons.length} encontrados`)
    console.log(`   📊 Score: ${score}/${maxScore} pontos`)
    
    if (issues.length > 0) {
      console.log('   ⚠️  Ícones faltando:')
      issues.forEach(issue => console.log(`      - ${issue}`))
      
      if (issues.length > 2) {
        this.results.criticalIssues.push('Muitos ícones em falta')
      }
    }
    
    this.results.items.icons = {
      score,
      maxScore,
      issues,
      foundIcons,
      status: score >= maxScore * 0.75 ? 'pass' : 'fail'
    }
    this.results.score += score
    this.results.maxScore += maxScore
  }

  checkServiceWorker() {
    console.log('⚙️ Verificando Service Worker com cache inteligente...')
    
    const swPath = path.join(process.cwd(), 'public', 'service-worker.js')
    let score = 0
    const maxScore = 15
    const issues = []
    
    if (!fs.existsSync(swPath)) {
      issues.push('Service Worker não encontrado')
      this.results.criticalIssues.push('Service Worker ausente')
    } else {
      try {
        const swContent = fs.readFileSync(swPath, 'utf8')
        
        // Verificar funcionalidades obrigatórias
        if (swContent.includes('install')) score += 3
        else issues.push('Event listener "install" não encontrado')
        
        if (swContent.includes('activate')) score += 3
        else issues.push('Event listener "activate" não encontrado')
        
        if (swContent.includes('fetch')) score += 3
        else issues.push('Event listener "fetch" não encontrado')
        
        if (swContent.includes('caches.open')) score += 2
        else issues.push('Cache API não implementada')
        
        if (swContent.includes('push') || swContent.includes('notification')) score += 2
        else this.results.improvements.push('Implementar suporte a notificações push')
        
        if (swContent.includes('Cache First') || swContent.includes('Network First')) score += 2
        else issues.push('Estratégias de cache não implementadas')
        
        console.log(`   ✅ Service Worker: ${score}/${maxScore} pontos`)
        if (issues.length > 0) {
          console.log('   ⚠️  Funcionalidades faltando:')
          issues.forEach(issue => console.log(`      - ${issue}`))
        }
        
      } catch (error) {
        issues.push(`Erro ao ler Service Worker: ${error.message}`)
        this.results.criticalIssues.push('Service Worker inválido')
      }
    }
    
    this.results.items.serviceWorker = {
      score,
      maxScore,
      issues,
      status: score >= maxScore * 0.8 ? 'pass' : 'fail'
    }
    this.results.score += score
    this.results.maxScore += maxScore
  }

  checkOfflinePage() {
    console.log('📄 Verificando página offline personalizada...')
    
    const offlinePath = path.join(process.cwd(), 'public', 'offline.html')
    let score = 0
    const maxScore = 10
    const issues = []
    
    if (!fs.existsSync(offlinePath)) {
      issues.push('Página offline não encontrada')
      this.results.criticalIssues.push('Página offline ausente')
    } else {
      try {
        const offlineContent = fs.readFileSync(offlinePath, 'utf8')
        
        if (offlineContent.includes('<html')) score += 3
        else issues.push('HTML inválido')
        
        if (offlineContent.includes('offline') || offlineContent.includes('sem internet')) score += 3
        else issues.push('Conteúdo não indica estado offline')
        
        if (offlineContent.includes('style') || offlineContent.includes('css')) score += 2
        else this.results.improvements.push('Adicionar estilização à página offline')
        
        if (offlineContent.includes('reconnect') || offlineContent.includes('tentar novamente')) score += 2
        else this.results.improvements.push('Adicionar botão de reconexão')
        
        console.log(`   ✅ Página Offline: ${score}/${maxScore} pontos`)
        
      } catch (error) {
        issues.push(`Erro ao ler página offline: ${error.message}`)
        this.results.criticalIssues.push('Página offline inválida')
      }
    }
    
    this.results.items.offlinePage = {
      score,
      maxScore,
      issues,
      status: score >= maxScore * 0.7 ? 'pass' : 'fail'
    }
    this.results.score += score
    this.results.maxScore += maxScore
  }

  checkSecurityHeaders() {
    console.log('🔒 Verificando headers de segurança obrigatórios...')
    
    const nextConfigPath = path.join(process.cwd(), 'next.config.mjs')
    let score = 0
    const maxScore = 20
    const issues = []
    const foundHeaders = []
    
    if (!fs.existsSync(nextConfigPath)) {
      issues.push('next.config.mjs não encontrado')
      this.results.criticalIssues.push('Configuração Next.js ausente')
    } else {
      try {
        const configContent = fs.readFileSync(nextConfigPath, 'utf8')
        
        const requiredHeaders = [
          'Content-Security-Policy',
          'X-Content-Type-Options',
          'X-Frame-Options',
          'Strict-Transport-Security',
          'Referrer-Policy'
        ]
        
        requiredHeaders.forEach(header => {
          if (configContent.includes(header)) {
            score += 4
            foundHeaders.push(header)
          } else {
            issues.push(`Header ${header} não configurado`)
          }
        })
        
        console.log(`   ✅ Headers: ${foundHeaders.length}/${requiredHeaders.length} configurados`)
        console.log(`   📊 Score: ${score}/${maxScore} pontos`)
        
        if (issues.length > 0) {
          console.log('   ⚠️  Headers faltando:')
          issues.forEach(issue => console.log(`      - ${issue}`))
          
          if (issues.length >= 3) {
            this.results.criticalIssues.push('Muitos headers de segurança em falta')
          }
        }
        
      } catch (error) {
        issues.push(`Erro ao ler configuração: ${error.message}`)
        this.results.criticalIssues.push('Configuração Next.js inválida')
      }
    }
    
    this.results.items.securityHeaders = {
      score,
      maxScore,
      issues,
      foundHeaders,
      status: score >= maxScore * 0.8 ? 'pass' : 'fail'
    }
    this.results.score += score
    this.results.maxScore += maxScore
  }

  checkPrivacyPolicy() {
    console.log('📋 Verificando política de privacidade estruturada...')
    
    const privacyPath = path.join(process.cwd(), 'app', 'privacy-policy', 'page.tsx')
    let score = 0
    const maxScore = 15
    const issues = []
    
    if (!fs.existsSync(privacyPath)) {
      issues.push('Página de política de privacidade não encontrada')
      this.results.criticalIssues.push('Política de privacidade ausente')
    } else {
      try {
        const privacyContent = fs.readFileSync(privacyPath, 'utf8')
        
        if (privacyContent.includes('privacy') || privacyContent.includes('privacidade')) score += 5
        else issues.push('Conteúdo não indica política de privacidade')
        
        if (privacyContent.includes('dados') || privacyContent.includes('data')) score += 3
        else issues.push('Não menciona tratamento de dados')
        
        if (privacyContent.includes('cookie') || privacyContent.includes('storage')) score += 3
        else this.results.improvements.push('Mencionar uso de cookies/storage')
        
        if (privacyContent.includes('contato') || privacyContent.includes('contact')) score += 2
        else this.results.improvements.push('Adicionar informações de contato')
        
        if (privacyContent.includes('atualiza') || privacyContent.includes('modifica')) score += 2
        else this.results.improvements.push('Mencionar política de atualizações')
        
        console.log(`   ✅ Política de Privacidade: ${score}/${maxScore} pontos`)
        
      } catch (error) {
        issues.push(`Erro ao ler política: ${error.message}`)
        this.results.criticalIssues.push('Política de privacidade inválida')
      }
    }
    
    this.results.items.privacyPolicy = {
      score,
      maxScore,
      issues,
      status: score >= maxScore * 0.7 ? 'pass' : 'fail'
    }
    this.results.score += score
    this.results.maxScore += maxScore
  }

  generateFinalReport() {
    const percentage = Math.round((this.results.score / this.results.maxScore) * 100)
    this.results.readyForStores = percentage >= 85 && this.results.criticalIssues.length === 0
    
    console.log('\n📊 RELATÓRIO FINAL:')
    console.log('='.repeat(60))
    
    console.log(`\n🎯 Pontuação Total: ${this.results.score}/${this.results.maxScore} (${percentage}%)`)
    
    let statusIcon = '🔴'
    let statusText = 'NÃO PRONTO'
    
    if (percentage >= 90) {
      statusIcon = '🟢'
      statusText = 'EXCELENTE'
    } else if (percentage >= 80) {
      statusIcon = '🟡'
      statusText = 'BOM'
    } else if (percentage >= 70) {
      statusIcon = '🟠'
      statusText = 'REGULAR'
    }
    
    console.log(`${statusIcon} Status para Stores: ${statusText}`)
    console.log(`🏪 Pronto para publicação: ${this.results.readyForStores ? '✅ SIM' : '❌ NÃO'}`)
    
    // Detalhamento por item
    console.log('\n📋 Detalhamento por Item:')
    Object.entries(this.results.items).forEach(([key, item]) => {
      const statusIcon = item.status === 'pass' ? '✅' : '❌'
      const percentage = Math.round((item.score / item.maxScore) * 100)
      console.log(`   ${statusIcon} ${key}: ${item.score}/${item.maxScore} (${percentage}%)`)
    })
    
    // Issues críticos
    if (this.results.criticalIssues.length > 0) {
      console.log('\n🚨 ISSUES CRÍTICOS (IMPEDEM PUBLICAÇÃO):')
      this.results.criticalIssues.forEach(issue => {
        console.log(`   ❌ ${issue}`)
      })
    }
    
    // Melhorias sugeridas
    if (this.results.improvements.length > 0) {
      console.log('\n💡 MELHORIAS SUGERIDAS:')
      this.results.improvements.forEach(improvement => {
        console.log(`   💡 ${improvement}`)
      })
    }
    
    // Próximos passos
    console.log('\n🚀 PRÓXIMOS PASSOS:')
    if (this.results.readyForStores) {
      console.log('   🎉 Parabéns! Seu app está pronto para as stores!')
      console.log('   📱 Execute: npm run store:prepare')
      console.log('   🔧 Execute: npm run build')
    } else {
      console.log('   🔧 Corrigir issues críticos listados acima')
      console.log('   🔄 Executar novamente: npm run store:autocheck')
      console.log('   📖 Consultar documentação de preparação para stores')
    }
  }

  saveReport() {
    const reportPath = path.join(process.cwd(), 'store-readiness-autocheck-report.json')
    try {
      fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2))
      console.log(`\n📄 Relatório detalhado salvo em: store-readiness-autocheck-report.json`)
    } catch (error) {
      console.error(`❌ Erro ao salvar relatório: ${error.message}`)
    }
  }

  async run() {
    console.log('🔄 Iniciando verificação automática...\n')
    
    this.checkManifestPWA()
    this.checkIcons()
    this.checkServiceWorker()
    this.checkOfflinePage()
    this.checkSecurityHeaders()
    this.checkPrivacyPolicy()
    
    this.generateFinalReport()
    this.saveReport()
    
    return this.results.readyForStores
  }
}

// Executar verificação
const checker = new StoreReadinessChecker()
checker.run()
  .then(ready => {
    console.log(`\n✅ Verificação concluída - App ${ready ? 'PRONTO' : 'NÃO PRONTO'} para stores`)
    process.exit(ready ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Erro na verificação:', error)
    process.exit(1)
  })
