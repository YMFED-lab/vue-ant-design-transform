import Vue from 'vue'
import { login } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { setStore} from "@/utils/storage"

const user = {
  namespaced: true, // 用于在全局引用此文件里的方法时标识这一个的文件名
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    side_menu: [], // 侧边栏的数据
  },
  getters: {

  },
  mutations: {
    SET_NAME: (state, {name, welcome}) => {
      state.name = name
      state.welcome = welcome
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },
  actions: {
    // 登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          if(result || response.code === 200) {
            Vue.ls.set(ACCESS_TOKEN, result.tokenlist.accessToken, 60 * 60 * 1000) // 允许的登录的时长1小时
            commit('SET_NAME', { name: result.member.name, welcome: welcome() })
            commit('SET_INFO', result)
            setStore('user', result)
            localStorage.setItem('loginTime', new Date().getTime())
            resolve(response);
          } else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出
    logout({ commit, state }) {
      return new Promise((resolve) => {
        Vue.ls.remove(ACCESS_TOKEN)
        resolve()
        // logout的接口实现
      })
    }
  }
}


export default user