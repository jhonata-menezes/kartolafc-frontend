<template>
  <div>
  <div class="section">
    <div class="container">
      <div class="heading">
        <h2 class="title has-text-centered">KartolaFC</h2>
      </div>
      <div>
        <div class="columns">
          <div class="column is-4" v-if="status.status_mercado === 2">
            <div class="section">
              <p class="title">Pontuação</p>
              <div>
                <input type="text" class="input" placeholder="Nome" v-model="pesquisaNomeAtletaPontuacao">
              </div>
              <div class="scrollabed">
                <div class="card" v-for="(atleta, k) of atletasPontuados">
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
                          <p>
                            Preço: ${{ getPrecoAtleta(atleta.atleta_id) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column is-4">
            <div class="section">
              <p class="title">Mais Escalados</p>
              <div class="scrollabed">
                <div class="card" v-for="destaque of destaques">
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
                          <p>Posição: {{ destaque.posicao }}</p>
                          <p>Preço: ${{ getPrecoAtleta(destaque.Atleta.atleta_id) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column is-5">
            <div class="section">
            <p class="title">Meu Time</p>
              <div class="scrollabed">
                <div v-if="meuTime.time">
                  <div class="card">
                    <div class="card-content">
                      <div class="media">
                        <div class="media-left">
                          <figure class="image is-48x48">
                          <img :src="meuTime.time.url_escudo_svg" alt="Escudo">
                          </figure>
                           <figure class="image is-48x48">
                          <img :src="meuTime.time.foto_perfil" alt="Perfil Facebook">
                          </figure>
                        </div>
                        <div class="media-content">
                          <div class="container">
                            <h5 class="title is-5">{{ meuTime.time.nome }}</h5>
                            <p>Cartoleiro: {{ meuTime.time.nome_cartola }}</p>
                          </div>
                          <p>Pontos: {{ calculaPontos(meuTime) }}</p>
                        </div>
                      </div>
                      <a class="link" @click="limparMeuTime">Remover</a>
                    </div>           
                  </div>
                </div>
                <div v-else>
                  <div class="field is-grouped">
                    <input type="text" class="input is-4" v-model="pesquisaTimes" placeholder="Time ou cartoleiro" @keyup.enter="searchTimes"><button @click="searchTimes" class="button is-light control">Pesquisar</button>
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
      meuTime: {},
      mercadoAberto: true,
      pontuados: {},
      pesquisaNomeAtletaPontuacao: '',
      status: {},
      mercado: {},
      mercadoAtletas: {}
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

    getStatus: function () {
      var self = this
      http.get('/mercado/status').then(function (r) {
        if (r.data) {
          self.status = r.data
        } else {
          self.status = {}
        }
        self.getMercado()
      })
    },

    getDestaques: function () {
      var self = this
      http.get('/mercado/destaques').then(r => {
        self.destaques = r.data
      })
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
          time = time[0]
          http.get('/time/id/' + time.time.time_id).then(function (r) {
            self.meuTime = r.data
          })
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
    },

    getMercadoRequest: function () {
      let self = this
      http.get('/atletas/mercado').then(function (r) {
        if (r.data) {
          self.mercado = r.data
          self.mercadoAtletaId()
          r.data.rodada_atual = self.status.rodada_atual
          db.mercado.put(r.data).catch(err => {
            console.log(err)
          })
        }
      })
    },

    getMercado: function () {
      if (this.status.rodada_atual) {
        let self = this
        db.mercado.get(this.status.rodada_atual, function (item) {
          if (item) {
            self.mercado = item
            self.mercadoAtletaId()
          } else {
            self.getMercadoRequest()
          }
        })
      }
    },

    mercadoAtletaId: function () {
      if (this.mercado.atletas) {
        this.mercado.atletas.forEach(function (element) {
          this.$set(this.mercadoAtletas, element.atleta_id, element)
        }, this)
      }
    },

    getPrecoAtleta: function (atletaId) {
      if (atletaId && this.mercadoAtletas[atletaId]) {
        return this.mercadoAtletas[parseInt(atletaId)].preco_num
      }
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
              atletas[k].atleta_id = k
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

.scrollabed {
  overflow: auto;
  max-height: 350px;
}

</style>
