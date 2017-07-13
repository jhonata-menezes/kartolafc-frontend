<template>
  <div>
    <div>
      <div>
        <div v-if="loader">
          <div class="loader-request-time"></div>
        </div>
        <div v-else>
          <div v-if="ativarGrafico" class="container-canvas">
            <chart :chartData="datasets" :options="options" :height="300" :width="500"></chart>
          </div>
          <hr class="hr">
          <div>
            <strong class="is-bold is-5">Mais escalado</strong><br>
            <div v-if="atletas.maisEscalado.escalado >= 0" class="media">
              <figure class="media-left">
                <p class="image is-48x48">
                  <img :src="atletas.maisEscalado.atleta.foto">
                </p>
              </figure>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong class="title is-6">{{atletas.maisEscalado.atleta.apelido}}</strong><br>
                    <strong class="subtitle is-6">{{atletas.maisEscalado.pontuacaoMais.toFixed(2)}} Pts - Escalado {{atletas.maisEscalado.escalado}}X</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <hr class="hr">
          <div>
            <strong class="is-bold is-5">Rendeu mais pontos</strong><br>
            <div v-if="atletas.maisPontos.escalado >= 0" class="media">
              <figure class="media-left">
                <p class="image is-48x48">
                  <img :src="atletas.maisPontos.atleta.foto">
                </p>
              </figure>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong class="title is-6">{{atletas.maisPontos.atleta.apelido}}</strong><br>
                    <strong class="subtitle is-6">{{atletas.maisPontos.pontuacaoMais.toFixed(2)}} Pts - Escalado {{atletas.maisPontos.escalado}}X</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <hr class="hr">
          <div>
            <strong class="is-bold is-5">Rendeu menos pontos</strong><br>
            <div v-if="atletas.menosPontos.escalado >= 0" class="media">
              <figure class="media-left">
                <p class="image is-48x48">
                  <img :src="atletas.menosPontos.atleta.foto">
                </p>
              </figure>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong class="title is-6">{{atletas.menosPontos.atleta.apelido}}</strong><br>
                    <strong class="subtitle is-6">{{atletas.menosPontos.pontuacaoMais.toFixed(2)}} Pts - Escalado {{atletas.menosPontos.escalado}}X</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <hr class="hr">
          <div>
            <div>
              <p class="has-text-centered">Reveja escalações passadas</p>
              <div class="field is-grouped is-grouped-centered">
                <p class="control has-icons-right">
                  <span class="select is-small">
                    <select v-model="rodadaSelecionada">
                      <option v-if="rodada > 0" :key="rodada" v-for="(time, rodada) of historico" :value="rodada">Rodada {{rodada}}</option>
                    </select>
                  </span>
                </p>
              </div>
            </div>
            <div v-if="historico[rodadaSelecionada] && historico[rodadaSelecionada].atletas">
              <p class="has-text-centered">
                Pontuação Total: {{historico[rodadaSelecionada].pontos.toFixed(2)}}
              </p>
              <hr class="hr-atleta">
              <div v-for="t of historico[rodadaSelecionada].atletas">
                <article class="media">
                  <figure class="media-left">
                    <p class="image is-16x16">
                      <img :src="pontuados.clubes[t.clube_id].Escudos['30x30']">
                    </p>
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p>
                        <strong>{{ t.apelido }}</strong><small> {{ pontuados.posicoes[t.posicao_id].abreviacao.charAt(0).toUpperCase() + pontuados.posicoes[t.posicao_id].abreviacao.slice(1) }}</small>
                        <strong class="is-pulled-right is-success" >{{ t.pontos_num }}</strong>
                      </p>
                    </div>
                  </div>
                </article>
                <hr class="hr-atleta">
              </div>
            </div>
          </div>
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
      pontuados: {},
      historico: [],
      rodadaSelecionada: 0,
      atletasOcorrencia: {},
      atletas: {
        maisPontos: {},
        menosPontos: {},
        maisEscalado: {}
      },
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
        responsive: false,
        title: {
          display: true,
          text: 'Histórico do Time'
        },
        layout: {
          padding: {
            left: 10,
            right: 20,
            top: 15,
            bottom: 15
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
      this.$kartolafc.pontuados.getPontuados(p => {
        this.pontuados = p
      })
      this.$kartolafc.timeHistorico(this.timeId, h => {
        this.historico = h
        this.mountGraficoTime()
        this.loader = false
      })
    },

    mountGraficoTime: function () {
      let time = {}
      let rodada = 0
      let index = 0
      this.atletasOcorrencia = new Array(300)
      for (rodada in this.historico) {
        time = this.historico[rodada]
        let variacao = 0
        if (!time.atletas) {
          this.grafico.variacao[rodada] = 0
        } else {
          for (let t of time.atletas) {
            variacao += t.variacao_num
            index = parseInt(t.atleta_id)
            if (this.atletasOcorrencia[index]) {
              this.atletasOcorrencia[index]['escalado']++
              this.atletasOcorrencia[index]['pontuacaoMais'] += t.pontos_num
            } else {
              this.atletasOcorrencia[index] = []
              this.atletasOcorrencia[index]['atleta'] = t
              this.atletasOcorrencia[index]['escalado'] = 1
              this.atletasOcorrencia[index]['pontuacaoMais'] = t.pontos_num
            }
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
      this.$emit('update:patrimonio', this.grafico.patrimonio.slice(-1)[0])
      let atletasTemp = this.atletasOcorrencia
      this.atletasOcorrencia = []
      for (let a of atletasTemp) {
        if (!a) {
          continue
        }
        this.atletasOcorrencia.push(a)
      }

      // melhores e piores
      this.atletasOcorrencia.sort((t1, t2) => {
        if (t1.escalado === t2.escalado) return 0
        return t1.escalado < t2.escalado ? 1 : -1
      })
      this.atletas.maisEscalado = this.atletasOcorrencia.slice(0, 1)[0]

      this.atletasOcorrencia.sort((t1, t2) => {
        if (t1.pontuacaoMais === t2.pontuacaoMais) return 0
        return t1.pontuacaoMais < t2.pontuacaoMais ? 1 : -1
      })

      this.atletas.maisPontos = this.atletasOcorrencia.slice(0, 1)[0]
      this.atletas.menosPontos = this.atletasOcorrencia.slice(-1)[0]
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

.hr {
  margin: 0.5rem 0.5rem
}

.hr-atleta {
  margin: 0.1rem 0.1rem
}

.container-canvas {
  width: 100%;
  overflow: auto;
  border: 1px;
}
</style>
