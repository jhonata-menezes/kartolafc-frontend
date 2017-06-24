<template>
  <div>
    <section class="section" :class="loader ? 'clareamento': ''">
      <div class="container">
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <p>
              <div class="pull-left">
                <router-link  class="button tag" :disabled="rodadaAtual<=1" :to="{ name: 'RodadaJogos', params: { rodada: (rodadaAtual - 1) }}">
                  <i class="fa fa-chevron-left" aria-hidden="true"></i>&nbsp Anterior
                </router-link>
              </div>
              <div class="pull-right">
                <router-link class="button tag" :disabled="rodadaAtual>=38" :to="{ name: 'RodadaJogos', params: { rodada: (rodadaAtual + 1) }}">Próxima &nbsp
                  <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </router-link>
              </div>
            </p><br/>
            <div class="content">
              <h4 class="title is-4 has-text-centered">Rodada Atual {{rodadaAtual}} </h4>
            </div>
            <div v-if="partida.rodada >= 1 && partida.rodada <= 38" class="">
              <div v-if="partida.rodada <= status.rodada_atual" >
                <article class="media" v-for="p of partidasOrdenadas">
                  <div class="media-content">
                    <div class="content">
                      <div class="nav-center is-small">
                        <p>
                          {{p.local}} {{ getDateFormat(p.partida_data)}}
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
                        <i class="button tag is-dark" @click="exibirdetalhes(p)">Detalhes</i>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
              <div v-else>
                <article class="media" v-for="p of partida.partidas">
                  <div class="media-content">
                    <div class="content">
                      <div class="nav-center is-small">
                        <p>
                          <small><span v-if="p.local != ''">{{p.local}}</span> {{ p.partida_data}}</small>
                        </p>
                      </div>
                      <div class="has-text-centered">
                        <div class="is-medium has-text-black">
                          <picture class="image is-24x24 is-pulled-left">
                            <img :src="partida.clubes[p.clube_casa_id].Escudos['30x30']" alt="Escudo">
                          </picture>
                          {{ partida.clubes[p.clube_casa_id].abreviacao }}
                          <span class="has-text-centered is-centered">
                            X
                          </span>
                          {{ partida.clubes[p.clube_visitante_id].abreviacao }}
                          <picture class="image is-24x24 is-pulled-right">
                            <img :src="partida.clubes[p.clube_visitante_id].Escudos['30x30']" alt="Escudo">
                          </picture>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>              
            </div>
            <div>
              <notificacao :ativar="alerta" :mensagem="mensagem" @update:ativar="v => alerta=v"></notificacao>
              <detalhes-jogo :ativar="detalhes.ativar" :rodada="partida.rodada" :jogoRodada="detalhes.jogo" @update:ativar="v => { if (v=='erro rodada') { setMensagem('Rodada sem pontuação no momento'); detalhes.ativar=false; alerta=true } else { detalhes.ativar=v } }"></detalhes-jogo>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div v-show="loader">
      <div class="loader-request"></div>
    </div>
  </div>
</template>

<script>
import { http } from './../../axios'
import moment from 'moment'
import ModalNotificacao from './../shared/ModalNotificacao'
import JogoRodada from './../shared/JogoRodada'

export default {
  components: {
    'notificacao': ModalNotificacao,
    'detalhes-jogo': JogoRodada
  },

  data () {
    return {
      detalhes: {
        jogo: {},
        ativar: false
      },
      partida: {},
      rodadaAtual: 0,
      alerta: false,
      mensagem: '',
      loader: false,
      status: {}
    }
  },

  methods: {
    getPartida: function (rodada = 0) {
      this.loader = true
      this.$Progress.start()
      this.$Progress.increase(50)
      this.setMensagem()
      http.get('/partidas/' + rodada).then(r => {
        if (r.data.rodada) {
          this.partida = r.data
          this.rodadaAtual = r.data.rodada
        } else {
          this.rodadaAtual = parseInt(rodada)
          this.alerta = true
          this.partida = {}
        }
        this.$Progress.finish()
        this.loader = false
      }).catch(err => {
        console.log(err)
        this.$Progress.fail()
        this.alerta = true
        this.partida = {}
        this.loader = false
      })
    },

    getDateFormat: function (dt) {
      let d = moment(dt)
      return d.format('DD/MM ') + 'às ' + d.format('HH:mm')
    },

    createdComponent: function () {
      if (this.$route.params.rodada) {
        this.getPartida(this.$route.params.rodada)
      } else {
        // rodada 0 é a rodada atual
        this.getPartida(0)
      }
    },

    exibirdetalhes: function (j) {
      this.detalhes.ativar = true
      this.detalhes.jogo = j
    },

    setMensagem: function (m = '') {
      if (m === '') {
        m = 'Não foi possivel obter a rodada ' + this.rodadaAtual + ' ou ainda não está disponível'
      }
      this.mensagem = m
    }
  },

  created: function () {
    this.createdComponent()
    this.$kartolafc.status.getStatus(s => {
      this.status = s
    })
  },

  watch: {
    // observa alguma mudanca na rota
    '$route': 'createdComponent'
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

