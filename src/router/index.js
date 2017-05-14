import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Bulma from '@/components/Bulma'
import Time from '@/components/Times/Time'
import Ligas from '@/components/Ligas/Ligas'
import Times from '@/components/Times/Times'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/bulma',
    name: 'Bulma',
    component: Bulma
  }, {
    path: '/time/:id',
    name: 'Time',
    component: Time
  }, {
    path: '/ligas',
    name: 'Ligas',
    component: Ligas
  }, {
    path: '/times',
    name: 'Times',
    component: Times
  }]
  // mode: 'history'
})
