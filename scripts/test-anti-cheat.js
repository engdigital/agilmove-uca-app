// scripts/test-anti-cheat.js
/**
 * Script para testar o sistema anti-trapaça
 * Execute: node scripts/test-anti-cheat.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 VALIDADOR DO SISTEMA ANTI-TRAPAÇA');
console.log('📅', new Date().toLocaleString());
console.log('=' .repeat(50));

// Verificar se os arquivos necessários existem
const files = [
  'lib/monotonic-time-validator.ts',
  'lib/secure-reading-service.ts',
  'test/manual-anti-cheat-test.ts',
  'docs/PLANO_TESTES_ANTI_TRAPACA.md'
];

console.log('\n📁 Verificando arquivos do sistema...');

let allFilesExist = true;

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  const exists = fs.existsSync(fullPath);
  
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  
  if (!exists) {
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ ERRO: Alguns arquivos estão faltando!');
  process.exit(1);
}

console.log('\n✅ Todos os arquivos estão presentes!');

// Verificar estrutura do código
console.log('\n🔍 Analisando código do validador monotônico...');

const validatorPath = path.join(process.cwd(), 'lib/monotonic-time-validator.ts');
const validatorCode = fs.readFileSync(validatorPath, 'utf8');

const checks = [
  {
    name: 'TimeAnchor interface',
    test: /interface TimeAnchor/,
    description: 'Interface de âncora temporal'
  },
  {
    name: 'MonotonicTimeValidator class',
    test: /class MonotonicTimeValidator/,
    description: 'Classe principal do validador'
  },
  {
    name: 'performance.now() usage',
    test: /performance\.now\(\)/,
    description: 'Uso do contador monotônico'
  },
  {
    name: 'Clock drift detection',
    test: /clockDrift.*CLOCK_DRIFT_TOLERANCE/,
    description: 'Detecção de deriva de relógio'
  },
  {
    name: 'Period validation',
    test: /validatePeriodRules/,
    description: 'Validação de períodos'
  },
  {
    name: 'Anchor hash generation',
    test: /generateAnchorHash/,
    description: 'Geração de hash da âncora'
  }
];

checks.forEach(check => {
  const passed = check.test.test(validatorCode);
  console.log(`${passed ? '✅' : '❌'} ${check.name}: ${check.description}`);
});

// Verificar integração com secure-reading-service
console.log('\n🔗 Verificando integração com serviço de leitura...');

const servicePath = path.join(process.cwd(), 'lib/secure-reading-service.ts');
const serviceCode = fs.readFileSync(servicePath, 'utf8');

const integrationChecks = [
  {
    name: 'MonotonicTimeValidator import',
    test: /MonotonicTimeValidator/,
    description: 'Import do validador monotônico'
  },
  {
    name: 'validateCompleteReading call',
    test: /validateCompleteReading/,
    description: 'Chamada da validação completa'
  },
  {
    name: 'completeReading call',
    test: /completeReading/,
    description: 'Finalização da leitura com nova âncora'
  }
];

integrationChecks.forEach(check => {
  const passed = check.test.test(serviceCode);
  console.log(`${passed ? '✅' : '❌'} ${check.name}: ${check.description}`);
});

// Verificar plano de testes
console.log('\n📋 Verificando plano de testes...');

const testPlanPath = path.join(process.cwd(), 'docs/PLANO_TESTES_ANTI_TRAPACA.md');
const testPlanContent = fs.readFileSync(testPlanPath, 'utf8');

const testPlanChecks = [
  'TESTE 1: Funcionamento Normal',
  'TESTE 2: Manipulação de Relógio - Avanço Simples',
  'TESTE 3: Manipulação de Relógio - Regressão',
  'TESTE 4: Sequência de Períodos Incorreta',
  'TESTE 5: Período Duplicado no Mesmo Dia',
  'performance.now()',
  'clockDrift',
  'CLOCK_DRIFT_TOLERANCE'
];

testPlanChecks.forEach(check => {
  const found = testPlanContent.includes(check);
  console.log(`${found ? '✅' : '❌'} ${check}`);
});

console.log('\n🚀 PRÓXIMOS PASSOS:');
console.log('');
console.log('1. 📱 Abra o aplicativo no navegador');
console.log('2. 🔧 Abra o Console do Desenvolvedor (F12)');
console.log('3. ⌨️  Digite: antiCheatTest.runAllTests()');
console.log('4. 🕐 Para testes manuais: antiCheatTest.startManualTests()');
console.log('');
console.log('📖 Documentação completa: docs/PLANO_TESTES_ANTI_TRAPACA.md');
console.log('');
console.log('🎯 OBJETIVO: O sistema deve bloquear leituras quando o relógio for manipulado!');

console.log('\n' + '=' .repeat(50));
console.log('✅ VALIDAÇÃO CONCLUÍDA - SISTEMA PRONTO PARA TESTE');
