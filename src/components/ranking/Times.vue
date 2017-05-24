<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <p class="title">Pontuação Geral
              <span class="tag is-warning">Em Testes</span>
            </p>              
            <div class="">
              <div class="card" v-for="(time, k) of rankingGeralTimes">
                <div class="card-content">
                  <div class="media">
                    <div class="media-left">
                      <figure class="image is-32x32">
                        <img :src="time.time.foto_perfil" alt="Image">
                      </figure>
                    </div>
                    <div class="media-left">
                      <figure class="image is-32x32">
                        <img :src="time.time.url_escudo_svg" alt="Image">
                      </figure>
                    </div>
                    <div class="media-content">
                      <p class="title is-4">{{ time.time.nome }}</p>
                      <div class="subtitle is-6">
                        <p>Cartoleiro: {{ time.time.nome_cartola }}</p>
                        <p>Posição: {{ time.posicao }}</p>
                        <p>Pontuação: {{ time.pontuacao.toFixed(2) }}</p>
                        <a class="button is-info is-small" @click="ativarModal(time)">Ver Time</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="block">
              <button class="button is-primary is-outlined is-fullwidth" @click="mostrarMaisTimes()" :disabled="limit >= 100">Mais 10 times<small>&nbsp (Max 100)</small></button>
            </div>
          </div>
        </div>
      </div>
      <escalacao-time :timemodal="modal.time" :active="modal.active" @update:active="val => modal.active = val"></escalacao-time>
    </section>
  </div>
</template>

<script>
import { http } from './../../axios'
import TemplateTime from './../shared/EscalacaoTime'

export default {

  components: {
    'escalacao-time': TemplateTime
  },

  data () {
    return {
      limit: 10,
      times: [],
      melhoresTimes: [],
      modal: {
        active: false,
        time: {}
      }
    }
  },

  methods: {
    ativarModal: function (time) {
      this.modal.active = true
      this.modal.time = time
    },

    mostrarMaisTimes: function () {
      this.limit += 10
      this.getTimeCompleto()
    },

    getRankingMelhores: function () {
      http.get('/ranking/melhores').then(r => {
        if (r.data.length >= 1) {
          this.melhoresTimes = r.data
          this.getTimeCompleto()
        }
      })
    },

    getTimeCompleto: function () {
      let inicio = (this.limit - 10)
      this.melhoresTimes.slice(inicio, this.limit).forEach((time, posicao) => {
        this.$kartolafc.time.getTime(time.time_id, t => {
          let timeCompleto = t
          timeCompleto.posicao = (posicao + 1 + inicio)
          timeCompleto.pontuacao = time.pontuacao
          this.times.push(timeCompleto)
        })
      }, this)
    }
  },

  computed: {
    rankingGeralTimes: function () {
      this.times.sort(function (a, b) {
        if ((typeof b.pontuacao === 'undefined' && typeof a.pontuacao !== 'undefined') || a.pontuacao < b.pontuacao) {
          return 1
        }
        if ((typeof a.pontuacao === 'undefined' && typeof b.pontuacao !== 'undefined') || a.pontuacao > b.pontuacao) {
          return -1
        }
        return 0
      })
      return this.times
    }
  },

  created: function () {
    this.getRankingMelhores()
  }
}
</script>

<style scoped>

</style>
