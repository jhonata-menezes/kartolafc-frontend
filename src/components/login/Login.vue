<template>
  <div>
    <section class="section">
      <div class="columns">
        <div class="column is-offset-4 is-4">
          <div class="notification is-warning notification-full">
            <p class="title is-6">
              Os dados inseridos serão utilizados apenas para autenticar no CartolaFC e adquirir o token, em nenhum momento o KartolaFC usará ou irá distribuir esses dados.
            </p>
          </div>
          <div class="field">
            <p class="control">
              <input v-model.trim="input.email"  v-validate="'required|email'" class="input is-hovered" type="email" placeholder="Email usado no CartolaFC" name="email">
            </p>
            <p class="help is-danger" v-show="showErrors && errors.has('email')">Insira um email</p>
          </div>
          <div class="field">
            <p class="control">
              <input v-model="input.senha"  v-validate="'required'" class="input is-hovered" type="password" placeholder="Senha usada no CartolaFC" name="senha">
            </p>
            <p class="help is-danger" v-show="showErrors && errors.has('senha')">Senha é obrigatório</p>
          </div>
          <div class="field has-text-centered">
            <p class="control is-expanded">
              <button class="button is-success is-medium button-autenticar" @click="realizarLogin()" :class="input.carregando ? 'is-loading': ''" type="text" :disabled="errors.has('email') || input.email == '' || input.senha == ''" >Autenticar</button>
            </p>
          </div>
          <div>
            <br>
            <div class="has-text-centered tile is-5">
              <p>Sessões ativas</p>
            </div>
            <div v-for="(t, i) of tokens" class="box">
              <article class="media">
                <div class="media-left">
                  <picture class="image is-48x48">
                    <img :src="t.time.url_escudo_svg" :title="t.time.nome">
                  </picture>
                </div>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <strong class="">{{ t.time.nome }}</strong><br>
                      <small class="subtitle is-6">{{ t.time.nome_cartola }}</small>
                      <a class="is-pulled-right" title="Remover" @click="remover(i)">
                        <span class="icon is-medium"><i class="fa fa-trash-o"></i></span>
                      </a>
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
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
      input: {
        email: '',
        senha: '',
        carregando: false
      },
      showErrors: false,
      tokens: {}
    }
  },

  methods: {
    realizarLogin: function () {
      if (this.errors.errors && this.errors.errors.length >= 1) {
        this.showErrors = true
        return
      }
      this.showErrors = false
      this.input.carregando = true
      http.post('/login/cartolafc', this.input).then(r => {
        if (r.data.id === 'Authenticated') {
          this.salvarToken(r.data.glbId)
          this.input.carregando = false
          this.$kartolafc.toast.success('Autenticação realizada com sucesso')
        } else {
          this.input.carregando = false
          this.$kartolafc.toast.error('Erro na autenticação: ' + r.data.userMessage)
        }
      }).catch(err => {
        this.input.carregando = false
        this.$kartolafc.toast.error('Algum problema com a rede')
        console.log(err)
      })
    },

    salvarToken: function (token) {
      http.get('/time/info', {
        headers: {token: token}
      }).then(r => {
        let response = r.data
        response.token = token
        this.$kartolafc.tokens.set(this.input.email, response)
        this.tokens = this.$kartolafc.tokens.get()
      })
    },

    getTokens: function () {
      this.tokens = this.$kartolafc.tokens.get()
    },

    remover: function (token) {
      this.$kartolafc.tokens.delete(token)
      this.getTokens()
    }
  },

  created: function () {
    this.getTokens()
  }
}
</script>

<style scoped>
.button-autenticar {
  width: 100%;
}

.section {
  padding: 0rem 1.5rem;
}

.section-message {
  /*padding: .0rem 0.0rem 0rem .0rem;*/
  margin-left: 0;
  margin-right: 0;
}

.notification-full{
  margin-left: -1.5rem;
  margin-right: -1.5rem;
}
</style>
