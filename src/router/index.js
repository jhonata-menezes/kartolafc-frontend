import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Time from '@/components/Times/Time'
import Ligas from '@/components/Ligas/Ligas'
import Times from '@/components/Times/Times'
import RankingTimes from '@/components/ranking/Times'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Home',
    component: Home
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
  }, {
    path: '/ranking/times',
    name: 'RankingTimes',
    component: RankingTimes
  }]
  // mode: 'history'
})
