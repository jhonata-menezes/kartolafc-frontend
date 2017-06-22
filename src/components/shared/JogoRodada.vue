<template>
  <div>
    <div v-if="ativar" class="modal" :class="ativar != false ? 'is-active' : ''" @click="closeModal()">
      <div class="modal-background"></div>
      <div class="modal-card" @click.stop>
        <header class="modal-card-head color-header">
          <p class="modal-card-title has-text-centered">
            <picture class="">
              <img :src="pontuados.clubes[jogoRodada.clube_casa_id].Escudos['30x30']" alt="escudo">
            </picture>
            <strong class="subtitle is-5">{{pontuados.clubes[jogoRodada.clube_casa_id].abreviacao}} {{jogoRodada.placar_oficial_mandante}}
              X {{jogoRodada.placar_oficial_visitante}} {{pontuados.clubes[jogoRodada.clube_visitante_id].abreviacao}}
            </strong>
            <picture class="">
              <img :src="pontuados.clubes[jogoRodada.clube_visitante_id].Escudos['30x30']">
            </picture>
              <br/>
            <small class="subtitle is-6">
              {{jogoRodada.local}} {{ getDateFormat(jogoRodada.partida_data)}}
            </small>
          </p>
          <button class="delete" @click="closeModal()"></button>
        </header>
        <section class="modal-card-body">
          <div class="has-text-centered">
            <b class="subtitle is-6">{{pontuados.clubes[jogoRodada.clube_casa_id].abreviacao}}</b>: {{ somaPontuacao(jogoRodada.clube_casa_id) }}
            <b class="subtitle is-6">{{pontuados.clubes[jogoRodada.clube_visitante_id].abreviacao}}</b>: {{ somaPontuacao(jogoRodada.clube_visitante_id) }}
            <span class="icon is-pulled-right" @click="ordenarPor='pontuacao'; ordenarAsc=(ordenarAsc * -1)">
              <i class="fa" :class="ordenarAsc === 1 ? 'fa-sort-asc' : 'fa-sort-desc'" alt='ordenar' title="Ordenar por pontuação"></i>
            </span>
            <hr class="hr">
          </div>
          <div>
            <div v-for="(atl, k) of timeComMaisAtletas">
              <article class="media">
                <div class="media-content">
                  <div class="content">
                    <p>
                      <small class="is-pulled-left" v-if="timesPorClubeId[jogoRodada.clube_casa_id][k]">
                        {{timesPorClubeId[jogoRodada.clube_casa_id][k].pontuacao}}
                        <strong> 
                          {{padraoNomeAtleta(timesPorClubeId[jogoRodada.clube_casa_id][k].apelido)}}
                          <i class="fa fa-futbol-o" aria-hidden="true" v-if="timesPorClubeId[jogoRodada.clube_casa_id][k].scout['G'] >= 1"></i>
                          <i class="fa fa-futbol-o fa-futbol-o-red" aria-hidden="true" v-if="timesPorClubeId[jogoRodada.clube_casa_id][k].scout['GC'] >= 1"></i>
                          <i class="" v-if="timesPorClubeId[jogoRodada.clube_casa_id][k].scout['CA'] >= 1">
                            <img class="icon-image-card" src="/static/img/cartao-amarelo.png">
                          </i>
                          <i class="" v-if="timesPorClubeId[jogoRodada.clube_casa_id][k].scout['CV'] >= 1">
                            <img class="icon-image-card" src="/static/img/cartao-vermelho.png">
                          </i>
                        </strong>
                      </small>
                      <small class="is-pulled-right" v-if="timesPorClubeId[jogoRodada.clube_visitante_id][k]">
                        <strong>
                          <i class="fa fa-futbol-o" aria-hidden="true" v-if="timesPorClubeId[jogoRodada.clube_visitante_id][k].scout['G'] >= 1"></i>
                          <i class="fa fa-futbol-o fa-futbol-o-red" aria-hidden="true" v-if="timesPorClubeId[jogoRodada.clube_visitante_id][k].scout['GC'] >= 1"></i>
                          <i class="" v-if="timesPorClubeId[jogoRodada.clube_visitante_id][k].scout['CA'] >= 1">
                            <img class="icon-image-card" src="/static/img/cartao-amarelo.png">
                          </i>
                          <i class="" v-if="timesPorClubeId[jogoRodada.clube_visitante_id][k].scout['CV'] >= 1">
                            <img class="icon-image-card" src="/static/img/cartao-vermelho.png">
                          </i>
                          {{padraoNomeAtleta(timesPorClubeId[jogoRodada.clube_visitante_id][k].apelido)}}
                        </strong>
                        {{timesPorClubeId[jogoRodada.clube_visitante_id][k].pontuacao}}
                      </small>
                    </p>
                  </div>
                </div>
              </article>
              <hr class="hr-atleta">
            </div>
          </div>
          <div>
          </div>
        </section>
        <footer class="modal-card-foot color-footer">
          <social-sharing class="" hashtags="KartolaFC" :url="'https://kartolafc.com.br/#/rodada/jogos/' + rodada" :title="rodada + '° Rodada: '+ pontuados.clubes[jogoRodada.clube_casa_id].nome+ ' ' + jogoRodada.placar_oficial_mandante +' X ' + jogoRodada.placar_oficial_visitante + ' ' + pontuados.clubes[jogoRodada.clube_visitante_id].nome" :description="'Acompanhe a rodada no KartolaFC'" inline-template>
            <span class="title is-6"> Compartilhar
              <network network="facebook">&nbsp 
                <i class="fa fa-facebook"></i>
              </network>&nbsp &nbsp
              <network network="whatsapp">
                <i class="fa fa-whatsapp"></i>
              </network>&nbsp &nbsp
              <network network="twitter">
                <i class="fa fa-twitter"></i>
              </network>&nbsp &nbsp
              <network network="telegram">
                <i class="fa fa-telegram"></i>
              </network>
            </span>
          </social-sharing>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {

  props: ['jogoRodada', 'ativar', 'rodada'],

  data () {
    return {
      pontuados: {},
      timesPorClubeId: [],
      ordenarPor: 'posicao_id',
      ordenarAsc: 1
    }
  },

  methods: {
    closeModal: function () {
      this.$emit('update:ativar', false)
    },

    criaTimesPorClubeId: function () {
      this.timesPorClubeId = []
      Object.keys(this.pontuados.atletas).forEach((atl, id) => {
        let tempAtl = this.pontuados.atletas[atl]
        if (!(this.timesPorClubeId[tempAtl.clube_id] instanceof Array)) {
          this.timesPorClubeId[tempAtl.clube_id] = []
        }
        tempAtl.atleta_id = atl
        this.timesPorClubeId[tempAtl.clube_id].push(tempAtl)
      })
    },

    somaPontuacao: function (timeId) {
      let soma = 0
      for (let k of this.timesPorClubeId[timeId]) {
        if (k.pontuacao) {
          soma += parseFloat(k.pontuacao)
        }
      }
      return soma.toFixed(2)
    },

    getDateFormat: function (dt) {
      let d = moment(dt)
      return d.format('DD/MM ') + 'às ' + d.format('HH:mm')
    },

    ordenaTimes: function () {
      this.timesPorClubeId.forEach((t, k) => {
        this.timesPorClubeId[k].sort((t1, t2) => {
          if (t1[this.ordenarPor] !== undefined && t2[this.ordenarPor] !== undefined) {
            if (t1[this.ordenarPor] > t2[this.ordenarPor]) return this.ordenarAsc
            if (t1[this.ordenarPor] < t2[this.ordenarPor]) return (this.ordenarAsc * -1)
          }
          return 0
        })
      })
    },

    cleanConfigs: function () {
      this.ordenarPor = 'posicao_id'
      this.ordenarAsc = 1
      if (this.pontuados.rodada !== this.rodada) {
        this.$emit('update:ativar', 'erro rodada')
      }
    },

    padraoNomeAtleta: function (nome) {
      if (nome.trim().indexOf(' ') >= 0) {
        let primeiro = nome.split(' ').slice(0)[0].substring(0, 1).toUpperCase()
        let segundo = nome.split(' ').slice(1)[0]
        return primeiro + '. ' + segundo
      }
      return nome
    }
  },

  watch: {
    'ativar': 'cleanConfigs'
  },

  created: function () {
    this.$kartolafc.pontuados.getPontuados(p => {
      this.pontuados = p
      this.criaTimesPorClubeId()
    })

    document.addEventListener('keydown', (e) => {
      if (this.ativar === true && e.keyCode === 27) {
        this.closeModal()
      }
    })
  },

  computed: {
    timeComMaisAtletas: function () {
      let totalCasa = this.timesPorClubeId[this.jogoRodada.clube_casa_id].length
      let totalVisitante = this.timesPorClubeId[this.jogoRodada.clube_visitante_id].length
      this.ordenaTimes()
      return totalCasa > totalVisitante ? this.timesPorClubeId[this.jogoRodada.clube_casa_id] : this.timesPorClubeId[this.jogoRodada.clube_visitante_id]
    }
  }
}
</script>

<style scoped>
.hr {
  margin: 0.2rem 0.2rem
}

.hr-atleta {
  margin: 0.2rem 0.2rem;
  clear: both;
  padding-top: 1px;
  margin-bottom: 1px;
}

.icon-image-card {
  height: 10px;
  width: 10px;
}

.fa-futbol-o-red {
  color: rgba(208, 31, 35, 1);
}
.color-header {
  background-color: rgb(148, 239, 133);
}

.color-footer {
  background-color: rgb(255, 252, 113);
}
</style>
