import { http } from './../axios'
import db from './../dexie'

const getMercado = (callback) => {
  db.mercado.toArray().then(result => {
    if (result.length >= 1) {
      let mercadoResult = result[0]
      if (parseInt(new Date() - new Date(mercadoResult.data_criado)) >= 3599941) {
        // necessario atualizar, passou mais de 1 hora que esta na tabela
        http.get('/atletas/mercado').then(r => {
          if (r.data) {
            this.$kartolafc.status.getStatus(status => {
              r.data.data_criado = new Date()
              r.data.rodada_atual = status.rodada_atual
              db.mercado.put(r.data).then(() => {
                callback(r.data)
              }).catch(err => {
                console.log(err)
              })
            })
          }
        })
      }
    }
  })
}

export default { getMercado }
