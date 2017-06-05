<template>
    <div>
        <nav class="nav has-shadow">
            <div class="nav-left-overflow nav-left">
              <router-link class="nav-item" to="/"><img class='image' src="/static/img/logo.png" alt="KartolaFC logo">&nbspartolaFC</router-link>
              <router-link class="nav-item is-tab is-hidden-mobile" :class="this.$route.path === '/' ? 'is-active': ''" to="/">Inicio</router-link>
              <router-link class="nav-item is-tab is-hidden-mobile" :class="this.$route.path === '/times' ? 'is-active' : ''" to="/times">Times</router-link>
              <router-link class="nav-item is-tab is-hidden-mobile" :class="this.$route.path === '/ligas' ? 'is-active' : ''" to="/ligas">Ligas</router-link>
              <router-link class="nav-item is-tab is-hidden-mobile" :class="this.$route.path === '/ranking/times' ? 'is-active' : ''" to="/ranking/times">Melhores Times da Rodada</router-link>
              <router-link class="nav-item is-tab is-hidden-mobile" :class="this.$route.path === '/rodada/jogos' ? 'is-active' : ''" to="/rodada/jogos">Jogos da Rodada</router-link>
              <router-link class="nav-item is-tab is-hidden-mobile" :class="this.$route.path === '/atletas/mercado' ? 'is-active' : ''" to="/atletas/mercado">Atletas</router-link>
              <router-link class="nav-item is-tab is-hidden-mobile" :class="this.$route.path === '/configuracao/notificacao' ? 'is-active' : ''" to="/configuracao/notificacao">Notificações</router-link>
            </div>

            <span class="nav-toggle " :class="menuIsActive ? 'is-active' : ''" @click="menuIsActive = !menuIsActive">
              <span></span>
              <span></span>
              <span></span>
            </span>

            <div class="nav-right nav-menu" :class="menuIsActive ? 'is-active' : ''" @click="menuIsActive = !menuIsActive">
              <router-link class="nav-item is-tab is-hidden-tablet"  :class="this.$route.path === '/' ? 'is-active': ''" to="/"><span class="icon"><i class="fa fa-home"></i></span>Inicio</router-link>
              <router-link class="nav-item is-tab is-hidden-tablet" :class="this.$route.path === '/times' ? 'is-active': ''" to="/times"><span class="icon"><i class="fa fa-shield"></i></span>Times</router-link>
              <router-link class="nav-item is-tab is-hidden-tablet" :class="this.$route.path === '/ligas' ? 'is-active': ''"to="/ligas"><span class="icon"><i class="fa fa-users"></i></span>Ligas</router-link>
              <router-link class="nav-item is-tab is-hidden-tablet" :class="this.$route.path === '/ranking/times' ? 'is-active': ''"to="/ranking/times"><span class="icon"><i class="fa fa-sort-numeric-asc"></i></span>Melhores Times da Rodada</router-link>
              <router-link class="nav-item is-tab is-hidden-tablet" :class="this.$route.path === '/rodada/jogos' ? 'is-active': ''"to="/rodada/jogos"><span class="icon"><i class="fa fa-play"></i></span>Jogos da Rodada</router-link>
              <router-link class="nav-item is-tab is-hidden-tablet" :class="this.$route.path === '/atletas/mercado' ? 'is-active': ''"to="/atletas/mercado"><span class="icon"><i class="fa fa-shopping-cart"></i></span>Atletas</router-link>
              <router-link class="nav-item is-tab is-hidden-tablet" :class="this.$route.path === '/configuracao/notificacao' ? 'is-active': ''"to="/configuracao/notificacao"><span class="icon"><i class="fa fa-bell-o"></i></span>Notificacões</router-link>
              <!--<a class="nav-item">
                <span>Times Escalados: {{ status.times_escalados }}</span>
              </a>
              <a class="nav-item ">
                <span>
                  Rodada Atual: {{ status.rodada_atual }}
                </span>
              </a>
              <a class="nav-item">
                <span v-if="status.fechamento">
                  <div v-if="status.status_mercado == 1">
                    Mercado Fecha em  <b>{{ diasParaFecharMercado }}</b>
                  </div>
                  <div v-else>
                    Mercado Fechado
                  </div>
                </span>
              </a>-->

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
.nav-left-overflow {
  overflow: visible; 
}

@keyframes menu_transition {
from {opacity:0;}
to {opacity:1;}
}
.nav-menu.nav-right {
  opacity:0; 
}
.is-active{
  animation-name: menu_transition;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}
</style>
