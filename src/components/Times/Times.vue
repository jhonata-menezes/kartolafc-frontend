<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <h3 class="title is-3">Times</h3>
            <div>
              <div>
                <div class="field">
                  <p class="control">
                    <input type="text" class="input" v-model="pesquisaTimes" placeholder="Adicionar Times" autofocus @keyup.enter="searchTimes">
                  </p>
                </div>
                <div class="field">
                  <p class="control">
                    <button @click="searchTimes" class="button is-success ">Pesquisar</button>
                    <button @click="retornoTimes = []" class="button is-danger ">Limpar</button>
                    <button @click="retornoTimes = []" class="button"><router-link to="/ligas">Pesquisar times na liga</router-link></button>
                  </p>
                </div>
                <div v-for="(time, k) of retornoTimes">
                  <div class="box">
                    <div class="media">
                      <div class="media-left">
                        <figure class="image is-48x48">
                          <img :src="time.url_escudo_svg" alt="Escudo">
                        </figure>
                      </div>
                      <div class="media-left">
                        <figure class="image is-48x48">
                          <img :src="time.foto_perfil" alt="Escudo">
                        </figure>
                      </div>
                      <div class="media-content">
                        <div class="content">
                          <p>
                            <strong>{{ time.nome }}</strong>
                            <br/>
                            <small>Cartoleiro: </small> <small>{{ time.nome_cartola }}</small>
                            <br/>
                            
                            <a class="is-link" @click="salvarTime(k)" v-if="!time.existe_database">Adicionar</a>
                            <a class="is-link" @click="removerTime(k)" v-else="time.existe_database">Remover</a>
                          </p>
                        </div>
                      </div>
                      <div class="media-right">
                        <figure class="image is-32x32">
                          <small>Pró</small>
                          <img class="" :src="time.assinante ? '/static/img/afirmativo.png' : '/static/img/negativo.png'">
                        </figure>
                      </div>
                      <div class="media-right is-hidden-mobile">
                        <figure class="image is-32x32">
                          <small>&nbsp</small>
                          <div class="is-pulled-right">
                            <i @click="salvarTime(k)" :class="existeTimeDatabase(k) && time.existe_database ? 'fa fa-star fa-2x' : 'fa fa-star-o fa-2x'" aria-hidden="true"></i>
                          </div>
                        </figure>
                      </div>
                    </div>
                  <div>
                  </div>
                </div>
              </div>
            </div>
            </div>
           <div>
             <br/>
            <div class="card" v-for="(time, k) of timesOrdenados">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-48x48">
                      <img :src="time.time.url_escudo_svg" alt="Image">
                    </figure>
                  </div>
                  <div class="media-left is-hidden-mobile">
                    <figure class="image is-32x32">
                      <img :src="time.time.foto_perfil" alt="Image">
                    </figure>
                  </div>
                  <div class="media-content">
                    <p class="title is-6">{{ time.time.nome }}</p>
                    <div class="subtitle is-6">
                      <p>{{ time.time.nome_cartola }}</p>
                      <p>Pontos: {{ calculaPontos(time) }}</p>
                      <p v-if="status.status_mercado === 2">Posição Geral: {{ time.posicao }}</p>
                      <div class="block">
                        <a class="button is-info is-small" @click="ativarModal(time)">Ver Time</a>
                        <a class="button is-danger is-small" @click="removerTimeLista(k)">Remover</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
    <escalacao-time :timemodal="modal.time" :active="modal.active" @update:active="val => modal.active = val" ></escalacao-time>
  </div>
</template>

<script>
import {http} from './../../axios'
import db from './../../dexie'
import TemplateTime from './../shared/EscalacaoTime'

export default {
  data () {
    return {
      modal: {
        active: false,
        time: {}
      },
      times: [],
      retornoTimes: [],
      pesquisaTimes: '',
      pontuados: {},
      status: {}
    }
  },
  methods: {
    getTimesDatabase: function () {
      this.times = []
      db.meusTimes.toArray().then(times => {
        if (times.length >= 1) {
          times.forEach(function (element) {
            if (status.status_mercado === 2 && element.status_mercado !== 2) {
              this.atualizaDadosTimes(times)
            } else {
              this.times.push(element)
            }
          }, this)
        }
      }).catch(function (err) {
        console.log(err)
      })
    },

    atualizaDadosTimes: function (times) {
      times.forEach((time, k) => {
        db.meusTimes.delete(time.time.time_id).then(() => {
          this.$kartolafc.time.getTime(time.time.time_id, t => {
            this.getRankingGeral(t, data => {
              this.times.push(data)
            })
          })
        })
      })
    },

    salvarTime: function (k) {
      this.addTimeAposSalva(this.retornoTimes[k].time_id)
      this.retornoTimes.splice(k, 1)
    },

    addTimeAposSalva: function (timeId) {
      this.$kartolafc.time.getTime(timeId, t => {
        this.times.push(t)
      })
    },

    removerTime: function (k) {
      db.meusTimes.delete(self.retornoTimes[k].time_id).then(item => {
        this.$set(this.retornoTimes[k], 'existe_database', false)
      }).catch(err => { console.log(err) })
    },

    removerTimeLista: function (k) {
      db.meusTimes.delete(this.times[k].time.time_id).then(item => {
        this.times.splice(k, 1)
      }).catch(err => { console.log(err) })
    },

    getRankingGeral: function (time, callback) {
      http.get('/ranking/time/id/' + time.time.time_id).then(function (r) {
        if (r.data.posicao >= 1) {
          time.posicao = r.data.posicao
          callback(time)
        }
      })
      return true
    },

    calculaPontos: function (time) {
      let total = 0
      let self = this
      if (!time.atletas || !self.pontuados.atletas) {
        return 0
      }
      time.atletas.forEach(function (atleta) {
        if (self.pontuados.atletas[atleta.atleta_id]) {
          total += self.pontuados.atletas[atleta.atleta_id].pontuacao
        }
      })
      return total.toFixed(2)
    },

    existeTimeDatabase: function (k) {
      if (k >= 0) {
        let self = this
        db.meusTimes.get(this.retornoTimes[k].time_id, function (item) {
          if (item) {
            self.$set(self.retornoTimes[k], 'existe_database', true)
          } else {
            self.$set(self.retornoTimes[k], 'existe_database', false)
          }
        })
      }
      return true
    },

    searchTimes: function () {
      if (this.pesquisaTimes) {
        http.get('/times/' + this.pesquisaTimes).then(r => {
          if (r.data.times) {
            this.retornoTimes = r.data.times
          } else {
            this.retornoTimes = []
          }
        })
      }
    },

    ativarModal: function (time) {
      this.modal.active = true
      this.modal.time = time
    }

  },
  mounted: function () {
    this.getTimesDatabase()
  },

  computed: {
    timesOrdenados: function () {
      let self = this
      let times = this.times
      times.sort(function (a, b) {
        let time1 = parseFloat(self.calculaPontos(a))
        let time2 = parseFloat(self.calculaPontos(b))
        if (time1 < time2) {
          return 1
        }
        if (time1 > time2) {
          return -1
        }
        return 0
      })
      return times
    },

    timesComputed: function () {
      //
    }
  },

  created: function () {
    this.$kartolafc.pontuados.getPontuados(p => {
      this.pontuados = p
    })
  },

  components: {
    'escalacao-time': TemplateTime
  }
}
</script>

<style scoped>
</style>
