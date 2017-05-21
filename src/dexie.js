import Dexie from 'dexie'

var db = new Dexie('kartolafc')
db.version(2).stores({
  meuTime: `time.time_id`,
  meusTimes: `time_id`
})

db.version(3).stores({
  meuTime: `time.time_id`,
  meusTimes: `time_id`,
  mercado: `rodada_atual`
})

export default db
