import http from '@/utils/http'
import type { LabelValueState } from '@/types/global'
import type { TreeNodeData } from '@arco-design/web-vue'
import type { OptionQuery } from '@/apis'


/** @desc 查询获取行政区*/
export function getAreas(data) {
  return http.post(`factory_system/Base/getAreas`, data)
}

/** @desc 获取所有字典集*/
export function getDictionary(data) {
  return http.post(`/loan/Dictionary/getDictionary`, data)
}


/** @desc 前端云存储记录到服务器*/
export function frontUpload(data) {
  return http.post(`/factory_storage/File/frontUpload`, data)
}

