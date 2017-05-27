<template>
  <div>
    <navbar></navbar>
    <meu-menu></meu-menu>
    <div class="">
      <div id="app">
      </div>
      <router-view></router-view>
        <vue-progress-bar></vue-progress-bar>
    </div>
  </div>
</template>

<script>
import Nav from '@/components/shared/Nav'
import MeuMenu from '@/components/shared/Menu'
export default {
  name: 'app',
  components: {
    'navbar': Nav,
    'meu-menu': MeuMenu
  },

  created: function () {
    this.$kartolafc.pontuados.getPontuados(a => {})
  }
}
</script>

<style>
</style>
