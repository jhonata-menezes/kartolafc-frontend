<template>
  <div>
    <div>
      <div>
        <div v-if="loader">
          <div class="loader-request-time"></div>
        </div>
        <div v-if="ativarGrafico">
          <chart :chartData="datasets" :options="options" :height="300" :width="400"></chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from './DefaultChart'
export default {
  props: ['timeId'],

  components: {
    'chart': Chart
  },

  data () {
    return {
      loader: false,
      historico: [],
      grafico: {
        variacao: [],
        patrimonio: [],
        pontuacao: []
      },
      datasets: {
        labels: [],
        datasets: []
      },
      options: {
        maintainAspectRatio: false,
        animation: {
          duration: 1,
          onComplete: function (t) {
            let chartInstance = this.chart
            let ctx = chartInstance.ctx
            // ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)'
            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i)
              meta.data.forEach(function (bar, index) {
                let field = dataset._meta[Object.keys(dataset._meta)[0]]
                if (field.hidden) {
                  ctx.fillText('', bar._model.x, bar._model.y - 5)
                } else {
                  var data = dataset.data[index]
                  ctx.fillText(data, bar._model.x, bar._model.y - 5)
                }
              })
            })
          }
        },
        tooltips: {
          enabled: true
        },
        hover: {
          animationDuration: 1
        },
        elements: {
          line: {
            tension: 0
          }
        },
        responsive: true,
        title: {
          display: true,
          text: 'Histórico do Time'
        },
        layout: {
          padding: {
            left: 10,
            right: 20,
            top: 10,
            bottom: 10
          }
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Rodada'
            }
          }],
          yAxes: [{
            ticks: {
              display: false
            }
          }]
        }
      },
      ativarGrafico: false
    }
  },

  methods: {
    getHistorico: function () {
      this.loader = true
      this.ativarGrafico = false
      this.$kartolafc.timeHistorico(this.timeId, h => {
        this.historico = h
        this.mountGraficoTime()
        this.loader = false
      })
    },

    mountGraficoTime: function () {
      let time = {}
      let rodada = 0
      for (rodada in this.historico) {
        time = this.historico[rodada]
        let variacao = 0
        if (!time.atletas) {
          this.grafico.variacao[rodada] = 0
        } else {
          for (let t of time.atletas) {
            variacao += t.variacao_num
          }
        }

        let patrimonio = 0
        if (parseInt(rodada) === 1) {
          patrimonio = 100 + variacao
        } else {
          patrimonio = parseFloat(this.grafico.patrimonio[rodada - 2]) + variacao
        }

        this.grafico.variacao[rodada - 1] = variacao.toFixed(2)
        this.grafico.pontuacao[rodada - 1] = time.pontos.toFixed(2)
        this.grafico.patrimonio[rodada - 1] = patrimonio.toFixed(2)

        this.datasets.labels[rodada - 1] = rodada
      }
      this.setData(this.grafico)
      this.ativarGrafico = true
    },

    setData: function (data) {
      this.datasets.datasets = [
        {
          label: 'Pontuacao',
          borderColor: 'rgba(182, 28, 0, 0.6)',
          backgroundColor: 'rgba(182, 28, 0, 0.6)',
          data: data['pontuacao'],
          fill: false
        },
        {
          label: 'Variacao',
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgb(54, 162, 235)',
          data: data['variacao'],
          fill: false
        },
        {
          label: 'Patrimonio',
          borderColor: 'rgba(34, 145, 22, 0.9)',
          backgroundColor: 'rgba(34, 145, 22, 0.9)',
          data: data['patrimonio'],
          fill: false
        }
      ]
    }
  },

  mounted: function () {
    this.getHistorico()
  },

  watch: {
    'timeId': 'getHistorico'
  }

}
</script>

<style scoped>
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

.clareamento {
  opacity: 0.5;
}
</style>
