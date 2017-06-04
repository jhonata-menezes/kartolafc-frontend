
import {http} from './../axios'
import c from './../services/configuracao'

const subscribeNotification = () => {
  if ('serviceWorker' in navigator && 'PushManager' in window && Notification && Notification.permission === 'granted') {
    let key = 'BJ9RwyNNNAEdhA6D0fSNs1a9lLxXoQC32gxIz6MH1eNqfFimIlTaHfLz2Z1wYYkOCzXM9UFQrZwqKktEefajy0E'
    const serverKey = urlB64ToUint8Array(key)
    let options = {
      userVisibleOnly: true,
      applicationServerKey: serverKey
    }
    navigator.serviceWorker.register('sw.js').then(() => {
      navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
        serviceWorkerRegistration.pushManager.permissionState(options).then(state => {
          if (state !== 'granted') {
            return
          }
          c.get(config => {
            // nao realiza o subscribe se usuario não liberar a notificacao
            // nao realiza a inscricao mais de uma vez
            if (config.notificacao && config.notificacao.status === true && config.notificacao.inscrito !== true) {
              serviceWorkerRegistration.pushManager.subscribe(options).then(pushSubscription => {
                http.post('/notificacao/adicionar', pushSubscription).then(() => {
                  // inscricao com sucesso, salvando na tabela para nao inscrever novamente
                  c.update((v, next) => {
                    v.notificacao.inscrito = true
                    next(v)
                  })
                }).catch(err => {
                  console.log('request das chaves', err)
                })
              }).catch(error => {
                console.log('error on subscribe', error)
              })
            }
          })
        })
      }).catch(err => {
        console.log(err)
      })
    })
  }
}

function urlB64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default {subscribeNotification}
