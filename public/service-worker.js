// AgilMove UCA - Service Worker
// PWA Service Worker com cache básico e suporte a notificações

const CACHE_NAME = 'agilmove-uca-v1.0.0'
const OFFLINE_URL = '/offline.html'

// Recursos essenciais para cache
const CORE_ASSETS = [
  '/',
  '/home',
  '/launch',
  '/details',
  '/analytics',
  '/privacy-policy',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon.png',
  '/apple-touch-icon.png'
]

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...")
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching core assets")
        return cache.addAll(CORE_ASSETS)
      })
      .then(() => {
        console.log("Service Worker: Core assets cached")
        self.skipWaiting() // Força ativação imediata
      })
      .catch((error) => {
        console.error("Service Worker: Failed to cache assets", error)
      })
  )
})

// Ativação do Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...")
  
  event.waitUntil(
    // Limpar caches antigos
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Deleting old cache", cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log("Service Worker: Activated")
      return clients.claim() // Assume controle de todas as páginas
    })
  )
})

// Interceptação de requisições (estratégia Cache First para assets, Network First para dados)
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Apenas interceptar requisições do mesmo domínio
  if (url.origin !== location.origin) return
  
  // Estratégia Cache First para assets estáticos
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'script' ||
      request.url.includes('/icon-') ||
      request.url.includes('favicon') ||
      request.url.includes('manifest.json')) {
    
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((fetchResponse) => {
          const responseClone = fetchResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
          return fetchResponse
        })
      }).catch(() => {
        // Fallback para imagens offline
        if (request.destination === 'image') {
          return caches.match('/icon-192x192.png')
        }
      })
    )
  }
  // Estratégia Network First para páginas e dados
  else {
    event.respondWith(
      fetch(request).then((response) => {
        // Cache páginas importantes
        if (response.status === 200 && request.method === 'GET') {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      }).catch(() => {
        // Fallback para cache ou página offline
        return caches.match(request).then((response) => {
          return response || caches.match(OFFLINE_URL)
        })
      })
    )
  }
})

// Notificações Push
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push notification received")
  
  let data = {}
  if (event.data) {
    try {
      data = event.data.json()
    } catch (e) {
      data = { title: "AgilMove UCA", body: event.data.text() }
    }
  }
  
  const title = data.title || "AgilMove UCA"
  const options = {
    body: data.body || "Hora da sua leitura diária dos pergaminhos!",
    icon: "/icon-192x192.png",
    badge: "/icon-96x96.png", 
    image: data.image || null,
    vibrate: [200, 100, 200],
    requireInteraction: true,
    tag: 'reading-reminder',
    renotify: true,
    data: {
      url: data.url || "/home",
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'read-now',
        title: 'Ler Agora',
        icon: '/icon-96x96.png'
      },
      {
        action: 'remind-later',
        title: 'Lembrar Depois',
        icon: '/icon-96x96.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Clique em notificações
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event.action)
  
  event.notification.close()
  
  const urlToOpen = event.notification.data?.url || "/home"
  
  if (event.action === 'read-now') {
    event.waitUntil(clients.openWindow(urlToOpen))
  } else if (event.action === 'remind-later') {
    // Reagendar notificação para 1 hora depois
    console.log("Service Worker: Reminder scheduled for later")
  } else {
    // Clique na notificação principal
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Tentar focar numa janela existente
        for (const client of clientList) {
          if (client.url.includes(location.origin) && 'focus' in client) {
            return client.focus()
          }
        }
        // Se não houver janela aberta, abrir nova
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
    )
  }
})

// Fechar notificação
self.addEventListener("notificationclose", (event) => {
  console.log("Service Worker: Notification closed", event.notification.tag)
})

console.log("Service Worker: Script loaded successfully")

self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event.notification.tag)
  event.notification.close() // Fecha a notificação

  const urlToOpen = event.notification.data.url || "/"

  event.waitUntil(
    clients.openWindow(urlToOpen), // Abre a URL associada à notificação
  )
})
