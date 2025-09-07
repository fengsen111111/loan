import http from '@/utils/http'

const BASE_URL = '/loan'

/** @desc 获取授信审批管理&签约管理&待转债订单列表 */
export function storeGetOrderList(query) {
  return http.post(`${BASE_URL}/Order/storeGetOrderList`, query)
}

/** @desc 获取授信审批&签约管理订单详情 */
export function storeGetOrderDetail(query) {
  return http.post(`${BASE_URL}/Order/storeGetOrderDetail`, query)
}
/** @desc 审核员 待办，待抢数量 统计 */
export function checkerOrderSta(query) {
  return http.post(`${BASE_URL}/Order/checkerOrderSta`, query)
}
/** @desc 审核员审核订单 */
export function storeCheckOrder(query) {
  return http.post(`${BASE_URL}/Order/storeCheckOrder`, query)
}
/** @desc 审核员抢单 */
export function storeHasOrder(query) {
  return http.post(`${BASE_URL}/Order/storeHasOrder`, query)
}
/** @desc 获取转债确认&转债成功订单列表（不提供详情接口） */
export function waitSureMoveList(query) {
  return http.post(`${BASE_URL}/Order/waitSureMoveList`, query)
}
/** @desc 确认转债*/
export function submitMove(query) {
  return http.post(`${BASE_URL}/Order/submitMove`, query)
}

/** @desc 获取交易随机因子*/
export function getRandom(query) {
  return http.post(`${BASE_URL}/Capital/getRandom`, query)
}

/** @desc 选择助贷方并放款*/
export function choiceCapitalAndPay(query) {
  return http.post(`${BASE_URL}/Order/choiceCapitalAndPay`, query)
}

/** @desc 获取转载信息*/
export function _getMoveMsg(query) {
  return http.post(`${BASE_URL}/Order/getMoveMsg`, query)
}

/** @desc 获取指定的助贷方转账记录列表*/
export function getTransferAccountsList(query) {
  return http.post(`${BASE_URL}/Capital/getTransferAccountsList`, query)
}
/** @desc 获取指定的助贷方提现记录列表*/
export function getCapitalWithdrawalList(query) {
  return http.post(`${BASE_URL}/Capital/getCapitalWithdrawalList`, query)
}
/** @desc 验证码二次校验*/
export function submitVerifyCode(query) {
  return http.post(`${BASE_URL}/Capital/submitVerifyCode`, query)
}

/** @desc 获取连连银行卡账户*/
export function getLLBankList(query) {
  return http.post(`${BASE_URL}/User/getLLBankList`, query)
}

/** @desc 助贷方提现*/
export function withdrawal(query) {
  return http.post(`${BASE_URL}/Capital/withdrawal`, query)
}
/** @desc 助贷方转账到持牌方账户*/
export function transferAccounts(query) {
  return http.post(`${BASE_URL}/Capital/transferAccounts`, query)
}

/** @desc 查看放款记录*/
export function getOrderPayLogList(query) {
  return http.post(`${BASE_URL}/Order/getOrderPayLogList`, query)
}

/** @desc 添加/修改/删除商家开票抬头*/
export function editInvoiceAccount(query) {
  return http.post(`${BASE_URL}/Store/editInvoiceAccount`, query)
}

/** @desc 商家开票抬头列表*/
export function getInvoiceAccountList(query) {
  return http.post(`${BASE_URL}/Store/getInvoiceAccountList`, query)
}

/** @desc 开票*/
export function addInvoice(query) {
  return http.post(`${BASE_URL}/Invoice/addInvoice`, query)
}

/** @desc 商家开票记录列表*/
export function getInvoiceList(query) {
  return http.post(`${BASE_URL}/Invoice/getInvoiceList`, query)
}

/** @desc 商家开票记录列表*/
export function getStorePriceLogList(query) {
  return http.post(`${BASE_URL}/Finance/getStorePriceLogList`, query)
}

/** @desc 作废 */
export function badOrder(query) {
  return http.post(`${BASE_URL}/Order/badOrder`, query)
}
/** @desc 获取签约链接 */
export function getHtmlUrl(query) {
  return http.post(`${BASE_URL}/Order/getHtmlUrl`, query)
}


/** @desc 恢复 */
export function reBadOrder(query) {
  return http.post(`${BASE_URL}/Order/reBadOrder`, query)
}

/** @desc 结束放款 */
export function endOrder(query) {
  return http.post(`${BASE_URL}/Order/endOrder`, query)
}
/** @desc 恢复放款 */
export function reOrder(query) {
  return http.post(`${BASE_URL}/Order/reOrder`, query)
}