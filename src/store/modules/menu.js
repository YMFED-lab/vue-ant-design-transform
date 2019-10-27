import Vue from 'vue'
import { getSideMenu } from '@/api/login'
import {
  SIDE_MENU
} from '@/store/mutation-types'
import {getStore, setStore} from "@/utils/storage"

const menu = {
  state: {
    side_menus: getStore('side_menus', true), // 侧边栏的数据
  },
  getters: {

  },
  mutations: {
    SET_SIDE_MENU: (state, side_menu) => {
      state.side_menu = side_menu
      Vue.ls.set(SIDE_MENU, side_menu)
      setStore('side_menus', side_menu)
    }
  },
  actions: {
    // 获取sider menu
    getSideMenu({ commit }, params) {
      return new Promise((resolve, reject) => {
        getSideMenu(params).then(response => {
          const result = response
          commit('SET_SIDE_MENU', result.menu)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default menu