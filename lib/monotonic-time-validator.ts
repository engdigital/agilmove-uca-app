// lib/monotonic-time-validator.ts
import CryptoJS from 'crypto-js';
import { getPeriod, formatDateToKey, getReadingDay } from './app-utils';

// Chave secreta para assinatura
const SECRET_KEY = process.env.NEXT_PUBLIC_SECURE_TIME_KEY || 'agilmove-uca-secure-time-2025';

// Tolerância para pequenas variações de clock (60 segundos)
const CLOCK_DRIFT_TOLERANCE = 60 * 1000;

export interface TimeAnchor {
  systemTimeAtAnchor: number;
  performanceTimeAtAnchor: number;
  periodOfAnchor: string;
  dayOfAnchor: string;
  scrollId: number;
  hash: string;
}

export interface MonotonicValidation {
  isValid: boolean;
  reason: string;
  clockDrift?: number;
  riskScore: number;
  warnings: string[];
}

export interface PeriodValidation {
  isValid: boolean;
  reason: string;
  currentPeriod: string;
  canRead: boolean;
}

export class MonotonicTimeValidator {
  private static readonly ANCHOR_KEY = 'uca_time_anchor';
  private static readonly READINGS_TODAY_KEY = 'uca_readings_today';

  /**
   * Salva uma nova âncora temporal após leitura válida
   */
  static saveTimeAnchor(scrollId: number, period: string, day: string): void {
    const anchor: TimeAnchor = {
      systemTimeAtAnchor: Date.now(),
      performanceTimeAtAnchor: performance.now(),
      periodOfAnchor: period,
      dayOfAnchor: day,
      scrollId,
      hash: this.generateAnchorHash(Date.now(), performance.now(), period, day, scrollId)
    };

    localStorage.setItem(this.ANCHOR_KEY, JSON.stringify(anchor));
  }

  /**
   * Recupera a última âncora temporal salva
   */
  static getLastTimeAnchor(): TimeAnchor | null {
    try {
      const anchorData = localStorage.getItem(this.ANCHOR_KEY);
      if (!anchorData) return null;
      
      const anchor = JSON.parse(anchorData) as TimeAnchor;
      
      // Validar integridade da âncora
      const expectedHash = this.generateAnchorHash(
        anchor.systemTimeAtAnchor,
        anchor.performanceTimeAtAnchor,
        anchor.periodOfAnchor,
        anchor.dayOfAnchor,
        anchor.scrollId
      );

      if (anchor.hash !== expectedHash) {
        console.warn('Âncora temporal corrompida, removendo...');
        localStorage.removeItem(this.ANCHOR_KEY);
        return null;
      }

      return anchor;
    } catch (error) {
      console.error('Erro ao recuperar âncora temporal:', error);
      return null;
    }
  }

  /**
   * Gera hash da âncora para validar integridade
   */
  private static generateAnchorHash(
    systemTime: number,
    performanceTime: number,
    period: string,
    day: string,
    scrollId: number
  ): string {
    const data = `${systemTime}|${performanceTime}|${period}|${day}|${scrollId}`;
    return CryptoJS.HmacSHA256(data, SECRET_KEY).toString();
  }

  /**
   * Validação principal: detecta manipulação de relógio
   */
  static validateReadingAttempt(scrollId: number): MonotonicValidation {
    const lastAnchor = this.getLastTimeAnchor();
    
    if (!lastAnchor) {
      // Primeira leitura, sempre válida
      return {
        isValid: true,
        reason: 'Primeira leitura detectada',
        riskScore: 0,
        warnings: []
      };
    }

    const currentSystemTime = Date.now();
    const currentPerformanceTime = performance.now();

    // 1. Calcular tempo real decorrido (não manipulável)
    const realTimeElapsed = currentPerformanceTime - lastAnchor.performanceTimeAtAnchor;

    // 2. Calcular qual deveria ser a hora do sistema (se não houvesse manipulação)
    const expectedSystemTime = lastAnchor.systemTimeAtAnchor + realTimeElapsed;

    // 3. Medir desvio entre o esperado e o real
    const clockDrift = Math.abs(currentSystemTime - expectedSystemTime);

    // 4. Validação principal: relógio foi manipulado?
    if (clockDrift > CLOCK_DRIFT_TOLERANCE) {
      return {
        isValid: false,
        reason: `Manipulação de relógio detectada. Deriva: ${Math.round(clockDrift / 1000)}s`,
        clockDrift,
        riskScore: Math.min(100, (clockDrift / 1000) * 2), // 2 pontos por segundo de deriva
        warnings: [
          'Detectamos uma alteração significativa no relógio do dispositivo',
          'Aguarde o tempo real passar para continuar lendo'
        ]
      };
    }

    // 5. Verificar se tempo não regrediu muito
    if (currentSystemTime < lastAnchor.systemTimeAtAnchor - CLOCK_DRIFT_TOLERANCE) {
      return {
        isValid: false,
        reason: 'Timestamp regressivo detectado',
        clockDrift,
        riskScore: 90,
        warnings: [
          'O relógio do dispositivo foi alterado para trás',
          'Não é possível registrar leituras no passado'
        ]
      };
    }

    return {
      isValid: true,
      reason: 'Relógio validado com sucesso',
      clockDrift,
      riskScore: Math.min(20, clockDrift / 3000), // Pequena penalidade para deriva menor
      warnings: clockDrift > 30000 ? ['Pequena deriva de relógio detectada'] : []
    };
  }

  /**
   * Valida regras de período (manhã/tarde/noite)
   */
  static validatePeriodRules(scrollId: number): PeriodValidation {
    const currentSystemTime = Date.now();
    const currentDate = new Date(currentSystemTime);
    const currentHour = currentDate.getHours();
    const currentPeriod = getPeriod(currentHour);
    const currentDay = formatDateToKey(getReadingDay(currentSystemTime));

    const lastAnchor = this.getLastTimeAnchor();
    
    if (!lastAnchor) {
      // Primeira leitura, sempre permitida
      return {
        isValid: true,
        reason: 'Primeira leitura do usuário',
        currentPeriod,
        canRead: true
      };
    }

    // Verificar se é o mesmo dia
    if (lastAnchor.dayOfAnchor === currentDay) {
      // Mesmo dia: verificar se já leu neste período
      if (lastAnchor.periodOfAnchor === currentPeriod) {
        return {
          isValid: false,
          reason: `Já foi realizada uma leitura no período da ${currentPeriod === 'morning' ? 'manhã' : currentPeriod === 'afternoon' ? 'tarde' : 'noite'} hoje`,
          currentPeriod,
          canRead: false
        };
      }

      // Verificar sequência lógica de períodos no mesmo dia
      const periodOrder = ['morning', 'afternoon', 'evening'];
      const lastPeriodIndex = periodOrder.indexOf(lastAnchor.periodOfAnchor);
      const currentPeriodIndex = periodOrder.indexOf(currentPeriod);

      if (currentPeriodIndex <= lastPeriodIndex) {
        return {
          isValid: false,
          reason: `Não é possível ler na ${currentPeriod === 'morning' ? 'manhã' : currentPeriod === 'afternoon' ? 'tarde' : 'noite'} após já ter lido na ${lastAnchor.periodOfAnchor === 'morning' ? 'manhã' : lastAnchor.periodOfAnchor === 'afternoon' ? 'tarde' : 'noite'} do mesmo dia`,
          currentPeriod,
          canRead: false
        };
      }
    } else {
      // Dia diferente: verificar se completou o dia anterior
      const readingsToday = this.getReadingsToday(currentDay);
      const readingsYesterday = this.getReadingsToday(lastAnchor.dayOfAnchor);

      if (readingsYesterday.length < 3) {
        return {
          isValid: false,
          reason: `É necessário completar as 3 leituras do dia anterior (${lastAnchor.dayOfAnchor}) antes de avançar para o próximo dia. Leituras feitas: ${readingsYesterday.length}/3`,
          currentPeriod,
          canRead: false
        };
      }
    }

    // Verificar se está na janela correta do período
    const periodWindows = {
      morning: { start: 5, end: 12 },
      afternoon: { start: 12, end: 18 },
      evening: { start: 18, end: 24 }
    };

    const window = periodWindows[currentPeriod as keyof typeof periodWindows];
    if (currentHour < window.start || (currentHour >= window.end && currentPeriod !== 'evening')) {
      return {
        isValid: false,
        reason: `Horário fora da janela permitida para ${currentPeriod === 'morning' ? 'manhã' : currentPeriod === 'afternoon' ? 'tarde' : 'noite'}. Janela: ${window.start}h-${window.end === 24 ? '23h59' : window.end + 'h'}`,
        currentPeriod,
        canRead: false
      };
    }

    return {
      isValid: true,
      reason: 'Período validado com sucesso',
      currentPeriod,
      canRead: true
    };
  }

  /**
   * Registra uma leitura realizada no dia
   */
  static recordReadingForDay(day: string, period: string): void {
    const readings = this.getReadingsToday(day);
    if (!readings.includes(period)) {
      readings.push(period);
      localStorage.setItem(`${this.READINGS_TODAY_KEY}_${day}`, JSON.stringify(readings));
    }
  }

  /**
   * Obtém leituras já realizadas em um dia específico
   */
  static getReadingsToday(day: string): string[] {
    try {
      const readingsData = localStorage.getItem(`${this.READINGS_TODAY_KEY}_${day}`);
      return readingsData ? JSON.parse(readingsData) : [];
    } catch (error) {
      console.error('Erro ao obter leituras do dia:', error);
      return [];
    }
  }

  /**
   * Validação completa para tentar registrar uma leitura
   */
  static validateCompleteReading(scrollId: number): {
    canRead: boolean;
    timeValidation: MonotonicValidation;
    periodValidation: PeriodValidation;
    overallRiskScore: number;
  } {
    // 1. Validar relógio (detecção de manipulação)
    const timeValidation = this.validateReadingAttempt(scrollId);
    
    // 2. Validar regras de período (se relógio estiver ok)
    const periodValidation = timeValidation.isValid 
      ? this.validatePeriodRules(scrollId)
      : { isValid: false, reason: 'Relógio inválido', currentPeriod: 'unknown', canRead: false };

    // 3. Calcular score de risco geral
    const overallRiskScore = timeValidation.riskScore + (periodValidation.isValid ? 0 : 30);

    // 4. Decisão final
    const canRead = timeValidation.isValid && periodValidation.isValid && overallRiskScore < 50;

    return {
      canRead,
      timeValidation,
      periodValidation,
      overallRiskScore
    };
  }

  /**
   * Completa o registro de uma leitura válida (salva nova âncora)
   */
  static completeReading(scrollId: number): void {
    const currentSystemTime = Date.now();
    const currentDate = new Date(currentSystemTime);
    const currentPeriod = getPeriod(currentDate.getHours());
    const currentDay = formatDateToKey(getReadingDay(currentSystemTime));

    // Salvar nova âncora temporal
    this.saveTimeAnchor(scrollId, currentPeriod, currentDay);
    
    // Registrar leitura do dia
    this.recordReadingForDay(currentDay, currentPeriod);
  }

  /**
   * Utilitário para debug/monitoramento
   */
  static getDebugInfo(): {
    currentSystemTime: number;
    currentPerformanceTime: number;
    lastAnchor: TimeAnchor | null;
    clockDrift: number | null;
    currentPeriod: string;
    currentDay: string;
  } {
    const lastAnchor = this.getLastTimeAnchor();
    const currentSystemTime = Date.now();
    const currentPerformanceTime = performance.now();
    const currentDate = new Date(currentSystemTime);
    
    let clockDrift = null;
    if (lastAnchor) {
      const realTimeElapsed = currentPerformanceTime - lastAnchor.performanceTimeAtAnchor;
      const expectedSystemTime = lastAnchor.systemTimeAtAnchor + realTimeElapsed;
      clockDrift = Math.abs(currentSystemTime - expectedSystemTime);
    }

    return {
      currentSystemTime,
      currentPerformanceTime,
      lastAnchor,
      clockDrift,
      currentPeriod: getPeriod(currentDate.getHours()),
      currentDay: formatDateToKey(getReadingDay(currentSystemTime))
    };
  }

  /**
   * Limpa dados de validação (uso apenas para testes)
   */
  static clearValidationData(): void {
    localStorage.removeItem(this.ANCHOR_KEY);
    // Limpar leituras dos últimos 7 dias
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayKey = formatDateToKey(date);
      localStorage.removeItem(`${this.READINGS_TODAY_KEY}_${dayKey}`);
    }
  }
}
