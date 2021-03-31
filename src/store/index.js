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
    token: Cookies.get("token")
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      Cookies.set("token", token, { expires: 1 / 24 })
    }
  },
  actions: {
    setToken ({commit}, token) {
      return new Promise((resolve, reject) => {
        commit("setToken", token)
        resolve()
      })
    }
  },
  getters:getters
})