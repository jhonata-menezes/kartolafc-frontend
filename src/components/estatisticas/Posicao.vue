<template>
  <div>
    <div>
      <div v-if="ativarGrafico">
        <bar :data="dataGrafico" :options="options" :height="250" :width="400"></bar>
      </div>
    </div>
  </div>
</template>

<script>
import HorizontalBar from './../shared/chart/HorizontalBar'

export default {
  props: ['posicaoId'],
  components: {
    'bar': HorizontalBar
  },
  data () {
    return {
      mercado: {},
      ativarGrafico: false,
      atletas: [],
      est: {
        maiorPontuador: {},
        menorPontuador: {},
        mediaPontuacao: 0
      },
      dataGrafico: {
        labels: [''],
        datasets: [
          {
            label: 'Média',
            borderColor: 'rgba(182, 28, 0, 0.6)',
            backgroundColor: 'rgba(182, 28, 0, 0.6)',
            data: []
          },
          {
            label: 'Maior pontuador',
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgb(54, 162, 235)',
            data: []
          },
          {
            label: 'Menor pontuador',
            borderColor: 'rgb(255, 205, 86)',
            backgroundColor: 'rgb(255, 205, 86)',
            data: []
          }
        ]
      },
      options: {
        elements: {
          rectangle: {
            borderWidth: 2
          }
        },
        responsive: false,
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: ''
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true
              // labelString: 'Rodada'
            }
          }]
        }
      }
    }
  },
  methods: {
    getAtletas: function () {
      if (!this.posicaoId) {
        return
      }
      this.ativarGrafico = false
      this.$kartolafc.mercado.getMercado(m => {
        this.mercado = m
        this.atletas = []
        let media = 0
        let total = 0
        let promises = []
        for (let a of m.atletas) {
          if (a.media_num !== 0 && a.posicao_id === parseInt(this.posicaoId)) {
            let p = new Promise((resolve, reject) => {
              this.$kartolafc.atletasHistorico(a.atleta_id, t => {
                resolve(this.atletas.push(t))
              })
            })
            promises.push(p)
            media += a.media_num
            total++
          }
        }
        this.est.mediaPontuacao = media / total
        Promise.all(promises).then(c => {
          this.parseAtletas()
          this.ativarGrafico = true
        })
      })
    },

    parseAtletas: function () {
      this.est.maiorPontuador.pontos = -100
      this.est.menorPontuador.pontos = 100
      for (let a of this.atletas) {
        for (let b of a) {
          if (this.est.maiorPontuador.pontos < b.pontos) this.est.maiorPontuador = b
          if (this.est.menorPontuador.pontos > b.pontos) this.est.menorPontuador = b
        }
      }
      this.dataGrafico.datasets[0].data = []
      this.dataGrafico.datasets[0].data.push(this.est.mediaPontuacao.toFixed(2))
      this.dataGrafico.datasets[1].data = []
      this.dataGrafico.datasets[1].data.push(this.est.maiorPontuador.pontos.toFixed(2))
      this.dataGrafico.datasets[2].data = []
      this.dataGrafico.datasets[2].data.push(this.est.menorPontuador.pontos.toFixed(2))
      this.options.title.text = 'Estatísticas da posição - ' + this.mercado.posicoes[this.posicaoId].nome
    }
  },

  mounted: function () {
    this.getAtletas()
  },

  watch: {
    posicaoId: function () {
      this.getAtletas()
    }
  }
}
</script>
