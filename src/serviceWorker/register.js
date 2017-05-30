
import {http} from './../axios'

const subscribeNotification = () => {
  if ('serviceWorker' in navigator && 'PushManager' in window && Notification && Notification.permission === 'granted') {
    // W1HAZf9KEso6B9PgCM0xqF_d4KBFe88qKGu-KtAkuvA
    const serverKey = urlB64ToUint8Array('BLScgOU8V52zWJDoRKwIrrq4E56goGdMtpVVbDv3Nx0eVQhLgvSDFVRdfXIfPN1vSEB1m56Z47K5c8PoyxrihLk')
    let options = {
      userVisibleOnly: true,
      applicationServerKey: serverKey
    }
    navigator.serviceWorker.register('sw.js').then(() => {
      navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
        serviceWorkerRegistration.pushManager.permissionState(options).then(state => {
          if (state === 'granted') {
            return
          }
          serviceWorkerRegistration.pushManager.subscribe(options).then(pushSubscription => {
            http.post('http://127.0.0.1:5015/notificacao/adicionar', pushSubscription).catch(err => {
              console.log('request das chaves', err)
            })
          }).catch(error => {
            console.log('error on subscribe', error)
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
