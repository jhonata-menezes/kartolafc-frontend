import Dexie from 'dexie'

let db = new Dexie('kartolafc')
db.version(2).stores({
  meuTime: `time.time_id`,
  meusTimes: `time_id`
})

db.version(3).stores({
  meuTime: `time.time_id`,
  meusTimes: `time_id`,
  mercado: `rodada_atual`
})

db.version(4).stores({
  meuTime: `time.time_id`,
  meusTimes: `time.time_id`,
  mercado: `rodada_atual`
}).upgrade(function (t) {
    // An upgrade function for version 3 will upgrade data based on version 2.
  return t.meusTimes.toCollection().modify(function (time) {
    delete time.time_id
  })
})

export default db
