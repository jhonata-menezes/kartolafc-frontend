<template>
  <div>
    <div class="opacity-default">
      <div class="media">
        <div class="media-content">
          <div class="content" v-if="pontuados && pontuados.atletas && pontuados.atletas[atletaId]">
            <p class="title is-bold is-5">{{pontuados.atletas[atletaId].apelido}}</p>
            <br>
            <div v-if="pontuados.atletas[atletaId].scout">
              <div v-for="(scout, qtd) of pontuados.atletas[atletaId].scout">
                {{qtd}} {{scout}}
              </div>
            </div>
            <p v-else>
              Sem scouts
            </p>
          </div>
          <div class="content" v-else>
            Sem scouts no momentom {{atletaId}}
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
      pontuados: {}
    }
  },

  methods: {
    getPontuados: function () {
      console.log('hg', this.$kartolafc.scouts)
      this.$kartolafc.pontuados.getPontuados(p => {
        console.log('hg', this.$kartolafc.scouts)
        this.pontuados = p
      })
    },

    close: function () {
      this.$emit('update:ativo', false)
    }
  },

  computed: {
    atletaComputed: function () {
      this.getPontuados()
      console.log('uiuiu')
      return this.atletaId
    }
  },

  watch: {
    'this.atletaId': 'getPontuado'
  }

}
</script>

<style scoped>
.opacity-default {
  opacity: 1;
  background-color: white
}
</style>
