<template>
  <div>
    <div>
      <div>
        <div>
          <br>
          <div>
            <b class="info-time" :class="{'sticky-detalhes': detalhesFixo}" v-if="detalhesFixo">
              <span class="info-time-item">Time <span class="has-text-success">${{valores.custoTime.toFixed(2)}}</span></span>
              <span class="info-time-item">Restam <span class="has-text-success">${{valores.restante.toFixed(2)}}</span></span>
              <span class="info-time-item">Em aberto <span class="has-text-info">{{timeMontado.filter(a => a === undefined).length}}</span></span>
              <span class="info-time-item">
                <span class="icon is-medium" @click="filtros.verFiltros=!filtros.verFiltros"><i class="fa fa-filter" aria-hidden="true"></i></span>
              </span>&nbsp
              <span class="info-time-item">
                <a class="delete is-large" @click="$emit('update:ativar', false)"></a><br class="is-hidden-tablet">
              </span>
              <div v-if="filtros.verFiltros">
                <div class="field is-grouped is-grouped-centered">
                  <p class="control">
                    <span class="select is-small has-icon-right">
                      <select v-model="filtros.atletaStatus">
                        <option v-for="s of mercado.status" :value="s.id">{{s.nome}}</option>
                      </select>
                    </span>
                  </p>
                  <p class="control">
                    <span class="select is-small">
                      <select class="is-small" v-model="sortColuna.coluna">
                        <option value="media_num">Média</option>
                        <option value="pontos_num">Ult. Pontuação</option>
                        <option value="variacao_num">Variação</option>
                        <option value="jogos_num">Jogos</option>
                        <option value="preco_num">Preço</option>
                      </select>
                    </span>
                  </p>
                  <p class="control">
                    <span @click="sortColuna.asc=(sortColuna.asc * -1)" class="icon is-small"><i class="fa" :class="sortColuna.asc == 1 ? 'fa-sort-asc': 'fa-sort-desc'"></i></span>
                  </p>
                </div>
                <div class="field is-grouped is-grouped-centered">
                  <p class="control">
                    <input type="text" class="input is-small" v-model="filtros.pesquisaNome" placeholder="Atleta ou time">
                  </p>
                </div>
              </div>
            </b>
            <div class="info-time has-text-centered">
              <span class="info-time-item">Time <span class="has-text-success">${{valores.custoTime.toFixed(2)}}</span></span>
              <span class="info-time-item">Restam <span class="has-text-success">${{valores.restante.toFixed(2)}}</span></span>
              <span class="info-time-item">Em aberto <span class="has-text-info">{{timeMontado.filter(a => a === undefined).length}}</span></span>
              <span class="info-time-item">
                <span class="icon is-medium" @click="filtros.verFiltros=!filtros.verFiltros"><i class="fa fa-filter" aria-hidden="true"></i></span>
              </span>&nbsp
              <span class="info-time-item">
                <a class="delete is-large" @click="$emit('update:ativar', false)"></a><br class="is-hidden-tablet">
              </span>
              <div v-if="filtros.verFiltros">
                <div class="field is-grouped is-grouped-centered">
                  <p class="control">
                    <span class="select is-small has-icon-right">
                      <select v-model="filtros.atletaStatus">
                        <option v-for="s of mercado.status" :value="s.id">{{s.nome}}</option>
                      </select>
                    </span>
                  </p>
                  <p class="control">
                    <span class="select is-small">
                      <select class="is-small" v-model="sortColuna.coluna">
                        <option value="media_num">Média</option>
                        <option value="pontos_num">Ult. Pontuação</option>
                        <option value="variacao_num">Variação</option>
                        <option value="jogos_num">Jogos</option>
                        <option value="preco_num">Preço</option>
                      </select>
                    </span>
                  </p>
                  <p class="control">
                    <span @click="sortColuna.asc=(sortColuna.asc * -1)" class="icon is-small"><i class="fa" :class="sortColuna.asc == 1 ? 'fa-sort-asc': 'fa-sort-desc'"></i></span>
                  </p>
                </div>
                <div class="field is-grouped is-grouped-centered">
                  <p class="control">
                    <input type="text" class="input is-small" v-model="filtros.pesquisaNome" placeholder="Atleta ou time">
                  </p>
                </div>
              </div>
            </div>
          </div>
          <br>
          <div v-for="atl of atletasSort" class="box" :key="atl.atleta_id">
            <div class="media" @click="$emit('update:est', atl)">
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
                    <span class="icon is-small" v-if="mercado.status" :title="mercado.status[atl.status_id].nome"><i class="fa" :class="statusIcon[atl.status_id]"></i></span>
                    <br>
                    <div class="campos-descricao-atleta">Preço <span class="has-text-success">${{atl.preco_num}}</span></div>
                    <div class="campos-descricao-atleta">Média <span :class="atl.media_num < 0 ? 'has-text-danger': 'has-text-success'">{{atl.media_num}}</span></div>
                    <div class="campos-descricao-atleta">Variação <span :class="atl.variacao_num < 0 ? 'has-text-danger': 'has-text-success'">{{atl.variacao_num}}</span></div>
                    <div class="campos-descricao-atleta">Última <span :class="atl.pontos_num < 0 ? 'has-text-danger': 'has-text-success'">{{atl.pontos_num}}</span></div>
                    <div class="campos-descricao-atleta">Jogos <br><span class="has-text-success">{{atl.jogos_num}}</span></div>
                    <div class="campos-descricao-atleta campos-descricao-atleta-jogos">
                      <div class="campos-descricao-jogo" v-if="partidas[atl.clube_id] && mercado.clubes">
                        <div v-for="a of partidas[atl.clube_id].aproveitamento_mandante" :key="a" :class="statusJogo[a]"></div>
                        <picture>
                          <img class="image-escudo" :src="mercado.clubes[partidas[atl.clube_id].clube_casa_id].Escudos['45x45']">
                        </picture>
                        X
                        <picture>
                          <img class="image-escudo" :src="mercado.clubes[partidas[atl.clube_id].clube_visitante_id].Escudos['45x45']">
                        </picture>
                        <div v-for="a of reverse(partidas[atl.clube_id].aproveitamento_visitante)" :key="a" :class="statusJogo[a]"></div>  
                      </div>
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
  props: ['atletas', 'timeMontado', 'esquema', 'valores', 'partidas'],
  data () {
    return {
      filtros: {
        verFiltros: false,
        pesquisaNome: '',
        atletaStatus: 7
      },
      detalhesFixo: false,
      sortColuna: {
        coluna: 'preco_num',
        asc: 1
      },
      mercado: {},
      atletasEscalados: {},
      statusIcon: {
        2: 'fa-question fa-color-red',
        3: 'fa-square fa-color-red',
        5: 'fa-plus fa-color-red',
        6: '',
        7: 'fa-check fa-check-green'
      },
      statusJogo: {
        'v': 'status-jogo status-jogo-vitoria',
        'e': 'status-jogo status-jogo-empate',
        'd': 'status-jogo status-jogo-derrota'
      }
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
    },

    reverse: function (i) {
      let a = i.slice()
      return a.reverse()
    }
  },

  computed: {
    atletasSort: function () {
      let atl = []
      if (this.atletas) {
        atl = this.atletas
        atl.sort(this.sortBy)
      }
      atl = atl.filter(a => a.status_id === this.filtros.atletaStatus)
        .filter(a => {
          if (a.apelido.toLowerCase().indexOf(this.filtros.pesquisaNome.toLowerCase()) >= 0 ||
            (this.mercado.clubes && this.mercado.clubes[a.clube_id].nome.toLowerCase().indexOf(this.filtros.pesquisaNome.toLowerCase()) >= 0)) {
            return true
          }
        })
      return atl
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
  font-weight: bold; 
  display: inline-block;
  max-width: 3.8rem;
  min-width: 2rem;
  text-align: center;
}

.campos-descricao-atleta-jogos {
  max-width: 10rem !important;
}

.escudo-lado {
  left: 32px;
  bottom: 18px
}

.fa-check-green {
  color: #21a021;
}

.info-time {
  font-size: .8rem;
  font-weight: bold;
}
.fa-color-red {
  color: red;
}

.box {
  background-color: rgba(230, 230, 230, 0.52);
  padding-left: .5rem;
}

.campos-descricao-jogo {
  display: inline-block;
  max-width: 19rem;
}

.image-escudo {
  height: 1.5rem;
  width: 1.5rem;
}

.status-jogo {
  height: 7px;
  width: 7px;
  border-radius: 50%;
  display: inline-block;
  margin-left: .1rem;
}

.status-jogo-vitoria {
  background: green;
}

.status-jogo-empate {
  background: #b5b5b5;
}

.status-jogo-derrota {
  background: red;
}

.info-time-item {
  display: inline-block;
  max-width: 4.3rem;
  text-align: center;
  vertical-align: text-top;
}

@media screen and (max-width: 768px) {
  .sticky-detalhes {
    overflow: hidden;
    padding: 10px 0 4px 12px;
    position: fixed;
    top: 0px;
    background: #f2f2f2;
    margin-left: -24px;
    z-index: 1;
    width: 100%;
    text-align: center;
  }

  .campos-descricao-atleta {
    font-size: .8rem;
    max-width: 2.8rem;
    min-width: 2rem;    
  }

  .image-escudo {
    height: 1.3rem;
    width: 1.3rem;
  }
}
</style>
