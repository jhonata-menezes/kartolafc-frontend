<template>
  <div>
    <section v-if="liga.liga" :class="loader ? 'clareamento': ''">
      <section class="hero is-success">
        <div class="hero-body">
          <div class="container">
            <div class="columns">
              <div class="column is-half is-offset-one-quarter">
                <div class="media">
                  <div class="media-right">
                    <picture class="image is-32x32">
                      <img :src="liga.liga.url_flamula_svg" @error="liga.liga.url_flamula_svg='/static/img/icon.png'">
                    </picture>
                  </div>
                  <div class="media-content">
                    <p class="title is-5">
                      {{liga.liga.nome}}
                      <a class="button is-small is-success" v-if="!detalhesLiga" @click="detalhesLiga = !detalhesLiga">+ Detalhes</a>
                      <a class="button is-small is-success" v-else @click="detalhesLiga = !detalhesLiga">- Detalhes</a>
                    </p>
                    <p class="subtitle is-6">
                      <div class="" v-if="detalhesLiga">
                        <small>Descrição: {{liga.liga.descricao}}</small>
                        <small>Tipo: {{liga.liga.tipo === 'F' ? 'Fechada' : liga.liga.tipo}}</small></br>
                        <small>Total de Times: {{liga.liga.total_times_liga}}</small></br>
                        <small v-if="presidente">Presidente: {{presidente}}</small>
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section section-min">
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <div class="field is-grouped is-grouped-centered">
               <p class="control">
                <span class="select is-small">
                  <select v-model="timesPontuacao.nome" @change="timesPontuacao.somarPontuacao = false">
                    <option value="padrao" selected>Atual</option>
                    <option value="rodada">Rodada</option>
                    <option value="mes">Mes</option>
                    <option value="turno">Turno</option>
                    <option value="campeonato">Campeonato</option>
                    <option value="patrimonio">Patrimônio</option>
                  </select>
                </span>
              </p>
              <p class="control">
                <label class="checkbox is-small" :disabled="timesPontuacao.nome === 'padrao' || timesPontuacao.nome === 'patrimonio'">
                  <input class="is-small" type="checkbox" :disabled="timesPontuacao.nome === 'padrao' || timesPontuacao.nome === 'patrimonio'"
                  v-model="timesPontuacao.somarPontuacao" :checked="timesPontuacao.somarPontuacao && timesPontuacao.nome !== 'padrao' && timesPontuacao.nome !== 'patrimonio'">
                  Somar
                </label>
              </p>
              <p class="control">
                <button class="tag button is-warning is-small" @click="getLiga()">Atualizar</button>
              </p>
            </div>
            <div class="content has-text-centered">
              <small class="is-6 subtitle">Clique no time para ver a escalação</small>
            </div>
            <div class="media">
              <div class="media-content">
                <div v-for="time of timesComputed" class="">
                  <p @click="verTime(time)">
                    <picture class="image is-24x24 is-pulled-left">
                      <img :src="time.url_escudo_svg" @error="time.url_escudo_svg='/static/img/icon.png'">
                    </picture>
                    <span class="i">{{time.nome.substring(0,15)}}</span>
                    <b><small v-if="!timesPontuacao.somarPontuacao && time.pontuacao !== undefined" class="is-6 is-pulled-right">{{ time.pontuacao.toFixed(2) }} &nbsp</small></b>
                    <small class="is-6 is-pulled-right" v-if="!timesPontuacao.somarPontuacao && timesPontuacao.nome !== 'padrao' && timesPontuacao.nome !== 'patrimonio'">{{time.pontos[timesPontuacao.nome].toFixed(2)}} &nbsp</small>
                    <b><small class="is-6 is-pulled-right" v-if="timesPontuacao.somarPontuacao && timesPontuacao.nome !== 'padrao' && timesPontuacao.nome !== 'patrimonio'">{{ (time.pontos[timesPontuacao.nome] + time.pontuacao).toFixed(2) }} &nbsp</small></b>
                    <small class="is-6 is-pulled-right" v-if="!timesPontuacao.somarPontuacao && timesPontuacao.nome === 'patrimonio'">$ {{time.patrimonio.toFixed(2)}} &nbsp</small>
                  </p>

                  <hr class="hr">
                </div>
              </div>
            </div>
          </div>
        </div>
        <escalacao-time :timemodal="modal.time" :active="modal.ativar" @update:active="val => modal.ativar = val" ></escalacao-time>
        <div v-show="loader">
          <div class="loader-request"></div>
        </div>
      </section>
    </section>
  </div>
  
</template>

<script>
import db from './../../dexie'
import {http} from './../../axios'
import EscalacaoTime from './../shared/EscalacaoTime'

export default {

  components: {
    'escalacao-time': EscalacaoTime
  },

  data () {
    return {
      modal: {
        time: {},
        ativar: false
      },
      slug: '',
      liga: {},
      timesSort: [],
      timesCompleto: [],
      pontuados: {},
      presidente: '',
      loader: false,
      ligasASeremGravadas: {},
      timesPontuacao: {
        nome: 'padrao',
        somarPontuacao: false
      },
      timesLigaPorAtletaId: [],
      detalhesLiga: false
    }
  },

  methods: {
    getLiga: function () {
      this.slug = this.$route.params.slug
      this.getLigaRequest()
    },

    verTime: function (time) {
      this.$kartolafc.time.getTime(time.time_id, t => {
        this.modal.ativar = true
        this.modal.time = t
      })
    },

    getLigaRequest: function () {
      this.$Progress.start()
      this.loader = true
      db.ligas.get(this.slug).then(r => {
        if (r) {
          this.liga = r
          this.getPontuados()
        } else {
          http.get('/liga/' + this.slug + '/' + 1).then(r => {
            if (r.data) {
              if (r.data.liga.total_times_liga > 100) {
                this.fimPesquisaComErro('Liga com mais de 100 times, não é possivel adicionar')
                return
              }
              for (let i = 0; i <= parseInt(parseInt(r.data.liga.total_times_liga) / 20); i++) {
                if (i === 6) {
                  break
                }
                // salva os times na tabela de times
                this.ligasASeremGravadas = {}
                this.salvarTimesLigaPage(this.slug, (i + 1), l => {
                  db.ligas.get(this.slug, item => {
                    this.$Progress.increase(10)
                    if (this.ligasASeremGravadas.times) {
                      this.ligasASeremGravadas.times = this.ligasASeremGravadas.times.concat(l.times)
                    } else {
                      this.ligasASeremGravadas = l
                    }
                    if (this.ligasASeremGravadas.times.length >= parseInt(this.ligasASeremGravadas.liga.total_times_liga)) {
                      this.liga = this.ligasASeremGravadas
                      this.getPontuados()
                      db.ligas.put(this.ligasASeremGravadas).catch(err => {
                        console.log(err)
                      })
                    }
                  })
                })
              }
            }
          })
        }
        this.$Progress.finish()
      })
    },

    salvarTimesLigaPage: function (liga, page, callback) {
      http.get('/liga/' + liga + '/' + page).then(r => {
        if (r.data) {
          callback(r.data)
        }
      })
    },

    getPontuados: function () {
      this.$kartolafc.pontuados.getPontuados(p => {
        this.pontuados = p
        if (this.liga.times) {
          this.timesSort = []
          this.liga.times.forEach((e, k) => {
            this.$kartolafc.time.getTime(e.time_id, t => {
              if (!this.timesCompleto[e.time_id]) {
                this.$set(this.timesCompleto, e.time_id, t)
              }

              if (t.time.time_id === this.liga.liga.time_dono_id) {
                this.presidente = t.time.nome
              }

              let soma = 0
              for (let atl of t.atletas) {
                if (p.atletas[atl.atleta_id]) {
                  soma += p.atletas[atl.atleta_id].pontuacao
                }
              }
              if (this.liga.times[k].pontuacao !== undefined) {
                this.liga.times[k].pontuacao = soma
              } else {
                this.$set(this.liga.times[k], 'pontuacao', soma)
              }
              this.timesSort.push(this.liga.times[k])
            })
          }, this)
        }
        this.loader = false
        this.$Progress.finish()
      })
    },

    fimPesquisaComErro: function (msg) {
      this.$Progress.finish()
      this.loader = false
      this.$kartolafc.toast.error(msg)
    }
  },

  mounted: function () {
    this.getLiga()
  },

  computed: {
    timesComputed: function () {
      this.timesSort.sort((time1, time2) => {
        let p1 = parseFloat(time1.pontuacao)
        let p2 = parseFloat(time2.pontuacao)
        if (this.timesPontuacao.nome === 'padrao') {
          if (p1 < p2) return 1
          if (p1 > p2) return -1
          return 0
        } if (this.timesPontuacao.somarPontuacao === true && this.timesPontuacao.nome !== 'padrao' && this.timesPontuacao.nome !== 'patrimonio') {
          if ((p1 + time1.pontos[this.timesPontuacao.nome]) < (p2 + time2.pontos[this.timesPontuacao.nome])) return 1
          if ((p1 + time1.pontos[this.timesPontuacao.nome]) > (p2 + time2.pontos[this.timesPontuacao.nome])) return -1
          return 0
        } if (this.timesPontuacao.nome === 'patrimonio') {
          if (time1.patrimonio === time2.patrimonio) return 0
          return time1.patrimonio < time2.patrimonio ? 1 : -1
        } else {
          if (time1.ranking[this.timesPontuacao.nome] ===
          time2.ranking[this.timesPontuacao.nome]) return 0
          return time1.ranking[this.timesPontuacao.nome] >
          time2.ranking[this.timesPontuacao.nome] ? 1 : -1
        }
      })

      return this.timesSort
    }
  }
}
</script>

<style scoped>
.hr {
  margin: 0.4rem 0.4rem;
  clear: both;
  padding-top: 1px;
  margin-bottom: 1px;
}

.section-min {
  padding: 0rem 1.5rem;
}
</style>

