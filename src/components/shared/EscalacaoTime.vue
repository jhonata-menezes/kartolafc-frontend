<template>
  <div>
    <div v-if="time.time" class="modal" :class="active != false ? 'is-active' : ''">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            <picture class="image is-24x24 is-pulled-right">
              <img :src="time.time.url_escudo_svg">
            </picture>
            <strong class="title">{{time.time.nome}}</strong></br>
            <small class="subtitle is-small">{{time.time.nome_cartola}}</small>
            <picture class="image is-24x24 is-pulled-right">
              <img :src="time.time.foto_perfil">
            </picture>
          </p>
          <button class="delete" @click="closeModal()" @keydown.27="closeModal()"></button>
        </header>
        <section class="modal-card-body" v-if="time.atletas.length >= 1">
          <div class="has-text-centered">
            <b>Rodada</b>: {{ time.rodada_atual }} <b>Pontuação</b>: {{ somaPontuacao(time) }}
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
        <!--<footer class="modal-card-foot">
        </footer>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      atletasPontuados: {}
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
      return this.timemodal
    }
  },

  created: function () {
    this.$kartolafc.pontuados.getPontuados(p => {
      this.atletasPontuados = p
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
