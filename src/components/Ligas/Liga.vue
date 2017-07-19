<template>
  <div>
    <section v-if="liga.liga" :class="loader ? 'clareamento': ''">
      <section class="hero is-success">
        <div class="hero-body">
          <div class="container">
            <div class="columns">
              <div class="column is-half is-offset-one-quarter">
                <div class="media">
                  <div class="media-right">
                    <picture class="image is-32x32">
                      <img :src="liga.liga.mata_mata ? liga.liga.url_trofeu_svg : liga.liga.url_flamula_svg" @error="liga.liga.url_flamula_svg='/static/img/icon.png'">
                    </picture>
                  </div>
                  <div class="media-content">
                    <p class="title is-5">
                      {{liga.liga.nome}}
                      <span class="icon is-6 is-small" title="Copiar link" v-clipboard="clipboard()" @success="clipboardSuccess">
                        <i class="fa fa-clipboard" aria-hidden="true"></i>
                      </span><br><br>
                      <a class="button is-small is-success" v-if="!detalhesLiga" @click="detalhesLiga = !detalhesLiga">+ Detalhes</a>
                      <a class="button is-small is-success" v-else @click="detalhesLiga = !detalhesLiga">- Detalhes</a>
                      <social-sharing class="" hashtags="KartolaFC" :url="'https://kartolafc.com.br/#/liga/' + slug" :title="liga.liga.nome" :description="liga.liga.descricao" inline-template>
                        <span class="title is-5">
                          <network network="facebook">
                            <i class="fa fa-facebook"></i>
                          </network>&nbsp &nbsp
                          <network network="whatsapp">
                            <i class="fa fa-whatsapp"></i>
                          </network>&nbsp &nbsp
                          <network network="twitter">
                            <i class="fa fa-twitter"></i>
                          </network>&nbsp &nbsp
                          <network network="telegram">
                            <i class="fa fa-telegram"></i>
                          </network>
                        </span>
                      </social-sharing>
                    </p>
                    <p class="subtitle is-6">
                      <div class="" v-if="detalhesLiga">
                        <small>Descrição: {{liga.liga.descricao}}</small></br>
                        <small>Tipo: {{liga.liga.tipo === 'F' ? 'Fechada' : liga.liga.tipo}}</small></br>
                        <small>Total de Times: {{liga.liga.total_times_liga}}</small></br>
                        <small v-if="presidente">Presidente: {{presidente}}</small>
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section section-min" v-if="liga.liga.mata_mata != true">
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <div class="field is-grouped is-grouped-centered">
               <p class="control has-icons-right">
                <span class="select is-small">
                  <select v-model="timesPontuacao.nome" @change="timesPontuacao.somarPontuacao = false">
                    <option value="padrao" selected>Atual</option>
                    <option value="rodada">Rodada</option>
                    <option value="mes">Mes</option>
                    <option value="turno">Turno</option>
                    <option value="campeonato">Campeonato</option>
                    <option value="patrimonio">Patrimônio</option>
                  </select>
                </span>
              </p>
              <p class="control">
                <label class="checkbox is-small" :disabled="status.status_mercado !== 2 || timesPontuacao.nome === 'padrao' || timesPontuacao.nome === 'patrimonio'">
                  <input class="is-small" type="checkbox" :disabled="status.status_mercado !== 2 || timesPontuacao.nome === 'padrao' || timesPontuacao.nome === 'patrimonio'"
                  v-model="timesPontuacao.somarPontuacao" :checked="timesPontuacao.somarPontuacao && timesPontuacao.nome !== 'padrao' && timesPontuacao.nome !== 'patrimonio'">
                  Somar
                </label>
              </p>
              <p class="control">
                <button class="tag button is-warning is-small" @click="loader = true; getPontuados(true)">Atualizar</button>
              </p>
            </div>
            <div class="content has-text-centered">
              <p class="is-6 is-bold">Clique no time para ver a escalação</p>
            </div>
            <div class="media">
              <div class="media-content">
                <div v-for="(time, k) of timesComputed" class="">
                  <p @click="verTime(time)">
                    <small class="is-pulled-left">{{ k+1 }}°&nbsp</small>
                    <picture class="image is-24x24 is-pulled-left">
                      <img :src="time.url_escudo_svg" @error="time.url_escudo_svg='/static/img/icon.png'">
                    </picture>
                    <span class="">{{time.nome.substring(0,15)}}</span>
                    <b><small v-if="!timesPontuacao.somarPontuacao && time.pontuacao !== undefined" class="is-6 is-pulled-right">{{ time.pontuacao.toFixed(2) }} &nbsp</small></b>
                    <small class="is-6 is-pulled-right" v-if="!timesPontuacao.somarPontuacao && timesPontuacao.nome !== 'padrao' && timesPontuacao.nome !== 'patrimonio'">{{time.pontos[timesPontuacao.nome].toFixed(2)}} &nbsp</small>
                    <b><small class="is-6 is-pulled-right" v-if="timesPontuacao.somarPontuacao && timesPontuacao.nome !== 'padrao' && timesPontuacao.nome !== 'patrimonio'">{{ (time.pontos[timesPontuacao.nome] + time.pontuacao).toFixed(2) }} &nbsp</small></b>
                    <small class="is-6 is-pulled-right" v-if="!timesPontuacao.somarPontuacao && timesPontuacao.nome === 'patrimonio'">$ {{time.patrimonio.toFixed(2)}} &nbsp</small>
                  </p>

                  <hr class="hr">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section section-min" v-else>
        <div class="columns">
          <div class="column is-half is-10 is-offset-1 is-info">
            <div class="field is-grouped is-grouped-centered" v-if="liga.liga && !liga.liga.podio">
              <p class="control">
                <button class="tag button is-warning is-small" @click="loader = true; getPontuados(true)">Atualizar</button>
              </p>
            </div>
            <div>
              <div v-if="liga.liga && liga.liga.podio">
                <br>
                <div class="columns">
                  <div class="column" v-for="(time, i) of  liga.liga.podio">
                    <div class="media box is-clicable" @click="verTime(time)">
                      <p class="title is-4 is-bold-2">{{(i+1)}}°</p>
                      <div class="media-left">
                        <picture class="image is-48x48">
                          <img :src="time.url_escudo_svg">
                        </picture>
                      </div>
                      <picture class="image is-24x24 is-left-image-perfil is-hidden-touch">
                        <img class="image-circle" :src="time.foto_perfil">
                      </picture>&nbsp
                      <div class="media-content">
                        <p><b>{{time.nome.charAt(0).toUpperCase()+time.nome.slice(1)}}</b></p>
                        <small>{{time.nome_cartola.charAt(0).toUpperCase()+time.nome_cartola.slice(1)}}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-for="rodadaChave of mataMataApenasRodadasExistentes">
              <br>
              <p class="title is-5 has-text-centered"><b>{{mataMataStatus[liga.chaves_mata_mata[rodadaChave][0].tipo_fase]}} - Rodada {{rodadaChave}}</b></p>
              <div class="box" v-for="chave of liga.chaves_mata_mata[rodadaChave]">
                <div class="has-text-centered">
                  <span class="tag is-warning tag-fase" v-if="chave.tipo_fase == 'F' || chave.tipo_fase == 'T'">{{mataMataStatus[chave.tipo_fase]}}</span>
                </div>
                <div class="" v-if="timesCompleto[chave.time_mandante_id] && timesCompleto[chave.time_visitante_id]">
                  <div class="columns is-mobile is-gapless">
                    <div class="column is-5 is-55 is-clicable" @click="chave.time_id = chave.time_mandante_id; verTime(chave)" :class="chave.rodada_id != status.rodada_atual && chave.time_mandante_id != chave.vencedor_id ? 'clareamento-time': ''">
                      <div class="media media-mobile">
                        <div class="media-content">
                          <div class="content has-text-right is-clearfix">
                            <span v-if="timesCompleto[chave.time_mandante_id]" class="">
                            <span class="nome-time has-text-right is-clearfix">{{timesCompleto[chave.time_mandante_id].time.nome}}</span>
                            <small class="is-hidden-mobile">{{timesCompleto[chave.time_mandante_id].time.nome_cartola}}</small>
                            </span>
                          </div>
                        </div>
                        <div class="">
                          <picture class="image image-escudo-esquerda">
                            <img :src="timesCompleto[chave.time_mandante_id].time.url_escudo_svg">
                          </picture>
                        </div>
                        <div class="placar-esquerdo">
                          <span v-if="chave.rodada_id == status.rodada_atual">
                            <span v-if="status.status_mercado != 2">0</span>
                            <span v-else>{{timesCompleto[chave.time_mandante_id].pontuacao.toFixed(2)}}</span>
                          </span>
                          <span v-else>{{chave.time_mandante_pontuacao.toFixed(2)}}</span>
                        </div>                        
                      </div>
                    </div>
                    <div class="column is-1">
                      <div class="has-text-centered">
                        <span class="separador-placar">X</span>
                      </div>
                    </div>
                    <div class="column is-5 is-clicable" @click="chave.t = {}; chave.t.time_id = chave.time_visitante_id; verTime((chave.t))" :class="chave.rodada_id != status.rodada_atual && chave.time_visitante_id != chave.vencedor_id ? 'clareamento-time' : ''">
                      <div class="media media-mobile">
                        <div class="placar-direito">
                          <span v-if="chave.rodada_id == status.rodada_atual">
                            <span v-if="status.status_mercado != 2">0</span>
                            <span v-else>{{timesCompleto[chave.time_visitante_id].pontuacao.toFixed(2)}}</span>
                          </span>
                          <span v-else>{{chave.time_visitante_pontuacao.toFixed(2)}}</span>
                        </div>
                        <div class="">
                          <picture class="image image-escudo-direita">
                            <img :src="timesCompleto[chave.time_visitante_id].time.url_escudo_svg">
                          </picture>
                        </div>
                        <div class="media-content">
                          <div class="content is-clearfix">
                            <span v-if="timesCompleto[chave.time_visitante_id]" class="">
                            <span class="nome-time-direito is-clearfix">{{timesCompleto[chave.time_visitante_id].time.nome}}</span>
                            <small class="is-hidden-mobile">{{timesCompleto[chave.time_visitante_id].time.nome_cartola}}</small>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
    <transition name="component-fade" mode="out-in">
      <div v-if="modal.ativar">
        <component :is="escalacaoTime" :timemodal="modal.time" :active="modal.ativar" @update:active="val => modal.ativar = val" ></component>
      </div>
    </transition>
    <div v-show="loader">
      <div class="loader-request"></div>
    </div>
  </div>
  
</template>

<script>
import EscalacaoTime from './../shared/EscalacaoTime'

export default {

  components: {
    'escalacao-time': EscalacaoTime
  },

  data () {
    return {
      escalacaoTime: 'escalacao-time',
      modal: {
        time: {},
        ativar: false
      },
      slug: '',
      liga: {},
      timesSort: [],
      timesCompleto: {},
      pontuados: {},
      presidente: '',
      loader: false,
      timesPontuacao: {
        nome: 'padrao',
        somarPontuacao: false
      },
      detalhesLiga: false,
      status: {},
      mataMataStatus: {
        'F': 'Final',
        'S': 'Semifinal',
        'Q': 'Quartas de Final',
        'O': 'Oitavas de Final',
        'P': 'Primeira Fase',
        'T': '3° Lugar'
      }
    }
  },

  methods: {
    getLiga: function () {
      this.slug = this.$route.params.slug
      this.getLigaRequest()
      this.$kartolafc.status.getStatus(s => {
        this.status = s
      })
    },

    verTime: function (time) {
      this.$kartolafc.time.getTime(time.time_id, t => {
        this.modal.ativar = true
        this.modal.time = t
      })
    },

    getLigaRequest: function () {
      this.$Progress.start()
      this.loader = true
      this.$kartolafc.liga.getLiga(this.slug, l => {
        if (parseInt(l.liga.total_times_liga) > 500) {
          this.$kartolafc.toast.info('Liga com mais de 500 times, apenas os 500 primeiros serão visualizados')
        }
        this.liga = l
        this.getPontuados()
        this.$Progress.finish()
      })
    },

    getPontuados: function (force = false) {
      this.$kartolafc.pontuados.getPontuados(p => {
        this.pontuados = p
        if (this.liga.times) {
          let promisses = []
          for (let k in this.liga.times) {
            let pro = new Promise((resolve, reject) => {
              this.$kartolafc.time.getTime(this.liga.times[k].time_id, t => {
                if (t.time.time_id === this.liga.liga.time_dono_id) {
                  this.presidente = t.time.nome
                }
                t.pontuacao = 0
                if (t.atletas && t.atletas.length) {
                  t.atletas.reduce((a, b) => { if (p.atletas[b.atleta_id]) t.pontuacao += p.atletas[b.atleta_id].pontuacao }, 0)
                }
                this.$set(this.timesCompleto, t.time.time_id, t)
                this.$set(this.liga.times[k], 'pontuacao', t.pontuacao)
                resolve(this.liga.times[k])
              })
            })
            promisses.push(pro)
          }
          Promise.all(promisses).then(times => {
            this.timesSort = times
            this.loader = false
            this.$Progress.finish()
          })
        }
      }, force)
    },

    fimPesquisaComErro: function (msg) {
      this.$Progress.finish()
      this.loader = false
      this.$kartolafc.toast.error(msg)
    },

    clipboard: function () {
      return 'https://kartolafc.com.br/#/liga/' + this.slug
    },

    clipboardSuccess: function () {
      this.$kartolafc.toast.info('Link copiado')
    }
  },

  mounted: function () {
    this.getLiga()
  },

  computed: {
    timesComputed: function () {
      this.timesSort.sort((time1, time2) => {
        let p1 = parseFloat(time1.pontuacao)
        let p2 = parseFloat(time2.pontuacao)
        if (this.timesPontuacao.nome === 'padrao') {
          if (p1 < p2) return 1
          if (p1 > p2) return -1
          return 0
        } if (this.timesPontuacao.somarPontuacao === true && this.timesPontuacao.nome !== 'padrao' && this.timesPontuacao.nome !== 'patrimonio') {
          if ((p1 + time1.pontos[this.timesPontuacao.nome]) < (p2 + time2.pontos[this.timesPontuacao.nome])) return 1
          if ((p1 + time1.pontos[this.timesPontuacao.nome]) > (p2 + time2.pontos[this.timesPontuacao.nome])) return -1
          return 0
        } if (this.timesPontuacao.nome === 'patrimonio') {
          if (time1.patrimonio === time2.patrimonio) return 0
          return time1.patrimonio < time2.patrimonio ? 1 : -1
        } else {
          if (time1.ranking[this.timesPontuacao.nome] ===
          time2.ranking[this.timesPontuacao.nome]) return 0
          return time1.ranking[this.timesPontuacao.nome] >
          time2.ranking[this.timesPontuacao.nome] ? 1 : -1
        }
      })

      return this.timesSort
    },
    mataMataApenasRodadasExistentes: function () {
      let rodada = []
      if (this.liga.chaves_mata_mata) {
        for (let a in this.liga.chaves_mata_mata) {
          if (a > this.status.rodada_atual) continue
          rodada.push(a)
        }
        return rodada.reverse()
      }
      return []
    }
  }
}
</script>

<style scoped>
.hr {
  margin: 0.4rem 0.4rem;
  clear: both;
  padding-top: 1px;
  margin-bottom: 1px;
}
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active for <2.1.8 */ {
  opacity: 0;
}
.font-size-nome {
  font-size: 2vw
}
.bloco-casa {
  text-align: left;
  position: relative;
}

.bloco-visitante {
  text-align: right;
  position: relative;
}


.placar-direito {
  margin-top: 3%;
  margin-right: 4%;
  font-weight: bold;
  
}

.placar-esquerdo {
  margin-top: 3%;
  margin-left: 4%;
  font-weight: bold;
}

.nome-time {
  font-size: 1rem;
  box-sizing: initial;
  font-weight: bold;
}

.nome-time-direito {
  font-size: 1rem;
  box-sizing: initial;
  font-weight: bold;
}
.separador-placar {
  font-size: 2rem;
  font-weight: bold;
}

.box22 {
  box-sizing: initial;
}

/* .is-55 {
  width: 46% !important;
} */

.image-escudo-esquerda {
  height: 48px;
  width: 48px;
}
.image-escudo-direita {
  height: 48px;
  width: 48px;
}

.clareamento-time {
  opacity: .2;
}

.is-bold-2{
  font-weight: bold;
}

.is-left-image-perfil {
  left: -14px;
}
.tag-fase {
  font-weight: bold;
  font-size: 14px;
  position: relative;
  bottom: 31px;
}
.is-clicable {
  cursor: pointer;
  pointer-events: painted;
}

.section-min {
  padding: 1rem;
}

@media screen and (max-width: 768px) {
  .nome-time {
    font-size: 0.65rem;
    display: block;
    position: absolute;
    bottom: -19px;
    right: 4px;
  }
  
  .nome-time-direito {
    font-size: 0.65rem;
    display: block;
    position: absolute;
    bottom: -19px;
    left: 4px;
  }
  .separador-placar {
    font-size: 1rem;
    font-weight: bold;
    position: relative;
    bottom: -3px;
  }
  .image-escudo-esquerda {
    position: relative;
    bottom: 9px;
    right: 8px;
    height: 32px;
    width: 32px;
  }

  .image-escudo-direita {
    position: relative;
    bottom: 9px;
    left: 8px;
    height: 32px;
    width: 32px;
  }

  .media-mobile {
    position: relative;
  }

  .is-clicable {
    cursor: auto;
  }
}
</style>
