import { login, logout, getPermissions } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getSessionUserInfo } from '@/api/system/user'

const user = {
  state: {
    token: getToken(),
    name: '',
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      return new Promise((resolve, reject) => {
        login(username, password).then(res => {
          setToken(res.data.token)
          commit('SET_TOKEN', res.data.token)
          commit('SET_NAME', res.data.user.name)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetSessionUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getSessionUserInfo().then(res => {
          commit('SET_NAME', res.data.name)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetPermissions({ commit, state }) {
      return new Promise((resolve, reject) => {
        getPermissions().then(res => {
          if (res.data && res.data.length > 0) {
            commit('SET_PERMISSIONS', res.data)
          }
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
