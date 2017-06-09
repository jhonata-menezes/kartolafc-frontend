<template>
  <div>
    <div class="section" :class="loader ? 'clareamento': ''">
      <div>
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <div class="">
              <h5 class="title is-4 has-text-centered">Mercado de Atletas</h5>
              <div>
                <div class="field has-addons-centered has-addons">
                  <p class="control">
                    <input class="input is-small is-primary" type="text" v-model="filtros.pesquisaNomeAtleta" placeholder="Nome Atleta">
                  </p>
                  <p class="control">
                    <span class="select is-primary is-small">
                      <select class='is-small' v-model="sort.coluna" >
                        <option value='preco_num' checked='checked'>Preço</option>
                        <option value='pontos_num'>Última pontuação</option>
                        <option value='media_num'>Média de pontos</option>
                        <option value='variacao_num'>Variação</option>
                        <option value='jogos_num'>Participação em jogos</option>
                      </select>
                    </span>
                  </p>
                </div>
                <div class="field is-grouped is-grouped-centered">
                  <p class="control">
                    <span class="select is-primary is-small">
                      <select class='is-small' v-model.number="filtros.posicao_id" >
                        <option value=0 disabled>Posição</option>
                        <option value=0 checked='checked'>Todos</option>
                        <option value=1>Goleiro</option>
                        <option value=2>Lateral</option>
                        <option value=3>Zagueiro</option>
                        <option value=4>Meia</option>
                        <option value=5>Atacante</option>
                        <option value=6>Técnico</option>
                      </select>
                    </span>
                  </p>
                  <p class="control">
                    <span class="select is-primary is-small">
                      <select class='is-small' v-model.number="filtros.status_id" >
                        <option value=7 checked='checked'>Provável</option>
                        <option value=2>Dúvida</option>
                        <option value=3>Suspenso</option>
                        <option value=5>Contundido</option>
                        <option value=6>Nulo</option>
                      </select>
                    </span>
                  </p>
                  <p class="control">
                    <span class="icon is-small" @click="sort.tipo = sort.tipo * -1">
                      <i class="fa fa-sort-amount-asc" aria-hidden="true" v-if="sort.tipo === 1"></i>
                      <i class="fa fa-sort-amount-desc" aria-hidden="true" v-else></i>
                    </span>
                  </p>
                </div>
                <div class="field is-grouped is-grouped-centered">
                  <p class="control">
                    <span class="tag is-warning is-small tag-down">Última Pontuação</span>
                    <span class="tag is-info is-small tag-down">Média</span>
                    <span class="tag is-dark is-small tag-down">Variação</span>
                    <span class="tag is-success is-small tag-down">Jogos</span>
                  </p>
                </div>
              </div>
            </div>
            <hr class="hr">
            <div class="" v-for="a of atletasComputed">
              <div class="media" @click="exibirDetalhes(a.atleta_id)">
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
                      <span class="tag is-warning is-small tag-down">{{ a.pontos_num }}</span>
                      <span class="tag is-info is-small tag-down">{{ a.media_num }}</span>
                      <span class="tag is-dark is-small tag-down">{{ a.variacao_num }}</span>
                      <span class="tag is-success is-small tag-down">{{ a.jogos_num }}</span>
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
    <detalhes-atleta :ativo="detalhes.ativo" :atletaId="detalhes.atletaId" @update:ativo="v => detalhes.ativo = v"></detalhes-atleta>
    <div v-show="loader">
      <div class="loader-request"></div>
    </div>
  </div>  
</template>

<script>
import DetalhesAleta from './../shared/DetalhesAtleta'

export default {
  components: {
    'detalhes-atleta': DetalhesAleta
  },
  data () {
    return {
      detalhes: {
        ativo: false,
        atletaId: 0
      },
      atletas: [],
      pontuados: {},
      loader: false,
      sort: {
        coluna: 'preco_num',
        tipo: 1
      },
      filtros: {
        status_id: 7,
        posicao_id: 0,
        pesquisaNomeAtleta: ''
      }
    }
  },

  created: function () {
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
    },

    exibirDetalhes: function (t) {
      this.detalhes.ativo = true
      this.detalhes.atletaId = t
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

      let atletasTemp = this.atletas.atletas.filter(v => v.status_id === this.filtros.status_id)
        .filter(v => v.apelido.toLowerCase().indexOf(this.filtros.pesquisaNomeAtleta.toLowerCase()) >= 0)
        .filter(v => {
          if (this.filtros.posicao_id === 0) return true
          return this.filtros.posicao_id === v.posicao_id
        })
      return atletasTemp.slice(0, 99)
    }
  }
}
</script>

<style scoped>
.hr {
  margin: 0.1rem 0.1rem
}

.fa-check {
  color: #21a021;
}

.tag-down {
  font-size: 0.8em;
  height: 1.3em;
}

.tag-down-max {
  font-size: 0.5em;
  height: 1.2em;
}
</style>
