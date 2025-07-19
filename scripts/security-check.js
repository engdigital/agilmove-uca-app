const fs = require('fs');
const path = require('path');

console.log('🔍 Verificação de Segurança - AgilMove UCA\n');

// Verificar arquivos críticos de segurança
const securityChecks = [
  {
    name: 'Content Security Policy',
    check: () => {
      const nextConfig = path.join(__dirname, '..', 'next.config.mjs');
      if (fs.existsSync(nextConfig)) {
        const content = fs.readFileSync(nextConfig, 'utf8');
        return content.includes('Content-Security-Policy');
      }
      return false;
    }
  },
  {
    name: 'SecurityProvider Component',
    check: () => {
      const securityProvider = path.join(__dirname, '..', 'components', 'security-provider.tsx');
      return fs.existsSync(securityProvider);
    }
  },
  {
    name: 'ErrorBoundary Component',
    check: () => {
      const errorBoundary = path.join(__dirname, '..', 'components', 'error-boundary.tsx');
      return fs.existsSync(errorBoundary);
    }
  },
  {
    name: 'Service Worker',
    check: () => {
      const serviceWorker = path.join(__dirname, '..', 'public', 'service-worker.js');
      return fs.existsSync(serviceWorker);
    }
  },
  {
    name: 'Manifest PWA',
    check: () => {
      const manifest = path.join(__dirname, '..', 'public', 'manifest.json');
      return fs.existsSync(manifest);
    }
  },
  {
    name: 'Página Offline',
    check: () => {
      const offline = path.join(__dirname, '..', 'public', 'offline.html');
      return fs.existsSync(offline);
    }
  },
  {
    name: 'Privacy Policy',
    check: () => {
      const privacy = path.join(__dirname, '..', 'app', 'privacy-policy', 'page.tsx');
      return fs.existsSync(privacy);
    }
  }
];

// Verificar dependências de segurança no package.json
const checkDependencies = () => {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const securityDeps = [
    '@radix-ui/react-alert-dialog',
    'lucide-react'
  ];
  
  const missingDeps = securityDeps.filter(dep => 
    !packageJson.dependencies[dep] && !packageJson.devDependencies?.[dep]
  );
  
  return {
    total: securityDeps.length,
    installed: securityDeps.length - missingDeps.length,
    missing: missingDeps
  };
};

// Executar verificações
console.log('📋 Verificações de Segurança:');
console.log('=' .repeat(50));

let totalChecks = 0;
let passedChecks = 0;

securityChecks.forEach(check => {
  totalChecks++;
  const result = check.check();
  const status = result ? '✅' : '❌';
  
  console.log(`${status} ${check.name}`);
  
  if (result) {
    passedChecks++;
  }
});

// Verificar dependências
console.log('\n📦 Dependências de Segurança:');
console.log('=' .repeat(50));

const deps = checkDependencies();
console.log(`✅ Instaladas: ${deps.installed}/${deps.total}`);

if (deps.missing.length > 0) {
  console.log('❌ Faltando:');
  deps.missing.forEach(dep => console.log(`   - ${dep}`));
}

// Pontuação final
console.log('\n📊 Resultado Final:');
console.log('=' .repeat(50));

const score = Math.round(((passedChecks / totalChecks) * 100));
let scoreColor = '';
let scoreText = '';

if (score >= 80) {
  scoreColor = '🟢';
  scoreText = 'Excelente';
} else if (score >= 60) {
  scoreColor = '🟡';
  scoreText = 'Bom';
} else {
  scoreColor = '🔴';
  scoreText = 'Crítico';
}

console.log(`${scoreColor} Pontuação: ${score}% (${scoreText})`);
console.log(`   Aprovado: ${passedChecks}/${totalChecks} verificações`);

// Recomendações
if (score < 100) {
  console.log('\n💡 Recomendações:');
  console.log('=' .repeat(50));
  
  securityChecks.forEach(check => {
    if (!check.check()) {
      console.log(`   - Implementar: ${check.name}`);
    }
  });
  
  if (deps.missing.length > 0) {
    console.log(`   - Instalar dependências: ${deps.missing.join(', ')}`);
  }
}

// Salvar relatório
const report = {
  timestamp: new Date().toISOString(),
  score,
  scoreText,
  total: totalChecks,
  passed: passedChecks,
  checks: securityChecks.map(check => ({
    name: check.name,
    status: check.check() ? 'pass' : 'fail'
  })),
  dependencies: deps
};

const reportPath = path.join(__dirname, '..', 'security-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`\n📄 Relatório salvo em: security-report.json`);
console.log('\n🚀 Para melhorar a segurança, execute:');
console.log('   npm run security:full');

process.exit(score >= 80 ? 0 : 1);
