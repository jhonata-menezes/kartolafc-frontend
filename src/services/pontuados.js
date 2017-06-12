import { http } from './../axios'

let pontuados = {}
let queue = []
let run = false

const getPontuados = (callback, force = false) => {
  if (run === true && !force) {
    if (pontuados.total_atletas >= 1) {
      callback(pontuados)
      return
    }
    queue.push(callback)
    return
  }
  queue.push(callback)
  run = true
  http.get('/atletas/pontuados').then(r => {
    pontuados = r.data

    while (queue.length) {
      queue.shift()(pontuados)
    }
    setTimeout(() => {
      run = false
    }, 60000)
  }).catch(err => { console.log(err) })
}

export default { getPontuados }
