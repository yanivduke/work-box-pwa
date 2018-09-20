/* eslint-disable promise/param-names */
import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT } from '../actions/auth'
import axios from 'axios'

import {idbKeyVal} from '../../idbPromise'
import {sendMsg} from '../../plugins/registerServiceWorker'
const state = { token: '', status: '', hasLoadedOnce: false  }

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
}

const actions = {
  [AUTH_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      axios.post('http://localhost:3001/api/authenticate', user)
      .then(resp => {
        console.log('axios resp: ' + resp.data.data.token)

        idbKeyVal.set('osAuth', 'auth-user-token', resp.data.data.token).then(()=>{
            sendMsg('startSync')
            commit(AUTH_SUCCESS, resp.data.data)
            resolve(resp.data.data)
        })
      })
      .catch(err => {
        idbKeyVal.delete('osAuth', 'auth-user-token').then(()=>{
          commit(AUTH_ERROR, err)
          reject(err)
        })
      })
    })
  },
  [AUTH_LOGOUT]: ({commit}) => {
    return new Promise((resolve, reject) => {
      idbKeyVal.delete('osAuth', 'auth-user-token').then(()=>{
        commit(AUTH_LOGOUT)
        resolve()
      })
    })
  }
}

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success'
    console.log('AUTH_SUCCESS: ' + resp.token)
    state.token = resp.token
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = ''
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}