<template>
  <div>
    <div v-if="time.time" class="modal" :class="active != false ? 'is-active' : ''" @click="closeModal()">
      <div class="modal-background"></div>
      <div class="modal-card" @click.stop>
        <header class="modal-card-head">
          <p class="">
            <div class="media">
              <div class="media-left">
                <picture class="image is-32x32">
                  <img :src="time.time.url_escudo_svg">
                </picture>
                <picture class="image is-32x32">
                  <img :src="time.time.foto_perfil" @error="defaultImage(time)">
                </picture>
              </div>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong class="title is-6">{{time.time.nome}}</strong></br>
                    <small class="subtitle is-small is-6">{{time.time.nome_cartola}}</small>
                  </p>
                </div>
              </div>
            </div>
          </p>
          <p class="modal-card-title"></p>
          <button class="delete" @click="closeModal()"></button>
        </header>
        <section class="modal-card-body" v-if="time.atletas">
          <div class="has-text-centered">
            <b>Rodada</b>: {{ time.rodada_atual }} <b> Pontuação</b>: {{ somaPontuacao(time) }}
            <b> Pró</b>: {{ time.time.assinante ? 'sim' : 'não' }}
            <span v-if="posicaoGeral"> <b>Posição</b>: {{posicaoGeral}}</span>
          </div>
          <hr class="hr">
          <div v-for="t of time.atletas">
            <article class="media">
              <figure class="media-left">
                <p class="image is-16x16">
                  <img :src="atletasPontuados.clubes[t.clube_id].Escudos['30x30']">
                </p>
              </figure>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{ t.apelido }}</strong><small> {{ posicao(t) }}</small>
                    <strong class="is-pulled-right is-success" v-if="atletasPontuados.atletas[t.atleta_id]">{{ atletasPontuados.atletas[t.atleta_id].pontuacao }}</strong>
                    <strong class="is-pulled-right is-success" v-else="">0</strong>
                  </p>
                </div>
              </div>
            </article>
            <hr class="hr-atleta">
          </div>
        </section>
        <section class="modal-card-body" v-else>
          <div class="has-text-centered">
            <p>Time não escalado</p>
          </div>
        </section>
        <footer class="modal-card-foot" v-if="time.time">
          <social-sharing :url="'https://kartolafc.com.br/#/time/id/' + time.time.time_id"  :title="time.time.nome" :description="'Veja minha pontuação e time no KartolaFC ' + somaPontuacao(time)" inline-template>
            <div class="title is-5"> Compartilhar 
                <network network="facebook">&nbsp 
                  <i class="fa fa-facebook"></i>
                </network>&nbsp &nbsp
                <network network="whatsapp">
                  <i class="fa fa-whatsapp"></i>
                </network>
            </div>
          </social-sharing>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import {http} from './../../axios'

export default {
  data () {
    return {
      atletasPontuados: {},
      posicaoGeral: 0
    }
  },

  methods: {
    closeModal: function () {
      this.$emit('update:active', false)
    },

    somaPontuacao: function (time) {
      let total = 0
      for (let k in time.atletas) {
        if (this.atletasPontuados.atletas[time.atletas[k].atleta_id]) {
          total += this.atletasPontuados.atletas[time.atletas[k].atleta_id].pontuacao
        }
      }
      return total.toFixed(2)
    },

    posicao: function (atleta) {
      if (this.atletasPontuados) {
        let pos = this.atletasPontuados.posicoes[atleta.posicao_id].abreviacao
        return pos.charAt(0).toUpperCase() + pos.slice(1)
      }
      return ''
    },

    getRankingGeral: function () {
      if (this.timemodal.time) {
        http.get('/ranking/time/id/' + this.timemodal.time.time_id).then(r => {
          if (r.data.posicao >= 1) {
            this.posicaoGeral = r.data.posicao
          }
        })
      }
      return true
    },

    defaultImage: function (src) {
      src.time.foto_perfil = '/static/img/icon.png'
      return true
    }
  },

  props: ['timemodal', 'active'],

  computed: {
    time () {
      if (this.timemodal.atletas) {
        this.timemodal.atletas.sort((a, b) => {
          if (a.posicao_id > b.posicao_id) return 1
          if (a.posicao_id < b.posicao_id) return -1
          return 0
        })
      }
      this.getRankingGeral()
      return this.timemodal
    }
  },

  created: function () {
    this.$kartolafc.pontuados.getPontuados(p => {
      this.atletasPontuados = p
    })

    document.addEventListener('keydown', (e) => {
      if (this.active === true && e.keyCode === 27) {
        this.closeModal()
      }
    })
  }
}
</script>
<style scoped>
.hr {
  margin: 0.2rem 0.2rem
}

.hr-atleta {
  margin: 0.1rem 0.1rem
}
</style>
