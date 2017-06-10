<template>
  <div>
  <section class="hero is-primary is-small">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title">
          KartolaFC
        </h1>
        <h2 class="subtitle">
          Visualise seu time, ligas e jogos com o KartolaFC
        </h2>
      </div>
    </div>
  </section>
  <section class="section">
    <div>
      <div>
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <div class="has-text-centered">
              <div class="fb-like" data-href="https://www.facebook.com/kartolafc/" data-layout="button_count" 
              data-action="like" data-size="small" data-show-faces="true" data-share="true">
              </div>
            </div><br/>
            <p class="title has-text-left">Meu Time</p>
            <div class="media">
              <div class="media-left" v-if="meuTime.time">
                <figure class="image is-48x48">
                  <img :src="meuTime.time.url_escudo_svg" alt="Escudo">
                </figure>
                <figure class="image is-48x48">
                  <img :src="meuTime.time.foto_perfil" alt="Perfil Facebook">
                </figure>
              </div>
              <div class="media-content" v-if="meuTime.time">
                <div class="content">
                  <p>{{ meuTime.time.nome }}</br>
                    <small>{{ meuTime.time.nome_cartola }}</small></br>
                    <small v-if="status.status_mercado === 2">
                    Posicao: {{ meuTime.posicao }}</br>
                    </small>
                    Pontos: {{ calculaPontos(meuTime) }}
                  </p>
                  <a class="button is-info is-small" @click="modal.active=true; modal.time=meuTime">Ver Time</a>
                  <a class="button is-danger is-small" @click="limparMeuTime">Remover</a>
                </div>
              </div>
              <div v-else>
                <div class="field is-grouped">
                  <input type="text" class="input is-4" v-model="pesquisaTimes" placeholder="Time ou cartoleiro" @keyup.enter="searchTimes"><button @click="searchTimes" class="button is-light control">Pesquisar</button>
                </div>
                <div v-for="time of retornoTimes">
                  <div class="box">
                    <div class="media">
                      <div class="media-left">
                        <figure class="image is-48x48">
                          <img :src="time.url_escudo_svg" alt="Escudo">
                        </figure>
                      </div>
                      <div class="media-left">
                        <figure class="image is-48x48">
                          <img :src="time.foto_perfil" alt="Escudo">
                        </figure>
                      </div>
                      <div class="media-content">
                        <div class="content">
                          <p>
                            <strong>{{ time.nome }}</strong><br/>
                            <small>Cartoleiro: </small> <small>{{ time.nome_cartola }}</small><br/>
                            <a class="is-link" @click="setMeuTime(time)">Salvar</a>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="" v-if="status.status_mercado == 2">
              <div class="">
                <div class=""><br/>
                  <p class="title">Pontuação</p>
                  <div>
                    <input type="text" class="input" placeholder="Nome" v-model="pesquisaNomeAtletaPontuacao">
                  </div>
                  <div class=""><br/>
                    <div class="" v-for="(atleta, k) of atletasPontuados">
                      <div class="">
                        <div class="media">
                          <div class="media-left">
                            <figure class="image is-32x32">
                              <img :src="atleta.foto" alt="Image">
                            </figure>
                          </div>
                          <div class="media-content">
                            <div class="content">
                               <p class="title is-6">
                                 {{ atleta.apelido }}</br>
                                 <small>PTS: {{ atleta.pontuacao }} &nbsp ${{ getPrecoAtleta(atleta.atleta_id) }}</small>
                                 <span class="tag is-info is-small is-pulled-right" @click="ativarDetalhes(atleta.atleta_id)">
                                   + Detalhes
                                 </span>
                               </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr class="hr">
                    </div>
                    <div class="field is-grouped is-grouped-centered">
                      <p class="control">
                        <button @click="limitPontuados+=6" :disabled="pontuados.atletas && limitPontuados >= Object.keys(pontuados.atletas).length" class="button is-success">Mostrar mais</button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </br><div class="">
              <div class="">
                <div class="">
                  <p class="title">Mais Escalados</p>
                  <div>
                    <div class="" v-for="destaque of destaques.slice(0, limitDestaques)">
                      <div class="">
                        <div class="media">
                          <div class="media-left">
                            <figure class="image is-32x32">
                              <img :src="destaque.Atleta.foto" alt="Image">
                            </figure>
                          </div>
                          <div class="media-content">
                            <div class="content">
                              <p class="title is-6">
                                {{ destaque.Atleta.apelido }}</br>
                                <small class="has-text-black">
                                  Escalações: {{ destaque.escalacoes }}</br>
                                  {{ destaque.posicao }} ${{ getPrecoAtleta(destaque.Atleta.atleta_id) }}
                                  <span class="tag is-info is-small is-pulled-right" @click="ativarDetalhes(destaque.Atleta.atleta_id)">
                                    + Detalhes
                                  </span>
                                </small>
                                </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr class="hr">
                    </div>
                    <div class="field is-grouped is-grouped-centered">
                      <p class="control">
                        <button @click="limitDestaques+=6" class="button is-success" :disabled="limitDestaques >= destaques.length">Mostrar mais</button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <detalhes-atleta :ativo="detalhes.ativo" :atletaId="detalhes.atletaId" @update:ativo="v => { detalhes.ativo = v; detalhes.atletaId = 0 }"></detalhes-atleta>
    <escalacao-time :timemodal="modal.time" :active="modal.active" @update:active="val => modal.active = val"></escalacao-time>
  </section>
</div>
</template>

<script>
import {http} from './../axios'
import db from './../dexie'
import EscalacaoTime from './shared/EscalacaoTime'
import DetalhesAleta from './shared/DetalhesAtleta'

export default {
  components: {
    'escalacao-time': EscalacaoTime,
    'detalhes-atleta': DetalhesAleta
  },

  data () {
    return {
      detalhes: {
        ativo: false,
        atletaId: 0
      },
      modal: {
        active: false,
        time: {}
      },
      retornoTimes: [],
      pesquisaTimes: '',
      destaques: [],
      meuTime: {},
      mercadoAberto: true,
      pontuados: {},
      pesquisaNomeAtletaPontuacao: '',
      status: {},
      mercado: {},
      mercadoAtletas: {},
      scrollEscalados: false,
      scrollPontuados: false,
      limitPontuados: 6,
      limitDestaques: 6
    }
  },
  methods: {
    searchTimes: function () {
      if (this.pesquisaTimes) {
        var self = this
        http.get('/times/' + this.pesquisaTimes).then(function (r) {
          if (r.data.times) {
            self.retornoTimes = r.data.times
          } else {
            self.retornoTimes = []
          }
        })
      }
    },

    calculaPontos: function (time) {
      let total = 0
      let self = this
      if (!time.atletas || !self.pontuados.atletas) {
        return 0
      }
      time.atletas.forEach(function (atleta) {
        if (self.pontuados.atletas[atleta.atleta_id]) {
          total += self.pontuados.atletas[atleta.atleta_id].pontuacao
        }
      })
      return total.toFixed(2)
    },

    getStatus: function () {
      this.$kartolafc.status.getStatus(status => {
        this.status = status
      })
    },

    getDestaques: function () {
      http.get('/mercado/destaques').then(r => {
        this.destaques = r.data
      })
    },

    getMeuTime: function () {
      db.meuTime.toArray().then(time => {
        if (time.length === 1) {
          this.$kartolafc.time.getTime(time[0].time.time_id, t => {
            this.meuTime = t
            this.getRankingGeral()
          })
        }
      }).catch(function (err) {
        console.log(err)
      })
    },

    setMeuTime: function (time) {
      this.limparMeuTime()
      this.$kartolafc.time.getTime(time.time_id, t => {
        this.meuTime = t
        // precisa salva meu time em uma tabela separada, apenas para nao criar coluna ou alguma flag
        db.meuTime.put(t).then(() => {
          console.log('time salvo ou atualizado')
        }).catch(err => {
          console.log('erro ao salvar meu time', err)
        }).catch(err => { console.log('endpoint nao respondeu', err) })
      })
    },

    getRankingGeral: function () {
      http.get('/ranking/time/id/' + this.meuTime.time.time_id).then(r => {
        this.$set(this.meuTime, 'posicao', r.data.posicao)
      })
    },

    limparMeuTime: function () {
      db.meuTime.clear()
      this.meuTime = {}
    },

    getMercado: function () {
      this.$kartolafc.mercado.getMercado(m => {
        this.mercado = m
        this.mercadoAtletaId()
      })
    },

    mercadoAtletaId: function () {
      if (this.mercado.atletas) {
        this.mercado.atletas.forEach(function (element) {
          this.$set(this.mercadoAtletas, element.atleta_id, element)
        }, this)
      }
    },

    getPrecoAtleta: function (atletaId) {
      if (atletaId && this.mercadoAtletas[atletaId]) {
        return this.mercadoAtletas[parseInt(atletaId)].preco_num
      }
    },

    ativarDetalhes: function (atletaId) {
      atletaId = parseInt(atletaId)
      this.detalhes.atletaId = atletaId
      this.detalhes.ativo = true
    }
  },
  created: function () {
    this.getDestaques()
    this.getMeuTime()
    this.getMercado()
    this.getStatus()
    this.$kartolafc.pontuados.getPontuados(p => { this.pontuados = p })
  },

  computed: {
    atletasPontuados: function () {
      if (this.pontuados.atletas) {
        var searchLowerCase = this.pesquisaNomeAtletaPontuacao.toLowerCase()
        var matches = []
        let atletas = this.pontuados.atletas
        for (let k in atletas) {
          if (atletas.hasOwnProperty(k)) {
            if (atletas[k].apelido.toLowerCase().indexOf(searchLowerCase) >= 0) {
              atletas[k].atleta_id = k
              matches.push(atletas[k])
            }
          }
        }
        // ordenando por pontuacao
        matches.sort((a, b) => {
          if ((typeof b.pontuacao === 'undefined' && typeof a.pontuacao !== 'undefined') || a.pontuacao < b.pontuacao) {
            return 1
          }
          if ((typeof a.pontuacao === 'undefined' && typeof b.pontuacao !== 'undefined') || a.pontuacao > b.pontuacao) {
            return -1
          }
          return 0
        })
        return matches.slice(0, this.limitPontuados)
      }
      return []
    }
  }
}
</script>

<style scoped>

.scrollabed {
  overflow: auto;
  max-height: 350px;
}
.hr {
  margin: 0.4rem 0.4rem
}

.is-primary {
  background-color: '#780a25'
}
</style>
