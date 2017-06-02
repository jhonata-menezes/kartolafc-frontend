import db from './../dexie'

const dao = {
  get: (callback) => {
    db.configuracao.get(1).then(d => {
      callback(d)
    }).catch(() => {
      let v = { id: 1, notificacao: {} }
      callback(v)
    })
  },

  set: v => {
    v.id = 1
    db.configuracao.put(v).then(() => { console.log('sucesso ao salvar configuracao') })
    .catch(err => { console.log(err) })
  },

  update: (callback) => {
    dao.get(d => {
      callback(d, n => {
        dao.set(n)
      })
    })
  }
}

export default dao
