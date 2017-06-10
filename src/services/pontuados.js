import { http } from './../axios'

let pontuados = {}

const getPontuados = (callback, force = false) => {
  if (pontuados.total_atletas >= 1 && !force) {
    return callback(pontuados)
  }
  http.get('/atletas/pontuados').then(r => {
    pontuados = r.data
    callback(r.data)
  }).catch(err => { console.log(err) })
}

export default { getPontuados }
