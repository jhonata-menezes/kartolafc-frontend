import Dexie from 'dexie'

var db = new Dexie('kartolafc')
db.version(1).stores({
  meuTime: `time.time_id`,
  meusTimes: `time_id`
})

export default db
