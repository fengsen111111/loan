/** 用户类型 */
export interface UserInfo {
  id: string
  name: string
  role: string
  mobile: string
  store_name: string
  store_id: string
  avatar: string
  roles: string
  store_price: string
  role_rules: string[]
  permissions: string[]
}

/** 路由类型 */
export interface RouteItem {
  id: string
  title: string
  parentId: string
  type: 1 | 2 | 3
  path: string
  name: string
  component: string
  redirect: string
  icon: string
  isExternal: boolean
  isHidden: boolean
  isCache: boolean
  permission: string
  roles: string[]
  sort: number
  status: 0 | 1
  children: RouteItem[]
  activeMenu: string
  alwaysShow: boolean
  breadcrumb: boolean
  showInTabs: boolean
  affix: boolean
}

/** 账号登录请求参数 */
export interface AccountLoginReq {
  account: string
  password: string
}

/** 手机号登录请求参数 */
export interface PhoneLoginReq {
  phone: string
  captcha: string
}

/** 邮箱登录请求参数 */
export interface EmailLoginReq {
  email: string
  captcha: string
}

// 登录响应类型
export interface LoginResp {
  name: string
  token: string
}

// 第三方登录授权类型
export interface SocialAuthAuthorizeResp {
  authorizeUrl: string
}
