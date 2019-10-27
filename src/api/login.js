import { auth } from '@/utils/request'

/**
 * login func
 * parameter: {
 *   username: '',
 *   password: ''
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  return auth({
    url: '/login/',
    method: 'post',
    data: parameter
  })
}

/**
 * sider menu
 * @param parameter
 */
export function getSideMenu(parameter) {
  return auth({
    url: '/users/usersmenu/username/',
    method: 'get',
    params: parameter
  })
}


export default {
  login,
  getSideMenu, // 获取侧边栏的数据
}