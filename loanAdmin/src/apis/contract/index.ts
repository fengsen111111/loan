import http from '@/utils/http'

const BASE_URL = '/loan'

/** @desc 查询合同申领列表 */
export function ContentsList(query) {
  return http.post(`${BASE_URL}/Store/getApplyUseContentsList`, query)
}
/** @desc 查询商家授权的合同列表 */
export function getStoreContractList(query) {
  return http.post(`${BASE_URL}/Contract/getStoreContractList`, query)
}
/** @desc 申领合同/修改合同状态 */
export function applyUseContracts(query) {
  return http.post(`${BASE_URL}/Store/applyUseContracts`, query)
}

/** @desc 获取合同申领详情 */
export function getApplyUseContentsDetail(query) {
  return http.post(`${BASE_URL}/Store/getApplyUseContentsDetail`, query)
}

/** @desc 作废剩余合同 */
export function rejectContracts(query) {
  return http.post(`${BASE_URL}/Store/rejectContracts`, query)
}

/** @desc 获取合同登记列表 */
export function getSignContentsList(query) {
  return http.post(`${BASE_URL}/Store/getSignContentsList`, query)
}

/** @desc 登记合同 */
export function signContract(query) {
  return http.post(`${BASE_URL}/Store/signContract`, query)
}

/** @desc 商家产品二级联动数据 */
export function storeGetGoodsList() {
  return http.post(`${BASE_URL}/Goods/storeGetGoodsList`)
}


export function withdrawalMoney(params) {
  return http.post(`${BASE_URL}/Order/withdrawal`,params)
}

export function getWithdrawalMsg(params) {
  return http.post(`${BASE_URL}/Order/getWithdrawalMsg`,params)
}

/** @desc 获取商家助贷方列表 */
export function getStoreCapitalList() {
  return http.post(`${BASE_URL}/Store/getStoreCapitalList`)
}
