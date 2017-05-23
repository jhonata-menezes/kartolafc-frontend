import {http} from './../axios'
import db from './../dexie'

const getTime = (timeId, callback) => {
  db.meusTimes.get(timeId, function (item) {
    if (item) {
      callback(item)
    } else {
      http.get('/time/id/' + timeId).then(r => {
        db.meusTimes.put(r.data).then(newItem => {
          callback(r.data)
        })
      })
    }
  })
}

export default {getTime}
