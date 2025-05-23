import http from '@/utils/http'
import type * as System from './type'

const BASE_URL = '/loan/Worker'

/** @desc 查询角色列表 */
export function listRole(data: any, form?: any) {
  return http.post(`${BASE_URL}/getRoleList`, data)
}

/** @desc 查询角色详情 */
export function getRole(id: string) {
  return http.get<System.RoleDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增角色 */
export function addRole(data: any) {
  return http.post(`${BASE_URL}/addRole`, data)
}

/** @desc 修改角色 */
export function updateRole(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除角色 */
export function deleteRole(ids: string | Array<string>) {
  return http.del(`${BASE_URL}/${ids}`)
}
