
if ('serviceWorker' in navigator && 'PushManager' in window) {
  // W1HAZf9KEso6B9PgCM0xqF_d4KBFe88qKGu-KtAkuvA
  const serverKey = urlB64ToUint8Array('BLScgOU8V52zWJDoRKwIrrq4E56goGdMtpVVbDv3Nx0eVQhLgvSDFVRdfXIfPN1vSEB1m56Z47K5c8PoyxrihLk')
  navigator.serviceWorker.register('sw.js').then(
    function (serviceWorkerRegistration) {
      var options = {
        userVisibleOnly: true,
        applicationServerKey: serverKey
      }
      serviceWorkerRegistration.pushManager.subscribe(options).then(
        function (pushSubscription) {
          console.log('OK', JSON.stringify(pushSubscription, pushSubscription))
          // The push subscription details needed by the application
          // server are now available, and can be sent to it using,
          // for example, an XMLHttpRequest.
        }, function (error) {
        console.log('ERROR', error)
      }
    )
    })
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
