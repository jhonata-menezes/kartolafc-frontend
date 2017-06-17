import db from './../dexie'
import {http} from './../axios'
import getStatus from './status'

const getTimeHistoricoRecursive = (timeId, callback, rodada, historico) => {
  if (rodada === 0) {
    callback(historico)
    return
  }

  db.timesHistorico.get({'time.time_id': timeId, rodada_atual: rodada}).then(r => {
    if (r) {
      historico[rodada] = r
      --rodada
      getTimeHistoricoRecursive(timeId, callback, rodada, historico)
    } else {
      // request para pegar historico
      http.get('/time/id/' + timeId + '/' + rodada).then(resp => {
        db.timesHistorico.put(resp.data)
        historico[rodada] = resp.data
        --rodada
        getTimeHistoricoRecursive(timeId, callback, rodada, historico)
      })
    }
  })
}

const getTimeHistorico = (timeId, callback) => {
  getStatus.getStatus(s => {
    let rodada = s.rodada_atual - 1
    let historico = []
    getTimeHistoricoRecursive(timeId, callback, rodada, historico)
  })
}

export default getTimeHistorico
