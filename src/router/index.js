import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import Login from "../pages/Login";
import Logout from "../pages/Logout";
import {AUTH_KEEPALIVE} from '../store/actions/auth'

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  store.dispatch(AUTH_KEEPALIVE).then(() => {
    if (store.getters.isAuthenticated) {
      next()
      return
    }
    next('/login')
  }).catch((err)=>{
    next('/login')
  });
  
  //document.location = '/login'
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import("../pages/Main"),
      beforeEnter: ifAuthenticated
      
    },
    {
      path: '/users',
      name: 'users',
      component: () => import("../pages/UsersList"),
      beforeEnter: ifAuthenticated
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
      beforeEnter: ifAuthenticated
    }
  ]
})
