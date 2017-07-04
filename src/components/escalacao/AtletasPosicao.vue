<template>
  <div>
    <div>
      <div>
        <div>
          <div v-for="atl of atletasSort" class="box" :key="atl.atleta_id">
            <div class="media">
              <div class="media-left">
                <picture class="image is-64x64">
                  <img :src="atl.foto">
                </picture>
                <picture class="image is-32x32 escudo-lado">
                  <img :src="mercado.clubes[atl.clube_id].Escudos['45x45']">
                </picture>
              </div>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{atl.apelido}}</strong> <small v-if="mercado.posicoes">{{mercado.posicoes[atl.posicao_id].abreviacao.charAt(0).toUpperCase() + mercado.posicoes[atl.posicao_id].abreviacao.slice(1)}}</small>
                    <span class="icon" v-if="atl.status_id == 7"><i class="fa fa-check"></i></span>
                    <br>
                    <div class="campos-descricao-atleta">Preço ${{atl.preco_num}}
                    Média {{atl.media_num}}
                    Última {{atl.pontos_num}}
                    Jogos {{atl.jogos_num}}
                    </div>
                    <button class="button is-success is-small" @click="$emit('update:selecionado', atl)"><i class="fa fa-check"></i></button>
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
  props: ['atletas'],
  data () {
    return {
      sortColuna: {
        coluna: 'preco_num',
        asc: 1
      },
      mercado: {}
    }
  },

  methods: {
    sortBy: function (a, b) {
      if (a[this.sortColuna] === b[this.sortColuna]) return 0
      return a[this.sortColuna] < b[this.sortColuna] ? this.sortColuna.asc * 1 : this.sortColuna.asc * -1
    }
  },

  computed: {
    atletasSort: function () {
      let atl = []
      if (this.atletas) {
        atl = this.atletas
        atl.sort(this.sortBy)
      }
      return atl
    }
  },

  created: function () {
    this.$kartolafc.mercado.getMercado(m => {
      this.mercado = m
    })
  }
}
</script>

<style>

</style>
