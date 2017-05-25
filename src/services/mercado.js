import { http } from './../axios'
import db from './../dexie'
import getStatus from './status'

const getMercado = (callback) => {
  db.mercado.toArray().then(result => {
    if (result.length >= 1) {
      let mercadoResult = result[0]
      if (parseInt(new Date() - new Date(mercadoResult.data_criado)) >= 3599941) {
        console.log(result.length)
        // necessario atualizar, passou mais de 1 hora que esta na tabela
        http.get('/atletas/mercado').then(r => {
          if (r.data) {
            getStatus.getStatus(status => {
              r.data.data_criado = new Date()
              r.data.rodada_atual = status.rodada_atual
              db.mercado.clear().catch(err => { console.log('deletando mercado', err) })
              db.mercado.put(r.data).then(() => {
                callback(r.data)
              }).catch(err => {
                console.log(err)
              })
            })
          }
        })
      } else {
        callback(mercadoResult)
      }
    } else {
      http.get('/atletas/mercado').then(r => {
        if (r.data) {
          getStatus.getStatus(status => {
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
  })
}

export default { getMercado }
