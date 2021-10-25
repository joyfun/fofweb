import Vue from 'vue'
import Vuex from 'vuex'
import tab from './tab'
import getters from './getters'
import Person from './Person'
import Cookies from "js-cookie"
import role from "./modules/role"
import layout from "./modules/layout/index"
Vue.use(Vuex)

export default new Vuex.Store({
  modules:{
    tab,
    role,
    layout,
    Person
  },
  state: {
    nowcart:'default',
    allCart:{},
    token: Cookies.get("token"),
    // ccart: Cookies.get("cart"),
//    ccart: JSON.parse(decodeURIComponent(Cookies.get("cart"))),
    cart:[],
    
    allparam:{},
    usermenu:Cookies.get("umenu"),
    uproduct:Cookies.get("uproduct"),
    uproductname:Cookies.get("uproductname"),

    param:{"class_type":[],"stage":[]},
    foflist:[],
    allmenu:[
        {lable:"基金公司",value:"fund-comp"},
        {lable:"初选基金",value:"fund-info"},
        {lable:"CTA",value:"fund-info1"},
        {lable:"指数增强",value:"fund-info2"},
        {lable:"套利",value:"fund-info3"},
        {lable:"中性",value:"fund-info4"},
        {lable:"期权",value:"fund-info5"},
        {lable:"混合",value:"fund-info6"},
        {lable:"分类基金对比",value:"fund-compare"},
        {lable:"已投对比",value:"fund-compare1"},
        {lable:"尽调对比",value:"fund-compare2"},
        {lable:"预选对比",value:"fund-compare3"},
        {lable:"组合配置",value:"fund-calc"},
        {lable:"虚拟配置",value:"fund-comb"},
        {lable:"组合模拟",value:"fund-virtual"},
        {lable:"压力测试",value:"fund-pressure"},
        {lable:"业绩对标",value:"fund-report"},
        {lable:"基金分析",value:"fund-analysis"},
        {lable:"对标差",value:"fund-jcomp"},
        {lable:"高级筛选",value:"fund-extra"},
        {lable:"归因",value:"fund-reason"},
        {lable:"风险归因",value:"fund-return"},
        {lable:"已投尽调排名",value:"fund-rank1"},
        {lable:"已投备投排名",value:"fund-rank2"},
        {lable:"系统字典",value:"sys-param"},
        {lable:"系统参数",value:"sys-cfg"},
        {lable:"基金拼接",value:"fund-concat"},
        {lable:"业绩预警",value:"fund-alarm"},
        {lable:"刷新参数",value:"fof-action"},
        {lable:"三方数据",value:"fof-crawl"},
        {lable:"数据时效",value:"fof-dash"},
        {lable:"编辑信息",value:"info-edit"},
        {lable:"审核信息",value:"info-audit"},
        {lable:"用户管理",value:"user-manage"}]
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      Cookies.set("token", token, { expires: 1 / 24 })
      // Cookies.remove("acart")
      // this.commit('nowCart','default')
    },
    nowCart (state, cartname) {
      state.nowcart = cartname
      // this.commit('setCart',state.allCart[cartname])

    },
    setAllCart (state, allcart) {
      console.log("start set allChart")
      console.log(allcart)
      for (var a in allcart){
        if(typeof(allcart[a])=='string')
        allcart[a]=JSON.parse(allcart[a])
      }
      localStorage.setItem('acart', JSON.stringify(allcart));

      // var acart=JSON.parse(decodeURIComponent(Cookies.get("acart")))
      // console.log(acart)
      Vue.set(state,"allCart",allcart)
      state.nowcart='default'
    },
    addCartTag (state, tag) {
      state.allCart[tag]=[]
      this.commit('nowCart',tag)
      localStorage.setItem('acart', JSON.stringify(state.allCart));

    },
    delCartTag (state, tag) {
      delete state.allCart[tag]
      if(tag==state.nowcart){
        this.commit('nowCart','default')
      }else{
        this.commit('nowCart',state.nowcart)
      }
      localStorage.setItem('acart', JSON.stringify(state.allCart));
    },
    setCart (state, cart) {
      console.log("setCart")
      state.allCart[state.nowcart]=cart
      localStorage.setItem('acart', JSON.stringify(state.allCart));
    },
    updataUproduct (state, product) {
        state.uproduct = product
        Cookies.set("uproduct", product, { expires: 'never' })
      },
    updataUproductName (state, productname) {
        state.uproductname = productname
        Cookies.set("uproductname", productname, { expires: 'never' })
      },
    setSysParam(state,params){
        state.param=params
    },
    setAllParam(state,params){
        state.allparam=params
    },
    updateUserMenu(state,params){  
        Cookies.set("umenu", params, { expires: 1 / 24 })
        if(params)
        state.usermenu=params.split(",")
    }

  },
  actions: {
    setToken ({commit}, token) {
      return new Promise((resolve, reject) => {
        commit("setToken", token)
        resolve()
      })
    },
    changeCart({commit},cartname){
      commit("nowCart", cartname)
    },
    setCart ({commit}, cart) {
      return new Promise((resolve, reject) => {
        commit("setCart", cart)
        resolve()
      })
    },
    addCartTag ({commit}, tag) {
      return new Promise((resolve, reject) => {
        commit("addCartTag", tag)
        resolve()
      })
    },
    delCartTag ({commit}, tag) {
      return new Promise((resolve, reject) => {
        commit("delCartTag", tag)
        resolve()
      })
    },
    setAllCart ({commit}, cart) {
      return new Promise((resolve, reject) => {
        console.log("###setAllcart")
        console.log(cart)
        commit("setAllCart", cart)
        resolve()
      })
    },
    setUserMenu ({commit}, token) {
        return new Promise((resolve, reject) => {
          commit("updateUserMenu", token)
          resolve()
        })
      }
  },
  getters:getters
})