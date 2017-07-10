<template>
  <div>
    <div>
      <div v-if="ativar">
        <bar :data="data" :options="options"></bar>
      </div>
    </div>
  </div>
</template>

<script>
import Bar from './../shared/chart/Bar'
export default {
  props: ['clubeId'],
  components: {
    'bar': Bar
  },

  data () {
    return {
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
            label: 'Pontuacao da ultima',
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
        responsive: false,
        title: {
          display: true,
          text: 'Estatísticas do Clube'
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
        this.atletas = []
        this.$kartolafc.mercado.getMercado(m => {
          for (let a of m.atletas.filter(a => a.clube_id === parseInt(this.clubeId))) {
            this.atletas.push(a)
          }
          this.ativar = false
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
      this.data.datasets[0].data.push(this.est.media)
      this.data.datasets[1].data = []
      this.data.datasets[1].data.push(this.est.pontuacao)
      this.data.datasets[2].data = []
      this.data.datasets[2].data.push(this.est.variacao)
    }
  },

  mounted: function () {
    this.getClubes()
  }
}
</script>

<style>
  
</style>
