import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VDragged from 'v-dragged'

Vue.use(VDragged)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
