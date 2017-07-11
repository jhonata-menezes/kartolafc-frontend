<template>
  <div>
    <div>
      <div v-if="ativar">
        <bar :data="data" :options="options" :height="250" :width="400"></bar>
      </div>
    </div>
  </div>
</template>

<script>
import HorizontalBar from './../shared/chart/HorizontalBar'
export default {
  props: ['clubeId'],
  components: {
    'bar': HorizontalBar
  },

  data () {
    return {
      mercado: {},
      ativar: false,
      atletas: [],
      est: {
        media: 0,
        pontuacao: 0,
        variacao: 0
      },
      data: {
        labels: [''],
        datasets: [
          {
            label: 'Média',
            borderColor: 'rgba(182, 28, 0, 0.6)',
            backgroundColor: 'rgba(182, 28, 0, 0.6)',
            data: []
          },
          {
            label: 'Última Pontuação',
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgb(54, 162, 235)',
            data: []
          },
          {
            label: 'Variacao Somada',
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
    getClubes: function () {
      if (this.clubeId) {
        this.ativar = false
        this.atletas = []
        this.$kartolafc.mercado.getMercado(m => {
          this.mercado = m
          for (let a of m.atletas.filter(a => a.clube_id === parseInt(this.clubeId))) {
            this.atletas.push(a)
          }
          this.parseAtletas()
          this.ativar = true
        })
      }
    },

    parseAtletas: function () {
      for (let a of this.atletas) {
        this.est.media += a.media_num
        this.est.pontuacao += a.pontos_num
        this.est.variacao += a.variacao_num
      }
      this.data.datasets[0].data = []
      this.data.datasets[0].data.push(this.est.media.toFixed(2))
      this.data.datasets[1].data = []
      this.data.datasets[1].data.push(this.est.pontuacao.toFixed(2))
      this.data.datasets[2].data = []
      this.data.datasets[2].data.push(this.est.variacao.toFixed(2))
      this.options.title.text = 'Estatísticas do Clube - ' + this.mercado.clubes[this.clubeId].nome
    }
  },

  mounted: function () {
    this.getClubes()
  },

  watch: {
    clubeId: function () {
      this.getClubes()
    }
  }
}
</script>

<style>
  
</style>
