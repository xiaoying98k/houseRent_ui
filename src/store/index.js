import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      name:'',
      nickname:'',
      password:'',
      type:-1,
      payPwd:'',
      phone:''},
  },
  getters: {
    user: state => state.user
  },
  mutations: {
    setUser (state, user) {
      sessionStorage.setItem('user', JSON.stringify(user))
      state.user = user
    }
  },
  actions: {
  }
})
