<template>
  <div>
    <div class="section">
      <div>
        <button class="button is-success" @click="ativarNotificacao()" :disabled="getPermission() == 'granted'">Ativar Notificações</button>
      </div>
    </div>
  </div>  
</template>

<script>
export default {
  data () {
    return {
      Notification: {}
    }
  },

  methods: {
    ativarNotificacao: function () {
      Notification.requestPermission().then(s => {
        console.log(s)
      }).catch(err => {
        console.log(err)
      })
    },

    getPermission: function () {
      return Notification.permission
    }
  }
}
</script>

<style>

</style>
