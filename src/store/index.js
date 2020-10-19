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
