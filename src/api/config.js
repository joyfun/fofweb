import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 创建一个axios实例
const service = axios.create({
    //请求超时配置
    timeout:3000
})
//添加请求拦截器
service.interceptors.request.use(
    config => {
        // console.log(store)
        config.headers['Authorization']=store.getters.Authorization
        console.log(config)
        return config
    },
    err => {
        console.log(err)
    }
)
//添加请求拦截器
service.interceptors.response.use(
    response => {
        let res = {}
        res.status = response.status
        if(response.status==401){
            window.location.href='/login'
        }
        res.data = response.data
        return res
    },
    err => {
        console.log(err)
        if (err.response.status == 401) {
            router.push({ name: 'login' })
        }
    }
)

export default service
