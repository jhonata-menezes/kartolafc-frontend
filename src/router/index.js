import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Bulma from '@/components/Bulma'
import Time from '@/components/Time'

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
  }],
  mode: 'history'
})
