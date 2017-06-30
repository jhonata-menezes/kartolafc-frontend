import getStatus from './services/status'
import getTime from './services/time'
import getMercado from './services/mercado'
import getPontuados from './services/pontuados'
import configuracao from './services/configuracao'
import toast from './services/toast'
import liga from './services/liga'
import timeHistorico from './services/time_historico'
import Scouts from './services/scouts'
import Tokens from './services/tokens'

let instaled = false

let kartolafc = {}
kartolafc.status = getStatus
kartolafc.time = getTime
kartolafc.timeHistorico = timeHistorico
kartolafc.mercado = getMercado
kartolafc.pontuados = getPontuados
kartolafc.configuracao = configuracao
kartolafc.toast = toast
kartolafc.liga = liga.liga
kartolafc.scouts = Scouts
kartolafc.tokens = Tokens

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
