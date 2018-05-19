<template>
  <div>
    <div v-if="time.time" class="modal" :class="active != false ? 'is-active' : ''" @click="closeModal()">
      <div class="modal-background"></div>
      <div class="modal-card" @click.stop>
        <header class="modal-card-head color-header">
          <p class="">
            <div class="media">
              <div class="media-left">
                <picture class="image is-32x32">
                  <img :src="time.time.url_escudo_svg">
                </picture>
                <picture class="image is-32x32">
                  <img class="image-circle" :src="time.time.foto_perfil" @error="defaultImage(time)">
                </picture>
              </div>
              <div class="media-content">
                <div class="content">
                  <p>
                    <b class="">{{time.time.nome}}</b>
                    <span class="icon is-small" title="Copiar link" v-clipboard="clipboard()" @success="clipboardSuccess">
                      <i class="fa fa-clipboard" aria-hidden="true"></i>
                    </span>
                    </br>
                    <small class="subtitle is-small is-6">{{time.time.nome_cartola.charAt(0).toUpperCase() + time.time.nome_cartola.slice(1)}}</small>
                    <span v-if="habilitarFavorito" class="icon"><i class="fa fa-star" :class="{'star-ativado': time.favorito}" @click="timeFavorito()"></i></span>
                  </p>
                </div>
              </div>
            </div>
          </p>
          <p class="modal-card-title"></p>
          <button class="delete is-large" @click="closeModal()"></button>
        </header>
        <section>
        </section>
        <div class="">
            <transition name="fade" key="scouts">
              <div class="popup2" v-if="scout.verScouts">
                 <scouts :atletaId="scout.atletaId" @update:ativo="v => scout.verScouts=v"></scouts>
              </div>
            </transition>
          </div>
        <section class="modal-card-body up-margin" v-if="time.atletas">
          <div :class="{clareamento: scout.verScouts }">
            <div class="has-text-centered">
              <small>
                <b> Pts</b>: {{ somaPontuacao(time) }}
                <span v-if="patrimonio !== 0"><b>Patrimônio:</b> ${{patrimonio}}</span>
                <br class="is-hidden-desktop">
                <b> Pró</b>: {{ time.time.assinante ? 'sim' : 'não' }}
              </small><br>
              <em class="is-bold is-6 subtitle">Clique no atleta para ver os scouts</em>
            </div>
            <hr class="hr">
            <div v-for="t of time.atletas">
              <article class="media" @click="scout.atletaId=t.atleta_id; scout.verScouts=true">
                <figure class="media-left">
                  <p class="image is-is-24x24">
                    <img :src="atletasPontuados.clubes[t.clube_id].Escudos['30x30']">
                  </p>
                </figure>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <strong>{{ t.apelido }}</strong><small> {{ posicao(t) }}</small>
                                            <span v-if="t.atleta_id === time.capitao_id" class="tag is-small is-warning" title="Capitão"><b>C</b></span>
                      <strong class="is-pulled-right is-success" v-if="atletasPontuados.atletas[t.atleta_id]" :class="atletasPontuados.atletas[t.atleta_id].pontuacao < 0 ? 'has-text-danger': 'has-text-success'">
                        {{ atletasPontuados.atletas[t.atleta_id].pontuacao * (t.atleta_id === time.capitao_id ? 2 : 1) }}</strong>
                      <strong class="is-pulled-right is-success" v-else>0</strong>
                    </p>
                  </div>
                </div>
              </article>
              <hr class="hr-atleta">
            </div>
            <div>
              <time-historico :timeId="timemodal.time.time_id" @update:patrimonio="p => patrimonio = p"></time-historico>
            </div>
          </div>
        </section>
        <section class="modal-card-body" v-else>
          <div class="has-text-centered">
            <p>Time não escalado</p>
          </div>
        </section>
        <footer class="modal-card-foot color-footer" v-if="time.time">
          <social-sharing hashtags="KartolaFC" :url="'https://kartolafc.com.br/#/time/id/' + time.time.time_id"  :title="time.time.nome" :description="'Veja a pontuação do '+ time.time.nome +' no KartolaFC ' + somaPontuacao(time)" inline-template >
            <div class="title is-6"> Compartilhar 
              <network network="facebook">&nbsp 
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
            </div>
          </social-sharing>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import TimeHistorico from './TimeHistorico'
import ScoutsRodada from './scouts/ScoutsRodada'
import db from './../../dexie'

export default {
  components: {
    'time-historico': TimeHistorico,
    'scouts': ScoutsRodada
  },

  props: ['timemodal', 'active'],

  data () {
    return {
      atletasPontuados: {},
      posicaoGeral: 0,
      scout: {
        atletaId: 0,
        verScouts: false
      },
      patrimonio: 0,
      habilitarFavorito: true
    }
  },

  methods: {
    closeModal: function () {
      this.patrimonio = 0
      this.scout.verScouts = false
      this.$emit('update:active', false)
    },

    somaPontuacao: function (time) {
      let total = 0
      for (let k of time.atletas) {
        if (this.atletasPontuados.atletas[k.atleta_id]) {
          total += this.atletasPontuados.atletas[k.atleta_id].pontuacao * (k.atleta_id === this.time.capitao_id ? 2 : 1)
        }
      }
      return total.toFixed(2)
    },

    posicao: function (atleta) {
      if (this.atletasPontuados) {
        let pos = this.atletasPontuados.posicoes[atleta.posicao_id].abreviacao
        return pos.charAt(0).toUpperCase() + pos.slice(1)
      }
      return ''
    },

    defaultImage: function (src) {
      src.time.foto_perfil = '/static/img/icon.png'
      return true
    },

    clipboard: function () {
      return 'https://kartolafc.com.br/#/time/id/' + this.time.time.time_id
    },

    clipboardSuccess: function () {
      this.$kartolafc.toast.info('Link copiado')
    },

    timeFavorito: function () {
      db.meusTimes.update(this.timemodal.time.time_id, {favorito: !this.timemodal.favorito})
      if (this.timemodal.favorito) {
        this.$kartolafc.toast.error('Removido dos Times')
      } else {
        this.$kartolafc.toast.success('Adicionado aos Times')
      }
      this.habilitarFavorito = false
    }
  },

  computed: {
    time () {
      if (this.timemodal.atletas) {
        this.timemodal.atletas.sort((a, b) => {
          if (a.posicao_id > b.posicao_id) return 1
          if (a.posicao_id < b.posicao_id) return -1
          return 0
        })
      }
      return this.timemodal
    }
  },

  created: function () {
    this.$kartolafc.pontuados.getPontuados(p => {
      this.atletasPontuados = p
    })

    document.addEventListener('keydown', (e) => {
      if (this.active === true && e.keyCode === 27) {
        this.closeModal()
      }
    })
  }
}
</script>
<style scoped>
.hr {
  margin: 0.2rem 0.2rem
}

.hr-atleta {
  margin: 0.4rem 0.4rem
}

@media screen and (max-width: 768px) {
  .hr-atleta {
    margin: 0.1rem 0.1rem
  }

  .modal-card-head {
    padding: 12px;
    padding-bottom: 2px;
  }
}

.color-header {
  background-color: rgb(148, 239, 133);
}

.color-footer {
  background-color: rgb(255, 252, 113);
}

.clareamento {
  opacity: 0.4;
}

.popup2 {
  position: absolute;
  top: 25%;
  left: 10%;
  width: 75%;
  /*height: 40%;*/
  padding: 16px;
  border: 4px solid rgb(148, 239, 133);
  background-color: white;
  z-index: 1002;
  overflow: auto;
  transition: all 1s ease-in-out;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}

.up-margin {
  margin-top: -17px
}

.modal {
  z-index: 101;
}

.fa-star {
  color: white;
}

.star-ativado {
  color: #c1b82f;
}
</style>
