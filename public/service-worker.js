// public/service-worker.js
// Este arquivo será registrado como um Service Worker.
// Ele deve estar na pasta `public` para ser acessível na raiz do seu domínio.

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed")
  self.skipWaiting() // Força a ativação do novo Service Worker imediatamente
})

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated")
  event.waitUntil(clients.claim()) // Assume o controle de todas as páginas abertas
})

self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received!", event.data.text())
  const data = event.data.json()
  const title = data.title || "UCA App"
  const options = {
    body: data.body || "Você tem um novo lembrete de leitura!",
    icon: "/favicon.ico", // Ícone para a notificação
    badge: "/favicon.ico", // Badge para dispositivos móveis
    data: {
      url: data.url || "/", // URL para abrir ao clicar na notificação
    },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event.notification.tag)
  event.notification.close() // Fecha a notificação

  const urlToOpen = event.notification.data.url || "/"

  event.waitUntil(
    clients.openWindow(urlToOpen), // Abre a URL associada à notificação
  )
})
