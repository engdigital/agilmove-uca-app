const fs = require('fs');
const path = require('path');

console.log('🌐 Verificação de Headers de Segurança\n');

// Verificar configuração de headers no next.config.mjs
const checkNextConfigHeaders = () => {
  const nextConfigPath = path.join(__dirname, '..', 'next.config.mjs');
  
  if (!fs.existsSync(nextConfigPath)) {
    return { configured: false, headers: [] };
  }
  
  const content = fs.readFileSync(nextConfigPath, 'utf8');
  
  const requiredHeaders = [
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'X-Frame-Options', 
    'X-XSS-Protection',
    'Strict-Transport-Security',
    'Referrer-Policy',
    'Permissions-Policy'
  ];
  
  const configuredHeaders = requiredHeaders.filter(header => 
    content.includes(header)
  );
  
  return {
    configured: content.includes('async headers()'),
    headers: configuredHeaders,
    total: requiredHeaders.length,
    missing: requiredHeaders.filter(h => !configuredHeaders.includes(h))
  };
};

// Verificar se o middleware está configurado
const checkMiddleware = () => {
  const middlewarePath = path.join(__dirname, '..', 'middleware.ts');
  
  if (!fs.existsSync(middlewarePath)) {
    return { exists: false };
  }
  
  const content = fs.readFileSync(middlewarePath, 'utf8');
  
  return {
    exists: true,
    hasSecurityHeaders: content.includes('security') || content.includes('headers'),
    isEmpty: content.includes('NextResponse.next()') && content.split('\n').length < 10
  };
};

// Executar verificações
console.log('📋 Configuração de Headers:');
console.log('=' .repeat(50));

const headerConfig = checkNextConfigHeaders();

if (headerConfig.configured) {
  console.log('✅ Headers configurados no next.config.mjs');
  console.log(`   ${headerConfig.headers.length}/${headerConfig.total} headers implementados`);
  
  headerConfig.headers.forEach(header => {
    console.log(`   ✅ ${header}`);
  });
  
  if (headerConfig.missing.length > 0) {
    console.log('\n   ❌ Headers faltando:');
    headerConfig.missing.forEach(header => {
      console.log(`      - ${header}`);
    });
  }
} else {
  console.log('❌ Headers não configurados no next.config.mjs');
}

console.log('\n📋 Middleware:');
console.log('=' .repeat(50));

const middleware = checkMiddleware();

if (middleware.exists) {
  console.log('✅ Arquivo middleware.ts existe');
  
  if (middleware.isEmpty) {
    console.log('⚠️  Middleware está vazio (adequado para PWA)');
  } else if (middleware.hasSecurityHeaders) {
    console.log('✅ Middleware contém configurações de segurança');
  } else {
    console.log('ℹ️  Middleware sem configurações de segurança específicas');
  }
} else {
  console.log('❌ Arquivo middleware.ts não encontrado');
}

// Calcular pontuação
const score = (() => {
  let points = 0;
  const maxPoints = 100;
  
  // Headers configuration (70 points)
  if (headerConfig.configured) {
    points += 30; // Base for having headers() function
    points += (headerConfig.headers.length / headerConfig.total) * 40; // Proportional for each header
  }
  
  // Middleware (30 points)
  if (middleware.exists) {
    points += 15; // Base for having middleware
    if (!middleware.isEmpty || middleware.hasSecurityHeaders) {
      points += 15; // Additional for non-empty or security-focused middleware
    }
  }
  
  return Math.round(points);
})();

console.log('\n📊 Pontuação de Headers:');
console.log('=' .repeat(50));

const scoreColor = score >= 80 ? '🟢' : score >= 60 ? '🟡' : '🔴';
const scoreText = score >= 80 ? 'Excelente' : score >= 60 ? 'Bom' : 'Necessita Melhorias';

console.log(`${scoreColor} Pontuação: ${score}% (${scoreText})`);

// Recomendações
if (score < 100) {
  console.log('\n💡 Recomendações:');
  console.log('=' .repeat(50));
  
  if (!headerConfig.configured) {
    console.log('   - Adicionar função headers() no next.config.mjs');
  }
  
  if (headerConfig.missing.length > 0) {
    console.log('   - Implementar headers faltando:');
    headerConfig.missing.forEach(header => {
      console.log(`     * ${header}`);
    });
  }
  
  if (!middleware.exists) {
    console.log('   - Criar arquivo middleware.ts');
  }
}

console.log('\n📄 Headers Recomendados para PWA:');
console.log('=' .repeat(50));
console.log('   ✅ Content-Security-Policy (Previne XSS)');
console.log('   ✅ X-Frame-Options (Previne clickjacking)');
console.log('   ✅ X-Content-Type-Options (Previne MIME sniffing)');
console.log('   ✅ Strict-Transport-Security (Force HTTPS)');
console.log('   ✅ Referrer-Policy (Controla referrer)');
console.log('   ✅ Permissions-Policy (Controla APIs do navegador)');

// Salvar relatório de headers
const headerReport = {
  timestamp: new Date().toISOString(),
  score,
  scoreText,
  configuration: headerConfig,
  middleware,
  recommendations: headerConfig.missing
};

const reportPath = path.join(__dirname, '..', 'headers-report.json');
fs.writeFileSync(reportPath, JSON.stringify(headerReport, null, 2));

console.log(`\n📄 Relatório salvo em: headers-report.json`);

process.exit(score >= 80 ? 0 : 1);
