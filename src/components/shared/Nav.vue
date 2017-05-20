<template>
    <div>
        <nav class="nav">
            <div class="nav-left">
              <a class="nav-item ">
                <router-link to="/"><img src="/static/img/logo.png" alt="KartolaFC logo"> artolaFC</router-link>
              </a>
              <a class="nav-item" >
                <router-link to="/">Inicio</router-link>
              </a>
              <a class="nav-item" >
                <router-link to="/times">Times</router-link>
              </a>
              <a class="nav-item" >
                <router-link to="/ligas">Ligas</router-link>
              </a>
            </div>
            <span class="nav-toggle" :class="menuIsActive ? 'is-active' : ''" @click="menuIsActive = !menuIsActive">
                <br/>
                <a class="is-link">+</a>
              </span>
            <div class="nav-right nav-menu" :class="menuIsActive ? 'is-active' : ''">
              <a class="nav-item is-active">
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
              </a>

            </div>

        </nav>
    </div>
</template>

<script>
import {http} from '@/axios'

export default {
  data () {
    return {
      status: {},
      menuIsActive: false
    }
  },
  created: function () {
    var self = this
    http.get('/mercado/status').then(function (r) {
      if (r.data) {
        self.status = r.data
      } else {
        self.status = {}
      }
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

<style>
    
</style>
