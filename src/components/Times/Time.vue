<template>
  <div>
    <h1>Time: {{ time.nome }}</h1>
    <h3>Nome Cartola: {{ time.nome_cartola }}</h3>

</div>
</template>

<script>
import {http} from './../../axios'

export default {
  data () {
    return {
      time: {}
    }
  },
  props: {
    //
  },
  mounted: function () {
    if (this.$route.params.id) {
      var self = this
      http.get('/time/id/' + this.$route.params.id).then(function (r) {
        if (r.data.time) {
          self.time = r.data.time
        } else {
          self.time = {}
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
