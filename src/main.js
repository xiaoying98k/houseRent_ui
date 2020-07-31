// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/global.css'
import VModal from 'vue-js-modal'
import axios from 'axios'
import store from './store'
require('./util/dateformat')//引入时间格式化工具，修改了Date prototype原型链

Vue.prototype.$axios= axios;
Vue.use(VModal, {
  dialog: true,
  dynamic: true
})
Vue.use(ElementUI)
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store:store,
  components: { App },
  template: '<App/>'
})
router.beforeEach((to, from, next) => {

  let user = JSON.parse(sessionStorage.getItem('user')) /* 这里是判断用户是否登录过，因为在用户登录后会在localStroage内存储Flag=isLogin */
 console.log(user)
  if (user !=null) { /* 如果存在Flag并且为isLogin意味着用户登录，这时修改vux内state下isLogin的状态 */
    next()
    if (!to.meta.isLogin) { /* 如果在有登录状态的情况下前往不需要权限的路由路径，则判定为退出登录，进行提示并跳转登录页 */
      sessionStorage.removeItem("user")
      Vue.prototype.$message.success("您已退出登录！")
      next({
        path: '/login'
      })
    }
  } else {
    if (to.meta.isLogin) { /* 如果没有登录状态且要去往需要权限的路径时跳转登录页并进行提示 */
      next({
        path: '/login'
      })
      Vue.prototype.$message.warning("请先登录！")
    } else {
      next()
    }
  }
})

router.afterEach(route => {
  window.scroll(0, 0)
})
