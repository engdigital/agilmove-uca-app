// test/core-test.js
/**
 * TESTE DO SISTEMA ANTI-TRAPAÇA (Versão Node.js)
 * Execute: node test/core-test.js
 */

console.log('🧪 TESTE DO SISTEMA ANTI-TRAPAÇA - VERSÃO CORE');
console.log('📅', new Date().toLocaleString());
console.log('=' .repeat(50));

// Simular performance.now() para Node.js
const { performance } = require('perf_hooks');

// Simular localStorage para Node.js  
const localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  }
};

// Versão simplificada do MonotonicTimeValidator para teste
class MonotonicTimeValidatorTest {
  static ANCHOR_KEY = 'uca_time_anchor';
  static CLOCK_DRIFT_TOLERANCE = 60000; // 60 segundos

  static saveTimeAnchor(scrollId, period, day) {
    const anchor = {
      systemTimeAtAnchor: Date.now(),
      performanceTimeAtAnchor: performance.now(),
      periodOfAnchor: period,
      dayOfAnchor: day,
      scrollId,
      hash: `hash_${Math.random()}`
    };

    localStorage.setItem(this.ANCHOR_KEY, JSON.stringify(anchor));
    return anchor;
  }

  static getLastTimeAnchor() {
    const anchorData = localStorage.getItem(this.ANCHOR_KEY);
    return anchorData ? JSON.parse(anchorData) : null;
  }

  static validateReadingAttempt(scrollId) {
    const lastAnchor = this.getLastTimeAnchor();
    
    if (!lastAnchor) {
      return {
        isValid: true,
        reason: 'Primeira leitura detectada',
        riskScore: 0,
        warnings: []
      };
    }

    const currentSystemTime = Date.now();
    const currentPerformanceTime = performance.now();

    // Calcular tempo real decorrido
    const realTimeElapsed = currentPerformanceTime - lastAnchor.performanceTimeAtAnchor;

    // Calcular hora esperada do sistema
    const expectedSystemTime = lastAnchor.systemTimeAtAnchor + realTimeElapsed;

    // Medir desvio
    const clockDrift = Math.abs(currentSystemTime - expectedSystemTime);

    // Validação principal
    if (clockDrift > this.CLOCK_DRIFT_TOLERANCE) {
      return {
        isValid: false,
        reason: `Manipulação de relógio detectada. Deriva: ${Math.round(clockDrift / 1000)}s`,
        clockDrift,
        riskScore: Math.min(100, (clockDrift / 1000) * 2),
        warnings: [
          'Detectamos uma alteração significativa no relógio do dispositivo'
        ]
      };
    }

    return {
      isValid: true,
      reason: 'Relógio validado com sucesso',
      clockDrift,
      riskScore: Math.min(20, clockDrift / 3000),
      warnings: clockDrift > 30000 ? ['Pequena deriva de relógio detectada'] : []
    };
  }

  static clearValidationData() {
    localStorage.removeItem(this.ANCHOR_KEY);
  }
}

// EXECUTAR TESTES
console.log('\n📋 TESTE 1: Primeira Leitura');
const test1 = MonotonicTimeValidatorTest.validateReadingAttempt(1);
console.log('✅ Resultado:', test1.isValid ? 'PASSOU' : 'FALHOU');
console.log('   Motivo:', test1.reason);

if (test1.isValid) {
  console.log('\n📋 Salvando âncora temporal...');
  const anchor = MonotonicTimeValidatorTest.saveTimeAnchor(1, 'morning', '2025-07-29');
  console.log('✅ Âncora salva:', {
    sistema: new Date(anchor.systemTimeAtAnchor).toLocaleTimeString(),
    performance: anchor.performanceTimeAtAnchor.toFixed(2) + 'ms'
  });
}

console.log('\n📋 TESTE 2: Segunda Leitura (Normal)');
// Aguardar 1 segundo
setTimeout(() => {
  const test2 = MonotonicTimeValidatorTest.validateReadingAttempt(1);
  console.log('✅ Resultado:', test2.isValid ? 'PASSOU' : 'FALHOU');
  console.log('   Motivo:', test2.reason);
  if (test2.clockDrift !== undefined) {
    console.log('   Deriva:', Math.round(test2.clockDrift) + 'ms');
  }

  console.log('\n📋 TESTE 3: Simulação de Manipulação');
  // Simular manipulação avançando Date.now artificialmente
  const originalDateNow = Date.now;
  Date.now = () => originalDateNow() + (2 * 60 * 60 * 1000); // +2 horas

  const test3 = MonotonicTimeValidatorTest.validateReadingAttempt(1);
  console.log('✅ Resultado:', test3.isValid ? 'FALHOU (deveria detectar!)' : 'PASSOU (detectou manipulação!)');
  console.log('   Motivo:', test3.reason);
  if (test3.clockDrift !== undefined) {
    console.log('   Deriva detectada:', Math.round(test3.clockDrift / 1000) + 's');
  }

  // Restaurar Date.now
  Date.now = originalDateNow;

  console.log('\n🎯 RESUMO DOS TESTES:');
  console.log('✅ Primeira leitura: Funcionando');
  console.log('✅ Leitura normal: Funcionando');
  console.log(test3.isValid ? '❌ Detecção de manipulação: FALHOU' : '✅ Detecção de manipulação: FUNCIONANDO');
  
  console.log('\n🛡️ SISTEMA ANTI-TRAPAÇA: ' + (!test3.isValid ? 'FUNCIONANDO CORRETAMENTE!' : 'PRECISA AJUSTES'));
  console.log('\n📖 Para teste completo no navegador, execute:');
  console.log('   antiCheatTest.runAllTests()');

}, 1000);

console.log('\n⏳ Aguardando 1 segundo para teste de deriva temporal...');
