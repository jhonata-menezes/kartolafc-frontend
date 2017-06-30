
export default {
  init: () => {
    let tokens = localStorage.getItem('tokens')
    if (!tokens) {
      tokens = '{}'
    }
    return JSON.parse(tokens)
  },

  get: (item = '') => {
    let tokens = this.a.init()
    return item === '' ? tokens : tokens[item]
  },

  set: (item, value) => {
    console.log(this)
    let tokens = this.a.init()
    tokens[item] = value
    localStorage.setItem('tokens', JSON.stringify(tokens))
  },

  delete: item => {
    let tokens = this.a.init()
    delete tokens[item]
    localStorage.setItem('tokens', JSON.stringify(tokens))
  }
}
