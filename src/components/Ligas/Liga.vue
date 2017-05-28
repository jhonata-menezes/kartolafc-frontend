<template>
  <div>
    <section v-if="liga.liga">
      <section class="hero is-success">
        <div class="hero-body">
          <div class="container">
            <div class="columns">
              <div class="column is-half is-offset-one-quarter">
                <div>
                  <p class="title is-5">
                    {{liga.liga.nome}}
                  </p>
                  <p class="subtitle is-6">
                    <div class="media-left">
                      <picture class="image is-64x64 is-pulled-right">
                        <img :src="liga.liga.url_flamula_svg">
                      </picture>
                    </div>
                    <div class="">
                      <small>Descrição: {{liga.liga.descricao}}</small><p></p>
                      <small>Tipo: {{liga.liga.tipo === 'F' ? 'Fechada' : liga.liga.tipo}}</small><p></p>
                      <small>Total de Times: {{liga.liga.total_times_liga}}</small><p></p>
                      <small v-if="presidente">Presidente: {{presidente}}</small>
                    </div>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <div class="media">
              <div class="media-content">
                <div v-for="time of timesComputed" class="">
                  <p>
                    <picture class="image is-24x24 is-pulled-left">
                      <img :src="time.url_escudo_svg">
                    </picture>
                    <span class="i">{{time.nome}}</span>
                    <a class="button is-info is-small is-pulled-right" @click="verTime(time)">Time</a>
                    <b><small v-if="time.pontuacao !== undefined" class="is-6 is-pulled-right">{{ time.pontuacao.toFixed(2) }} &nbsp</small></b>
                  </p>

                  <hr class="hr">
                </div>
              </div>
            </div>
          </div>
        </div>
        <escalacao-time :timemodal="modal.time" :active="modal.ativar" @update:active="val => modal.ativar = val" ></escalacao-time>
      </section>
    </section>
  </div>
  
</template>

<script>
import db from './../../dexie'
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
      presidente: ''
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
      db.ligas.get(this.slug).then(r => {
        if (r) {
          this.liga = r
          this.getPontuados()
        }
        this.$Progress.finish()
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
      })
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
        if (p1 < p2) return 1
        if (p1 > p2) return -1
        return 0
      })
      return this.timesSort
    }
  }
}
</script>

<style scoped>
.hr {
  margin: 0.4rem 0.4rem
}

</style>

