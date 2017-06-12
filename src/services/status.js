import {http} from '../axios'

let run = false
let status = {}
let queue = []

const getStatus = (callback, force = false) => {
  if (run === true && !force) {
    // evita de fazer varias requisições
    if (status.rodada_atual > 0) {
      callback(status)
      return
    }
    queue.push(callback)
    return
  }
  queue.push(callback)
  run = true
  http.get('/mercado/status').then(function (r) {
    if (r.data) {
      status = r.data
      while (queue.length) {
        queue.shift()(status)
      }
    } else {
      status = {}
    }
    // apos 2 minutos se for requisitaod, sera feito request do status
    setTimeout(() => {
      run = false
    }, 120000)
  })
}

export default {getStatus}

