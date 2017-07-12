<template>
    <div>
        <nav class="navbar has-shadow-nav">
            <div class="navbar-brand">
              <router-link class="navbar-item" to="/"><img class='image' src="/static/img/logo.png" alt="KartolaFC logo">&nbspartolaFC</router-link>
              <div class="navbar-burger burger" data-target="navMenu" :class="menuIsActive ? 'is-active' : ''" @click="menuIsActive = !menuIsActive">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div id="navMenu" class="navbar-menu" :class="menuIsActive ? 'is-active' : ''" @click="menuIsActive = !menuIsActive">
              <div class="navbar-start">
                <router-link class="navbar-item"  :class="this.$route.path === '/' ? 'is-active is-active-color': ''" to="/"><span class="icon"><i class="fa fa-home"></i></span>Inicio</router-link>
                <div class="navbar-item has-dropdown is-hoverable">
                  <a class="navbar-link">
                    Times e Ligas
                  </a>
                  <div class="navbar-dropdown">
                    <router-link class="navbar-item" :class="this.$route.path === '/times' ? 'is-active is-active-color': ''" to="/times"><span class="icon"><i class="fa fa-shield"></i></span>Times</router-link>
                    <router-link class="navbar-item " :class="this.$route.path === '/ligas' ? 'is-active is-active-color': ''"to="/ligas"><span class="icon"><i class="fa fa-users"></i></span>Ligas</router-link>
                    <router-link class="navbar-item " :class="this.$route.path === '/escalacao' ? 'is-active is-active-color': ''"to="/escalacao"><span class="icon"><i class="fa fa-user"></i></span>Escalação</router-link>
                  </div>
                </div>
                <div class="navbar-item has-dropdown is-hoverable">
                  <a class="navbar-link">
                    Rodada e Outros
                  </a>
                  <div class="navbar-dropdown">
                    <router-link class="navbar-item" :class="this.$route.path === '/login' ? 'is-active is-active-color': ''"to="/login"><span class="icon"><i class="fa fa-sign-in"></i></span>Login/Sessões</router-link>
                    <router-link class="navbar-item" :class="this.$route.path === '/rodada/jogos' ? 'is-active is-active-color': ''"to="/rodada/jogos"><span class="icon"><i class="fa fa-play"></i></span>Jogos da Rodada</router-link>
                    <router-link class="navbar-item" :class="this.$route.path === '/atletas/mercado' ? 'is-active is-active-color': ''"to="/atletas/mercado"><span class="icon"><i class="fa fa-shopping-cart"></i></span>Atletas</router-link>
                    <router-link class="navbar-item" :class="this.$route.path === '/configuracao/notificacao' ? 'is-active is-active-color': ''"to="/configuracao/notificacao"><span class="icon"><i class="fa fa-bell-o"></i></span>Notificacões</router-link>
                    <a class="navbar-item" href="https://goo.gl/forms/oKRKaObtHVLkhMqY2" target="_blank"><span class="icon"><i class="fa fa-exclamation"></i></span>Sugestões</a>
                    <a class="navbar-item" href="https://github.com/search?utf8=%E2%9C%93&q=kartolafc+user%3Ajhonata-menezes&type=Repositories&ref=advsearch&l=&l=" target="_blank"><span class="icon"><i class="fa fa-github"></i></span>GitHub</a>
                    <!--<a class="navbar-item" href="https://www.linkedin.com/in/jhonata-santos-a3659011a/" target="_blank"><span class="icon"><i class="fa fa-linkedin"></i></span>Linkedin</a>-->
                  </div>
                </div>
                <!--<router-link class="nav-item is-tab is-hidden-tablet" :class="this.$route.path === '/ranking/times' ? 'is-active is-active-color': ''"to="/ranking/times"><span class="icon"><i class="fa fa-sort-numeric-asc"></i></span>Melhores Times da Rodada</router-link>-->
              </div>
            </div>
        </nav>
    </div>
</template>

<script>

export default {
  data () {
    return {
      status: {},
      menuIsActive: false
    }
  },
  mounted: function () {
    this.$kartolafc.status.getStatus(status => {
      this.status = status
    })
  },
  computed: {
    diasParaFecharMercado: function () {
      if (this.status.fechamento) {
        let a = new Date(this.status.fechamento.timestamp * 1000)
        let b = new Date()
        let dias = parseInt((((a - b) / 60000) / 60) / 24)
        // caso contrario retorna horas
        if (dias === 0) {
          let horas = parseInt(((a - b) / 60000) / 60)
          if (horas === 0) {
            let minutos = parseInt(((a - b) / 60000) / 60)
            return minutos + ' minutos'
          }
          return horas + ' horas'
        }
        return dias + ' dias'
      }
      return 'indisponível'
    }
  }
}
</script>

<style scoped>
@keyframes menu_transition {
from {opacity:0;}
to {opacity:1;}
}
.is-active {
  animation-name: menu_transition;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.is-active-color {
  border-bottom: 3px solid #00d1b2 !important;
  color: #00d1b2 !important;
}

.has-shadow-nav {
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);
}

.navbar {
  z-index: 100;
}
</style>
