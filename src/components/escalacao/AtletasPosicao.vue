<template>
  <div>
    <div>
      <div>
        <div>
          <br>
          <div>
            <b :class="{'sticky-detalhes': detalhesFixo}">
              Time <span class="has-text-success">${{valores.custoTime.toFixed(2)}}</span>
              Restam <span class="has-text-success">${{valores.restante.toFixed(2)}}</span>&nbsp
              <a class="delete is-large" @click="$emit('update:ativar', false)"></a>
            </b>
          </div>
          <br>
          <div v-for="atl of atletasSort" class="box" :key="atl.atleta_id">
            <div class="media">
              <div class="media-left">
                <picture class="image is-64x64">
                  <img :src="atl.foto">
                </picture>
                <picture class="image is-32x32 escudo-lado">
                  <img v-if="mercado.clubes && mercado.clubes[atl.clube_id]" :src="mercado.clubes[atl.clube_id].Escudos['45x45']">
                </picture>
              </div>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{atl.apelido}}</strong> <small v-if="mercado.posicoes && mercado.posicoes[atl.posicao_id]">{{mercado.posicoes[atl.posicao_id].abreviacao.charAt(0).toUpperCase() + mercado.posicoes[atl.posicao_id].abreviacao.slice(1)}}</small>
                    <span class="icon" v-if="atl.status_id == 7"><i class="fa fa-check fa-check-green"></i></span>
                    <br>
                    <div class="campos-descricao-atleta">Preço ${{atl.preco_num}}
                    Média {{atl.media_num}}
                    Última {{atl.pontos_num}}
                    Jogos {{atl.jogos_num}}
                    </div>
                    <button v-if="atletasEscalados[atl.atleta_id]" class="button is-danger is-small" @click="removeAtleta(atl)">Vender</button>
                    <button v-else class="button is-success is-small" @click="selecionAtleta(atl)" :disabled="valores.restante < atl.preco_num">Comprar</button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
export default {
  props: ['atletas', 'timeMontado', 'esquema', 'valores'],
  data () {
    return {
      detalhesFixo: false,
      sortColuna: {
        coluna: 'preco_num',
        asc: 1
      },
      mercado: {},
      atletasEscalados: {}
    }
  },

  methods: {
    sortBy: function (a, b) {
      if (a[this.sortColuna.coluna] === b[this.sortColuna.coluna]) return 0
      return a[this.sortColuna.coluna] < b[this.sortColuna.coluna] ? this.sortColuna.asc * 1 : this.sortColuna.asc * -1
    },

    selecionAtleta: function (atleta) {
      this.$emit('update:selecionado', atleta)
      this.updateMontados()
      for (let a in this.timeMontado) {
        if (!this.timeMontado[a]) {
          this.$emit('update:posicao', a)
          return
        }
      }
      // finaliza
    },

    updateMontados: function () {
      let atletasEscalados = {}
      for (let a of this.timeMontado) {
        if (a) {
          atletasEscalados[a.atleta_id] = a
        }
      }
      this.atletasEscalados = atletasEscalados
    },

    removeAtleta: function (atleta) {
      for (let a in this.timeMontado) {
        if (this.timeMontado[a].atleta_id === atleta.atleta_id) {
          this.$emit('update:posicao', a)
          break
        }
      }
      this.$emit('update:selecionado', undefined)
      this.updateMontados()
    }
  },

  computed: {
    atletasSort: function () {
      let atl = []
      if (this.atletas) {
        atl = this.atletas
        atl.sort(this.sortBy)
      }
      return atl.filter(a => a.status_id === 7)
    }
  },

  created: function () {
    this.$kartolafc.mercado.getMercado(m => {
      this.mercado = m
    })
    window.onscroll = () => {
      let top = window.pageYOffset || document.documentElement.scrollTop
      this.detalhesFixo = top > 230
    }
  },

  watch: {
    timeMontado: function (n) {
      this.updateMontados()
    }
  }
}
</script>

<style scoped>
.campos-descricao-atleta {
  font-size: .9rem;  
}

.escudo-lado {
  left: 32px;
  bottom: 18px
}

.fa-check-green {
  color: #21a021;
}
@media screen and (max-width: 768px) {
  .sticky-detalhes {
    /*margin: 0;*/
    /*margin-left: -24px;*/
    overflow: hidden;
    padding: 10px 0 4px 12px;
    position: fixed;
    top: 0px;
    background: #f2f2f2;
    margin-left: -24px;
    height: 40px;
    z-index: 1;
    width: 100%;
    text-align: center;
  }
}
</style>
