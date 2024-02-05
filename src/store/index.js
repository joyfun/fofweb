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
    syswts: [6, 0, 2, 1, 2, -1, 0, 0],
    cols: ['yeaily_return', 'sharpe', 'calmar', 'sortino', 'dd', 'dd_week', 'win_ratio', 'volatility'],
    nowcart:'default',
    allCart:{},
    token: Cookies.get("token"),
    Authorization:'',
    access_key:'',
    // ccart: Cookies.get("cart"),
//    ccart: JSON.parse(decodeURIComponent(Cookies.get("cart"))),
    cart:[],
    days:{},
    mholding:{},
    allparam:{},
    holding:[],
    usermenu:Cookies.get("umenu"),

    param:{"class_type":[],"stage":[]},
    foflist:[],
    actionData:[],
    allmenu:[
        {lable:"基金公司",value:"fund-comp"},
        {lable:"初选基金",value:"fund-info"},
        {lable:"尽调任务",value:"invest-task"},
        {lable:"添加统计",value:"add-stat"},
        {lable:"尽调统计",value:"invest-stat"},
        {lable:"运营尽调列表",value:"invest-dash"},
        {lable:"未排名产品",value:"norank-prod"},
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
        {lable:"购物车",value:"my-cart"},
        {lable:"系统参数",value:"sys-cfg"},
        {lable:"基金拼接",value:"fund-concat"},
        {lable:"业绩预警",value:"fund-alarm"},
        {lable:"刷新参数",value:"fof-action"},
        {lable:"三方数据",value:"fof-crawl"},
        {lable:"管理统计",value:"fund-dash"},
        {lable:"清单分析",value:"list-rank"},
        {lable:"编辑信息",value:"info-edit"},
        {lable:"审核信息",value:"info-audit"},
        {lable:"基金排名",value:"rank-btn"},
        {lable:"基金仿真",value:"sim-btn"},
        {lable:"资金情况",value:"fof-dash"},
        {lable:"投资排名",value:"rank-info"},
        {lable:"周剑指数",value:"stat-info"},
        {lable:"指标分析1",value:"trend-info"},
        {lable:"指标分析2",value:"trend-info2"},
        {lable:"指标分析3",value:"trend-info3"},
        {lable:"投后排名",value:"rank-infoa"},
        {lable:"投后分析",value:"rank-infoa1"},
        {lable:"数据监控",value:"data-monitor"},
        {lable:"额外信息",value:"info-meta"},
        {lable:"持仓信息",value:"holding-info"},
        {lable:"用户管理",value:"user-manage"}]
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      Cookies.set("token", token, { expires: 1 })
      // Cookies.remove("acart")
      // this.commit('nowCart','default')
    },
    nowCart (state, cartname) {
      state.nowcart = cartname
      // this.commit('setCart',state.allCart[cartname])

    },
    setFoflist(state, foflist){
      Vue.set(state,"foflist",foflist)
      console.log(foflist)
    },
    addAction(state, action){
      Vue.set(state,"actionData",state.actionData.concat(action))
      // console.log(foflist)
    },
    delAction(state,action){

    },
    setAllCart (state, allcart) {
      // console.log("start set allChart")
      // console.log(allcart)
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
    setSysParam(state,params){
        state.param=params
    },
    setAllParam(state,params){
        state.allparam=params
    },
    setHolding(state,params){
      state.holding=params
  },
    updateUserMenu(state,params){  
        Cookies.set("umenu", params, { expires: 1 })
        if(params)
        state.usermenu=params.split(",")
    },
    updateDays(state,params){  
      state.days=params
  },
  updatemHolding(state,params){  
    state.mholding=params
},
  updateAccessKey(state,params){  
    console.log(params)
    state.Authorization="Bearer "+params
    state.access_key=params
    console.log(state)
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
      },
    setDays ({commit}, token) {
        return new Promise((resolve, reject) => {
          commit("updateDays", token)
          resolve()
        })
      },
    setAuths ({commit}, token) {
      return new Promise((resolve, reject) => {
        commit("updateAccessKey",  token)
        resolve()
      })

    }}

  ,
  getters:getters
})