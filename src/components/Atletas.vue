<template>
  <div>
    <div class="section">
      <div>
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <div class="">
              <div class="media-left">
                <div class="">
                  <picture class="image is-32x32">
                    <img :src="">
                  </picture>
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
export default {
  data () {
    return {
      atletas: [],
      pontuados: {}
    }
  },

  mounted: function () {
    this.$kartolafc.mercado.getMercado(m => {
      this.$kartolafc.pontuados.getPontuados(p => {
        this.atletas = m
        this.pontuados = p
      })
    })
  }
}
</script>

<style>

</style>
