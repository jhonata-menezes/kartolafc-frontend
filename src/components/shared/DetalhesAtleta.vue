<template>
  <div>
    <div class="modal" :class="ativo != false ? 'is-active' : ''" @click="closeModal()">
      <div class="modal-background"></div>
      <div class="modal-card" @click.stop>
        <header class="modal-card-head">
          <p class="modal-card-title">
            <span class="subtitle is-5">
              {{atletaMercado.apelido}}
            </span>
            <picture class="image is-32x32 is-pulled-left">
              <img :src="atletaMercado.foto">
            </picture>
          </p>
          <button class="delete" @click="closeModal()"></button>
        </header>
        <section class="modal-card-body">
          <div class="media">
            <div class="media-content">
              <div class="content">
                <div class="subtitle is-6">
                  ${{atletaMercado.preco_num}} Jogos: {{atletaMercado.jogos_num}}<br/>
                  <small v-if="atletaMercado.scout && atletaMercado.scout['G'] > 0">Gols: {{atletaMercado.scout['G']}}</small>
                </div>
              </div>
              <div>
                <grafico-atleta :data="dataGrafico" :option="option"></grafico-atleta>
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
      option: {
        elements: {
          line: {
            tension: 0
          }
        }
      },
      dataGrafico: {
        labels: [1, 2, 3, 4, 5, 6, 7],
        datasets: [
          {
            label: 'Gols',
            data: [1, 0, 2]
          },
          {
            label: 'Cartão Amarelo',
            borderColor: '##00d1b2',
            data: [1, 1, 1]
          }
        ]
      }
    }
  },

  methods: {
    getAtleta: function () {
      // Overwriting base render method with actual data.
      this.$kartolafc.mercado.getMercado(m => {
        http.get('/atletas/historico/' + this.atletaId).then(r => {
          this.$kartolafc.status.getStatus(s => {
            this.status = s
            this.atletaHistorico = r.data
            m.atletas.forEach(e => {
              if (e.atleta_id === this.atletaId) {
                this.atletaMercado = e
              }
            }, this)
          })
        }).catch(err => { console.log(err) })
      })
    },

    closeModal: function () {
      this.$emit('update:ativo', false)
    }
  },

  watch: {
    'atletaId': 'getAtleta'
  }
}
</script>

<style>

</style>
