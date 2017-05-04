<template>
  <div>
    <navbar></navbar>
    <div class="section">
      <div id="app" class="content">
      </div>
    </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Nav from '@/components/shared/Nav'
export default {
  name: 'app',
  components: {
    'navbar': Nav
  }
}
</script>

<style lang="scss">
  @import "./assets/main.sass";
</style>
