// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueAnalytics from 'vue-analytics'
import {analytics, env} from './config'
import kartolafc from './pluginKartolafc'
import VueProgressBar from 'vue-progressbar'
import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'
import SocialSharing from 'vue-social-sharing'
import subscribeNotification from './serviceWorker/register'
import VueClipboards from 'vue-clipboards'
import VeeValidate from 'vee-validate'
import Smoothscrool from 'smoothscroll-polyfill'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

if (env.NODE_ENV === 'production') {
  Raven
      .config('https://68106bd6b6f341308f0eda7926e0ab17@sentry.io/1194388')
      .addPlugin(RavenVue, Vue)
      .install()
}

Smoothscrool.polyfill()
Vue.use(VeeValidate)
Vue.use(VueClipboards)
subscribeNotification.subscribeNotification()
let optionsProgress = {
  color: '#00d1b2',
  failedColor: '#874b4b',
  thickness: '2px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true
}

Vue.use(SocialSharing)
Vue.use(kartolafc)
Vue.use(VueProgressBar, optionsProgress)

Vue.config.productionTip = false

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
