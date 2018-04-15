import c from './../services/configuracao'
import db from './../dexie'
'use strict'

self.addEventListener('fetch', function(event) {})

self.addEventListener('push', function (event) {
  const pushNotification = (n) => {
    const title = n.title
    const options = {
      body: n.body,
      icon: n.icon || '/static/img/icon.png',
      badge: '/static/img/icon-badge.png',
      dir: 'auto',
      requireInteraction: false,
      vibrate: [200, 100, 200],
      data: n,
      actions: [
        {
          action: '/',
          title: '🏠 Meus Times'
        },
        {
          action: '/ligas',
          title: '🛡 Ligas'
        }
      ]
    }
    event.waitUntil(self.registration.showNotification(title, options))
  }
  
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

    // apenas meus times ? se sim o atleta da notificacao tem que estar em algum dos meus times
    if (v.notificacao.opcoes && v.notificacao.opcoes.times) {
      if (v.notificacao.opcoes && !v.notificacao.opcoes[n.scout.toLowerCase()]) {
        return
      }
      let notificado = false
      db.meuTime.toArray().then(time => {
        for (let mt of time) {
          db.meusTimes.get(mt.time.time_id).then(t => {
            for (let a of t.atletas) {
              if (parseInt(a.atleta_id) === n.atleta_id && notificado === false) {
                notificado = true
                pushNotification(n)
                return
              }
            }
          })
        }
        return
      }).catch(function (err) {
        console.log(err)
        return
      })
    } else {
      // verifica se o cliente permitiu a notificações deste scout
      if (v.notificacao.opcoes && !v.notificacao.opcoes[n.scout.toLowerCase()]) {
        return
      }
      pushNotification(n)
    }
  })
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  let link = ''
  if (event.action === '') {
    link = event.notification.data.link
  } else {
    link = 'https://kartolafc.com.br/#' + event.action
  }
  event.waitUntil(
    clients.openWindow(link)
  )
})
