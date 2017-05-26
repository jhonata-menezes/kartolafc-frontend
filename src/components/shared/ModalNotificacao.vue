<template>
  <div>
    <div class="modal" :class="alerta ? 'is-active' : ''" @click="close()">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box" @click.stop>
          <article class="media">
            <div class="media-content">
              <p class="content has-text-centered">
                {{mensagem}}
              </p>
            </div>
          </article>
        </div>
      </div>
      <button class="modal-close" @click="close()"></button>
    </div>
  </div>
</template>

<script>
export default {

  props: ['ativar', 'mensagem'],

  data () {
    return {
    }
  },

  computed: {
    alerta: function () {
      return this.ativar
    }
  },

  methods: {
    close: function () {
      this.$emit('update:ativar', false)
    }
  },

  created: function () {
    document.addEventListener('keydown', (e) => {
      if (this.alerta === true && e.keyCode === 27) {
        this.close()
      }
    })
  }
}
</script>

<style>

</style>

