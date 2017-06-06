<template>
  <div>
    <div class="modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{atletaMercado.apelido}}</p>
          <button class="delete"></button>
        </header>
        <section class="modal-card-body">
          aksjaksaks
        </section>
      </div>
    </div>
  </div>  
</template>

<script>
import http from './../../axios'

export default {
  props: ['ativo', 'atletaId'],

  data () {
    return {
      atletaHistorico: [],
      atletaMercado: {},
      status: {}
    }
  },

  methods: {
    getAtleta: function () {
      this.$kartolafc.mercado.getMercado(m => {
        http.get('/atletas/historico/' + this.atletaId).then(r => {
          this.$kartolafc.status.getStatus(s => {
            this.status = s
            this.atletaHistorico = r.data
            this.mercado.atletas.forEach(e => {
              if (e.atleta_id == this.atletaId) {
                this.atletaMercado = e
              }
            }, this);
          })
        }).catch(err => { console.log(err) })
      })
    }
  },

  created: function () {
    this.getAtleta()
  }

}
</script>

<style>

</style>
