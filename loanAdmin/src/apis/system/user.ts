import http from '@/utils/http'
import type * as System from './type'

const BASE_URL = '/loan/Worker'

/** @desc 查询用户列表 */
export function listUser(data: any) {
  return http.post<PageRes<System.UserResp[]>>(`${BASE_URL}/getWorkerList`, data)
}

/** @desc 查询用户详情 */
export function getUser(id: string) {
  return http.get<System.UserDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增用户 */
export function addUser(data: any) {
  return http.post(`${BASE_URL}/addWorker`, data)
}

/** @desc 修改用户 */
export function updateUser(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除用户 */
export function deleteUser(ids: string | Array<string>) {
  return http.del(`${BASE_URL}/${ids}`)
}

/** @desc 导出用户 */
export function exportUser(query: System.UserQuery) {
  return http.download<any>(`${BASE_URL}/export`, query)
}

/** @desc 重置密码 */
export function resetUserPwd(data: any, id: string) {
  return http.patch(`${BASE_URL}/${id}/password`, data)
}

