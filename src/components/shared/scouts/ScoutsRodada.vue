<template>
  <div>
    <div class="opacity-default">
      <div class="media">
        <div class="media-content">
          <div class="content" v-if="pontuados && pontuados.atletas && pontuados.atletas[atletaId]">
            <b class="has-text-centered" @click="close()">{{pontuados.atletas[atletaId].apelido}}</b>
            <button class="delete is-medium is-pulled-right" @click="close()"></button>
            <div v-if="pontuados.atletas[atletaId].scout">
              <div v-if="pontuados.atletas[atletaId].posicao_id == 6">
                Não há detalhes específicos, já que sua pontuação é a média dos jogadores do clube.
              </div>
              <div v-else v-for="(qtd, scout) of pontuados.atletas[atletaId].scout" :key="scout">
                <small>{{qtd}} {{$kartolafc.scouts[scout].nome}}: <span :class="$kartolafc.scouts[scout].pontos < 0 ? 'has-text-danger' : 'has-text-success'">{{($kartolafc.scouts[scout].pontos * parseInt(qtd)).toFixed(1)}}       </span> 
                </small>
              </div>
              <div v-if="pontuados.atletas[atletaId].posicao_id != 6">
                ----------------------------<br>
                Total = <b :class="totalPontos < 0 ? 'has-text-danger' : 'has-text-success'">{{totalPontos.toFixed(1)}}</b>
              </div>
            </div>
          </div>
          <div class="content" v-else>
          Sem scouts no momento
          <button class="delete is-pulled-right" @click="close()"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['atletaId'],

  data () {
    return {
      pontuados: {},
      totalPontos: 0
    }
  },

  methods: {
    getPontuados: function () {
      this.$kartolafc.pontuados.getPontuados(p => {
        this.pontuados = p
        this.somaPontuacao()
      })
    },

    somaPontuacao: function () {
      this.totalPontos = 0
      if (this.pontuados.atletas[this.atletaId]) {
        for (let s in this.pontuados.atletas[this.atletaId].scout) {
          let qtd = parseFloat(this.pontuados.atletas[this.atletaId].scout[s])
          let p = this.$kartolafc.scouts[s].pontos * qtd
          this.totalPontos += p
        }
      }
    },

    close: function () {
      this.totalPontos = 0
      this.$emit('update:ativo', false)
    }
  },

  computed: {
  },

  created: function () {
    this.getPontuados()
  },

  watch: {
    atletaId: function () {
      this.somaPontuacao()
    }
  }

}
</script>

<style scoped>
.opacity-default {
  opacity: 1;
  background-color: white
}
</style>
