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
                      <span class="icon is-6 is-small" title="Copiar link" v-clipboard="clipboard()" @success="clipboardSuccess">
                        <i class="fa fa-clipboard" aria-hidden="true"></i>
                      </span><br><br>
                      <a class="button is-small is-success" v-if="!detalhesLiga" @click="detalhesLiga = !detalhesLiga">+ Detalhes</a>
                      <a class="button is-small is-success" v-else @click="detalhesLiga = !detalhesLiga">- Detalhes</a>
                      <social-sharing class="" hashtags="KartolaFC" :url="'https://kartolafc.com.br/#/liga/' + slug" :title="liga.liga.nome" :description="liga.liga.descricao" inline-template>
                        <span class="title is-5">
                          <network network="facebook">
                            <i class="fa fa-facebook"></i>
                          </network>&nbsp &nbsp
                          <network network="whatsapp">
                            <i class="fa fa-whatsapp"></i>
                          </network>&nbsp &nbsp
                          <network network="twitter">
                            <i class="fa fa-twitter"></i>
                          </network>&nbsp &nbsp
                          <network network="telegram">
                            <i class="fa fa-telegram"></i>
                          </network>
                        </span>
                      </social-sharing>
                    </p>
                    <p class="subtitle is-6">
                      <div class="" v-if="detalhesLiga">
                        <small>Descrição: {{liga.liga.descricao}}</small></br>
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
               <p class="control has-icons-right">
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
                <label class="checkbox is-small" :disabled="status.status_mercado !== 2 || timesPontuacao.nome === 'padrao' || timesPontuacao.nome === 'patrimonio'">
                  <input class="is-small" type="checkbox" :disabled="status.status_mercado !== 2 || timesPontuacao.nome === 'padrao' || timesPontuacao.nome === 'patrimonio'"
                  v-model="timesPontuacao.somarPontuacao" :checked="timesPontuacao.somarPontuacao && timesPontuacao.nome !== 'padrao' && timesPontuacao.nome !== 'patrimonio'">
                  Somar
                </label>
              </p>
              <p class="control">
                <button class="tag button is-warning is-small" @click="loader = true; getPontuados(true)">Atualizar</button>
              </p>
            </div>
            <div class="content has-text-centered">
              <p class="is-6 is-bold">Clique no time para ver a escalação</p>
            </div>
            <div class="media">
              <div class="media-content">
                <div v-for="(time, k) of timesComputed" class="">
                  <p @click="verTime(time)">
                    <small class="is-pulled-left">{{ k+1 }}°&nbsp</small>
                    <picture class="image is-24x24 is-pulled-left">
                      <img :src="time.url_escudo_svg" @error="time.url_escudo_svg='/static/img/icon.png'">
                    </picture>
                    <span class="">{{time.nome.substring(0,15)}}</span>
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
      timesPontuacao: {
        nome: 'padrao',
        somarPontuacao: false
      },
      detalhesLiga: false,
      status: {}
    }
  },

  methods: {
    getLiga: function () {
      this.slug = this.$route.params.slug
      this.getLigaRequest()
      this.$kartolafc.status.getStatus(s => {
        this.status = s
      })
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
      this.$kartolafc.liga.getLiga(this.slug, l => {
        if (parseInt(l.liga.total_times_liga) > 100) {
          this.$kartolafc.toast.info('Liga com mais de 100 times, apenas os 100 primeiros serão visualizados')
        }
        this.liga = l
        this.getPontuados()
        this.$Progress.finish()
      })
    },

    getPontuados: function (force = false) {
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
      }, force)
    },

    fimPesquisaComErro: function (msg) {
      this.$Progress.finish()
      this.loader = false
      this.$kartolafc.toast.error(msg)
    },

    clipboard: function () {
      return 'https://kartolafc.com.br/#/liga/' + this.slug
    },

    clipboardSuccess: function () {
      this.$kartolafc.toast.info('Link copiado')
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

