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

db.version(7).stores({
  meuTime: `time.time_id`,
  meusTimes: `time.time_id`,
  timesHistorico: `[time.time_id+rodada_atual]`,
  mercado: `rodada_atual`,
  ligas: `liga.slug`,
  configuracao: `id`
})

db.version(8).stores({
  meuTime: `time.time_id`,
  meusTimes: `time.time_id`,
  timesHistorico: `[time.time_id+rodada_atual]`,
  mercado: `rodada_atual`,
  ligas: `liga.slug`,
  configuracao: `id`,
  atletasHistorico: `atleta_id`,
  rodadas: `rodada`
})

export default db
