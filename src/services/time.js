import {http} from './../axios'
import db from './../dexie'
import getStatus from './status'

const getTime = function (timeId, callback) {
  getStatus.getStatus(s => {
    db.meusTimes.get(timeId, item => {
      if (item) {
        if (item.status_mercado === s.status_mercado && item.rodada_atual === s.rodada_atual) {
          // alguns times pode estar com nome vazio
          if (item.time.nome === undefined || item.time.nome === '') {
            db.meusTimes.delete(timeId).then(() => {
              getTime(timeId, callback)
            })
          } else {
            // mantem esse time enquanto o mercado e a rodada forem iguais
            callback(item)
          }
        } else {
          db.meusTimes.delete(timeId).then(() => {
            getTime(timeId, callback)
          })
        }
      } else {
        http.get('/time/id/' + timeId).then(r => {
          r.data.rodada_atual = s.rodada_atual
          r.data.status_mercado = s.status_mercado
          db.meusTimes.put(r.data).then(newItem => {
            callback(r.data)
          })
        })
      }
    })
  })
}

export default {getTime}
