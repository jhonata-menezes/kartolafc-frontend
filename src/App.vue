<template>
  <div>
    <navbar></navbar>
    <meu-menu></meu-menu>
    <div class="">
      <div id="app" class="">
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
  }
}
</script>

<style lang="scss">
  @import "./assets/main.sass";
</style>
