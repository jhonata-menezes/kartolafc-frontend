import { http } from './../axios'

let pontuados = {}
let runnable = false

const getPontuados = (callback) => {
  if (pontuados.total_atletas >= 1) {
    return callback(pontuados)
  } else {
    if (runnable === true) {
      http.get('/atletas/pontuados').then(r => {
        pontuados = r.data
        callback(r.data)
      }).catch(err => { console.log(err) })
    }
    runnable = true
    setTimeout(() => {
      http.get('/atletas/pontuados').then(r => {
        pontuados = r.data
        callback(r.data)
      }).catch(err => { console.log(err) })
    }, 120000)
  }
}

export default { getPontuados }
