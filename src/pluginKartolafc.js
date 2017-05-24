import getStatus from './services/status'
import getTime from './services/time'
import getMercado from './services/mercado'
import getPontuados from './services/pontuados'

let instaled = false

let kartolafc = {}
kartolafc.status = getStatus
kartolafc.time = getTime
kartolafc.mercado = getMercado
kartolafc.pontuados = getPontuados

// plugin install
const install = Vue => {
  if (instaled) {
    return // users plugin já foi instalado
  }

  Object.defineProperties(Vue.prototype, {
    $kartolafc: {
      get () {
        return kartolafc
      }
    }
  })

  instaled = true
}

export default { install }
