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
                  <input type="text" class="input control" v-model="pesquisaTimes" placeholder="Nome ou cartoleiro do seu time" @keyup.enter="searchTimes"><button @click="searchTimes" class="button is-light control">Pesquisar</button>
                </div>
                <div v-for="time of retornoTimes">
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
                            <strong>{{ time.nome }}</strong><br/>
                            <small>Cartoleiro: </small> <small>{{ time.nome_cartola }}</small><br/>
                            <a class="is-link" @click="setMeuTime(time)">Salvar</a>
                          </p>
                        </div>
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

    searchTimes: function () {
      if (this.pesquisaTimes) {
        var self = this
        http.get('/times/' + this.pesquisaTimes).then(function (r) {
          if (r.data.times) {
            self.retornoTimes = r.data.times
            // console.log(r.data)
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
  watch: {
    //
  }
}
</script>

<style scoped>
</style>
