import type { N } from "mockjs"

interface AnyObject {
  [key: string]: unknown
}

interface Options {
  label: string
  value: unknown
}

/** 键值对类型 */
export interface LabelValueState {
  label: string
  value: any
  color?: string
}

/** 字典类型 */
export interface DictState {
  code: string
  items: Array<LabelValueState>
}

/** 状态（1：启用；2：禁用） */
type Status = 1 | 2

/** 性别（1：男；2：女；0：未知） */
type Gender = 1 | 2 | 0


/** 状态（Y：启用；N：禁用） */
type ROLEStatus = Y | N