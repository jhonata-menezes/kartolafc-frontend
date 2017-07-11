<template>
  <div>
    <div v-if="atletaId && mercadoPorAtletaId[atletaId]">
      <div class="container">
        <div class="media">
          <div class="media-left">
            <picture class="image is-64x64">
              <img class="image-circle" :src="mercadoPorAtletaId[atletaId].foto">
            </picture>
          </div>
          <div class="media-content">
            <b>{{mercadoPorAtletaId[atletaId].apelido}}</b>
          </div>
        </div>
        <div>
          <div v-for="(v, scout) of mercadoPorAtletaId[atletaId].scout" :key="scout">
            <b>{{v}} {{$kartolafc.scouts[scout].nome}}</b>
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
      mercadoPorAtletaId: {},
      mercado: {}
    }
  },

  mounted: function () {
    this.$kartolafc.mercado.getMercado(m => {
      this.mercado = m
      let t = {}
      for (let a of m.atletas) {
        t[a.atleta_id] = a
      }
      this.mercadoPorAtletaId = t
    })
  }
}
</script>

<style scoped>
.media-content {
  padding-top: 1rem;
}  
</style>
