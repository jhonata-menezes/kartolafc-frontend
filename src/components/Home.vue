<template>
  <div>
  <div class="section">
    <div class="container">
      <div class="heading">
        <h2 class="title has-text-centered">KartolaFC mostra a pontuação de seu time e colegas</h2>
      </div>
      <div>
        <div class="columns">
          <div class="column is-4" v-if="status.status_mercado === 2">
            <div class="section">
              <p class="title">Pontuação</p>
              <div>
                <input type="text" class="input" placeholder="Nome" v-model="pesquisaNomeAtletaPontuacao">
              </div>
              <div class="card" v-for="atleta of atletasPontuados.slice(0, quantidadePontuacao())">
                <div class="card-content">
                  <div class="media">
                    <div class="media-left">
                      <figure class="image is-64x64">
                        <img :src="atleta.foto" alt="Image">
                      </figure>
                    </div>
                    <div class="media-content">
                      <p class="title is-4">{{ atleta.apelido }}</p>
                      <div class="subtitle is-6">
                        <p>Pontuação: {{ atleta.pontuacao }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="panel">
                <button class="button is-primary is-outlined is-fullwidth" @click="mostrarTodosPontuacao = !mostrarTodosPontuacao">
                  <span v-if="mostrarTodosPontuacao">Ocultar Lista</span>
                  <span v-else>Mostrar a Lista</span>
                </button>
              </div>
            </div>
          </div>
          <div class="column is-4">
            <div class="section">
              <p class="title">Mais Escalados</p>
              <div class="card" v-for="destaque of destaques.slice(0, quantidadeDestaques())">
                <div class="card-content">
                  <div class="media">
                    <div class="media-left">
                      <figure class="image is-64x64">
                        <img :src="destaque.Atleta.foto" alt="Image">
                      </figure>
                    </div>
                    <div class="media-content">
                      <p class="title is-4">{{ destaque.Atleta.apelido }}</p>
                      <div class="subtitle is-6">
                        <p>Escalações: {{ destaque.escalacoes }}</p>
                        <p>Preço: ${{ destaque.Atleta.preco_editorial }}</p>
                        <p>Posição: {{ destaque.posicao }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="panel">
                <button class="button is-primary is-outlined is-fullwidth" @click="mostrarTodosDestaques = !mostrarTodosDestaques">
                  <span v-if="mostrarTodosDestaques">Ocultar Lista</span>
                  <span v-else>Mostrar a Lista</span>
                </button>
              </div>
            </div>
          </div>
          <div class="column is-5">
            <div class="section">
            <p class="title">Meu Time</p>
              <div>
                <div v-if="meuTime.time">
                  <div class="card">
                    <div class="card-content">
                      <div class="media">
                        <div class="media-left">
                          <figure class="image is-64x64">
                          <img :src="meuTime.time.url_escudo_svg" alt="Escudo">
                          </figure>
                        </div>
                        <div class="media-left">
                          <figure class="image is-64x64">
                          <img :src="meuTime.time.foto_perfil" alt="Perfil Facebook">
                          </figure>
                        </div>
                        <div class="media-content">
                          <div class="container">
                            <h4 class="title is-4">{{ meuTime.time.nome }}</h4>
                            Cartoleiro: <h5 class="title is-5">{{ meuTime.time.nome_cartola }}</h5>
                          </div>
                        </div>
                      </div>
                      <a class="link" @click="limparMeuTime">Apagar Meu Time</a>
                    </div>           
                  </div>
                </div>
                <div v-else>
                  <div class="field is-grouped">
                    <input type="text" class="input is-3" v-model="pesquisaTimes" placeholder="Nome ou cartoleiro do seu time" @keyup.enter="searchTimes"><button @click="searchTimes" class="button is-light control">Pesquisar</button>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {http} from './../axios'
import db from './../dexie'

export default {
  data () {
    return {
      retornoTimes: [],
      pesquisaTimes: '',
      destaques: [],
      mostrarTodosDestaques: false,
      meuTime: {},
      mercadoAberto: true,
      pontuados: {},
      pesquisaNomeAtletaPontuacao: '',
      mostrarTodosPontuacao: false,
      status: {}
    }
  },
  methods: {
    searchTimes: function () {
      event.preventDefault()
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
    },

    getStatus: function () {
      var self = this
      http.get('/mercado/status').then(function (r) {
        if (r.data) {
          self.status = r.data
        } else {
          self.status = {}
        }
      })
    },

    getDestaques: function () {
      var self = this
      http.get('/mercado/destaques').then(r => {
        self.destaques = r.data
      })
    },

    quantidadeDestaques: function () {
      return this.mostrarTodosDestaques ? 100 : 3
    },

    quantidadePontuacao: function () {
      return this.mostrarTodosPontuacao ? 100 : 3
    },

    getPontuados: function () {
      if (this.mercadoAberto) {
        var self = this
        http.get('/atletas/pontuados').then(r => {
          self.pontuados = r.data
        })
      }
    },

    getMeuTime: function () {
      var self = this
      db.meuTime.toArray().then(function (time) {
        if (time.length === 1) {
          self.meuTime = time[0]
        }
      }).catch(function (err) {
        console.log(err)
      })
    },

    setMeuTime: function (time) {
      var self = this
      db.meuTime.clear()
      http.get('/time/id/' + time.time_id).then(function (r) {
        db.meuTime.put(r.data).then(function () {
          self.getMeuTime()
          console.log('time salvo ou atualizado')
        }).catch(err => {
          console.log('erro ao salvar meu time', err)
        }).catch(err => { console.log('endpoint nao respondeu', err) })
      })
    },

    limparMeuTime: function () {
      db.meuTime.clear()
      this.meuTime = {}
    }
  },
  mounted: function () {
    this.getDestaques()
    this.getMeuTime()
    this.getPontuados()
    this.getStatus()
  },

  computed: {
    atletasPontuados: function () {
      if (this.pontuados.atletas) {
        var searchLowerCase = this.pesquisaNomeAtletaPontuacao.toLowerCase()
        var matches = []
        let atletas = this.pontuados.atletas
        for (let k in atletas) {
          if (atletas.hasOwnProperty(k)) {
            if (atletas[k].apelido.toLowerCase().indexOf(searchLowerCase) >= 0) {
              matches.push(atletas[k])
            }
          }
        }
        // ordenando por pontuacao
        matches.sort(function (a, b) {
          if ((typeof b.pontuacao === 'undefined' && typeof a.pontuacao !== 'undefined') || a.pontuacao < b.pontuacao) {
            return 1
          }
          if ((typeof a.pontuacao === 'undefined' && typeof b.pontuacao !== 'undefined') || a.pontuacao > b.pontuacao) {
            return -1
          }
          return 0
        })
        return matches
      }
      return []
    }
  }
}
</script>

<style scoped>
</style>
