<template>
  <div>
    <div class="opacity-default">
      <div class="media">
        <div class="media-content">
          <div class="content" v-if="mercadoPorAtletaId && mercadoPorAtletaId[atletaId]">
            <b class="has-text-centered" @click="$emit('update:ativo', false)">{{mercadoPorAtletaId[atletaId].apelido}}</b>
            <button class="delete is-medium is-pulled-right" @click="$emit('update:ativo', false)"></button>
            <div v-if="mercadoPorAtletaId[atletaId].scout">
              <div v-if="mercadoPorAtletaId[atletaId].posicao_id == 6">
                Não há detalhes específicos, já que sua pontuação é a média dos jogadores do clube.
              </div>
              <div v-else v-for="(qtd, scout) of mercadoPorAtletaId[atletaId].scout" :key="scout">
                <small>{{qtd}} {{$kartolafc.scouts[scout].nome}}
                </small>
              </div>
            </div>
          </div>
          <div class="content" v-else>
          Sem scouts no momento
          <button class="delete is-pulled-right" @click="$emit('update:ativo', false)"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['atletaId', 'mercadoPorAtletaId']
}
</script>

<style scoped>
.opacity-default {
  opacity: 1;
  background-color: white
}
</style>
