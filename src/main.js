import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


// import 'bootstrap'
// import $ from 'jquery'

//全局配置
import '@/assets/scss/reset.scss'
import 'element-ui/lib/theme-chalk/index.css';
// import http from '@/api/config'
// import './mock'

//第三方包
import ElementUI from 'element-ui'
import axios from 'axios'
Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.use(ElementUI)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
