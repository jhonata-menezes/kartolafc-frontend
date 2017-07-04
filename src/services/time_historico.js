import db from './../dexie'
import {http} from './../axios'
import getStatus from './status'

function get (timeId, rodada) {
  return db.timesHistorico.get({'time.time_id': timeId, rodada_atual: rodada}).then(r => {
    if (r) {
      return r
    } else {
      return http.get('/time/id/' + timeId + '/' + rodada).then(resp => {
        db.timesHistorico.put(resp.data)
        return resp.data
      })
    }
  })
}

const getTimeHistoricoRecursive = (timeId, callback, rodada) => {
  let iterable = []
  for (let i = rodada; i > 0; i--) {
    iterable.push(get(timeId, i))
  }
  let returnComRodada = {}
  Promise.all(iterable).then(collection => {
    for (let c of collection) {
      returnComRodada[c.rodada_atual] = c
    }
    callback(returnComRodada)
  })
}

const getTimeHistorico = (timeId, callback) => {
  getStatus.getStatus(s => {
    let rodada = s.rodada_atual - 1
    getTimeHistoricoRecursive(timeId, callback, rodada)
  })
}

export default getTimeHistorico
