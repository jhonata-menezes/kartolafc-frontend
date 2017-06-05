import c from './../services/configuracao'
'use strict'

self.addEventListener('push', function (event) {
  let n = event.data.json()
  if (Notification.permission !== 'granted') {
    return
  }

  if (!n.title && !n.body) {
    console.log('titulo e corpo vazio, impossivel notificar')
    return
  }

  // verifica a permissao de notificacao do cliente
  c.get(v => {
    if (v.notificacao && v.notificacao.status !== true) {
      return
    }

    // verifica se o cliente permitiu a notificações deste scout
    if (v.notificacao.opcoes && !v.notificacao.opcoes[n.scout.toLowerCase()]) {
      return
    }

    const title = n.title
    const options = {
      body: n.body,
      icon: n.icon || '/static/img/icon.png',
      badge: n.badge || '/static/img/icon.png',
      dir: 'auto',
      requireInteraction: false,
      vibrate: [200, 100, 200],
      data: n
    }

    event.waitUntil(self.registration.showNotification(title, options))
  })
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data.link)
  )
})
