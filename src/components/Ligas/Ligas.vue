<template>
  <div>
    <div class="field">
      <p class="control">
        <input type="text" class="input is-success" v-model="pesquisa" @keyup.enter="search" placeholder="Digite o nome da liga e aperte enter">
      </p>
    </div>
    <div>
    <div class="columns" v-for="liga of ligas">
  <div class="column">
    {{ liga.liga_id}}
  </div>
  <div class="column">
    {{ liga.nome}}
  </div>
  <div class="column">
    {{ liga.descricao}}
  </div>
  <div class="column">
    <img :src="liga.imagem" class="image is-48x48 is-centered">
  </div>
  <div class="column">
    {{ liga.tipo}}
  </div>
</div>
    </div>
  </div>
</template>

<script>
import {http} from '@/axios'
export default {
  data () {
    return {
      pesquisa: '',
      ligas: []
    }
  },
  methods: {
    search: function () {
      var self = this
      http.get('/ligas/' + this.pesquisa).then(function (r) {
        if (r.data) {
          self.ligas = r.data
        } else {
          self.ligas = []
        }
      })
    }
  }
}
</script>

<style>
  
</style>
