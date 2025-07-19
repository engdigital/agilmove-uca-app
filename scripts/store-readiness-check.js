#!/usr/bin/env node

/**
 * Script de Verificação de Prontidão para App Stores - AgilMove UCA
 * Verifica todos os requisitos para submissão às stores
 */

const fs = require('fs');
const path = require('path');

console.log('🏪 Verificação de Prontidão para App Stores - AgilMove UCA\n');

// Verificações específicas para stores
const storeRequirements = [
  {
    name: 'Manifest.json completo',
    category: 'PWA',
    check: () => {
      const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json');
      if (!fs.existsSync(manifestPath)) return { status: false, message: 'Arquivo não encontrado' };
      
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const required = ['name', 'short_name', 'description', 'start_url', 'display', 'icons', 'theme_color', 'background_color'];
      const missing = required.filter(field => !manifest[field]);
      
      return {
        status: missing.length === 0,
        message: missing.length > 0 ? `Campos faltando: ${missing.join(', ')}` : 'Completo'
      };
    }
  },
  {
    name: 'Ícones em todas as resoluções',
    category: 'Assets',
    check: () => {
      const requiredSizes = ['72x72', '96x96', '128x128', '144x144', '152x152', '192x192', '384x384', '512x512'];
      const missing = [];
      
      requiredSizes.forEach(size => {
        const iconPath = path.join(__dirname, '..', 'public', `icon-${size}.png`);
        if (!fs.existsSync(iconPath)) {
          missing.push(size);
        }
      });
      
      return {
        status: missing.length === 0,
        message: missing.length > 0 ? `Ícones faltando: ${missing.join(', ')}` : 'Todos os ícones presentes'
      };
    }
  },
  {
    name: 'Service Worker ativo',
    category: 'PWA',
    check: () => {
      const swPath = path.join(__dirname, '..', 'public', 'service-worker.js');
      if (!fs.existsSync(swPath)) return { status: false, message: 'Service Worker não encontrado' };
      
      const content = fs.readFileSync(swPath, 'utf8');
      const hasCache = content.includes('CACHE_NAME');
      const hasInstall = content.includes("addEventListener('install'");
      const hasFetch = content.includes("addEventListener('fetch'");
      
      return {
        status: hasCache && hasInstall && hasFetch,
        message: 'Service Worker configurado corretamente'
      };
    }
  },
  {
    name: 'Página offline funcional',
    category: 'UX',
    check: () => {
      const offlinePath = path.join(__dirname, '..', 'public', 'offline.html');
      if (!fs.existsSync(offlinePath)) return { status: false, message: 'Página offline não encontrada' };
      
      const content = fs.readFileSync(offlinePath, 'utf8');
      const hasTitle = content.includes('<title>');
      const hasStyle = content.includes('<style>');
      const hasScript = content.includes('<script>');
      
      return {
        status: hasTitle && hasStyle && hasScript,
        message: 'Página offline completa'
      };
    }
  },
  {
    name: 'Headers de segurança configurados',
    category: 'Segurança',
    check: () => {
      const nextConfigPath = path.join(__dirname, '..', 'next.config.mjs');
      if (!fs.existsSync(nextConfigPath)) return { status: false, message: 'next.config.mjs não encontrado' };
      
      const content = fs.readFileSync(nextConfigPath, 'utf8');
      const requiredHeaders = [
        'Content-Security-Policy',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Strict-Transport-Security',
        'Referrer-Policy'
      ];
      
      const configured = requiredHeaders.filter(header => content.includes(header));
      
      return {
        status: configured.length === requiredHeaders.length,
        message: `${configured.length}/${requiredHeaders.length} headers configurados`
      };
    }
  },
  {
    name: 'Política de privacidade',
    category: 'Legal',
    check: () => {
      const privacyPath = path.join(__dirname, '..', 'app', 'privacy-policy', 'page.tsx');
      if (!fs.existsSync(privacyPath)) return { status: false, message: 'Página de privacidade não encontrada' };
      
      const content = fs.readFileSync(privacyPath, 'utf8');
      const hasContent = content.length > 1000; // Assume que deve ter pelo menos 1KB de conteúdo
      
      return {
        status: hasContent,
        message: hasContent ? 'Política de privacidade completa' : 'Política muito curta'
      };
    }
  },
  {
    name: 'Meta tags para mobile',
    category: 'Mobile',
    check: () => {
      const layoutPath = path.join(__dirname, '..', 'app', 'layout.tsx');
      if (!fs.existsSync(layoutPath)) return { status: false, message: 'layout.tsx não encontrado' };
      
      const content = fs.readFileSync(layoutPath, 'utf8');
      const requiredMetas = [
        'viewport',
        'mobile-web-app-capable',
        'apple-mobile-web-app-capable',
        'theme-color'
      ];
      
      const configured = requiredMetas.filter(meta => content.includes(meta));
      
      return {
        status: configured.length === requiredMetas.length,
        message: `${configured.length}/${requiredMetas.length} meta tags configuradas`
      };
    }
  },
  {
    name: 'Screenshots para stores',
    category: 'Assets',
    check: () => {
      const screenshotsDir = path.join(__dirname, '..', 'public', 'images');
      if (!fs.existsSync(screenshotsDir)) return { status: false, message: 'Diretório de imagens não encontrado' };
      
      const files = fs.readdirSync(screenshotsDir);
      const screenshots = files.filter(file => file.includes('screenshot') || file.includes('screen'));
      
      return {
        status: screenshots.length >= 2,
        message: `${screenshots.length} screenshots encontradas (mínimo: 2)`
      };
    }
  },
  {
    name: 'Configuração de build para PWA',
    category: 'Build',
    check: () => {
      const packagePath = path.join(__dirname, '..', 'package.json');
      if (!fs.existsSync(packagePath)) return { status: false, message: 'package.json não encontrado' };
      
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const scripts = packageJson.scripts || {};
      
      const hasBuild = scripts.build;
      const hasStart = scripts.start;
      
      return {
        status: hasBuild && hasStart,
        message: 'Scripts de build configurados'
      };
    }
  }
];

// Executar verificações
let totalScore = 0;
let maxScore = storeRequirements.length * 10;
const categories = {};

console.log('📋 Verificações de Prontidão para Stores:');
console.log('=' .repeat(60));

storeRequirements.forEach(requirement => {
  const result = requirement.check();
  const status = result.status ? '✅' : '❌';
  const points = result.status ? 10 : 0;
  
  if (!categories[requirement.category]) {
    categories[requirement.category] = { total: 0, passed: 0, items: [] };
  }
  
  categories[requirement.category].total += 10;
  categories[requirement.category].passed += points;
  categories[requirement.category].items.push({
    name: requirement.name,
    status: result.status,
    message: result.message
  });
  
  totalScore += points;
  
  console.log(`${status} ${requirement.name}`);
  console.log(`   ${result.message}`);
  console.log('');
});

// Relatório por categoria
console.log('📊 Relatório por Categoria:');
console.log('=' .repeat(60));

Object.entries(categories).forEach(([category, data]) => {
  const percentage = Math.round((data.passed / data.total) * 100);
  const emoji = percentage >= 80 ? '🟢' : percentage >= 60 ? '🟡' : '🔴';
  
  console.log(`${emoji} ${category}: ${percentage}% (${data.passed}/${data.total})`);
  
  data.items.forEach(item => {
    const itemStatus = item.status ? '  ✅' : '  ❌';
    console.log(`${itemStatus} ${item.name}`);
  });
  console.log('');
});

// Pontuação final
const finalScore = Math.round((totalScore / maxScore) * 100);
const scoreEmoji = finalScore >= 80 ? '🟢' : finalScore >= 60 ? '🟡' : '🔴';
const scoreText = finalScore >= 80 ? 'Pronto para Stores' : finalScore >= 60 ? 'Quase Pronto' : 'Necessita Melhorias';

console.log('🎯 Pontuação Final:');
console.log('=' .repeat(60));
console.log(`${scoreEmoji} ${finalScore}% - ${scoreText}`);

// Recomendações
if (finalScore < 100) {
  console.log('\n💡 Próximos Passos:');
  console.log('=' .repeat(60));
  
  Object.entries(categories).forEach(([category, data]) => {
    const failedItems = data.items.filter(item => !item.status);
    if (failedItems.length > 0) {
      console.log(`\n${category}:`);
      failedItems.forEach(item => {
        console.log(`   - ${item.name}: ${item.message}`);
      });
    }
  });
}

// Comandos recomendados
console.log('\n🚀 Comandos para Preparação:');
console.log('=' .repeat(60));
console.log('npm run build              # Testar build de produção');
console.log('npm run start              # Testar em modo produção');
console.log('npm run security:check     # Verificar segurança');
console.log('npx lighthouse http://localhost:3000 --view # Audit PWA');

// Salvar relatório
const report = {
  timestamp: new Date().toISOString(),
  finalScore,
  scoreText,
  categories,
  requirements: storeRequirements.map(req => ({
    name: req.name,
    category: req.category,
    result: req.check()
  }))
};

const reportPath = path.join(__dirname, '..', 'store-readiness-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`\n📄 Relatório salvo em: store-readiness-report.json`);

// Exit code baseado na pontuação
process.exit(finalScore >= 80 ? 0 : 1);
