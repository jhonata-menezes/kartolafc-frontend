import status from './status'
import {http} from './../axios'
import db from './../dexie'

export default (rodada, end) => {
  status.getStatus(s => {
    db.rodadas.get({rodada: rodada}).then(r => {
      if (r) {
        return end(r)
      }
      http.get('/partidas/' + rodada).then(r => {
        if (rodada < s.rodada_atual && rodada !== 0) {
          db.rodadas.put(r.data)
        }
        return end(r.data)
      })
    })
  })
}
