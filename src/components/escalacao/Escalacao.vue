<template>
  <div>
    <section class="section">
      <div>
        <div class="">
        </div>
        <div class="columns" v-if="existeTimes()">
          <div class="column is-4 escalacao-scroll">
            <div>
              <div class="notification is-danger" v-if="status.status_mercado == 4">
                <b>Mercado em manutenção</b><br>
              </div>
              <div class="notification is-success" v-if="status.status_mercado == 1">
                <b>Mercado Aberto - Rodada {{status.rodada_atual}}</b><br>
                Times Escalados <b>{{status.times_escalados}}<br>
                </b> Mercado Fecha em <b>{{tempoParaFechamento}}</b>
              </div>
              <div class="notification is-danger" v-if="status.status_mercado == 2">
                <b>Mercado Fechado - Rodada {{status.rodada_atual}}</b><br>
                Times Escalados {{status.times_escalados}}
              </div>
            </div>
            <div v-if="status.status_mercado == 1">
              <div class="field">
                <label class="label">Selecione o time que deseja escalar</label>
              </div>
              <div class="field-body">
                <div class="field is-grouped">
                  <p class="control has-icons-right">
                    <span class="select is-small">
                      <select v-model="time">
                        <option v-for="t of times" :value="t" :key="t.time.time_id">{{t.time.nome}}</option>
                      </select>
                    </span>
                  </p>
                  <p class="control has-icons-right">
                    <span class="select is-small">
                      <select v-model="esquema">
                        <option v-for="(t, id) of esquemasTipos" :value="id" :key="id">{{t}}</option>
                      </select>
                    </span>
                  </p>
                </div>
              </div>
              <transition name="escalacao">
                <div v-if="time.time && !ativarComponente">
                  <div>
                    <div>
                      <table class="table">
                        <tbody>
                          <tr>
                            <td>
                              Patrimônio <span class="has-text-success">${{time.patrimonio.toFixed(2)}}</span>
                            </td>
                            <td>
                              Preço do time <span class="has-text-success">${{valores.custoTime.toFixed(2)}}</span>
                            </td>
                            <td>Restam <span class="has-text-success">${{valores.restante.toFixed(2)}}</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="field">
                    <p class="control">
                      <button class="button is-danger is-medium button-expand" @click="timeMontado = timeMontado.map(e => undefined)">Vender Time</button>
                    </p>
                  </div>
                  <div v-for="i in itensGerados" :key="i" class="box" @click="setDataComponents(timeMontado[i])">
                    <div class="media" v-if="timeMontado[i] && timeMontado[i].atleta_id">
                      <div class="media-left">
                        <picture class="image is-64x64">
                          <img :src="timeMontado[i].foto">
                        </picture>
                        <picture class="image is-32x32 escudo-lado">
                          <img :src="mercado.clubes[timeMontado[i].clube_id].Escudos['45x45']">
                        </picture>
                      </div>
                      <div class="media-content">
                        <div class="content">
                          <p>
                            <strong>{{timeMontado[i].apelido}}</strong> <small>{{time.posicoes[timeMontado[i].posicao_id].abreviacao.charAt(0).toUpperCase() + time.posicoes[timeMontado[i].posicao_id].abreviacao.slice(1)}}</small>

                             <span class="icon is-small" v-if="mercado.status" :title="mercado.status[timeMontado[i].status_id].nome">
                               <i class="fa" :class="statusIcon[timeMontado[i].status_id]"></i></span>
                            <br>
                            <div class="campos-descricao-atleta">Preço  <span class="has-text-success">${{timeMontado[i].preco_num}}</span></div>
                            <div class="campos-descricao-atleta">Média <span :class="timeMontado[i].media_num < 0 ? 'has-text-danger': 'has-text-success'">{{timeMontado[i].media_num}}</span></div>
                            <div class="campos-descricao-atleta">Variação <span :class="timeMontado[i].variacao_num < 0 ? 'has-text-danger': 'has-text-success'">{{timeMontado[i].variacao_num}}</span></div>
                            <div class="campos-descricao-atleta">Última <br><span :class="timeMontado[i].pontos_num < 0 ? 'has-text-danger': 'has-text-success'">{{timeMontado[i].pontos_num}}</span></div>
                            <div class="campos-descricao-atleta">Jogos <br><span class="has-text-success">{{timeMontado[i].jogos_num}}</span></div>
                            <div class="campos-descricao-atleta campos-descricao-atleta-jogos">
                              <div class="campos-descricao-jogo" v-if="timeMontado[i] && partidas[timeMontado[i].clube_id] && mercado.clubes">
                                <div v-for="a of partidas[timeMontado[i].clube_id].aproveitamento_mandante" :key="a" :class="statusJogo[a]"></div>
                                <picture>
                                  <img class="image-escudo" :src="mercado.clubes[partidas[timeMontado[i].clube_id].clube_casa_id].Escudos['45x45']">
                                </picture>
                                X
                                <picture>
                                  <img class="image-escudo" :src="mercado.clubes[partidas[timeMontado[i].clube_id].clube_visitante_id].Escudos['45x45']">
                                </picture>
                                <div v-for="a of reverse(partidas[timeMontado[i].clube_id].aproveitamento_visitante)" :key="a" :class="statusJogo[a]"></div>  
                              </div>
                            </div>
                            <button class="button is-danger is-small" @click="$set(timeMontado, i, undefined)">Vender</button>
                            <button class="button is-info is-small" @click="ativarPopupScouts = true; componentAtletaIdSomenteMobile=timeMontado[i].atleta_id">Scouts</button>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div v-else class="media">
                      <div class="media-content">
                        <div class="content">
                          <p class="">
                            <button class="button is-success is-medium button-size-default" @click="pesquisarAtleta($kartolafc.esquemas.esquemas[time.esquema_id].posicao[i], i)">
                              <i class="fa fa-plus"></i>&nbsp{{$kartolafc.esquemas.esquemas[time.esquema_id].posicao[i]}}</button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="field">
                    <p class="control">
                      <button ref="btnEscalar" class="button is-success is-large button-expand" :class="{'is-loading': salvandoTime}" :disabled="timeMontado.some(e => e === undefined)" @click="salvarTime()">Escalar Time</button>
                    </p>
                  </div>
                </div>
              </transition>
              <transition name="bounce" mode="out-in">
                <div v-if="ativarComponente && timeMontado.some(e => e === undefined)">
                  <component :is="componentAtletaPosicao" :atletas="atletasComponente" 
                  @update:selecionado="atl => {respostaComponente(atl)}" :timeMontado="timeMontado" :esquema="time.esquema_id"
                  @update:posicao="p => {pesquisarAtleta($kartolafc.esquemas.esquemas[time.esquema_id].posicao[p], p)}" 
                  :valores="valores" @update:ativar="a => {ativarComponente = a}" :partidas="partidas"
                  @update:est="a =>{setDataComponents(a)}" :posicaoId="posicaoIdEscalar">
                  </component>
                </div>
              </transition>
              <transition name="scouts-geral">
                <div v-if="ativarPopupScouts" class="popup2">
                  <component :is="componentScoutGeral" @update:ativo="a=>{ativarPopupScouts=a}" :atletaId="componentAtletaIdSomenteMobile" :mercadoPorAtletaId="mercadoPorAltetaId"></component>
                  </div>
              </transition>
            </div>
          </div>
          <div class="column is-hidden-touch">
            <div class="tile is-ancestor">
              <div class="tile is-vertical is-8">
                <div class="tile">
                  <div class="tile is-parent is-vertical">
                    <article class="tile is-child notification tela-est">
                      <div>
                        <posicao-estatistica :posicaoId="componentData.posicaoId"></posicao-estatistica>
                      </div>
                    </article>
                    <article class="tile is-child notification tela-est">
                      <div>
                        <clube-estatistica :clubeId="componentData.clubeId" ></clube-estatistica>
                      </div>
                    </article>
                  </div>
                  <div class="tile is-parent is-8">
                    <article class="tile is-child notification">
                      <div>
                        <scouts-estatistica :atletaId="componentData.atletaId"></scouts-estatistica>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="column is-offset-1 is-4">
            <div class="notification is-warning">
              <p>Para escalar time é necessario autenticar com os dados da sua conta do cartolafc</p>
            </div>
            <div class="field">
              <p class="control">
                  <router-link class="button button-expand is-large is-success" :to="{name:'Login'}">Realizar Autenticação</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>  
  </div>
</template>

<script>
import {http} from './../../axios'
import AtletaPosicao from './AtletasPosicao'
import PosicaoEstatistica from './../estatisticas/Posicao'
import ClubeEstatistica from './../estatisticas/Clube'
import ScoutEstatistica from './../estatisticas/Scouts'
import ScoutsGeral from './../shared/scouts/ScoutsRodadaGeral'
import moment from 'moment'
import 'moment/locale/pt-br'

export default {
  components: {
    'atletaPosicao': AtletaPosicao,
    'posicao-estatistica': PosicaoEstatistica,
    'clube-estatistica': ClubeEstatistica,
    'scouts-estatistica': ScoutEstatistica,
    'scouts-geral': ScoutsGeral
  },
  data () {
    return {
      tempoParaFechamento: '',
      componentScoutGeral: 'scouts-geral',
      componentAtletaIdSomenteMobile: 0,
      ativarPopupScouts: false,
      componentData: {
        clubeId: 0,
        atletaId: 0,
        posicaoId: 0
      },
      ativarComponente: false,
      componentAtletaPosicao: 'atletaPosicao',
      indiceAlterar: 0,
      atletasComponente: [],
      itensGerados: [],
      times: [],
      time: {},
      timeMontado: [],
      mercado: {},
      mercadoPorAltetaId: {},
      status: {},
      esquema: 0,
      esquemasTipos: {
        1: '3-4-3',
        2: '3-5-2',
        3: '4-3-3',
        4: '4-4-2',
        5: '4-5-1',
        6: '5-3-2',
        7: '5-4-1'
      },
      partidas: {},
      atletasPosicao: [],
      valores: {
        restante: 0,
        custoTime: 0
      },
      statusIcon: {
        2: 'fa-question fa-color-red',
        3: 'fa-square fa-color-red',
        5: 'fa-plus fa-color-red',
        6: '',
        7: 'fa-check fa-check-green'
      },
      statusJogo: {
        'v': 'status-jogo status-jogo-vitoria',
        'e': 'status-jogo status-jogo-empate',
        'd': 'status-jogo status-jogo-derrota'
      },
      salvandoTime: false,
      posicaoIdEscalar: 0,
      setIntervalFechamento: null
    }
  },

  methods: {
    getTimes: function () {
      let times = this.$kartolafc.tokens.get()
      for (let t in times) {
        http.get('/time/info', {headers: {token: times[t].token}}).then(r => {
          if (r.data.time) {
            r.data.token = times[t].token
            this.times.push(r.data)
          }
        })
      }
    },

    existeTimes: function () {
      let times = this.$kartolafc.tokens.get()
      return times && Object.keys(times).length > 0
    },

    init: function () {
      this.$kartolafc.mercado.getMercado(m => {
        this.mercado = m
        let atletasPosicao = []
        for (let atl of m.atletas) {
          this.mercadoPorAltetaId[atl.atleta_id] = atl
          // array por posicao
          if (!atletasPosicao[atl.posicao_id]) {
            atletasPosicao[atl.posicao_id] = []
          }
          atletasPosicao[atl.posicao_id].push(atl)
        }
        this.atletasPosicao = atletasPosicao
      })
      this.$kartolafc.status.getStatus(s => {
        this.status = s
        this.processarTempo()
      })
      http.get('/partidas/0').then(r => {
        let p = {}
        for (let partida of r.data.partidas) {
          p[partida.clube_casa_id] = partida
          p[partida.clube_visitante_id] = partida
        }
        this.partidas = p
      })
    },

    precoTime: function () {
      let soma = 0
      for (let t of this.timeMontado) {
        if (t) {
          soma += t.preco_num
        }
      }
      return soma
    },

    calculaTime: function () {
      let precoTime = this.precoTime()
      this.valores.custoTime = precoTime
      this.valores.restante = this.time.patrimonio - precoTime
    },

    reverse: function (i) {
      let a = i.slice()
      return a.reverse()
    },

    pesquisarAtleta: function (nomePosicao, i) {
      this.posicaoIdEscalar = 0
      for (let p in this.mercado.posicoes) {
        if (this.mercado.posicoes[p].nome === nomePosicao) {
          this.posicaoIdEscalar = this.mercado.posicoes[p].id
          break
        }
      }
      this.atletasComponente = this.atletasPosicao[this.posicaoIdEscalar]
      this.indiceAlterar = i
      this.ativarComponente = true
    },

    respostaComponente: function (atleta) {
      this.$set(this.timeMontado, parseInt(this.indiceAlterar), atleta)
    },

    salvarTime: function () {
      this.salvandoTime = true
      let time = {}
      time.atleta = []
      for (let t of this.timeMontado) {
        time.atleta.push(t.atleta_id)
      }
      time.esquema = this.time.esquema_id
      http.post('/time/salvar', time, {headers: {token: this.time.token}}).then(r => {
        if (r.data.mensagem) {
          this.$kartolafc.toast.info(r.data.mensagem)
        }
        this.salvandoTime = false
      }).catch(() => {
        this.$kartolafc.toast.error('Não foi possível salvar, tente novamente em alguns segundos')
        this.salvandoTime = false
      })
    },

    setDataComponents: function (atl) {
      if (atl) {
        this.componentData.atletaId = atl.atleta_id
        this.componentData.clubeId = atl.clube_id
        this.componentData.posicaoId = atl.posicao_id
      }
    },

    timeIgual: function () {
      let tempTime = {}
      for (let t of this.timeMontado) {
        tempTime[t.atleta_id] = t
      }
      // true se o time for igual ao que esta escalado
      return !this.time.atletas.some(a => tempTime[a.atleta_id] === undefined)
    },

    scrollEscalar: function () {
      window.setTimeout(() => {
        this.$refs.btnEscalar.scrollIntoView({behavior: 'smooth'})
      }, 1000)
    },

    processarTempo: function () {
      if (this.status) {
        // moment.locale('pt-BR')
        let fechamento = moment.unix(this.status.fechamento.timestamp)
        this.setIntervalFechamento = window.setInterval(() => {
          let diff = fechamento.diff(moment(), 'unix')
          this.tempoParaFechamento = moment(diff).utc().format('HH:mm:ss')
        }, 1000)
      }
    },

    alteraEsquema: function () {
      for (let a in this.timeMontado) {
        if (this.timeMontado[a]) {
          let nome = this.$kartolafc.esquemas.esquemas[this.esquema].posicao[a]
          if (this.mercado.posicoes[this.timeMontado[a].posicao_id].nome !== nome) {
            this.timeMontado[a] = undefined
          }
        }
      }
    }
  },

  created: function () {
    this.init()
    this.getTimes()
    for (let i = 0; i < 12; i++) {
      this.itensGerados.push(i)
    }
  },

  computed: {
  },

  watch: {
    time: function (n, old) {
      this.time.atletas.sort((a, b) => a.posicao_id > b.posicao_id ? 1 : -1)
      this.timeMontado = []
      for (let a of n.atletas) {
        this.timeMontado.push(a)
      }
      this.esquema = this.time.esquema_id
    },
    timeMontado: function (n) {
      let montado = this.timeMontado.some(e => e === undefined)
      if (this.ativarComponente) {
        this.ativarComponente = montado
      }
      // realiza o scroll até o botao de escalar
      if (!montado && !this.timeIgual()) {
        this.scrollEscalar()
      }
      this.calculaTime()
    },

    esquema: function (n) {
      this.time.esquema_id = n
      this.alteraEsquema()
    }
  },

  beforeDestroy: function () {
    window.clearInterval(this.setIntervalFechamento)
  }
}
</script>

<style scoped>
.section {
  padding-top: 1rem;
}

.table {
  margin-bottom: .5rem !important;
}

td {
  padding: .2rem .5rem !important;
  font-weight: bold;
  font-size: .8rem;
  border: none !important;
}

.escudo-lado {
  left: 32px;
  bottom: 18px
}

.fa-check-green {
  color: #21a021;
}

.button-expand {
  width: 100%;
}

.escalacao-enter-active, .escalacao-leave-active {
  transition: opacity .2s
}
.escalacao-enter, .escalacao-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}

.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
.fa-color-red {
  color: red;
}

.campos-descricao-atleta {
  font-size: .9rem;
  font-weight: bold; 
  display: inline-block;
  max-width: 3.8rem;
  min-width: 2rem;
  text-align: center;
}

.campos-descricao-atleta-jogos {
  max-width: 10rem !important;
}

.button-size-default {
  width: 100%;
  margin-left: 0%;
  margin-right: 10%;
}

.box {
  background-color: rgba(230, 230, 230, 0.52);
  padding-left: .5rem;
}

.campos-descricao-jogo {
  display: inline-block;
  max-width: 19rem;
}

.image-escudo {
  height: 1.5rem;
  width: 1.5rem;
}

.status-jogo {
  height: 7px;
  width: 7px;
  border-radius: 50%;
  display: inline-block;
  margin-left: .1rem;
}

.status-jogo-vitoria {
  background: green;
}

.status-jogo-empate {
  background: #b5b5b5;
}

.status-jogo-derrota {
  background: red;
}

.escalacao-scroll {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 38rem;
   min-height: 15rem; 
}

.escalacao-scroll::-webkit-scrollbar {
    width: 4px;
}
 
.escalacao-scroll::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}

.scouts-geral-enter-active, .scouts-geral-leave-active {
  transition: opacity .2s
}
.scouts-geral-enter, .scouts-geral-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}

.popup2 {
  position: fixed;
  top: 25%;
  left: 10%;
  width: 75%;
  padding: 16px;
  border: 4px solid #3273dc;
  background-color: white;
  z-index: 1002;
  overflow: auto;
  transition: all .6s ease-in-out;
}

@keyframes bounce-in {
  from, 60%, 75%, 90%, to {
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }

  from {
    opacity: 0;
    transform: translate3d(0, 3000px, 0);
  }

  60% {
    opacity: 1;
    transform: translate3d(0, 20px, 0);
  }

  75% {
    transform: translate3d(0, 10px, 0);
  }

  90% {
    transform: translate3d(0, 5px, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

@media screen and (max-width: 768px) {
  .campos-descricao-atleta {
    font-size: .8rem;
    max-width: 2.8rem;
    min-width: 2rem;    
  }

  .image-escudo {
    height: 1.3rem;
    width: 1.3rem;
  }

  .escalacao-scroll {
    overflow-y: auto;
    max-height: none;
  }
}
</style>
