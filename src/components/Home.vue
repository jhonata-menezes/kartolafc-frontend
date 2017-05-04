<template>
  <div>
    <h1>KartolaFC mostra a pontuação de seu time e colegas</h1>
    <div class="field">
      <p class="control">
        <input type="text" class="input is-success" v-model="pesquisaTimes" @keyup.enter="searchTimes" placeholder="Digite o time para pesquisar">
      </p>
    </div>

    <div>
      <table class="table">
        <thead>
          <tr>
            <th title="Nome do Time">Nome do Time</th>
            <th title="Nome Cartoleiro">Nome Cartoleiro</th>
            <th title="Escudo">Escudo</th>
            <th title="Foto de Perfil">Foto de Perfil</th>
            <th title="Pró">Pró</th>
            <th title="Ver Time">Ver Time</th>
            <th title="Favoritos">Favoritos</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="time in retornoTimes" @click>
          <th>{{ time.nome }}</th>
          <th>{{ time.nome_cartola }}</th>
          <th>
            <img :src="time.url_escudo_svg" class="image is-48x48">
          </th>
          <th>
            <img :src="time.foto_perfil" class="image is-48x48">
          </th>
          <th><img class="image is-48x48" :src="time.assinante ? '/static/img/afirmativo.png' : '/static/img/negativo.png'"></th>
          <th><router-link :to="{ name: 'Time', params: { id: time.time_id }}"><a class="button is-warning">Ver Time</a></router-link></th>
          <th><i class="fa fa-star-o" aria-hidden="true"></i></th>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
import {http} from './../axios'

export default {
  data () {
    return {
      retornoTimes: [],
      pesquisaTimes: ''
    }
  },
  methods: {
    searchTimes: function () {
      event.preventDefault()
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
    }
  },
  watch: {
    //
  }
}
</script>

<style scoped>
</style>
