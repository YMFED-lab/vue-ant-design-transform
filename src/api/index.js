import login from './login'

const api = {
  login
}

export default api

export const ApiPlugin = {}

ApiPlugin.install = function (Vue, options) {
  Vue.prototype.api = api // 挂载api在原型上
}