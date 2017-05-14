<template>
  <div>
  <div class="section">
    <div class="container">
      <div class="heading">
        <h2 class="title has-text-centered">KartolaFC mostra a pontuação de seu time e colegas</h2>
      </div>
      <div>
        <div class="columns is-mobile">
  <div class="column is-one-third is-5">
    <div class="section">
      <p class="title">Jogadores Mais Escalados</p>
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
  <div class="column olumn is-one-third is-5">
    <div class="section">
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
            <input type="text" class="input control" v-model="pesquisaTimes" placeholder="Nome ou cartoleiro do seu time" @keyup.enter="searchTimes"><button @click="searchTimes" class="button is-light control">Pesquisar</button>
          </div>
          <div v-for="time of retornoTimes">
            Nome do Time: {{ time.nome }}
            Nome do cartoleiro: {{ time.nome_cartola }}
            <div>
              <a class="is-link" @click="setMeuTime(time)">Salvar Time</a>
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
      meuTime: {}
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

    getDestaques: function () {
      var self = this
      http.get('/mercado/destaques').then(r => {
        self.destaques = r.data
      })
    },

    quantidadeDestaques: function () {
      return this.mostrarTodosDestaques ? 100 : 3
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
  }
}
</script>

<style scoped>
</style>
