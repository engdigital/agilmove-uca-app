# Plano de Testes - Sistema Anti-Trapaça Monotônico

## 🎯 **Objetivo dos Testes**

Validar que o sistema **Âncora Temporal Monotônica** impede a manipulação do relógio do dispositivo para burlar as regras de leitura (manhã, tarde, noite).

### **Configurações do Sistema:**
- **CLOCK_DRIFT_TOLERANCE**: 60.000ms (60 segundos)
- **performance.now()**: Contador monotônico não manipulável
- **Janelas de Período**: Manhã (5h-12h), Tarde (12h-18h), Noite (18h-24h)

---

## 🧪 **Cenários de Teste**

### **TESTE 1: Funcionamento Normal (Baseline)**

**Objetivo:** Verificar que leituras legítimas funcionam normalmente.

**Passos:**
1. Limpar dados de validação: `MonotonicTimeValidator.clearValidationData()`
2. Fazer leitura manhã (ex: 10:00) ✅
3. Aguardar 2 horas reais 
4. Fazer leitura tarde (ex: 12:30) ✅
5. Aguardar 7 horas reais
6. Fazer leitura noite (ex: 19:30) ✅

**Resultado Esperado:**
- ✅ Todas as 3 leituras devem ser aceitas
- ✅ `canRead = true` para cada tentativa
- ✅ `riskScore < 20` para todas

---

### **TESTE 2: Manipulação de Relógio - Avanço Simples** ⚠️

**Objetivo:** Detectar quando usuário avança o relógio para "pular" períodos.

**Passos:**
1. Limpar dados: `MonotonicTimeValidator.clearValidationData()`
2. Fazer leitura manhã (10:00) ✅
3. **SEM AGUARDAR**, avançar relógio do dispositivo para 14:00
4. Tentar fazer leitura tarde (14:00) ❌

**Resultado Esperado:**
- ❌ `canRead = false`
- ❌ `timeValidation.reason = "Manipulação de relógio detectada"`
- ❌ `clockDrift > 60000` (deriva > 1 minuto)
- ❌ `riskScore > 50`

---

### **TESTE 3: Manipulação de Relógio - Regressão** ⚠️

**Objetivo:** Detectar quando usuário volta o relógio para "refazer" leituras.

**Passos:**
1. Fazer leitura manhã (10:00) ✅
2. Aguardar 1 hora real (11:00)
3. Voltar relógio do dispositivo para 09:00
4. Tentar fazer nova leitura ❌

**Resultado Esperado:**
- ❌ `canRead = false`
- ❌ `timeValidation.reason = "Timestamp regressivo detectado"`
- ❌ `riskScore = 90`

---

### **TESTE 4: Sequência de Períodos Incorreta** ⚠️

**Objetivo:** Verificar que não permite ler "manhã" após "tarde" no mesmo dia.

**Passos:**
1. Fazer leitura tarde (14:00) ✅
2. Aguardar 30 minutos reais
3. Tentar fazer leitura manhã (configurando relógio para 10:00) ❌

**Resultado Esperado:**
- ❌ `canRead = false`
- ❌ `periodValidation.reason` contém "não é possível ler na manhã após"

---

### **TESTE 5: Período Duplicado no Mesmo Dia** ⚠️

**Objetivo:** Verificar que não permite duas leituras no mesmo período.

**Passos:**
1. Fazer leitura manhã (09:00) ✅
2. Aguardar 2 horas reais
3. Tentar fazer outra leitura manhã (11:00) ❌

**Resultado Esperado:**
- ❌ `canRead = false`
- ❌ `periodValidation.reason` contém "Já foi realizada uma leitura no período da manhã"

---

### **TESTE 6: Avanço de Dia Sem Completar** ⚠️

**Objetivo:** Verificar que não permite avançar para próximo dia sem completar as 3 leituras.

**Passos:**
1. Fazer apenas leitura manhã (09:00) ✅
2. Avançar relógio para próximo dia (09:00 do dia seguinte)
3. Tentar fazer leitura manhã do novo dia ❌

**Resultado Esperado:**
- ❌ `canRead = false`
- ❌ `periodValidation.reason` contém "É necessário completar as 3 leituras do dia anterior"

---

### **TESTE 7: Leitura Fora da Janela de Período** ⚠️

**Objetivo:** Verificar que não permite leituras fora dos horários permitidos.

**Janelas:**
- Manhã: 05:00 - 11:59
- Tarde: 12:00 - 17:59  
- Noite: 18:00 - 23:59

**Passos:**
1. Tentar fazer leitura "manhã" às 04:00 ❌
2. Tentar fazer leitura "tarde" às 18:30 ❌ (deveria ser noite)
3. Tentar fazer leitura "noite" às 12:00 ❌ (deveria ser tarde)

**Resultado Esperado:**
- ❌ `canRead = false` para todas
- ❌ `periodValidation.reason` contém "Horário fora da janela permitida"

---

### **TESTE 8: Deriva Pequena de Relógio (Tolerância)** ✅

**Objetivo:** Verificar que pequenas deriças são toleradas.

**Passos:**
1. Fazer leitura manhã (10:00) ✅
2. Aguardar 2 horas reais
3. Ajustar relógio +30 segundos (simula deriva natural)
4. Tentar fazer leitura tarde (12:00:30) ✅

**Resultado Esperado:**
- ✅ `canRead = true`
- ✅ `clockDrift < 60000` (dentro da tolerância)
- ✅ `timeValidation.warnings` pode conter "Pequena deriva de relógio"

---

### **TESTE 9: Reinstalação/Limpeza de App** ✅

**Objetivo:** Verificar comportamento quando dados são perdidos.

**Passos:**
1. `MonotonicTimeValidator.clearValidationData()` (simula reinstalação)
2. Tentar fazer qualquer leitura ✅

**Resultado Esperado:**
- ✅ `canRead = true`
- ✅ `timeValidation.reason = "Primeira leitura detectada"`
- ✅ Nova âncora temporal é criada

---

### **TESTE 10: Fechamento e Reabertura do App** ✅

**Objetivo:** Verificar que o sistema funciona após fechar/abrir o app.

**Passos:**
1. Fazer leitura manhã (10:00) ✅
2. Simular fechamento do app (recarregar página)
3. Aguardar 4 horas reais
4. Abrir app e tentar leitura tarde (14:00) ✅

**Resultado Esperado:**
- ✅ `canRead = true`
- ✅ Âncora temporal deve ser mantida no localStorage
- ✅ Validação monotônica funciona corretamente

---

## 🛠️ **Como Executar os Testes**

### **1. Código de Teste Automatizado**

```typescript
// test/monotonic-time-validator.test.ts
import { MonotonicTimeValidator } from '../lib/monotonic-time-validator';

describe('MonotonicTimeValidator', () => {
  beforeEach(() => {
    // Limpar dados antes de cada teste
    MonotonicTimeValidator.clearValidationData();
  });

  test('TESTE 1: Funcionamento Normal', async () => {
    // Primeira leitura (manhã)
    const result1 = MonotonicTimeValidator.validateCompleteReading(1);
    expect(result1.canRead).toBe(true);
    
    if (result1.canRead) {
      MonotonicTimeValidator.completeReading(1);
    }

    // Simular passagem de tempo (2 horas)
    jest.advanceTimersByTime(2 * 60 * 60 * 1000);
    
    // Segunda leitura (tarde)
    const result2 = MonotonicTimeValidator.validateCompleteReading(1);
    expect(result2.canRead).toBe(true);
  });

  test('TESTE 2: Manipulação de Relógio - Avanço', () => {
    // Primeira leitura
    const result1 = MonotonicTimeValidator.validateCompleteReading(1);
    MonotonicTimeValidator.completeReading(1);

    // Simular avanço manual do relógio (sem performance.now())
    const originalDateNow = Date.now;
    Date.now = jest.fn(() => originalDateNow() + 4 * 60 * 60 * 1000); // +4 horas
    
    // Tentar segunda leitura
    const result2 = MonotonicTimeValidator.validateCompleteReading(1);
    expect(result2.canRead).toBe(false);
    expect(result2.timeValidation.reason).toContain('Manipulação de relógio');
    
    // Restaurar Date.now
    Date.now = originalDateNow;
  });
});
```

### **2. Teste Manual no Navegador**

```typescript
// Console do navegador
async function testarSistema() {
  console.log('🧪 INICIANDO TESTES DO SISTEMA ANTI-TRAPAÇA');
  
  // Limpar dados
  MonotonicTimeValidator.clearValidationData();
  
  // Teste 1: Leitura normal
  console.log('\n📋 TESTE 1: Leitura Normal');
  let result = MonotonicTimeValidator.validateCompleteReading(1);
  console.log('Primeira leitura:', result);
  
  if (result.canRead) {
    MonotonicTimeValidator.completeReading(1);
    console.log('✅ Primeira leitura registrada');
  }
  
  // Aguardar usuário manipular relógio manualmente
  console.log('\n⚠️ AGORA: Avance o relógio do seu dispositivo +3 horas');
  console.log('⏰ Depois execute: testarManipulacao()');
}

function testarManipulacao() {
  console.log('\n📋 TESTE 2: Tentativa Após Manipulação');
  const result = MonotonicTimeValidator.validateCompleteReading(1);
  console.log('Resultado:', result);
  
  if (!result.canRead) {
    console.log('🎉 SUCESSO! Manipulação foi detectada e bloqueada!');
    console.log('❌ Motivo:', result.timeValidation.reason);
    console.log('📊 Risk Score:', result.overallRiskScore);
  } else {
    console.log('❌ FALHA! Manipulação não foi detectada!');
  }
}

// Executar teste
testarSistema();
```

### **3. Debug e Monitoramento**

```typescript
// Para verificar estado atual do sistema
function debugSistema() {
  const debug = MonotonicTimeValidator.getDebugInfo();
  console.table({
    'Hora do Sistema': new Date(debug.currentSystemTime).toLocaleString(),
    'Performance Time': debug.currentPerformanceTime + 'ms',
    'Última Âncora': debug.lastAnchor ? new Date(debug.lastAnchor.systemTimeAtAnchor).toLocaleString() : 'Nenhuma',
    'Deriva do Relógio': debug.clockDrift ? (debug.clockDrift / 1000) + 's' : 'N/A',
    'Período Atual': debug.currentPeriod,
    'Dia Atual': debug.currentDay
  });
}
```

---

## 📊 **Critérios de Sucesso**

### ✅ **Sistema Funcionando Corretamente:**
- Todos os testes de manipulação (2-7) devem **FALHAR** a validação
- Todos os testes normais (1, 8-10) devem **PASSAR** a validação
- `clockDrift` deve ser detectado corretamente
- Mensagens de erro devem ser informativas

### ❌ **Sistema com Problemas:**
- Se qualquer teste de manipulação **PASSAR** a validação
- Se leituras normais forem **BLOQUEADAS** incorretamente
- Se `performance.now()` não estiver funcionando

---

## 🚀 **Execução Recomendada**

1. **Execute teste automatizado** primeiro (Jest/Vitest)
2. **Execute teste manual** no navegador com manipulação real do relógio
3. **Teste em diferentes dispositivos** (Android, iOS, Desktop)
4. **Teste cenários extremos** (fechar app por dias, mudar timezone, etc.)

O sistema deve ser **99% eficaz** contra manipulação de relógio, permitindo apenas leituras legítimas dentro das regras estabelecidas.
