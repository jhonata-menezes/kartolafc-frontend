<template>
  <div>
    <escalacao-time :timemodal="time" :active="modal.ativar" @update:active="val => modal.ativar = val" ></escalacao-time>
  </div>
</template>

<script>
import TemplateTime from './../shared/EscalacaoTime'

export default {
  components: {
    'escalacao-time': TemplateTime
  },

  data () {
    return {
      modal: {
        ativar: false
      },
      time: {}
    }
  },

  mounted: function () {
    if (this.$route.params.id) {
      this.$kartolafc.time.getTime(this.$route.params.id, t => {
        if (t) {
          this.time = t
          this.modal.ativar = true
        }
      })
    }
  },
  watch: {
    //
  }
}
</script>

<style scoped>
</style>
