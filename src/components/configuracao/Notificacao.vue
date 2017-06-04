<template>
  <div>
    <div class="section">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <h3 class="title is-3">
            Notificação
          </h3>
          <div v-if="isNotificabled()">
            <div class="onoffswitch" @click="alteraNotificacao()">
              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" :checked="notificacaoStatus" disabled>
              <label class="onoffswitch-label" for="myonoffswitch">
                <span class="onoffswitch-inner"></span>
                <span class="onoffswitch-switch"></span>
              </label>
            </div>
            <div class="section">
              <div class="content">
                <p class="control">
                  <label class="checkbox">
                    <input type="checkbox" :checked="opcoes.times" @click="opcoes.times = !opcoes.times">
                      <b>Apenas jogadores dos meus times</b>
                  </label>
                </p>
                <p class="control">
                  <label class="checkbox">
                    <input type="checkbox" :checked="opcoes.g" @click="opcoes.g = !opcoes.g">
                      Gols
                  </label>
                </p>
                <p class="control">
                  <label class="checkbox">
                    <input type="checkbox" :checked="opcoes.cv" @click="opcoes.cv = !opcoes.cv">
                      Cartao Vermelho
                  </label>
                </p>
                 <p class="control">
                  <label class="checkbox">
                    <input type="checkbox" :checked="opcoes.ca" @click="opcoes.ca = !opcoes.ca">
                      Cartao Amarelo
                  </label>
                </p>
                 <p class="control">
                  <label class="checkbox">
                    <input type="checkbox" :checked="opcoes.dp" @click="opcoes.dp = !opcoes.dp">
                      Defesa de Penalti
                  </label>
                </p>
                 <p class="control">
                  <label class="checkbox">
                    <input type="checkbox" :checked="opcoes.gc" @click="opcoes.gc = !opcoes.gc">
                      Gol Contra
                  </label>
                </p>
                <p class="control">
                  <label class="checkbox">
                    <button class="button is-success" @click="salvarOpcoes()">
                      Salvar</button>
                  </label>
                  <label class="checkbox">
                    <button class="button is-info" @click="marcar(true)">
                      Marcar</button>
                  </label>
                  <label class="checkbox">
                    <button class="button is-danger" @click="marcar(false)">
                      Desmarcar</button>
                  </label>
                </p>
              </div>
            </div>
          </div>
          <div v-else>
            <div>
              <div class="notification is-danger">
                Browser não tem suporte para notificação
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
  data () {
    return {
      notificacaoStatus: false,
      opcoes: {
        times: false,
        g: true,
        gc: true,
        dp: true,
        ca: true,
        cv: true

      },

      loader: false
    }
  },

  methods: {
    alteraNotificacao: function () {
      switch (Notification.permission) {
        case 'granted':
          this.notificacaoStatus = !this.notificacaoStatus
          this.$kartolafc.configuracao.update((old, next) => {
            old.notificacao.status = this.notificacaoStatus
            old.notificacao.inscrito = false
            next(old)
          })
          console.log(this.notificacaoStatus)
          break
        case 'default':
          Notification.requestPermission().then(s => {
            if (s === 'granted') {
              this.notificacaoStatus = true
              this.$kartolafc.configuracao.update((old, next) => {
                old.notificacao.status = this.notificacao
                next(old)
              })
            }
            console.log(s)
          }).catch(err => {
            console.log(err)
          })
          break
      }
    },

    marcar: function (s) {
      this.opcoes.g = s
      this.opcoes.gc = s
      this.opcoes.dp = s
      this.opcoes.ca = s
      this.opcoes.cv = s
    },

    salvarOpcoes: function () {
      this.$kartolafc.configuracao.update((v, next) => {
        v.notificacao.opcoes = this.opcoes
        next(v)
        this.$kartolafc.toast.success('Opções salvas')
      })
    },

    isNotificabled: function () {
      return 'serviceWorker' in navigator && 'PushManager' in window
    }
  },

  mounted: function () {
    if (Notification.permission !== 'granted') {
      return false
    }
    this.$kartolafc.configuracao.get(v => {
      if (v.notificacao) {
        this.notificacaoStatus = v.notificacao.status
        if (v.notificacao.opcoes) {
          this.opcoes = v.notificacao.opcoes
        }
      } else {
        this.notificacaoStatus = false
      }
    })
  }
}
</script>

<style scoped>
.onoffswitch {
    position: relative; width: 74px;
    -webkit-user-select:none; -moz-user-select:none; -ms-user-select: none;
}
.onoffswitch-checkbox {
    display: none;
}
.onoffswitch-label {
    display: block; overflow: hidden; cursor: pointer;
    border: 2px solid #999999; border-radius: 20px;
}
.onoffswitch-inner {
    display: block; width: 200%; margin-left: -100%;
    transition: margin 0.3s ease-in 0s;
}
.onoffswitch-inner:before, .onoffswitch-inner:after {
    display: block; float: left; width: 50%; height: 30px; padding: 0; line-height: 30px;
    font-size: 14px; color: white; font-family: Trebuchet, Arial, sans-serif; font-weight: bold;
    box-sizing: border-box;
}
.onoffswitch-inner:before {
    content: "ON";
    padding-left: 10px;
    background-color: #3CC980; color: #FFFFFF;
}
.onoffswitch-inner:after {
    content: "OFF";
    padding-right: 10px;
    background-color: #EEEEEE; color: #999999;
    text-align: right;
}
.onoffswitch-switch {
    display: block; width: 21px; margin: 7px;
    background: #FFFFFF;
    position: absolute; top: 0; bottom: 0;
    right: 40px;
    border: 2px solid #999999; border-radius: 20px;
    transition: all 0.3s ease-in 0s; 
}
.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner {
    margin-left: 0;
}
.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {
    right: 0px; 
}
</style>
