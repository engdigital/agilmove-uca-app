import { useEffect } from 'react'
import { ScreenOrientation } from '@capacitor/screen-orientation'
import { Capacitor } from '@capacitor/core'

/**
 * Hook para bloquear orientação em modo portrait
 * Usa a Screen Orientation API quando disponível
 */
export function useOrientationLock() {
  useEffect(() => {
    const lockOrientation = async () => {
      try {
        // Se estivermos em um app nativo (Capacitor)
        if (Capacitor.isNativePlatform()) {
          await ScreenOrientation.lock({ orientation: 'portrait-primary' })
          console.log('✅ Orientação bloqueada para portrait (Capacitor)')
          return
        }

        // Fallback para PWA/Web
        // Tenta usar a Screen Orientation API moderna
        if ('screen' in window && 'orientation' in window.screen) {
          const screen = window.screen as any
          if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock('portrait-primary')
            console.log('✅ Orientação bloqueada para portrait (Web API)')
          }
        }
        // Fallback para API mais antiga
        else if ('lockOrientation' in window.screen) {
          const screen = window.screen as any
          screen.lockOrientation('portrait-primary')
        }
        // Fallback para webkit
        else if ('webkitLockOrientation' in window.screen) {
          const screen = window.screen as any
          screen.webkitLockOrientation('portrait-primary')
        }
        // Fallback para moz
        else if ('mozLockOrientation' in window.screen) {
          const screen = window.screen as any
          screen.mozLockOrientation('portrait-primary')
        }
      } catch (error) {
        // Ignorar erros silenciosamente - nem todos os dispositivos suportam
        console.log('ℹ️ Screen Orientation Lock não disponível neste dispositivo')
      }
    }

    // Executar quando o componente montar
    lockOrientation()

    // Adicionar listener para mudanças de orientação
    const handleOrientationChange = () => {
      // Força o bloqueio novamente após mudança de orientação
      setTimeout(lockOrientation, 100)
    }

    // Escutar eventos de orientação
    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', handleOrientationChange)

    // Cleanup
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', handleOrientationChange)
    }
  }, [])
}
