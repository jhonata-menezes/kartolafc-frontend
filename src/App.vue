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
.loader-request {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #00d1b2;
  width: 50px;
  height: 50px;
  -webkit-animation: spin .6s linear infinite;
  animation: spin .6s linear infinite;
  margin: auto;
  padding: 10px;
  position: fixed;
  top: 50%;
  left: 45%;
  z-index: 15;
  opacity: 1;
}

.clareamento {
  opacity: 0.5;
}

.image-circle {
    border-radius: 50%;
}

@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
