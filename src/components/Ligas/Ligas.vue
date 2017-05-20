<template>
  <div>
     <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <h3 class="title is-3">Ligas</h3>
            <div>
              <div>
                <div class="field">
                  <p class="control">
                    <input type="text" class="input" v-model="pesquisaLigas" placeholder="Pesquisar Ligas" autofocus @keyup.enter="searchLigas">
                  </p>
                </div>
                <div class="field">
                  <p class="control">
                    <button @click="searchLigas" class="button is-success ">Pesquisar</button>
                  </p>
                </div>
                <div v-for="(liga, k) of ligas">
                  <div class="box">
                    <div class="media">
                      <div class="media-left">
                        <figure class="image is-48x48">
                          <img :src="liga.imagem" alt="Escudo">
                        </figure>
                      </div>
                      <div class="media-content">
                        <div class="content">
                          <p>
                            <strong>{{ liga.nome }}</strong>
                            <br/>
                            <small>Descricao: </small> <small>{{ liga.descricao }}</small>
                            <br/>
                            <small>Tipo: </small> <small>{{ liga.tipo }}</small>
                            <br/>
                            <a class="is-link" @click="salvarTimesLiga(liga)">Adicionar times desta liga</a>
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
           <div>
          </div>
        </div>
      </div>
      </div>
    </section>
  </div>
</template>

<script>
import {http} from '@/axios'
import db from './../../dexie'

export default {
  data () {
    return {
      pesquisaLigas: '',
      ligas: []
    }
  },
  methods: {
    searchLigas: function () {
      var self = this
      http.get('/ligas/' + this.pesquisaLigas).then(function (r) {
        if (r.data) {
          self.ligas = r.data
        } else {
          self.ligas = []
        }
      })
    },

    salvarTimesLiga: function (liga) {
      var self = this
      http.get('/liga/' + liga.slug + '/' + 1).then(function (r) {
        if (r.data) {
          console.log(r.data.liga.total_times_liga, parseInt(parseInt(r.data.liga.total_times_liga) / 20))
          for (var i = 0; i <= parseInt(parseInt(r.data.liga.total_times_liga) / 20); i++) {
            if (i === 6) {
              break
            }
            self.salvarTimesLigaPage(liga, (i + 1))
          }
        }
      })
    },

    salvarTimesLigaPage: function (liga, page) {
      var self = this
      http.get('/liga/' + liga.slug + '/' + page).then(function (r) {
        if (r.data) {
          r.data.times.forEach(function (time) {
            self.salvarTime(time.time_id)
          })
        }
      })
    },

    salvarTime: function (timeId) {
      // var self = this
      db.meusTimes.put({time_id: timeId}).catch(err => { console.log(err) })
    }
  }
}
</script>

<style>
  
</style>
