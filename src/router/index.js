import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Time from '@/components/Times/Time'
import Ligas from '@/components/Ligas/Ligas'
import Times from '@/components/Times/Times'
import RodadaJogos from '@/components/rodada/Jogos'
import Liga from '@/components/Ligas/Liga'
import NotificationComponent from '@/components/configuracao/Notificacao'
import MercadoAtletas from '@/components/atletas/Mercado'
import Login from '@/components/login/Login'
import Escalacao from '@/components/escalacao/Escalacao'

Vue.use(Router)

let route = new Router({
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
    path: '/rodada/jogos/:rodada?',
    name: 'RodadaJogos',
    component: RodadaJogos
  }, {
    path: '/configuracao/notificacao',
    name: 'Notificacao',
    component: NotificationComponent
  }, {
    path: '/atletas/mercado',
    name: 'AtletasMercado',
    component: MercadoAtletas
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/escalacao',
    name: 'Escalacao',
    component: Escalacao
  }]
  // mode: 'history'
})

// passando parametros de alteracao do layout
route.beforeEach((to, from, next) => {
  if (Object.keys(from.query).length && JSON.stringify(from.query) !== JSON.stringify(to.query)) {
    next({name: to.name, query: from.query, hash: to.hash, params: to.params})
  } else {
    next()
  }
})

export default route
