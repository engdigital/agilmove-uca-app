"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Hook para tratar o botão voltar do Android
 * Redireciona para a tela home quando não estiver na home
 */
export function useAndroidBackHandler() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Função que trata o evento do botão voltar
    const handleBackButton = () => {
      // Se não estiver na tela home, vai para a home
      if (pathname !== '/home') {
        router.push('/home')
        return false // Previne o comportamento padrão
      }
      return true // Permite o comportamento padrão (sair do app)
    }

    // Escuta o evento do botão voltar no Capacitor
    const addBackButtonListener = async () => {
      try {
        // Verifica se está rodando no Capacitor (Android)
        if (typeof window !== 'undefined') {
          // Método 1: Capacitor moderno (v4+)
          if ((window as any).Capacitor?.Plugins?.App) {
            const { App } = (window as any).Capacitor.Plugins
            
            const backButtonListener = await App.addListener('backButton', (data: any) => {
              const shouldExit = handleBackButton()
              
              // Se shouldExit for true, permite sair do app
              if (shouldExit && data.canGoBack === false) {
                App.exitApp()
              }
            })

            return backButtonListener
          }
          // Método 2: Capacitor legado 
          else if ((window as any).Capacitor) {
            const capacitor = (window as any).Capacitor
            
            // Importa dinamicamente o plugin App
            if (capacitor.Plugins && capacitor.Plugins.App) {
              const { App } = capacitor.Plugins
              
              const backButtonListener = await App.addListener('backButton', (data: any) => {
                const shouldExit = handleBackButton()
                
                if (shouldExit && data.canGoBack === false) {
                  App.exitApp()
                }
              })

              return backButtonListener
            }
          }
          // Método 3: Verifica se o Capacitor está disponível globalmente
          else if ((window as any).Capacitor?.isNativePlatform?.()) {
            // Usa apenas APIs globais do Capacitor para evitar problemas de import
            console.log('Capacitor detectado, mas usando APIs globais')
          }
        }
      } catch (error) {
        console.log('Erro ao configurar listener do botão voltar:', error)
      }
      
      return null
    }

    // Adiciona o listener
    let listener: any = null
    addBackButtonListener().then((result) => {
      listener = result
    })

    // Cleanup - remove o listener quando o componente for desmontado
    return () => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove()
      }
    }
  }, [pathname, router])
}
