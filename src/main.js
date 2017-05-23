// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueAnalytics from 'vue-analytics'
import {analytics} from './config'
import kartolafc from './pluginKartolafc'

Vue.use(kartolafc)

Vue.config.productionTip = false

import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'

Vue.use(VueAnalytics, {
  id: analytics,
  router
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
