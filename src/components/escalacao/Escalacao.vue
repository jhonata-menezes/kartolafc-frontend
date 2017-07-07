<template>
  <div>
    <section class="section">
      <div>
        <div class="">
        </div>
        <div class="columns" v-if="existeTimes()">
          <div class="column is-offset-1 is-4">
            <div>
              <div class="notification is-danger" v-if="status.status_mercado == 4">
                <b>Mercado em manutenção</b><br>
              </div>
              <div class="notification is-success" v-if="status.status_mercado == 1">
                <strong>Mercado Aberto - Rodada {{status.rodada_atual}}</strong><br>
                Times Escalados {{status.times_escalados}}
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
                      <select v-model="time.esquema_id">
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
                  <div v-for="i in itensGerados" :key="i" class="box">
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
                             <span class="icon is-small" v-if="mercado.status" :title="mercado.status[timeMontado[i].status_id].nome"><i class="fa" :class="statusIcon[timeMontado[i].status_id]"></i></span>
                            <br>
                            <div class="campos-descricao-atleta">Preço  <span class="has-text-success">${{timeMontado[i].preco_num}}</span></div>
                            <div class="campos-descricao-atleta">Média <span :class="timeMontado[i].media_num < 0 ? 'has-text-danger': 'has-text-success'">{{timeMontado[i].media_num}}</span></div>
                            <div class="campos-descricao-atleta">Última <span :class="timeMontado[i].pontos_num < 0 ? 'has-text-danger': 'has-text-success'">{{timeMontado[i].pontos_num}}</span></div>
                            <div class="campos-descricao-atleta">Jogos  <span class="has-text-success">{{timeMontado[i].jogos_num}}</span></div>
                            <div>
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
                      <button class="button is-success is-large button-expand" :class="{'is-loading': salvandoTime}" :disabled="timeMontado.some(e => e === undefined)" @click="salvarTime()">Escalar Time</button>
                    </p>
                  </div>
                </div>
              </transition>
              <transition name="bounce" mode="out-in">
                <div v-if="ativarComponente && timeMontado.some(e => e === undefined)">
                  <component :is="componentAtletaPosicao" :atletas="atletasComponente" 
                  @update:selecionado="atl => {respostaComponente(atl)}" :timeMontado="timeMontado" :esquema="time.esquema_id"
                  @update:posicao="p => {pesquisarAtleta($kartolafc.esquemas.esquemas[time.esquema_id].posicao[p], p)}" 
                  :valores="valores" @update:ativar="a => {ativarComponente = a}" :partidas="partidas">
                  </component>
                </div>
              </transition>
            </div>
          </div>
          <div class="column">
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

export default {
  components: {
    'atletaPosicao': AtletaPosicao
  },
  data () {
    return {
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
      salvandoTime: false
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
      let posicaoId = 0
      for (let p in this.mercado.posicoes) {
        if (this.mercado.posicoes[p].nome === nomePosicao) {
          posicaoId = this.mercado.posicoes[p].id
          break
        }
      }
      this.atletasComponente = this.atletasPosicao[posicaoId]
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
      })
    }
  },

  created: function () {
    this.init()
    this.getTimes()
    for (let i = 0; i < 12; i++) {
      this.itensGerados.push(i)
    }
  },

  watch: {
    time: function (n) {
      this.time.atletas.sort((a, b) => a.posicao_id > b.posicao_id ? 1 : -1)
      this.timeMontado = []
      for (let a of n.atletas) {
        this.timeMontado.push(a)
      }
    },
    timeMontado: function (n) {
      if (this.ativarComponente) {
        this.ativarComponente = this.timeMontado.some(e => e === undefined)
      }
      this.calculaTime()
    }
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
.campos-descricao-atleta {
  font-size: .9rem;  
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
  animation: bounce-in .8s;
}
.bounce-leave-active {
  animation: bounce-in .8s reverse;
}
.fa-color-red {
  color: red;
}
.campos-descricao-atleta {
  font-size: .9rem;
  font-weight: bold; 
  display: inline-block;
  max-width: 3rem;
  min-width: 2rem;
  text-align: center;
}

.button-size-default {
  width: 100%;
  margin-left: 0%;
  margin-right: 10%;
}

.box {
  background-color: rgba(230, 230, 230, 0.52);
}

.campos-descricao-jogo {
  display: inline-block;
  max-width: 10rem;
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
    max-width: 2.5rem;
    min-width: 2rem;    
  }

  .image-escudo {
    height: 1.3rem;
    width: 1.3rem;
  }
}
</style>
