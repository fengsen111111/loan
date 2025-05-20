import http from '@/utils/http'
import type * as Common from './type'

const BASE_URL = '/loan'

/** @desc 查询访问趋势 */
export function listDashboardAccessTrend(days: number) {
  return http.get<Common.DashboardAccessTrendResp[]>(`${BASE_URL}/access/trend/${days}`)
}

/** @desc 查询公告列表 */
export function listDashboardNotice() {
  return http.get<Common.DashboardNoticeResp[]>(`${BASE_URL}/notice`)
}

/** @desc 统计*/
export function getStoreStatistics(data) {
  return http.post(`${BASE_URL}/Store/getStoreStatistics`,data)
}

