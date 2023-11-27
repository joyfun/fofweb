import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./permission"
import * as process from "process"
import dayjs from "dayjs"



//全局配置
import '@/assets/scss/reset.scss'
import 'element-ui/lib/theme-chalk/index.css';
// import http from '@/api/config'
// import './mock'

//第三方包
import ElementUI from 'element-ui'
import axios from 'axios'

import tools from '@/store/tools.js'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import '@/assets/iconfont/iconfont.css'
import {parseTime}  from '@/utils'
import service from '@/api/config.js'
// import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'

// VXETable.use(VXETablePluginExportXLSX)
Vue.use(VXETable)
Vue.use(tools)
Vue.prototype.$process=process
Vue.prototype.$axios = axios //需要验证jwt场景service
var dayOfYear = require('dayjs/plugin/dayOfYear')
dayjs.extend(dayOfYear)
Vue.prototype.$moment = dayjs
Vue.prototype.$isElectron= tools.isElectron()
Vue.config.productionTip = false

Vue.use(ElementUI)
// export const formatMoney = (number, decimals = 0, decPoint = '.', thousandsSep = ',') => {
//     number = (number + '').replace(/[^0-9+-Ee.]/g, '')
//     let n = !isFinite(+number) ? 0 : +number
//     let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
//     let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
//     let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
//     let s = ''
//     let toFixedFix = function (n, prec) {
//       let k = Math.pow(10, prec)
//       return '' + Math.ceil(n * k) / k
//     }
//     s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
//     let re = /(-?\d+)(\d{3})/
//     while (re.test(s[0])) {
//       s[0] = s[0].replace(re, '$1' + sep + '$2')
//     }
//     if ((s[1] || '').length < prec) {
//       s[1] = s[1] || ''
//       s[1] += new Array(prec - s[1].length + 1).join('0')
//     }
//     return s.join(dec)
//   }
Vue.filter('formatTime', function(time) {
  return parseTime(time)
})
// 防止el-button重复点击
Vue.directive('preventReClick', {
	inserted(el, binding) {
   	  el.addEventListener('click', () => {
     	if (!el.disabled) {
      	 el.disabled = true
      	 setTimeout(() => {
        	 el.disabled = false
       	}, binding.value || 3000)
     	}
   	})
	 }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
