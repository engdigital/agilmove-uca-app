"use client"

import { useEffect } from 'react'

export function PWAInstaller() {
  useEffect(() => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then((registration) => {
            console.log('PWA: Service Worker registrado com sucesso:', registration.scope)
            
            // Verificar atualizações
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('PWA: Nova versão disponível')
                    // Aqui você pode mostrar uma notificação para o usuário sobre a atualização
                  }
                })
              }
            })
          })
          .catch((error) => {
            console.log('PWA: Falha ao registrar Service Worker:', error)
          })
      })
    }

    // Detectar quando o app pode ser instalado
    let deferredPrompt: any = null

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: Prompt de instalação disponível')
      e.preventDefault()
      deferredPrompt = e
      
      // Aqui você pode mostrar um botão de instalação personalizado
      showInstallButton()
    }

    const showInstallButton = () => {
      // Criar ou mostrar botão de instalação se necessário
      const existingButton = document.getElementById('pwa-install-button')
      if (!existingButton && deferredPrompt) {
        console.log('PWA: Mostrando opção de instalação')
        // Você pode implementar um banner ou botão aqui
      }
    }

    const handleAppInstalled = () => {
      console.log('PWA: App instalado com sucesso')
      deferredPrompt = null
      
      // Esconder botão de instalação se existir
      const installButton = document.getElementById('pwa-install-button')
      if (installButton) {
        installButton.style.display = 'none'
      }
    }

    // Event listeners para instalação PWA
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Detectar se já está instalado como PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isIOSStandalone = 'standalone' in navigator && (navigator as any).standalone
    
    if (isStandalone || isIOSStandalone) {
      console.log('PWA: Aplicativo rodando como PWA instalado')
      document.body.classList.add('pwa-installed')
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  return null // Este componente não renderiza nada visualmente
}

// Função utilitária para instalar PWA (pode ser chamada de um botão)
export const installPWA = async () => {
  const deferredPrompt = (window as any).deferredPrompt
  
  if (!deferredPrompt) {
    console.log('PWA: Prompt de instalação não disponível')
    return false
  }

  try {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('PWA: Usuário aceitou instalar')
      return true
    } else {
      console.log('PWA: Usuário recusou instalar')
      return false
    }
  } catch (error) {
    console.error('PWA: Erro ao tentar instalar:', error)
    return false
  }
}
