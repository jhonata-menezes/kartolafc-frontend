<template>
    <div class="modal" :class="ativo != false ? 'is-active' : ''" @click="closeModal()">
      <div class="modal-background" v-if="!loader"></div>
      <div class="modal-card" @click.stop>
        <header class="modal-card-head">
          <p class="modal-card-title">
            <span class="subtitle is-5">
              &nbsp {{atletaMercado.apelido}}
            </span>
            <picture class="image is-48x48 is-pulled-left">
              <img :src="atletaMercado.foto">
            </picture>
          </p>
          <button class="delete" @click="closeModal()"></button>
        </header>
        <section class="modal-card-body">
          <div v-if="loader">
            <div class="loader-request-time"></div>
          </div>
          <div class="media" v-else>
            <div class="media-content">
              <!--<div class="content">
                <div class="subtitle is-6">
                  <span class="has-text-black">Preço: ${{atletaMercado.preco_num}} Jogos: {{atletaMercado.jogos_num}}</span>
                  <p class="has-text-black" v-if="atletaMercado.scout && atletaMercado.scout['G'] > 0"><span>Gols:</span> {{atletaMercado.scout['G']}}</p>
                </div>
              </div>-->
              <div v-if="ativarGrafico" class="">
                <grafico-atleta :chartData="dataGrafico" :options="options" :height="200"></grafico-atleta>
              </div>
            </div>
          </div>
        </section>
        <!--<footer class="modal-card-foot">
        </footer>-->
      </div>
    </div>
  </div>  
</template>

<script>
import {http} from './../../axios'
import Chart from './DefaultChart'

export default {
  props: ['ativo', 'atletaId'],

  components: {
    'grafico-atleta': Chart
  },

  data () {
    return {
      atletaHistorico: [],
      atletaMercado: {},
      status: {},
      ativarGrafico: false,
      historico: {
        pontos: [],
        preco: [],
        variacao: [],
        media: []
      },
      options: {
        elements: {
          line: {
            tension: 0
          }
        },
        responsive: true,
        title: {
          display: true,
          text: 'Pontuação por Rodada'
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Rodada'
            }
          }]
        }
      },
      dataGrafico: {
        labels: [],
        datasets: [
          {
            label: 'Pontos',
            borderColor: 'rgba(182, 28, 0, 0.6)',
            backgroundColor: 'rgba(182, 28, 0, 0.6)',
            data: [],
            fill: false
          },
          {
            label: 'Preço',
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgb(54, 162, 235)',
            data: [],
            fill: false
          },
          {
            label: 'Variação',
            borderColor: 'rgb(255, 205, 86)',
            backgroundColor: 'rgb(255, 205, 86)',
            data: [],
            fill: false
          },
          {
            label: 'Média',
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgb(75, 192, 192)',
            data: [],
            fill: false
          }
        ]
      },
      loader: false
    }
  },

  methods: {
    getAtleta: function () {
      if (this.atletaId === 0) return
      this.loader = true
      // Overwriting base render method with actual data.
      this.$kartolafc.mercado.getMercado(m => {
        http.get('/atletas/historico/' + this.atletaId).then(r => {
          this.$kartolafc.status.getStatus(s => {
            this.status = s
            this.atletaHistorico = r.data
            this.transformaHistoricoGrafico()
            m.atletas.forEach(e => {
              if (e.atleta_id === this.atletaId) {
                this.atletaMercado = e
              }
            }, this)
            this.loader = false
          })
        }).catch(err => { console.log(err) })
      })
    },

    closeModal: function () {
      this.$emit('update:ativo', false)
      this.ativarGrafico = false
    },

    transformaHistoricoGrafico: function () {
      this.historico.pontos = []
      this.historico.preco = []
      this.historico.variacao = []
      this.historico.media = []
      for (let a of this.atletaHistorico) {
        this.historico.pontos.push(a.pontos)
        this.historico.preco.push(a.preco)
        this.historico.variacao.push(a.variacao)
        this.historico.media.push(a.media)
      }
      this.dataGrafico.datasets[0].data = this.historico.pontos
      this.dataGrafico.datasets[1].data = this.historico.preco
      this.dataGrafico.datasets[2].data = this.historico.variacao
      this.dataGrafico.datasets[3].data = this.historico.media

      this.dataGrafico.labels = []
      for (let i = 1; i < this.status.rodada_atual; i++) {
        this.dataGrafico.labels.push(i)
      }

      this.ativarGrafico = true
    }
  },

  watch: {
    'atletaId': 'getAtleta'
  },

  created: function () {
    document.addEventListener('keydown', (e) => {
      if (this.ativo === true && e.keyCode === 27) {
        this.closeModal()
      }
    })
  }
}
</script>

<style scoped>
.container-scroll-horizontal {
    width: 30em;
    overflow-x: auto;
    white-space: nowrap;
}

.loader-request-time {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #00d1b2;
  width: 50px;
  height: 50px;
  -webkit-animation: spin .6s linear infinite;
  animation: spin .6s linear infinite;
  margin: auto;
  padding: 10px;
  /*position: absolute;*/
  /*top: 50%;*/
  left: 45%;
  /*z-index: 15;*/
  opacity: 40;
}
</style>
