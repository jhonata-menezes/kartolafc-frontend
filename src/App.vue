<template>
  <div>
    <navbar></navbar>
    <meu-menu></meu-menu>
    <div class="">
      <div id="app">
      </div>
    </div>
      <router-view></router-view>
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

  created () {
    this.$kartolafc.status.getStatus((a) => {})
  }
}
</script>

<style>
</style>
