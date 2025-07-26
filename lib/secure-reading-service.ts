// lib/secure-reading-service.ts
import { db, type ReadingEntry } from './db';
import { 
  SecureTimeService, 
  BehaviorValidator, 
  SequenceService,
  type SecureTimestamp,
  type TimestampValidation 
} from './secure-time';
import { formatDateToKey, getReadingDay, getPeriod } from './app-utils';

export interface SecureReadingResult {
  success: boolean;
  reading?: ReadingEntry;
  validation?: TimestampValidation;
  trustScore?: number;
  warnings?: string[];
  error?: string;
}

export class SecureReadingService {
  /**
   * Registra uma leitura de forma segura com validações de tempo
   */
  static async recordSecureReading(
    scrollId: number,
    userTimestamp?: number
  ): Promise<SecureReadingResult> {
    try {
      // Usar timestamp atual se não fornecido
      const baseTimestamp = userTimestamp || Date.now();
      
      // Gerar timestamp seguro
      const secureTimestamp = SecureTimeService.generateSecureTimestamp();
      
      // Calcular dados da leitura
      const readingDay = getReadingDay(baseTimestamp);
      const readingDayKey = formatDateToKey(readingDay);
      const period = getPeriod(new Date(baseTimestamp).getHours());
      
      // Obter leituras recentes para validação de comportamento
      const recentReadings = await this.getRecentReadings(scrollId, 10);
      
      // Validar padrão de comportamento
      const validation = BehaviorValidator.validateReadingPattern(
        secureTimestamp.timestamp,
        recentReadings.map(r => ({ timestamp: r.timestamp, period: r.period }))
      );
      
      // Calcular score de confiança
      const allReadings = await db.readings.where({ scrollId }).toArray();
      const trustScore = BehaviorValidator.calculateTrustScore(allReadings);
      
      // Gerar dados sequenciais para blockchain-like
      const sequentialData = SequenceService.generateSequentialReading(scrollId, secureTimestamp);
      
      // Criar ID composto para a entrada de leitura
      const readingId = `${scrollId}-${readingDayKey}-${period}`;
      
      // Verificar se já existe leitura para este período
      const existingReading = await db.readings.get(readingId);
      
      const warnings: string[] = [];
      
      // Adicionar avisos baseados na validação
      if (!validation.isValid) {
        warnings.push(`Padrão suspeito detectado: ${validation.issues.join(', ')}`);
      }
      
      if (validation.riskScore > 50) {
        warnings.push(`Alto risco de manipulação (${validation.riskScore}%)`);
      }
      
      if (trustScore < 70) {
        warnings.push(`Score de confiança baixo (${trustScore}%)`);
      }
      
      if (existingReading) {
        warnings.push('Sobrescrevendo leitura existente para este período');
      }
      
      // Criar entrada de leitura segura
      const readingEntry: ReadingEntry = {
        id: readingId,
        scrollId,
        dateKey: readingDayKey,
        period,
        timestamp: baseTimestamp,
        sequence: sequentialData.sequence,
        hash: sequentialData.hash,
        previousHash: sequentialData.previousHash,
        secureTimestamp,
        validation,
        trustScore,
        deviceInfo: secureTimestamp.deviceInfo,
        suspicious: !validation.isValid || validation.riskScore > 30
      };
      
      // Salvar no banco de dados
      await db.readings.put(readingEntry);
      
      // Salvar cópia criptografada no localStorage para backup
      await this.saveEncryptedBackup(readingEntry);
      
      // Log para auditoria (apenas em desenvolvimento)
      if (process.env.NODE_ENV === 'development') {
        console.log('Leitura segura registrada:', {
          scrollId,
          sequence: sequentialData.sequence,
          validation: validation.isValid,
          riskScore: validation.riskScore,
          trustScore,
          warnings
        });
      }
      
      return {
        success: true,
        reading: readingEntry,
        validation,
        trustScore,
        warnings: warnings.length > 0 ? warnings : undefined
      };
      
    } catch (error) {
      console.error('Erro ao registrar leitura segura:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
  
  /**
   * Obtém leituras recentes para validação
   */
  private static async getRecentReadings(scrollId: number, limit: number = 10): Promise<ReadingEntry[]> {
    try {
      return await db.readings
        .where({ scrollId })
        .reverse()
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('Erro ao obter leituras recentes:', error);
      return [];
    }
  }
  
  /**
   * Salva backup criptografado no localStorage
   */
  private static async saveEncryptedBackup(reading: ReadingEntry): Promise<void> {
    try {
      const CryptoJS = (await import('crypto-js')).default;
      const SECRET_KEY = process.env.NEXT_PUBLIC_SECURE_TIME_KEY || 'agilmove-uca-secure-time-2025';
      
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(reading),
        SECRET_KEY
      ).toString();
      
      const backupKey = `uca_backup_${reading.sequence}`;
      localStorage.setItem(backupKey, encrypted);
      
      // Manter apenas os últimos 50 backups
      this.cleanupOldBackups();
      
    } catch (error) {
      console.error('Erro ao salvar backup criptografado:', error);
    }
  }
  
  /**
   * Remove backups antigos do localStorage
   */
  private static cleanupOldBackups(): void {
    try {
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith('uca_backup_'))
        .sort((a, b) => {
          const seqA = parseInt(a.split('_')[2]);
          const seqB = parseInt(b.split('_')[2]);
          return seqB - seqA; // Ordem decrescente
        });
      
      // Remover backups além dos últimos 50
      if (backupKeys.length > 50) {
        const toRemove = backupKeys.slice(50);
        toRemove.forEach(key => localStorage.removeItem(key));
      }
    } catch (error) {
      console.error('Erro ao limpar backups antigos:', error);
    }
  }
  
  /**
   * Valida a integridade de todas as leituras de um pergaminho
   */
  static async validateScrollIntegrity(scrollId: number): Promise<{
    isValid: boolean;
    totalReadings: number;
    corruptedReadings: number;
    chainIntegrity: boolean;
    issues: string[];
  }> {
    try {
      const readings = await db.readings.where({ scrollId }).toArray();
      const issues: string[] = [];
      let corruptedReadings = 0;
      
      // Validar cada leitura individual
      for (const reading of readings) {
        if (reading.secureTimestamp) {
          const isValidSignature = SecureTimeService.validateSecureTimestamp(reading.secureTimestamp);
          if (!isValidSignature) {
            corruptedReadings++;
            issues.push(`Assinatura inválida na leitura ${reading.sequence}`);
          }
          
          const isCurrentDevice = SecureTimeService.isCurrentDevice(reading.secureTimestamp.deviceInfo);
          if (!isCurrentDevice) {
            issues.push(`Dispositivo diferente detectado na leitura ${reading.sequence}`);
          }
        }
      }
      
      // Validar integridade da cadeia
      const readingsWithSequence = readings.filter(r => r.sequence && r.hash && r.secureTimestamp);
      const chainIntegrity = SequenceService.validateChainIntegrity(
        readingsWithSequence.map(r => ({
          sequence: r.sequence!,
          scrollId: r.scrollId,
          hash: r.hash!,
          previousHash: r.previousHash!,
          secureTimestamp: r.secureTimestamp!
        }))
      );
      
      if (!chainIntegrity) {
        issues.push('Integridade da cadeia comprometida');
      }
      
      return {
        isValid: corruptedReadings === 0 && chainIntegrity,
        totalReadings: readings.length,
        corruptedReadings,
        chainIntegrity,
        issues
      };
      
    } catch (error) {
      console.error('Erro ao validar integridade:', error);
      return {
        isValid: false,
        totalReadings: 0,
        corruptedReadings: 0,
        chainIntegrity: false,
        issues: ['Erro ao validar integridade']
      };
    }
  }
  
  /**
   * Obtém estatísticas de segurança para um usuário
   */
  static async getSecurityStats(): Promise<{
    totalReadings: number;
    suspiciousReadings: number;
    averageTrustScore: number;
    deviceChanges: number;
    chainIntegrity: boolean;
  }> {
    try {
      const allReadings = await db.readings.toArray();
      const suspiciousCount = allReadings.filter(r => r.suspicious).length;
      
      const trustScores = allReadings
        .filter(r => r.trustScore !== undefined)
        .map(r => r.trustScore!);
      
      const averageTrustScore = trustScores.length > 0 
        ? trustScores.reduce((a, b) => a + b, 0) / trustScores.length 
        : 100;
      
      // Contar mudanças de dispositivo
      const devices = new Set(allReadings
        .filter(r => r.deviceInfo)
        .map(r => r.deviceInfo)
      );
      
      // Validar integridade geral da cadeia
      const readingsWithSequence = allReadings.filter(r => r.sequence && r.hash && r.secureTimestamp);
      const chainIntegrity = SequenceService.validateChainIntegrity(
        readingsWithSequence.map(r => ({
          sequence: r.sequence!,
          scrollId: r.scrollId,
          hash: r.hash!,
          previousHash: r.previousHash!,
          secureTimestamp: r.secureTimestamp!
        }))
      );
      
      return {
        totalReadings: allReadings.length,
        suspiciousReadings: suspiciousCount,
        averageTrustScore: Math.round(averageTrustScore),
        deviceChanges: Math.max(0, devices.size - 1),
        chainIntegrity
      };
      
    } catch (error) {
      console.error('Erro ao obter estatísticas de segurança:', error);
      return {
        totalReadings: 0,
        suspiciousReadings: 0,
        averageTrustScore: 0,
        deviceChanges: 0,
        chainIntegrity: false
      };
    }
  }
}
