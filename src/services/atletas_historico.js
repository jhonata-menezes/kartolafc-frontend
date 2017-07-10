import status from './status'
import {http} from './../axios'
import db from './../dexie'

export default (atletaId, end) => {
  status.getStatus(s => {
    db.atletasHistorico.get({atleta_id: atletaId}).then(h => {
      if (h) {
        let existeRodada = (s.rodada_atual - 1)
        for (let r of h) {
          if (r.rodada_id === existeRodada) {
            return end(h)
          }
        }
      }
      http.get('/atletas/historico/' + atletaId).then(r => {
        r.data.atleta_id = atletaId
        db.atletasHistorico.put(r.data)
        end(r.data)
      }).catch(err => { console.log(err) })
    })
  })
}
