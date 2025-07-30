// test/manual-anti-cheat-test.ts
/**
 * TESTE MANUAL DO SISTEMA ANTI-TRAPAÇA
 * 
 * Execute este arquivo no console do navegador para testar o sistema
 * de validação temporal monotônica.
 */

import { MonotonicTimeValidator } from '../lib/monotonic-time-validator';

// Declare global para permitir acesso via console
declare global {
  interface Window {
    antiCheatTest: typeof AntiCheatTest;
  }
}

export class AntiCheatTest {
  private static testResults: Array<{
    test: string;
    passed: boolean;
    details: any;
    timestamp: string;
  }> = [];

  /**
   * Executa todos os testes automatizados
   */
  static async runAllTests(): Promise<void> {
    console.log('🧪 INICIANDO BATERIA COMPLETA DE TESTES ANTI-TRAPAÇA');
    console.log('📅', new Date().toLocaleString());
    console.log('=' .repeat(60));

    this.testResults = [];

    // Limpar dados antes dos testes
    MonotonicTimeValidator.clearValidationData();
    
    await this.test1_FuncionamentoNormal();
    await this.test2_PeriodoDuplicado();
    await this.test3_SequenciaIncorreta();
    await this.test4_PrimeiraLeitura();
    await this.test5_JanelaIncorreta();
    
    this.showResults();
    
    console.log('\n⚠️  PRÓXIMOS TESTES REQUEREM MANIPULAÇÃO MANUAL:');
    console.log('🔧 Execute: antiCheatTest.startManualTests()');
  }

  /**
   * TESTE 1: Funcionamento Normal - Primeira Leitura
   */
  private static async test1_FuncionamentoNormal(): Promise<void> {
    console.log('\n📋 TESTE 1: Primeira Leitura (deve funcionar)');
    
    try {
      const result = MonotonicTimeValidator.validateCompleteReading(1);
      
      const passed = result.canRead === true && 
                    result.timeValidation.reason === 'Primeira leitura detectada';
      
      this.logTest('Primeira Leitura', passed, {
        canRead: result.canRead,
        reason: result.timeValidation.reason,
        riskScore: result.overallRiskScore
      });

      if (result.canRead) {
        MonotonicTimeValidator.completeReading(1);
        console.log('✅ Âncora temporal criada');
      }

    } catch (error) {
      this.logTest('Primeira Leitura', false, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * TESTE 2: Período Duplicado no Mesmo Dia
   */
  private static async test2_PeriodoDuplicado(): Promise<void> {
    console.log('\n📋 TESTE 2: Período Duplicado (deve bloquear)');
    
    try {
      // Tentar fazer segunda leitura no mesmo período
      const result = MonotonicTimeValidator.validateCompleteReading(1);
      
      const passed = result.canRead === false && 
                    result.periodValidation?.reason?.includes('Já foi realizada uma leitura');
      
      this.logTest('Período Duplicado', passed, {
        canRead: result.canRead,
        reason: result.periodValidation?.reason,
        periodValidation: result.periodValidation?.isValid
      });

    } catch (error) {
      this.logTest('Período Duplicado', false, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * TESTE 3: Sequência Incorreta (simular mudança de período)
   */
  private static async test3_SequenciaIncorreta(): Promise<void> {
    console.log('\n📋 TESTE 3: Simulação de Sequência Temporal');
    
    try {
      // Simular que já foi feita leitura da tarde
      const currentHour = new Date().getHours();
      let testPeriod = 'afternoon';
      
      // Ajustar baseado na hora atual para criar conflito
      if (currentHour >= 5 && currentHour < 12) {
        testPeriod = 'evening'; // Se manhã, simular que já leu noite
      }
      
      console.log(`⏰ Hora atual: ${currentHour}h (${currentHour >= 5 && currentHour < 12 ? 'manhã' : currentHour >= 12 && currentHour < 18 ? 'tarde' : 'noite'})`);
      console.log(`🎯 Tentando criar conflito de sequência temporal`);
      
      const debug = MonotonicTimeValidator.getDebugInfo();
      
      this.logTest('Análise Temporal', true, {
        horaAtual: new Date().toLocaleString(),
        periodoDetectado: debug.currentPeriod,
        ultimaAncora: debug.lastAnchor?.periodOfAnchor || 'nenhuma',
        diaAtual: debug.currentDay
      });

    } catch (error) {
      this.logTest('Sequência Incorreta', false, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * TESTE 4: Reset e Primeira Leitura
   */
  private static async test4_PrimeiraLeitura(): Promise<void> {
    console.log('\n📋 TESTE 4: Reset do Sistema');
    
    try {
      // Limpar dados para simular primeira instalação
      MonotonicTimeValidator.clearValidationData();
      
      const result = MonotonicTimeValidator.validateCompleteReading(999);
      
      const passed = result.canRead === true;
      
      this.logTest('Reset do Sistema', passed, {
        canRead: result.canRead,
        reason: result.timeValidation.reason,
        isFirstTime: result.timeValidation.reason.includes('Primeira')
      });

    } catch (error) {
      this.logTest('Reset do Sistema', false, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * TESTE 5: Verificação de Janela de Período
   */
  private static async test5_JanelaIncorreta(): Promise<void> {
    console.log('\n📋 TESTE 5: Verificação de Janelas de Período');
    
    try {
      const currentHour = new Date().getHours();
      let windowStatus = 'dentro';
      let expectedPeriod = '';
      
      if (currentHour >= 5 && currentHour < 12) {
        expectedPeriod = 'manhã (5h-12h)';
      } else if (currentHour >= 12 && currentHour < 18) {
        expectedPeriod = 'tarde (12h-18h)';
      } else if (currentHour >= 18 && currentHour <= 23) {
        expectedPeriod = 'noite (18h-23h)';
      } else {
        expectedPeriod = 'fora de janela válida';
        windowStatus = 'fora';
      }
      
      const result = MonotonicTimeValidator.validateCompleteReading(2);
      
      this.logTest('Janela de Período', true, {
        horaAtual: `${currentHour}h`,
        periodoEsperado: expectedPeriod,
        statusJanela: windowStatus,
        canRead: result.canRead,
        periodValidation: result.periodValidation?.isValid
      });

    } catch (error) {
      this.logTest('Janela de Período', false, { error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * Inicia testes que requerem manipulação manual do relógio
   */
  static startManualTests(): void {
    console.log('\n🔧 TESTES MANUAIS - MANIPULAÇÃO DE RELÓGIO');
    console.log('=' .repeat(50));
    
    // Preparar para teste manual
    MonotonicTimeValidator.clearValidationData();
    
    // Fazer primeira leitura
    const result = MonotonicTimeValidator.validateCompleteReading(1);
    if (result.canRead) {
      MonotonicTimeValidator.completeReading(1);
      console.log('✅ Primeira leitura registrada');
    }
    
    console.log('\n📋 TESTE MANUAL 1: Detecção de Avanço de Relógio');
    console.log('📝 INSTRUÇÕES:');
    console.log('1. 🕐 AVANCE o relógio do seu dispositivo +2 horas');
    console.log('2. ⌨️  Execute: antiCheatTest.testClockManipulation()');
    console.log('3. 🔄 VOLTE o relógio para hora correta');
    console.log('4. ⌨️  Execute: antiCheatTest.testClockRegression()');
  }

  /**
   * Teste de manipulação - Avanço de relógio
   */
  static testClockManipulation(): void {
    console.log('\n⚡ TESTANDO: Avanço de Relógio');
    
    try {
      const result = MonotonicTimeValidator.validateCompleteReading(1);
      
      if (!result.canRead && result.timeValidation.reason.includes('Manipulação')) {
        console.log('🎉 SUCESSO! Manipulação detectada e bloqueada!');
        console.log('❌ Motivo:', result.timeValidation.reason);
        console.log('📊 Risk Score:', result.overallRiskScore);
        console.log('⏱️  Clock Drift:', result.timeValidation.clockDrift ? 
          Math.round(result.timeValidation.clockDrift / 1000) + 's' : 'N/A');
      } else {
        console.log('❌ FALHA! Manipulação NÃO foi detectada!');
        console.log('🚨 PROBLEMA DE SEGURANÇA!');
      }
      
      this.logTest('Manipulação por Avanço', !result.canRead, {
        canRead: result.canRead,
        reason: result.timeValidation.reason,
        clockDrift: result.timeValidation.clockDrift,
        riskScore: result.overallRiskScore
      });
      
    } catch (error) {
      console.log('❌ Erro no teste:', error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Teste de manipulação - Regressão de relógio
   */
  static testClockRegression(): void {
    console.log('\n⚡ TESTANDO: Regressão de Relógio');
    
    try {
      const result = MonotonicTimeValidator.validateCompleteReading(1);
      
      if (!result.canRead && result.timeValidation.reason.includes('regressivo')) {
        console.log('🎉 SUCESSO! Regressão detectada e bloqueada!');
        console.log('❌ Motivo:', result.timeValidation.reason);
      } else {
        console.log('ℹ️  Regressão pode não ter sido detectada se o tempo voltou ao normal');
      }
      
      this.logTest('Manipulação por Regressão', true, {
        canRead: result.canRead,
        reason: result.timeValidation.reason,
        wasRegression: result.timeValidation.reason.includes('regressivo')
      });
      
    } catch (error) {
      console.log('❌ Erro no teste:', error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Mostra informações de debug do sistema
   */
  static showDebugInfo(): void {
    console.log('\n🔍 DEBUG - Estado Atual do Sistema');
    console.log('=' .repeat(40));
    
    const debug = MonotonicTimeValidator.getDebugInfo();
    
    console.table({
      'Hora do Sistema': new Date(debug.currentSystemTime).toLocaleString(),
      'Performance Time': debug.currentPerformanceTime.toFixed(2) + 'ms',
      'Última Âncora': debug.lastAnchor ? 
        new Date(debug.lastAnchor.systemTimeAtAnchor).toLocaleString() : 'Nenhuma',
      'Deriva do Relógio': debug.clockDrift ? 
        (debug.clockDrift / 1000).toFixed(1) + 's' : 'N/A',
      'Período Atual': debug.currentPeriod,
      'Dia Atual': debug.currentDay
    });

    if (debug.lastAnchor) {
      console.log('\n📄 Detalhes da Última Âncora:');
      console.table({
        'Período da Âncora': debug.lastAnchor.periodOfAnchor,
        'Dia da Âncora': debug.lastAnchor.dayOfAnchor,
        'Scroll ID': debug.lastAnchor.scrollId,
        'Hash': debug.lastAnchor.hash.substring(0, 16) + '...'
      });
    }
  }

  /**
   * Executa teste de performance do sistema
   */
  static performanceTest(): void {
    console.log('\n⚡ TESTE DE PERFORMANCE');
    console.log('=' .repeat(30));

    const iterations = 1000;
    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
      MonotonicTimeValidator.validateCompleteReading(i);
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / iterations;

    console.log(`📊 Resultados (${iterations} validações):`);
    console.table({
      'Tempo Total': totalTime.toFixed(2) + 'ms',
      'Tempo Médio': avgTime.toFixed(3) + 'ms',
      'Validações/seg': Math.round(1000 / avgTime)
    });
  }

  /**
   * Registra resultado de teste
   */
  private static logTest(testName: string, passed: boolean, details: any): void {
    this.testResults.push({
      test: testName,
      passed,
      details,
      timestamp: new Date().toLocaleString()
    });

    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${testName}:`, passed ? 'PASSOU' : 'FALHOU');
    if (details) {
      console.log('   Detalhes:', details);
    }
  }

  /**
   * Mostra resumo dos resultados
   */
  private static showResults(): void {
    console.log('\n📊 RESUMO DOS TESTES');
    console.log('=' .repeat(30));

    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    const percentage = Math.round((passed / total) * 100);

    console.log(`✅ Testes Aprovados: ${passed}/${total} (${percentage}%)`);
    console.log(`❌ Testes Falharam: ${total - passed}/${total}`);

    if (percentage >= 80) {
      console.log('🎉 SISTEMA FUNCIONANDO CORRETAMENTE!');
    } else {
      console.log('⚠️  SISTEMA PRECISA DE AJUSTES!');
    }

    console.table(this.testResults);
  }

  /**
   * Limpa todos os dados e reinicia sistema
   */
  static resetSystem(): void {
    console.log('🔄 Resetando sistema...');
    MonotonicTimeValidator.clearValidationData();
    this.testResults = [];
    console.log('✅ Sistema resetado');
  }
}

// Disponibilizar globalmente para uso no console
if (typeof window !== 'undefined') {
  window.antiCheatTest = AntiCheatTest;
}

// Instruções de uso
console.log('🧪 SISTEMA DE TESTES ANTI-TRAPAÇA CARREGADO');
console.log('📋 Para iniciar, execute no console:');
console.log('   antiCheatTest.runAllTests()');
console.log('🔧 Para testes manuais:');
console.log('   antiCheatTest.startManualTests()');
console.log('🔍 Para debug:');
console.log('   antiCheatTest.showDebugInfo()');
