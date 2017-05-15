<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <h3 class="title is-3">Times</h3>
            <div>
              <div>
                <div class="field is-grouped">
                  <input type="text" class="input control" v-model="pesquisaTimes" placeholder="Adicionar Times" @keyup.enter="searchTimes">
                  <button @click="searchTimes" class="button is-success control">Pesquisar</button>
                  <button @click="retornoTimes = []" class="button is-danger control">Limpar</button>
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
                            
                            <a class="is-link" @click="salvarTime(k)">Adicionar</a>
                          </p>
                        </div>
                      </div>
                      <div class="media-right">
                        <figure class="image is-32x32">
                          <small>Pró</small>
                          <img class="" :src="time.assinante ? '/static/img/afirmativo.png' : '/static/img/negativo.png'">
                        </figure>
                      </div>
                      <div class="media-right">
                        <figure class="image is-32x32">
                          <small>Adicionar</small>
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
            <div class="card" v-for="time of times">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-96x96">
                      <img :src="time.url_escudo_svg" alt="Image">
                    </figure>
                  </div>
                  <div class="media-left">
                    <figure class="image is-96x96">
                      <img :src="time.foto_perfil" alt="Image">
                    </figure>
                  </div>
                  <div class="media-content">
                    <p class="title is-4">{{ time.apelido }}</p>
                    <div class="subtitle is-6">
                      <p>Pontuação: {{ time.pontuacao }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {http} from './../../axios'
import db from './../../dexie'

export default {
  data () {
    return {
      times: [],
      retornoTimes: [],
      pesquisaTimes: ''
    }
  },
  methods: {
    getTimesDatabase: function () {
      var self = this
      db.meusTimes.toArray().then(function (times) {
        if (times.length >= 1) {
          self.times = times
        }
      }).catch(function (err) {
        console.log(err)
      })
    },

    salvarTime: function (k) {
      var self = this
      db.meusTimes.put(self.retornoTimes[k]).then(function (item) {
        self.$set(self.retornoTimes[k], 'existe_database', true)
      }).catch(err => { console.log(err) })
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
        var self = this
        http.get('/times/' + this.pesquisaTimes).then(function (r) {
          if (r.data.times) {
            self.retornoTimes = r.data.times
          } else {
            self.retornoTimes = []
          }
        })
      }
    }
  },
  mounted: function () {
    this.getTimesDatabase()
  },
  computed: {
    //
  }
}
</script>

<style scoped>
</style>
