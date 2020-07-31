import Vue from 'vue'
import Router from 'vue-router'
import condition from '@/components/common/condition'
import login from '@/components/common/login'
import home from '@/components/common/home'
import result from '@/components/common/result'
import console from '@/components/common/console'
import addHouse from '@/components/owner/addHouse'
import myIssue from '@/components/owner/myIssue'
import editHouse from '@/components/owner/editHouse'
import orderCenter from '@/components/owner/orderCenter'
import message from '@/components/owner/message'
import orders from '@/components/tenant/orders'
import rentInfo from '@/components/tenant/rentInfo'
import goodsRepair from "@/components/tenant/goodsRepair";

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', name: 'condition', component: condition},
    {path: '/login', name: 'login', component: login},
    {path: '/result', name: 'result', component: result},
    {path: '/addHouse', name: 'addHouse', component: addHouse},
    {path: '/editHouse', name: 'editHouse', component: editHouse,meta:{isLogin:true}},
    {path: '/orderCenter', name: 'orderCenter', component: orderCenter,meta:{isLogin:true}},
    {path: '/goodsRepair', name: 'goodsRepair', component: goodsRepair,meta:{isLogin:true}},
    {path: '/myIssue', name: 'myIssue', component: myIssue},
    {path: '/message', name: 'message', component: message},
    {path: '/orders', name: 'orders', component: orders},
    {path: '/rentInfo', name: 'rentInfo', component: rentInfo},
    {path: '/console', name: 'console', component: console,meta:{isLogin:true}},
    {path: '/home', name: 'home', component: home,meta:{isLogin:true}}
  ]
})
