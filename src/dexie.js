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
})

db.version(5).stores({
  meuTime: `time.time_id`,
  meusTimes: `time.time_id`,
  mercado: `rodada_atual`,
  ligas: `liga.slug`
})

db.version(6).stores({
  meuTime: `time.time_id`,
  meusTimes: `time.time_id`,
  mercado: `rodada_atual`,
  ligas: `liga.slug`,
  configuracao: `id`
})

db.open().catch(err => {
  console.log('open', err)
  let req = indexedDB.deleteDatabase('kartolafc')
  req.onsuccess = function () {
    console.log('deletado com sucesso')
    location.reload()
  }
  req.onerror = function () {
    console.log('nao foi possivel deletar')
  }
})

export default db
