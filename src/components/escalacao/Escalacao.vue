<template>
  <div>
    <section class="section">
      <div>
        <div class="">
        </div>
        <div class="columns">
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
            <div class="field" v-if="status.status_mercado == 1">
              <label class="label">Selecione o time que deseja escalar</label>
            </div>
            <div class="field-body" v-if="status.status_mercado == 1">
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
            <div v-if="status.status_mercado == 1 && time.time && !ativarComponente">
              <div>
                <div>
                  <table class="table">
                    <tbody>
                      <tr>
                        <td>
                          Patrimônio <span class="has-text-success">${{time.patrimonio.toFixed(2)}}</span>
                        </td>
                        <td>
                          Preço do time <span class="has-text-success">${{precoTime()}}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>Resta <span class="has-text-success">${{ (time.patrimonio.toFixed(2) - precoTime()).toFixed(2) }}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
                        <span class="icon" v-if="timeMontado[i].status_id == 7"><i class="fa fa-check fa-check-green"></i></span>
                        <br>
                        <div class="campos-descricao-atleta">Preço ${{timeMontado[i].preco_num}}
                        Média {{timeMontado[i].media_num}}
                        Última {{timeMontado[i].pontos_num}}
                        Jogos {{timeMontado[i].jogos_num}}
                        </div>
                        <button class="button is-danger is-small" @click="$set(timeMontado, i, undefined)">Vender</button>
                      </p>
                    </div>
                  </div>
                </div>
                <div v-else class="media">
                  <div class="media-content">
                    <div class="content">
                      <p class="has-text-left">
                        <button class="button is-success is-medium" @click="pesquisarAtleta($kartolafc.esquemas.esquemas[time.esquema_id].posicao[i], i)">
                          <i class="fa fa-plus"></i>&nbsp{{$kartolafc.esquemas.esquemas[time.esquema_id].posicao[i]}}</button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="field">
                <p class="control">
                  <button class="button is-success is-large button-expand" :disabled="timeMontado.some(e => e === undefined)">Escalar Time</button>
                </p>
              </div>
              <div class="field">
                <p class="control">
                  <button class="button is-danger is-large button-expand" @click="timeMontado = timeMontado.map(e => undefined)">Vender Time</button>
                </p>
              </div>
            </div>
            <div v-if="ativarComponente && timeMontado.some(e => e === undefined)">
              <component :is="componentAtletaPosicao" :atletas="atletasComponente" 
              @update:selecionado="atl => {respostaComponente(atl)}" :timeMontado="timeMontado" :esquema="time.esquema_id"
              @update:posicao="p => {pesquisarAtleta($kartolafc.esquemas.esquemas[time.esquema_id].posicao[p], p)}">
              </component>
            </div>
          </div>
          <div class="column"></div>
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
      partida: {},
      atletasPosicao: []
    }
  },

  methods: {
    getTimes: function () {
      let times = this.$kartolafc.tokens.get()
      for (let t in times) {
        http.get('/time/info', {headers: {token: times[t].token}}).then(r => {
          if (r.data.time) {
            r.data.token = t
            this.times.push(r.data)
          }
        })
      }
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
        this.partida = r.data
      })
    },

    precoTime: function () {
      let soma = 0
      for (let t of this.time.atletas) {
        soma += t.preco_num
      }
      return soma.toFixed(2)
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
      // this.ativarComponente = false
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
        console.log(this.ativarComponente)
      }
    }
  }
}
</script>

<style>
.section {
  padding-top: 2rem;
}

.table {
  margin-bottom: .5rem !important;
}

td {
  padding: .2rem .5rem !important;
  font-weight: bold;
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
</style>
