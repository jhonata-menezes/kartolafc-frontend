<template>
  <div>
    <div class="section" :class="loader ? 'clareamento': ''">
      <div>
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <div>
              <h5 class="title is-6 has-text-centered">Mercado de Atletas</h5>
              <div>
                <div class="has-text-centered">
                  <span class="tag is-warning is-small">Pontos</span>
                  <span class="tag is-info is-small">Média</span>
                  <span class="tag is-dark is-small">Variação</span>
                  <span class="tag is-success is-small">Jogos</span>
                  <br/> <br/>
                </div>
                <div class="field is-grouped is-grouped-centered">
                  <p class="control">
                    <input class="input is-small is-primary" type="text" v-model="pesquisaNomeAtleta" placeholder="Nome Atleta">
                  </p>
                  <p class="control">
                    <span class="select is-small is-primary">
                      <select v-model="sort.coluna" >
                        <option value='preco_num' checked='checked'>Preço</option>
                        <option value='pontos_num'>Última pontuacao</option>
                        <option value='media_num'>Média de pontos</option>
                        <option value='variacao_num'>Variação</option>
                        <option value='jogos_num'>Participação em jogos</option>
                      </select>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <hr class="hr">
            <div class="" v-for="a of atletasComputed">
              <div class="media">
                <div class="media-left">
                  <picture class="image is-48x48">
                    <img :src="a.foto">
                  </picture>
                </div>
                <div class="media-content">
                  <div class="content">
                    <p><strong>{{ a.apelido }}</strong>
                      <small>{{pontuados.posicoes[a.posicao_id].abreviacao.charAt(0).toUpperCase() + pontuados.posicoes[a.posicao_id].abreviacao.slice(1)}}</small>
                      <small v-if="atletas.status[a.status_id] && a.status_id === 7"><span class="icon is-small "><i class="fa fa-check" aria-hidden="true"></i></span></small>
                      <small class="is-pulled-right">
                        <span class="tag is-primary is-small">${{a.preco_num.toFixed(2)}}</span>
                      </small>
                      <br/>
                      <span class="tag is-warning is-small">{{ a.pontos_num }}</span>
                      <span class="tag is-info is-small">{{ a.media_num }}</span>
                      <span class="tag is-dark is-small">{{ a.variacao_num }}</span>
                      <span class="tag is-success is-small">{{ a.jogos_num }}</span>
                    </p>
                  </div>
                </div>
              </div>
              <hr class="hr">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="loader">
      <div class="loader-request"></div>
    </div>
  </div>  
</template>

<script>
export default {
  data () {
    return {
      atletas: [],
      pontuados: {},
      loader: false,
      sort: {
        coluna: 'preco_num',
        tipo: 1
      },
      status_id: 7,
      pesquisaNomeAtleta: ''
    }
  },

  mounted: function () {
    this.update()
  },

  methods: {
    update: function () {
      this.loader = true
      this.$kartolafc.mercado.getMercado(m => {
        this.$kartolafc.pontuados.getPontuados(p => {
          this.atletas = m
          this.pontuados = p
          this.loader = false
        })
      })
    }
  },

  computed: {
    atletasComputed: function () {
      if (!this.atletas.atletas) {
        return []
      }

      this.atletas.atletas.sort((atl1, atl2) => {
        if (atl1[this.sort.coluna] < atl2[this.sort.coluna]) {
          return (this.sort.tipo * 1)
        }

        if (atl1[this.sort.coluna] > atl2[this.sort.coluna]) {
          return (this.sort.tipo * -1)
        }
        return 0
      })

      return this.atletas.atletas.filter(v => v.status_id === this.status_id)
        .filter(v => v.apelido.toLowerCase().indexOf(this.pesquisaNomeAtleta.toLowerCase()) >= 0)
    }
  }
}
</script>

<style>
.hr {
  margin: 0.1rem 0.1rem
}

.fa-check {
  color: #21a021
}

.new-line-p {

}
</style>
