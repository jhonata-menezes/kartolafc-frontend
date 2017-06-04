<template>
  <div>
    <section class="section" :class="loader ? 'clareamento': ''">
      <div class="">
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <p class="title">Pontuação Geral
              <span class="tag is-warning">Em Testes</span>
            </p>              
            <div class="">
              <div class="field is-grouped is-grouped-centered">
                <p class="control">
                  <label class="checkbox">
                    <input type="checkbox" @click="apenasPro=!apenasPro" :checked="apenasPro">
                    Apenas cartoleiros pró
                  </label>
                </p>
              </div>
              <div class="" v-for="(time, k) of rankingGeralTimes">
                <div class="">
                  <div class="media">
                    <div class="media-left">
                      <figure class="image is-32x32">
                        <img :src="time.time.foto_perfil" alt="Image" @error="time.time.foto_perfil='/static/img/icon.png'">
                      </figure>
                      <figure class="image is-32x32">
                        <img :src="time.time.url_escudo_svg" alt="Image" @error="time.time.url_escudo_svg='/static/img/icon.png'">
                      </figure>
                    </div>
                    <div class="media-content">
                      <div class="content">
                        <p>
                          <small class="title is-5">{{time.posicao}}º {{ time.time.nome }}</small></br>
                          <small class="tag">{{ time.time.nome_cartola }}</small>
                          <small class="tag">pts: {{ time.pontuacao.toFixed(2) }}</small>
                          <small class="tag">Pró: {{ time.time.assinante ? 'sim' : 'não' }}</small></br>
                          <a class="button is-info is-small" @click="ativarModal(time)">Ver Time</a>
                        </p>
                      </div>                      
                    </div>
                  </div>
                </div>
                <hr class="hr">
              </div>
            </div>
            <div class="block">
              <button class="button is-primary is-outlined is-fullwidth" @click="mostrarMaisTimes()" :disabled="limit >= 100">Mais 10 times<small>&nbsp (Max 100)</small></button>
            </div>
          </div>
        </div>
      </div>
      <escalacao-time :timemodal="modal.time" :active="modal.active" @update:active="val => modal.active = val"></escalacao-time>
      <div v-show="loader">
        <div class="loader-request"></div>
      </div>
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
      },
      loader: false,
      apenasPro: false
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
      this.loader = true
      http.get('/ranking/melhores').then(r => {
        if (r.data.length >= 1) {
          this.melhoresTimes = r.data
          this.getTimeCompleto()
          this.loader = false
        }
      }).catch(() => { this.loader = false })
    },

    getTimeCompleto: function () {
      let inicio = (this.limit - 10)
      this.melhoresTimes.slice(inicio, this.limit).forEach((time, posicao) => {
        this.$kartolafc.time.getTime(time.time_id, t => {
          let timeCompleto = t
          timeCompleto.posicao = (posicao + 1 + inicio)
          timeCompleto.pontuacao = time.pontuacao
          timeCompleto.assinante = time.assinante
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
      return this.times.filter(t => {
        if (this.apenasPro) {
          return t.assinante
        }
        return true
      })
    }
  },

  created: function () {
    this.getRankingMelhores()
  }
}
</script>

<style scoped>
.hr {
  margin: 0.3rem 0.3rem
}
</style>
