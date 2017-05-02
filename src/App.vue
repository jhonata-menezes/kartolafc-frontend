<template>
  <div>
    <nav class="nav">
      <div class="nav-left">
        <a class="nav-item">
          <router-link to="/"><img src="/static/img/logo.png" alt="KartolaFC logo"></router-link>
        </a>
      </div>
    </nav>
    <div id="app">
        <router-view></router-view>
      </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
