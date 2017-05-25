<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <p>
              <div class="pull-left">
                <i class="tag is-success button" @click="alteraRodada((rodadaAtual - 1))">
                  <i class="fa fa-chevron-left" aria-hidden="true"></i>
                   &nbsp Anterior 
                </i>
              </div>
              <div class="pull-right">
                <i class="tag is-success" @click="alteraRodada((rodadaAtual + 1))">
                  Próxima &nbsp
                  <i class="fa fa-chevron-right" aria-hidden="true">
                  </i>
                </i>
              </div>
            </p><br/>
            <div class="content">
              <h4 class="title is-4 has-text-centered">Rodada Atual {{partida.rodada}} </h4>
            </div>
            <div class="">
              <article class="media" v-for="p of partidasOrdenadas">
                <div class="media-content">
                  <div class="content">
                    <div class="nav-center is-small">
                      <p>
                        Local: {{p.local}} às {{ getDateFormat(p.partida_data)}}
                      </p>
                    </div>
                    <div class="has-text-centered">
                      <div class="is-medium has-text-black">
                        <picture class="image is-24x24 is-pulled-left">
                          <img :src="partida.clubes[p.clube_casa_id].Escudos['30x30']" alt="Escudo">
                        </picture>
                        {{ partida.clubes[p.clube_casa_id].abreviacao }}
                        <span class="has-text-centered is-centered">
                          {{ p.placar_oficial_mandante }} X {{ p.placar_oficial_visitante }}
                        </span>
                        {{ partida.clubes[p.clube_visitante_id].abreviacao }}
                        <picture class="image is-24x24 is-pulled-right">
                          <img :src="partida.clubes[p.clube_visitante_id].Escudos['30x30']" alt="Escudo">
                        </picture>
                      </div>
                      <i class="tag is-dark is-small">Detalhes</i>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { http } from './../../axios'
import moment from 'moment'

export default {
  data () {
    return {
      partida: {},
      rodadaAtual: 0
    }
  },

  methods: {
    alteraRodada: function (rodada) {
      this.$route.params.rodada = rodada
      this.rodadaAtual = rodada
      this.getPartida(rodada)
    },

    getPartida: function (rodada = 0) {
      http.get('/partidas/' + rodada).then(r => {
        if (r.data.rodada) {
          this.partida = r.data
          this.rodadaAtual = r.data.rodada
        }
      }).catch(err => { console.log(err) })
    },

    getDateFormat: function (dt) {
      let d = moment(dt)
      return d.format('DD/MM HH:mm')
    }
  },

  created: function () {
    if (this.$route.params.rodada) {
      this.getPartida(this.$route.params.rodada)
      this.rodadaAtual = this.$route.params.rodada
    } else {
      // rodada 0 é a rodada atual
      this.getPartida(0)
    }
  },

  computed: {
    partidasOrdenadas: function () {
      if (this.partida.partidas) {
        this.partida.partidas.sort((f, s) => {
          if (f.partida_data > s.partida_data) return 1
          if (f.partida_data < s.partida_data) return -1
          return 0
        })
      }
      return this.partida.partidas
    }
  }
}
</script>

<style scoped>
.clickabed {
  cursor: pointer
}
</style>

