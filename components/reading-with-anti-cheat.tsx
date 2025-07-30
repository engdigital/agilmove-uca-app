// components/reading-with-anti-cheat.tsx
"use client"

import { useState, useEffect } from 'react';
import { MonotonicTimeValidator } from '@/lib/monotonic-time-validator';
import { SecureReadingService } from '@/lib/secure-reading-service';

interface ReadingButtonProps {
  scrollId: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ReadingWithAntiCheat({ scrollId, onSuccess, onError }: ReadingButtonProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{
    canRead: boolean;
    message: string;
    warnings: string[];
    riskScore: number;
  } | null>(null);

  // Verificar status na montagem do componente
  useEffect(() => {
    checkReadingStatus();
  }, [scrollId]);

  const checkReadingStatus = () => {
    try {
      const validation = MonotonicTimeValidator.validateCompleteReading(scrollId);
      
      setValidationStatus({
        canRead: validation.canRead,
        message: validation.canRead 
          ? validation.periodValidation?.reason || 'Leitura permitida'
          : validation.timeValidation.reason || validation.periodValidation?.reason || 'Leitura bloqueada',
        warnings: validation.timeValidation.warnings,
        riskScore: validation.overallRiskScore
      });
    } catch (error) {
      setValidationStatus({
        canRead: false,
        message: 'Erro na validação de segurança',
        warnings: [],
        riskScore: 100
      });
    }
  };

  const handleReading = async () => {
    if (!validationStatus?.canRead) {
      onError?.(validationStatus?.message || 'Leitura não permitida');
      return;
    }

    setIsValidating(true);
    
    try {
      const result = await SecureReadingService.recordSecureReading(scrollId);
      
      if (result.success) {
        setValidationStatus({
          canRead: false,
          message: 'Leitura registrada com sucesso',
          warnings: result.warnings || [],
          riskScore: result.overallRiskScore || 0
        });
        onSuccess?.();
      } else {
        onError?.(result.error || 'Erro ao registrar leitura');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusColor = () => {
    if (!validationStatus) return 'bg-gray-500';
    if (validationStatus.canRead) return 'bg-green-500';
    if (validationStatus.riskScore > 70) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const getStatusIcon = () => {
    if (!validationStatus) return '⏳';
    if (validationStatus.canRead) return '✅';
    if (validationStatus.riskScore > 70) return '🔒';
    return '⚠️';
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      {/* Status da Validação */}
      <div className={`p-3 rounded ${getStatusColor()} text-white`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <span className="font-medium">
            {validationStatus?.message || 'Verificando...'}
          </span>
        </div>
        
        {validationStatus?.riskScore !== undefined && (
          <div className="text-sm mt-1 opacity-90">
            Score de Risco: {validationStatus.riskScore}%
          </div>
        )}
      </div>

      {/* Avisos de Segurança */}
      {validationStatus?.warnings && validationStatus.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
          <h4 className="font-medium text-yellow-800 mb-2">⚠️ Avisos de Segurança:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {validationStatus.warnings.map((warning: string, index: number) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Botão de Leitura */}
      <button
        onClick={handleReading}
        disabled={!validationStatus?.canRead || isValidating}
        className={`w-full py-3 px-4 rounded font-medium transition-colors ${
          validationStatus?.canRead && !isValidating
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isValidating ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Registrando Leitura...
          </span>
        ) : validationStatus?.canRead ? (
          'Marcar como Lido'
        ) : (
          'Leitura Bloqueada'
        )}
      </button>

      {/* Botão de Debug (apenas desenvolvimento) */}
      {typeof window !== 'undefined' && window.location?.hostname === 'localhost' && (
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
            🔍 Debug Info
          </summary>
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <button
              onClick={() => {
                const debug = MonotonicTimeValidator.getDebugInfo();
                console.table(debug);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Ver Estado no Console
            </button>
            
            <button
              onClick={() => {
                MonotonicTimeValidator.clearValidationData();
                checkReadingStatus();
              }}
              className="ml-4 text-red-600 hover:text-red-800"
            >
              Reset Sistema (Dev)
            </button>
          </div>
        </details>
      )}
    </div>
  );
}

// Hook para usar o sistema anti-trapaça
export function useAntiCheatValidation(scrollId: number) {
  const [validation, setValidation] = useState<{
    canRead: boolean;
    timeValidation: any;
    periodValidation: any;
    overallRiskScore: number;
  } | null>(null);

  const checkValidation = () => {
    const result = MonotonicTimeValidator.validateCompleteReading(scrollId);
    setValidation(result);
    return result;
  };

  const completeReading = async () => {
    const result = await SecureReadingService.recordSecureReading(scrollId);
    if (result.success) {
      checkValidation(); // Atualizar status após registro
    }
    return result;
  };

  useEffect(() => {
    checkValidation();
  }, [scrollId]);

  return {
    validation,
    checkValidation,
    completeReading,
    canRead: validation?.canRead || false,
    riskScore: validation?.overallRiskScore || 0
  };
}
