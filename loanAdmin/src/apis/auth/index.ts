import http from '@/utils/http'
import type * as Auth from './type'

const BASE_URL = '/loan/Worker'

/** @desc 账号登录 */
export function accountLogin(req: Auth.AccountLoginReq) {
  return http.post<Auth.LoginResp>(`${BASE_URL}/login`, req)
}
/** @desc 账号登录 */
export function changePassWord(req) {
  return http.post(`${BASE_URL}/changePassWord`, req)
}

/** @desc 退出登录 */
export function logout() {
  return http.post(`${BASE_URL}/logout`)
}

/** @desc 获取用户信息 */
export const getUserInfo = () => {
  return http.post<Auth.UserInfo>(`${BASE_URL}/getWorkerInfo`)
}

/** @desc 获取路由信息 */
export const getUserRoute = () => {
  return http.get<Auth.RouteItem[]>(`${BASE_URL}/getWorkerInfo`)
}

export const getRoute = () => {
  return http.post(`${BASE_URL}/getWorkerInfo`)
}
