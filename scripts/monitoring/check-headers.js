#!/usr/bin/env node

/**
 * Script de Verificação de Headers de Segurança - AgilMove UCA
 * Verifica se os headers de segurança estão configurados corretamente
 */

const https = require('https')
const http = require('http')

console.log('🔒 Verificando Headers de Segurança - AgilMove UCA\n')

const requiredHeaders = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': ['DENY', 'SAMEORIGIN'],
  'x-xss-protection': '1; mode=block',
  'strict-transport-security': null, // Verificar apenas presença
  'content-security-policy': null,
  'referrer-policy': null
}

const recommendations = {
  'x-content-type-options': 'Previne ataques MIME type sniffing',
  'x-frame-options': 'Protege contra clickjacking',
  'x-xss-protection': 'Ativa proteção XSS do navegador',
  'strict-transport-security': 'Força conexões HTTPS',
  'content-security-policy': 'Controla recursos carregados',
  'referrer-policy': 'Controla informações do referrer'
}

function checkHeaders(url) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://')
    const client = isHttps ? https : http
    
    const options = {
      method: 'HEAD',
      timeout: 5000
    }

    const req = client.request(url, options, (res) => {
      const headers = {}
      Object.keys(res.headers).forEach(key => {
        headers[key.toLowerCase()] = res.headers[key]
      })
      
      resolve({
        statusCode: res.statusCode,
        headers: headers
      })
    })

    req.on('error', reject)
    req.on('timeout', () => reject(new Error('Request timeout')))
    req.setTimeout(5000)
    req.end()
  })
}

async function validateSecurityHeaders() {
  const urls = [
    'http://localhost:3000',
    'http://localhost:3001'
  ]

  let totalScore = 0
  let maxScore = 0
  const results = []

  for (const url of urls) {
    console.log(`\n🌐 Verificando: ${url}`)
    console.log('='.repeat(50))

    try {
      const response = await checkHeaders(url)
      
      if (response.statusCode !== 200) {
        console.log(`⚠️  Status Code: ${response.statusCode}`)
      }

      let urlScore = 0
      let urlMaxScore = 0

      Object.entries(requiredHeaders).forEach(([headerName, expectedValue]) => {
        urlMaxScore += 10
        const actualValue = response.headers[headerName]
        
        if (!actualValue) {
          console.log(`❌ ${headerName}: Ausente`)
          console.log(`   💡 ${recommendations[headerName]}`)
        } else if (Array.isArray(expectedValue)) {
          if (expectedValue.some(val => actualValue.includes(val))) {
            console.log(`✅ ${headerName}: ${actualValue}`)
            urlScore += 10
          } else {
            console.log(`⚠️  ${headerName}: ${actualValue} (esperado: ${expectedValue.join(' ou ')})`)
            urlScore += 5
          }
        } else if (expectedValue === null) {
          console.log(`✅ ${headerName}: ${actualValue}`)
          urlScore += 10
        } else if (actualValue.includes(expectedValue)) {
          console.log(`✅ ${headerName}: ${actualValue}`)
          urlScore += 10
        } else {
          console.log(`⚠️  ${headerName}: ${actualValue} (esperado: ${expectedValue})`)
          urlScore += 5
        }
      })

      // Verificações adicionais
      if (response.headers['server']) {
        console.log(`⚠️  Server: ${response.headers['server']} (pode expor informações)`)
      }

      if (response.headers['x-powered-by']) {
        console.log(`⚠️  X-Powered-By: ${response.headers['x-powered-by']} (deve ser removido)`)
      } else {
        console.log(`✅ X-Powered-By: Ausente (bom!)`)
        urlScore += 5
        urlMaxScore += 5
      }

      const percentage = Math.round((urlScore / urlMaxScore) * 100)
      console.log(`\n📊 Pontuação: ${urlScore}/${urlMaxScore} (${percentage}%)`)

      results.push({
        url,
        score: urlScore,
        maxScore: urlMaxScore,
        percentage,
        status: response.statusCode
      })

      totalScore += urlScore
      maxScore += urlMaxScore

    } catch (error) {
      console.log(`❌ Erro ao verificar ${url}: ${error.message}`)
      results.push({
        url,
        score: 0,
        maxScore: Object.keys(requiredHeaders).length * 10 + 5,
        percentage: 0,
        error: error.message
      })
      maxScore += Object.keys(requiredHeaders).length * 10 + 5
    }
  }

  // Relatório Final
  console.log('\n📋 Relatório de Headers de Segurança:')
  console.log('='.repeat(50))

  const finalPercentage = Math.round((totalScore / maxScore) * 100)
  console.log(`Pontuação Geral: ${totalScore}/${maxScore} (${finalPercentage}%)`)

  results.forEach(result => {
    const status = result.error ? '❌' : 
                  result.percentage >= 80 ? '✅' : 
                  result.percentage >= 60 ? '⚠️' : '❌'
    console.log(`${status} ${result.url}: ${result.percentage}%`)
    if (result.error) {
      console.log(`   Erro: ${result.error}`)
    }
  })

  console.log('\n💡 Recomendações:')
  if (finalPercentage < 70) {
    console.log('- Configure um proxy reverso (nginx/Apache) para adicionar headers')
    console.log('- Use middleware de segurança (helmet.js para Node.js)')
    console.log('- Configure CSP específico para sua aplicação')
  }
  
  if (finalPercentage < 90) {
    console.log('- Remova headers que expõem informações do servidor')
    console.log('- Implemente HSTS com max-age adequado')
    console.log('- Configure CSP modo strict')
  }

  if (finalPercentage >= 90) {
    console.log('- Excelente! Headers de segurança bem configurados')
    console.log('- Considere implementar CSP Report-Only para testes')
  }

  console.log('\n🚀 Para aplicar em produção:')
  console.log('1. Configure servidor web (nginx/Apache)')
  console.log('2. Use middleware de segurança')
  console.log('3. Teste regularmente')

  return finalPercentage >= 70
}

// Executar verificação
validateSecurityHeaders()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Erro na verificação:', error)
    process.exit(1)
  })
