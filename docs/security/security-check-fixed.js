#!/usr/bin/env node

/**
 * Script de Validação de Segurança - AgilMove UCA
 * Verifica a implementação dos hooks seguros
 */

const fs = require('fs')
const path = require('path')

console.log('🔐 Validando Hooks Seguros - AgilMove UCA\n')

const checks = {
  securityProvider: false,
  secureInput: false,
  secureHooksDemo: false,
  demoPage: false,
  documentation: false
}

const issues = []

// 1. Verificar SecurityProvider
const securityProviderPath = path.join(__dirname, 'components', 'security-provider.tsx')
if (fs.existsSync(securityProviderPath)) {
  const content = fs.readFileSync(securityProviderPath, 'utf8')
  
  // Verificar hooks implementados
  const hasSecureStorage = content.includes('useSecureStorage')
  const hasSecureNotifications = content.includes('useSecureNotifications')
  const hasSecureInput = content.includes('useSecureInput')
  const hasSanitization = content.includes('sanitizeInput')
  const hasEncryption = content.includes('btoa')
  
  if (hasSecureStorage && hasSecureNotifications && hasSecureInput && hasSanitization && hasEncryption) {
    checks.securityProvider = true
    console.log('✅ SecurityProvider: Todos os hooks implementados')
  } else {
    issues.push('❌ SecurityProvider: Hooks incompletos')
    if (!hasSecureStorage) issues.push('  - useSecureStorage ausente')
    if (!hasSecureNotifications) issues.push('  - useSecureNotifications ausente')
    if (!hasSecureInput) issues.push('  - useSecureInput ausente')
    if (!hasSanitization) issues.push('  - Sanitização ausente')
    if (!hasEncryption) issues.push('  - Criptografia ausente')
  }
} else {
  issues.push('❌ SecurityProvider: Arquivo não encontrado')
}

// 2. Verificar SecureInput Component
const secureInputPath = path.join(__dirname, 'components', 'secure-input.tsx')
if (fs.existsSync(secureInputPath)) {
  const content = fs.readFileSync(secureInputPath, 'utf8')
  
  const hasValidation = content.includes('validationRules')
  const hasPasswordValidation = content.includes('type === \'password\'')
  const hasSanitization = content.includes('setSanitizedValue') || content.includes('sanitizeInput')
  const hasSecurityIndicator = content.includes('showSecurityIndicator')
  
  if (hasValidation && hasPasswordValidation && hasSanitization && hasSecurityIndicator) {
    checks.secureInput = true
    console.log('✅ SecureInput: Componente completo')
  } else {
    issues.push('❌ SecureInput: Recursos incompletos')
    if (!hasValidation) issues.push('  - validationRules ausente')
    if (!hasPasswordValidation) issues.push('  - Validação de senha ausente')
    if (!hasSanitization) issues.push('  - Sanitização ausente')
    if (!hasSecurityIndicator) issues.push('  - Indicador de segurança ausente')
  }
} else {
  issues.push('❌ SecureInput: Arquivo não encontrado')
}

// 3. Verificar Demo Component
const demoPath = path.join(__dirname, 'components', 'secure-hooks-demo.tsx')
if (fs.existsSync(demoPath)) {
  const content = fs.readFileSync(demoPath, 'utf8')
  
  const hasStorageDemo = content.includes('useSecureStorage')
  const hasNotificationDemo = content.includes('useSecureNotifications')
  const hasInputDemo = content.includes('SecureInput')
  
  if (hasStorageDemo && hasNotificationDemo && hasInputDemo) {
    checks.secureHooksDemo = true
    console.log('✅ Demo Component: Implementado')
  } else {
    issues.push('❌ Demo Component: Incompleto')
  }
} else {
  issues.push('❌ Demo Component: Arquivo não encontrado')
}

// 4. Verificar página de demo
const demoPagePath = path.join(__dirname, 'app', 'secure-hooks', 'page.tsx')
if (fs.existsSync(demoPagePath)) {
  checks.demoPage = true
  console.log('✅ Demo Page: Rota configurada')
} else {
  issues.push('❌ Demo Page: Rota não encontrada')
}

// 5. Verificar documentação
const docsPath = path.join(__dirname, 'SECURE_HOOKS.md')
if (fs.existsSync(docsPath)) {
  const content = fs.readFileSync(docsPath, 'utf8')
  
  const hasUsage = content.includes('Uso:')
  const hasSecurity = content.includes('Segurança')
  const hasCompatibility = content.includes('Compatibilidade')
  
  if (hasUsage && hasSecurity && hasCompatibility) {
    checks.documentation = true
    console.log('✅ Documentação: Completa')
  } else {
    issues.push('❌ Documentação: Incompleta')
  }
} else {
  issues.push('❌ Documentação: Arquivo não encontrado')
}

// 6. Verificar package.json para scripts
const packagePath = path.join(__dirname, 'package.json')
if (fs.existsSync(packagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  if (packageContent.scripts && packageContent.scripts.build) {
    console.log('✅ Build Script: Configurado')
  } else {
    issues.push('❌ Build Script: Não configurado')
  }
} else {
  issues.push('❌ package.json: Não encontrado')
}

// Relatório final
console.log('\n📊 Relatório de Segurança:')
console.log('='.repeat(40))

const totalChecks = Object.keys(checks).length
const passedChecks = Object.values(checks).filter(Boolean).length
const securityScore = Math.round((passedChecks / totalChecks) * 100)

console.log(`Pontuação de Segurança: ${securityScore}%`)
console.log(`Verificações Passadas: ${passedChecks}/${totalChecks}`)

if (issues.length > 0) {
  console.log('\n⚠️  Problemas Encontrados:')
  issues.forEach(issue => console.log(issue))
} else {
  console.log('\n🎉 Todas as verificações passaram!')
}

console.log('\n🔍 Verificações Detalhadas:')
Object.entries(checks).forEach(([check, passed]) => {
  const status = passed ? '✅' : '❌'
  const checkName = check.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  console.log(`${status} ${checkName}`)
})

// Sugestões de melhorias
if (securityScore < 100) {
  console.log('\n💡 Sugestões de Melhorias:')
  
  if (!checks.securityProvider) {
    console.log('- Implementar todos os hooks no SecurityProvider')
  }
  
  if (!checks.secureInput) {
    console.log('- Completar componente SecureInput com validação')
  }
  
  if (!checks.secureHooksDemo) {
    console.log('- Criar demo completo para teste dos hooks')
  }
  
  if (!checks.demoPage) {
    console.log('- Configurar rota /secure-hooks para testes')
  }
  
  if (!checks.documentation) {
    console.log('- Documentar uso e características de segurança')
  }
}

console.log('\n🚀 Para testar os hooks:')
console.log('npm run dev')
console.log('Acesse: http://localhost:3000/secure-hooks')

process.exit(securityScore === 100 ? 0 : 1)
