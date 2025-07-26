// lib/secure-time.ts
import CryptoJS from 'crypto-js';

// Chave secreta para assinatura - Em produção, usar variável de ambiente
const SECRET_KEY = process.env.NEXT_PUBLIC_SECURE_TIME_KEY || 'agilmove-uca-secure-time-2025';

export interface SecureTimestamp {
  timestamp: number;
  signature: string;
  deviceInfo: string;
  nonce: string;
}

export interface TimestampValidation {
  isValid: boolean;
  issues: string[];
  riskScore: number;
}

export class SecureTimeService {
  /**
   * Gera um fingerprint único do dispositivo baseado em características difíceis de falsificar
   */
  static getDeviceFingerprint(): string {
    try {
      const screen = `${window.screen.width}x${window.screen.height}`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const language = navigator.language;
      const platform = navigator.platform;
      const userAgent = navigator.userAgent.slice(0, 100); // Primeiros 100 chars
      const colorDepth = window.screen.colorDepth;
      
      const fingerprint = `${screen}|${timezone}|${language}|${platform}|${colorDepth}|${userAgent}`;
      return CryptoJS.SHA256(fingerprint).toString();
    } catch (error) {
      console.warn('Erro ao gerar fingerprint do dispositivo:', error);
      return 'fallback-fingerprint';
    }
  }

  /**
   * Gera um timestamp seguro com assinatura criptográfica
   */
  static generateSecureTimestamp(): SecureTimestamp {
    const timestamp = Date.now();
    const deviceInfo = this.getDeviceFingerprint();
    const nonce = CryptoJS.lib.WordArray.random(16).toString();
    
    // Criar payload para assinatura
    const payload = `${timestamp}|${deviceInfo}|${nonce}`;
    const signature = CryptoJS.HmacSHA256(payload, SECRET_KEY).toString();
    
    return {
      timestamp,
      signature,
      deviceInfo,
      nonce
    };
  }

  /**
   * Valida um timestamp seguro verificando a assinatura
   */
  static validateSecureTimestamp(secureTimestamp: SecureTimestamp): boolean {
    try {
      const { timestamp, signature, deviceInfo, nonce } = secureTimestamp;
      const payload = `${timestamp}|${deviceInfo}|${nonce}`;
      const expectedSignature = CryptoJS.HmacSHA256(payload, SECRET_KEY).toString();
      
      return signature === expectedSignature;
    } catch (error) {
      console.error('Erro ao validar timestamp:', error);
      return false;
    }
  }

  /**
   * Verifica se o dispositivo atual corresponde ao dispositivo do timestamp
   */
  static isCurrentDevice(deviceInfo: string): boolean {
    const currentDeviceInfo = this.getDeviceFingerprint();
    return deviceInfo === currentDeviceInfo;
  }
}

export class BehaviorValidator {
  /**
   * Valida o padrão de leitura para detectar comportamentos suspeitos
   */
  static validateReadingPattern(
    newTimestamp: number,
    recentReadings: Array<{ timestamp: number; period: string }>
  ): TimestampValidation {
    const issues: string[] = [];
    let riskScore = 0;

    if (recentReadings.length > 0) {
      const lastReading = recentReadings[recentReadings.length - 1];
      const timeDiff = newTimestamp - lastReading.timestamp;

      // Verificar se a leitura é muito rápida (menos de 30 segundos)
      if (timeDiff < 30000) {
        issues.push('READING_TOO_FAST');
        riskScore += 50;
      }

      // Verificar se o timestamp é no passado em relação à última leitura
      if (newTimestamp < lastReading.timestamp) {
        issues.push('TIMESTAMP_REGRESSION');
        riskScore += 80;
      }

      // Verificar se há muitas leituras no mesmo dia
      const today = new Date(newTimestamp).toDateString();
      const todayReadings = recentReadings.filter(r => 
        new Date(r.timestamp).toDateString() === today
      );

      if (todayReadings.length >= 3) {
        issues.push('TOO_MANY_READINGS_TODAY');
        riskScore += 30;
      }
    }

    // Verificar horário suspeito (muito tarde ou muito cedo)
    const hour = new Date(newTimestamp).getHours();
    if (hour < 5 || hour > 23) {
      issues.push('UNUSUAL_HOUR');
      riskScore += 20;
    }

    // Verificar se é um horário muito preciso (pode indicar manipulação)
    const seconds = new Date(newTimestamp).getSeconds();
    const milliseconds = new Date(newTimestamp).getMilliseconds();
    if (seconds === 0 && milliseconds === 0) {
      issues.push('SUSPICIOUSLY_PRECISE_TIME');
      riskScore += 25;
    }

    return {
      isValid: issues.length === 0,
      issues,
      riskScore: Math.min(riskScore, 100)
    };
  }

  /**
   * Calcula um score de confiança baseado no histórico do usuário
   */
  static calculateTrustScore(
    allReadings: Array<{ timestamp: number; validation?: TimestampValidation }>
  ): number {
    if (allReadings.length === 0) return 100;

    const suspiciousReadings = allReadings.filter(r => 
      r.validation && (!r.validation.isValid || r.validation.riskScore > 30)
    );

    const suspiciousRatio = suspiciousReadings.length / allReadings.length;
    
    // Score de 0-100, onde 100 é totalmente confiável
    return Math.max(0, 100 - (suspiciousRatio * 100));
  }
}

export class SequenceService {
  private static readonly SEQUENCE_KEY = 'uca_reading_sequence';
  private static readonly CHAIN_KEY = 'uca_reading_chain';

  /**
   * Obtém a última sequência de leitura
   */
  static getLastSequence(): number {
    try {
      return parseInt(localStorage.getItem(this.SEQUENCE_KEY) || '0');
    } catch (error) {
      console.error('Erro ao obter última sequência:', error);
      return 0;
    }
  }

  /**
   * Obtém o hash da última leitura na cadeia
   */
  static getLastChainHash(): string {
    try {
      return localStorage.getItem(this.CHAIN_KEY) || '0';
    } catch (error) {
      console.error('Erro ao obter último hash da cadeia:', error);
      return '0';
    }
  }

  /**
   * Calcula o hash de uma leitura
   */
  static calculateReadingHash(
    scrollId: number,
    sequence: number,
    timestamp: number,
    previousHash: string,
    deviceInfo: string
  ): string {
    const data = `${scrollId}|${sequence}|${timestamp}|${previousHash}|${deviceInfo}`;
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Gera uma nova entrada de leitura com sequência e hash
   */
  static generateSequentialReading(scrollId: number, secureTimestamp: SecureTimestamp) {
    const lastSequence = this.getLastSequence();
    const newSequence = lastSequence + 1;
    const previousHash = this.getLastChainHash();
    
    const hash = this.calculateReadingHash(
      scrollId,
      newSequence,
      secureTimestamp.timestamp,
      previousHash,
      secureTimestamp.deviceInfo
    );

    const reading = {
      sequence: newSequence,
      scrollId,
      hash,
      previousHash,
      secureTimestamp,
      createdAt: Date.now()
    };

    // Salvar nova sequência e hash
    localStorage.setItem(this.SEQUENCE_KEY, newSequence.toString());
    localStorage.setItem(this.CHAIN_KEY, hash);

    return reading;
  }

  /**
   * Valida a integridade de uma cadeia de leituras
   */
  static validateChainIntegrity(readings: Array<{
    sequence: number;
    scrollId: number;
    hash: string;
    previousHash: string;
    secureTimestamp: SecureTimestamp;
  }>): boolean {
    if (readings.length === 0) return true;

    // Ordenar por sequência
    const sortedReadings = [...readings].sort((a, b) => a.sequence - b.sequence);

    for (let i = 0; i < sortedReadings.length; i++) {
      const reading = sortedReadings[i];
      
      // Verificar se o hash está correto
      const expectedHash = this.calculateReadingHash(
        reading.scrollId,
        reading.sequence,
        reading.secureTimestamp.timestamp,
        reading.previousHash,
        reading.secureTimestamp.deviceInfo
      );

      if (reading.hash !== expectedHash) {
        console.error('Hash inválido na sequência:', reading.sequence);
        return false;
      }

      // Verificar se o hash anterior está correto (exceto para o primeiro)
      if (i > 0) {
        const previousReading = sortedReadings[i - 1];
        if (reading.previousHash !== previousReading.hash) {
          console.error('Hash anterior inválido na sequência:', reading.sequence);
          return false;
        }
      }
    }

    return true;
  }
}
