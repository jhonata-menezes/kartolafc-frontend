import {http} from '../axios'

let run = false
let status = {}

const getStatus = (callback, force = false) => {
  if (run === true && !force) {
    callback(status)
  }
  run = true
  http.get('/mercado/status').then(function (r) {
    if (r.data) {
      status = r.data
      callback(status)
    } else {
      status = {}
    }
  })
}

export default {getStatus}

