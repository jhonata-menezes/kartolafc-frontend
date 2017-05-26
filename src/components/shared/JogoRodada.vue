<template>
  <div>
    <div v-if="ativar" class="modal" :class="ativar != false ? 'is-active' : ''">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            <picture class="image is-24x24 is-pulled-right">
              <img :src="pontuados.clubes[jogoRodada.clube_casa_id].Escudos['30x30']" alt="escudo">
            </picture>
            <h3 class="title is-3">{{pontuados.clubes[jogoRodada.clube_casa_id].abreviacao}}
              X {{pontuados.clubes[jogoRodada.clube_visitante_id].abreviacao}}</h3></br>
            <small class="subtitle is-small">{{time.time.nome_cartola}}</small>-->
            <picture class="image is-24x24 is-pulled-right">
              <img :src="pontuados.clubes[jogoRodada.clube_visitante_id].Escudos['30x30']">
            </picture>
          </p>
          <button class="delete" @click="closeModal()"></button>
        </header>
        <section class="modal-card-body">
          <div class="has-text-centered">
            <b> Casa</b>: {{ somaPontuacao(time) }}
            <b>Posição</b>: {{posicaoGeral}}
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
                  </p>
                </div>
              </div>
            </article>
            <hr class="hr-atleta">
          </div>
        </section>
        <footer class="modal-card-foot">
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  props: ['jogoRodada', 'ativar'],

  data () {
    return {
      pontuados: {},
      timeCasa: [],
      timeVisitante: []
    }
  },

  methods: {
    closeModal: function () {
      this.$emit('update:ativar', false)
    },

    getJogadoresTimeCasa: function (timeId) {
      pontuados.atletas.forEach((e, k) => {
        if (e.clubeId === timeId) {
          e.alteta_id = k
          timeCasa.push(e)
        }
      }, this)
    },

    getJogadoresTimeVisitante: function (timeId) {
      pontuados.atletas.forEach((e, k) => {
        if (e.clubeId === timeId) {
          e.alteta_id = k
          timeCasa.push(e)
        }
      }, this)
    },

    somaPontuacao: function (time) {
      let soma = 0
      for (k of time) {
        soma += time.pontuacao
      }
    }
  },

  created: function () {
    this.$kartolafc.pontuados.getPontuados(p => {
      this.pontuados = p
    })

    document.addEventListener('keydown', (e) => {
      if (this.ativar === true && e.keyCode === 27) {
        this.closeModal()
      }
    })
  },

  computed: {
  }
}
</script>

<style>

</style>
