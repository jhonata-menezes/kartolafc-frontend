import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Time from '@/components/Times/Time'
import Ligas from '@/components/Ligas/Ligas'
import Times from '@/components/Times/Times'
import RankingTimes from '@/components/ranking/Times'
import RodadaJogos from '@/components/rodada/Jogos'
import Liga from '@/components/Ligas/Liga'
import NotificationComponent from '@/components/configuracao/Notificacao'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/time/id/:id',
    name: 'Time',
    component: Time
  }, {
    path: '/ligas',
    name: 'Ligas',
    component: Ligas
  }, {
    path: '/liga/:slug',
    name: 'Liga',
    component: Liga
  }, {
    path: '/times',
    name: 'Times',
    component: Times
  }, {
    path: '/ranking/times',
    name: 'RankingTimes',
    component: RankingTimes
  }, {
    path: '/rodada/jogos/:rodada?',
    name: 'RodadaJogos',
    component: RodadaJogos
  }, {
    path: '/configuracao/notificacao',
    name: 'Notificacao',
    component: NotificationComponent
  }]
  // mode: 'history'
})
