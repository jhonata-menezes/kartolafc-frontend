<template>
  <div>
    <section class="section">
      <div>
        <div class="">
          <div class="field">
            <label class="label">Selecione o time que deseja escalar</label>
            <p class="control has-icons-right">
              <span class="select is-small">
                <select v-model="time">
                  <option v-for="t of times" :value="t" :key="t.time.time_id">{{t.time.nome}}</option>
                </select>
              </span>
            </p>
          </div>
          <br>
        </div>
        <div class="columns">
          <div class="column is-offset-1 is-4" v-if="time.time">
            <div>
              <div>
                <p>Patrimônio ${{time.patrimonio.toFixed(2)}}
                  Preço do time ${{precoTime()}}
                </p>
              </div>
            </div>
            <div v-for="(atleta, atletaId) of time.atletas.sort((a,b) => a.posicao_id > b.posicao_id ? 1 : -1)" :key="atletaId" class="box">
              <div class="media">
                <div class="media-left">
                  <picture class="image is-48x48">
                    <img :src="atleta.foto">
                  </picture>
                </div>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <strong>{{atleta.apelido}}</strong> <small>{{time.posicoes[atleta.posicao_id].abreviacao.charAt(0).toUpperCase() + time.posicoes[atleta.posicao_id].abreviacao.slice(1)}}</small><br>
                      ${{atleta.preco_num}}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column"></div>
        </div>
      </div>
    </section>  
  </div>
</template>

<script>
import {http} from './../../axios'
export default {
  data () {
    return {
      times: [],
      time: {},
      mercadoPorAltetaId: {},
      status: {}
    }
  },

  methods: {
    getTimes: function () {
      let times = this.$kartolafc.tokens.get()
      for (let t in times) {
        http.get('/time/info', {headers: {token: times[t].token}}).then(r => {
          if (r.data.time) {
            r.data.token = t
            this.times.push(r.data)
          }
        })
      }
    },

    init: function () {
      this.$kartolafc.mercado.getMercado(m => {
        this.mercado = m
        for (let atl of m) {
          this.mercadoPorAltetaId[atl.atleta_id] = atl
        }
      })
      this.$kartolafc.status.getStatus(s => {
        this.status = s
      })
    },

    precoTime: function () {
      let soma = 0
      for (let t of this.time.atletas) {
        soma += t.preco_num
      }
      return soma.toFixed(2)
    }
  },

  created: function () {
    this.init()
    this.getTimes()
  }
}
</script>

<style>

</style>
