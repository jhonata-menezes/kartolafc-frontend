<template>
  <div>
     <section class="section" :class="loader ? 'clareamento': ''">
      <div class="container">
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <h3 class="title is-3">Ligas</h3>
            <div>
              <div>
                <div class="field">
                  <p class="control">
                    <input type="text" class="input" v-model="pesquisaLigas" placeholder="Pesquisar Ligas" @keyup.enter="searchLigas">
                  </p>
                </div>
                <div class="field">
                  <p class="control">
                    <button @click="searchLigas" class="button is-success">Pesquisar</button>
                  </p>
                </div>
                <div v-for="(liga, k) of ligas">
                  <div class="">
                    <div class="media">
                      <div class="media-left">
                        <figure class="image is-48x48">
                          <img :src="liga.imagem" alt="Escudo" @error="defaultImage(liga)">
                        </figure>
                      </div>
                      <div class="media-content">
                        <div class="content">
                          <p>
                            <strong class="title is-5">{{ liga.nome }}</strong>
                            <br/>
                            <small class="subtitle is-6 is-small is-clearfix">Descricao: {{ liga.descricao }}</small>
                            <small class="is-clearfix">Tipo: {{ liga.tipo }}</small>
                            <a class="is-link" @click="salvarLiga(liga)">Adicionar liga</a>
                          </p>
                        </div>
                      </div>
                    </div>
                </div>
                <hr class='hr'>
              </div>
              <div>
                <div v-for="(l, k) of minhasLigas">
                  <div class="card-content">
                    <div class="media">
                      <div class="media-left">
                        <figure class="image is-48x48">
                          <img :src="l.liga.mata_mata ? l.liga.url_trofeu_svg : l.liga.url_flamula_svg" alt="Image">
                        </figure>
                      </div>
                      <div class="media-content">
                        <p class="title is-6"><b>{{ l.liga.nome }}</b></p>
                        <div class="subtitle is-6">
                          <p>{{ l.liga.descricao }}</p>
                          <div class="block">
                            <router-link class="button is-info is-small" :to="{name:'Liga', params: { slug: l.liga.slug }}">Ver Liga</router-link>
                            <a class="button is-danger is-small" @click="removerLiga(k)">Remover</a>
                          </div>
                        </div>
                      </div>
                    </div>
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
      <notificacao :ativar="modal.ativar" :mensagem="modal.mensagem" @update:ativar="v => modal.ativar=v"></notificacao>
      <div v-show="loader">
        <div class="loader-request"></div>
      </div>
    </section>
  </div>
</template>

<script>
import {http} from '@/axios'
import db from './../../dexie'
import ModalNotificacao from './../shared/ModalNotificacao'

export default {
  components: {
    'notificacao': ModalNotificacao
  },

  data () {
    return {
      modal: {
        mensagem: '',
        ativar: false
      },
      pesquisaLigas: '',
      ligas: [],
      ligasASeremGravadas: {},
      minhasLigas: [],
      loader: false
    }
  },
  methods: {
    searchLigas: function () {
      this.$Progress.start()
      this.loader = true
      http.get('/ligas/' + this.pesquisaLigas).then(r => {
        this.$Progress.finish()
        if (r.data) {
          this.ligas = r.data
        } else {
          this.ligas = []
        }
        this.loader = false
      }).catch(() => { this.loader = false })
    },

    salvarLiga: function (liga) {
      this.loader = true
      http.get('/liga/' + liga.slug + '/' + 1).then(r => {
        if (r.data) {
          if (r.data.times.length === 0) {
            this.fimPesquisaComErro('Nenhum time nesta liga')
            return
          }
          if (r.data.liga.total_times_liga > 500) {
            this.$kartolafc.toast.info('Liga com mais de 500 times, apenas os 500 primeiros serão adicionados')
          }
          this.$Progress.start()
          for (let i = 0; i <= parseInt(parseInt(r.data.liga.total_times_liga) / 20); i++) {
            if (i === 6) {
              break
            }
            // salva os times na tabela de times
            this.ligasASeremGravadas = {}
            this.salvarTimesLigaPage(liga, (i + 1), l => {
              db.ligas.get(l.liga.slug, item => {
                this.$Progress.increase(10)
                if (this.ligasASeremGravadas.times) {
                  this.ligasASeremGravadas.times = this.ligasASeremGravadas.times.concat(l.times)
                } else {
                  this.ligasASeremGravadas = l
                }
                if ((i + 1) >= 5 || (parseInt(l.liga.total_times_liga) / (20 * (i + 1))) < 1) {
                  db.ligas.put(this.ligasASeremGravadas).then(r => {
                    this.fimPesquisaComSucesso('Liga adicionada')
                    this.ligas = []
                  }).catch(err => {
                    this.fimPesquisaComErro('Não foi possivel adicionar a liga, tente novamente')
                    console.log(err)
                  })
                }
              })
            })
          }
        }
      })
    },

    fimPesquisaComSucesso: function (msg) {
      this.$Progress.finish()
      this.loader = false
      this.getMinhasLigas()
      this.$kartolafc.toast.success(msg)
    },

    fimPesquisaComErro: function (msg) {
      this.$Progress.finish()
      this.loader = false
      this.getMinhasLigas()
      this.$kartolafc.toast.error(msg)
    },

    salvarTimesLigaPage: function (liga, page, callback) {
      http.get('/liga/' + liga.slug + '/' + page).then(r => {
        if (r.data) {
          callback(r.data)
          r.data.times.forEach(time => {
            this.salvarTime(time.time_id)
          })
        }
      })
    },

    salvarTime: function (timeId) {
      this.$kartolafc.time.getTime(timeId, t => {
        db.meusTimes.update(timeId, {favorito_liga: true}).catch(err => { console.log(err) })
      })
    },

    getMinhasLigas: function () {
      db.ligas.toArray(d => {
        this.minhasLigas = d
      })
    },

    removerLiga: function (k) {
      db.ligas.delete(this.minhasLigas[k].liga.slug).then(r => {
        this.minhasLigas.splice(k, 1)
      }).catch(err => {
        console.log(err)
      })
    },

    defaultImage: function (liga) {
      liga.imagem = '/static/img/icon.png'
      return true
    }
  },

  created: function () {
    this.getMinhasLigas()
  }

}
</script>

<style>
.hr {
  margin: 0.3rem 0.3rem
}
  
</style>
