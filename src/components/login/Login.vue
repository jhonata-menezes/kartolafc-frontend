<template>
  <div>
    <section class="section">
      <div class="columns">
        <div class="column is-offset-4 is-4">
          <div class="notification is-warning">
            <p class="title is-6">
              Os dados inseridos serão utilizados apenas para autenticar no CartolaFC e adquirir o token, em nenhum momento o KartolaFC usará ou irá distribuir esses dados.
            </p>
          </div>
          <div class="field">
            <p class="control">
              <input v-model.trim="input.email"  v-validate="'required|email'" class="input is-success is-focused" type="email" placeholder="Email" name="email">
            </p>
            <p class="help is-danger" v-show="showErrors && errors.has('email')">Insira um email</p>
          </div>
          <div class="field">
            <p class="control">
              <input v-model="input.senha"  v-validate="'required'" class="input is-success is-focused" type="password" placeholder="Senha" name="senha">
            </p>
            <p class="help is-danger" v-show="showErrors && errors.has('senha')">Senha é obrigatório</p>
          </div>
          <div class="field has-text-centered">
            <p class="control is-expanded">
              <button class="button is-success is-medium" @click="realizarLogin()" :class="input.carregando ? 'is-loading': ''" type="text" >Autenticar</button>
            </p>
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
      showErrors: false
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
      localStorage.setItem('token', token)
    }
  }
}
</script>
