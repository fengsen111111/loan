import http from '@/utils/http'
import type * as System from './type'

const BASE_URL = '/loan/Worker'

/** @desc 查询部门列表 */
export function listDept(query: System.DeptQuery) {
  return http.post<System.DeptResp[]>(`${BASE_URL}/getRoleList`, query)
}

/** @desc 查询部门详情 */
export function getDept(id: string) {
  return http.get<System.DeptResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增/修改部门 */
export function addDept(data: any) {
  return http.post<boolean>(`${BASE_URL}/addRole`, data)
}


/** @desc 删除部门 */
export function deleteDept(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出部门 */
export function exportDept(query: System.DeptQuery) {
  return http.download<any>(`${BASE_URL}/export`, query)
}
