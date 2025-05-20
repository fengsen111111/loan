type LabelValueItem = { label: string; value: number|String; color: string }
export const DisEnableStatusList: LabelValueItem[] = [
  { label: '启用', value: 'Y', color: 'green' },
  { label: '禁用', value: 'N', color: 'red' }
]

export const DisEnableWORkList: LabelValueItem[] = [
  { label: '在职', value:  'Y', color: '' },
  { label: '离职', value: 'N', color: '' },
]
export const DisContratStatus: LabelValueItem[] = [
  { label: '待复核', value: 'a', color: 'green' },
  { label: '待用印', value: 'b', color: 'red' },
   { label: '已拒绝', value: 'c', color: 'green' },
  { label: '待邮寄', value:'d', color: 'red' },
   { label: '已邮寄', value: 'e', color: 'green' },
  { label: '已归档', value: 'f', color: 'red' },
   { label: '已取消', value: 'g', color: 'green' },

]	
