import Vue from 'vue'
import Vuex from 'vuex'
import tab from './tab'
import Person from './Person'
Vue.use(Vuex)

export default new Vuex.Store({
  modules:{
    tab,
    Person
  }
})
export function exportExcel(url, options = {}) {
    return new Promise((resolve, reject) => {
      console.log(`${url} 请求数据，参数=>`, JSON.stringify(options))
      axis.defaults.headers['content-type'] = 'application/json;charset=UTF-8'
      axis({
        method: 'post',
        url: url, // 请求地址
        data: options, // 参数
        responseType: 'blob' // 表明返回服务器返回的数据类型
      }).then(
        response => {
          resolve(response.data)
          let blob = new Blob([response.data], {
            type: 'application/vnd.ms-excel'
          })
          console.log(blob)
          let fileName = Date.parse(new Date()) + '.xlsx'
          if (window.navigator.msSaveOrOpenBlob) {
            // console.log(2)
            navigator.msSaveBlob(blob, fileName)
          } else {
            // console.log(3)
            var link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            //释放内存
            window.URL.revokeObjectURL(link.href)
          }
        },
        err => {
          reject(err)
        }
      )
    })
  }