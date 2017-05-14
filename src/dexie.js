import Dexie from 'dexie'

var db = new Dexie('kartolafc')
db.version(2).stores({
  meuTime: `time.time_id`,
  meusTimes: `time_id`
})

export default db
