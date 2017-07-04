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
            <div v-if="status.status_mercado == 1 && time.time">
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
              <div v-for="(atleta, atletaId) of atletasSort" :key="atletaId" class="box">
                <div class="media">
                  <div class="media-left">
                    <picture class="image is-64x64">
                      <img :src="atleta.foto">
                    </picture>
                    <picture class="image is-32x32 escudo-lado">
                      <img :src="mercado.clubes[atleta.clube_id].Escudos['45x45']">
                    </picture>
                  </div>
                  <div class="media-content">
                    <div class="content">
                      <p>
                        <strong>{{atleta.apelido}}</strong> <small>{{time.posicoes[atleta.posicao_id].abreviacao.charAt(0).toUpperCase() + time.posicoes[atleta.posicao_id].abreviacao.slice(1)}}</small>
                        <span class="icon" v-if="mercadoPorAltetaId[atleta.atleta_id].status_id == 7"><i class="fa fa-check"></i></span>
                        <br>
                        <div class="campos-descricao-atleta">Preço ${{atleta.preco_num}}
                        Média {{mercadoPorAltetaId[atleta.atleta_id].media_num}}
                        Última {{mercadoPorAltetaId[atleta.atleta_id].pontos_num}}
                        Jogos {{mercadoPorAltetaId[atleta.atleta_id].jogos_num}}
                        </div>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
export default {
  data () {
    return {
      times: [],
      time: {},
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
      partida: {}
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
        for (let atl of m.atletas) {
          this.mercadoPorAltetaId[atl.atleta_id] = atl
        }
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
    }
  },

  created: function () {
    this.init()
    this.getTimes()
  },

  computed: {
    atletasSort: function () {
      return this.time.atletas.sort((a, b) => a.posicao_id > b.posicao_id ? 1 : -1)
    }
  }
}
</script>

<style scoped>
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

.fa-check {
  color: #21a021;
}
</style>
