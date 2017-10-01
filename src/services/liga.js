import db from './../dexie'
import {http} from './../axios'
import getStatus from './status'

// vai ate no maximo a pagina 5 da liga. se houver liga com mais de 100 times nao sera adicionado
const requestLigaRecursive = (slug, end, qtd = -100, page = 1, liga = {}) => {
  http.get('/liga/' + slug + '/' + page).then(r => {
    if (r.data.times) {
      if (page === 1) {
        liga = r.data
      }
      if (page !== 1) {
        liga.times = liga.times.concat(r.data.times)
      }
      if (r.data.times.length < 100 || page === 5) {
        end(liga)
      } else {
        requestLigaRecursive(slug, end, qtd, ++page, liga)
      }
    } else {
      // liga não contem times
      end(r.data)
    }
  })
}

const getLiga = (slug, callback, force = false) => {
  getStatus.getStatus(s => {
    db.ligas.get(slug).then(r => {
      if (r && r.rodada_atual === s.rodada_atual && force === false) {
        callback(r)
        return
      }
      // salva na tabela e passa para o callback
      requestLigaRecursive(slug, liga => {
        liga.rodada_atual = s.rodada_atual
        db.ligas.put(liga).then()
        callback(liga)
      })
    })
  })
}

const liga = {requestLigaRecursive, getLiga}

export default {liga}
