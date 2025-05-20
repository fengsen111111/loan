import { createRouter, createWebHashHistory } from 'vue-router'

/** 默认布局 */
const Layout = () => import('@/layout/index.vue')

/** 静态路由 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/default/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/default/error/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/403',
    component: () => import('@/views/default/error/403.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    name: 'Home',
    component: Layout,
    redirect: '/home',
    meta: { hidden: false },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', icon: 'home', affix: true, hidden: false }
      }
    ]
  },

  {
    path: '/setting',
    name: '/setting',
    component: Layout,
    redirect: '/setting',
    // meta: { hidden: false },
    children: [
      {
        path: '/setting/profile',
        name: '账户设置',
        component: () => import('@/views/setting/profile/index.vue')
      },
      {
        path: '/setting/security',
        name: '用户设置',
        component: () => import('@/views/setting/security/index.vue')
      }
    ]
  }
]

// 路由配置数据
const routes = [
  {
    path: '/contract',
    name: 'contract',
    component: 'Layout',
    redirect: '/contract',
    meta: { title: '合同管理', hidden: false, alwaysShow: true, icon: 'stamp' },
    children: [
      {
        path: '/contract/application',
        name: 'application',
        component: 'loanManagement/contract/application/index',
        meta: { title: '合同协议申领管理', showInTabs: false, icon: '' }
      },
      {
        path: '/contract/invalidation',
        name: 'invalidation',
        component: 'loanManagement/contract/invalidation/index',
        meta: { title: '合同使用登记管理', showInTabs: false, icon: '' }
      },
      {
        path: '/contract/registration',
        name: 'registration',
        component: 'loanManagement/contract/registration/index',
        meta: { title: '合同作废登记管理', showInTabs: false, icon: '' }
      },
      {
        path: '/contract/prending',
        name: 'prending',
        component: 'loanManagement/contract/prending/index',
        meta: { title: '待登记合同管理', showInTabs: false, icon: '' }
      }
    ]
  },

  {
    path: '/loanManagement',
    name: 'loanManagement',
    redirect: '/loanManagement',
    component: 'Layout',
    meta: { title: '订单管理', hidden: false, alwaysShow: true, icon: 'robot' },
    children: [
      {
        path: '/loanManagement/approval',
        name: 'apaproval',
        component: 'creditApproval/index',
        meta: { title: '授信审批', hidden: false, alwaysShow: false },
        children: [
          {
            path: 'add',
            name: 'look',
            meta: { title: '查看', hidden: true, alwaysShow: true, icon: 'settings' },
            permission: 'system:user:list',
            component: ''
          }
        ]
      },
      {
        path: '/loanManagement/sign',
        name: 'sign',
        component: 'loanManagement/sign/index',
        meta: { title: '签约管理', hidden: false, alwaysShow: false, icon: '' }
      },

      {
        path: '/loanManagement/notarial',
        name: 'notarial',
        component: 'notarial/index',
        meta: { title: '公证管理', hidden: false, alwaysShow: false, icon: '' }
      },
      {
        path: '/loanManagement/loan',
        name: 'loan',
        component: 'loanManagement/loan/index',
        meta: { title: '放款管理', hidden: false, alwaysShow: false, icon: '' }
      }
      // {
      //   path: '/loanManagement/iou',
      //   name: 'iou',
      //   component: 'loanManagement/iou/index',
      //   meta: { title: '借据管理', hidden: false,  alwaysShow: false, icon: '' }
      // },
      // {
      //   path: '/loanManagement/creditRights',
      //   name: 'creditRightst',

      //   meta: { title: '债权管理', hidden: false,  alwaysShow: true },
      //   children: [
      //     {
      //       path: '/loanManagement/creditRights/transferSuccess',
      //       name: 'transferSuccess',
      //       component: 'loanManagement/creditRights/transferSuccess/index',
      //       meta: { title: '债转成功管理', showInTabs: false }
      //     },
      //     {
      //       path: '/loanManagement/creditRights/contracts',
      //       name: 'contracts',
      //       component:'loanManagement/creditRights/contracts/index',
      //       meta: { title: '待债转合同', showInTabs: false }
      //     },
      //     {
      //       path: '/loanManagement/creditRights/confirmation',
      //       name: 'confirmation',
      //       component: 'loanManagement/creditRights/confirmation/index',
      //       meta: { title: '债权确认单', showInTabs: false }
      //     }
      //   ]
      // }
    ]
  },

  {
    path: '/electronAccount',
    name: 'electronAccount',
    component: 'Layout',
    meta: { title: '账户管理', hidden: false, alwaysShow: true, icon: 'public' },
    children: [
      {
        path: '/electronAccount/capitalAccounts',
        name: 'accounts',
        component: 'electronAccount/accounts/capitalAccounts/index',
        meta: { title: '我的助贷方账户', hidden: false, alwaysShow: false }
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    component: 'Layout',
    meta: { title: '权限管理', hidden: false, alwaysShow: true, icon: 'settings' },
    children: [
      {
        path: '/system/dept',
        name: 'dept',
        component: 'system/dept/index',
        meta: { title: '部门管理', hidden: false, alwaysShow: false }
      },
      {
        path: '/system/role',
        name: 'role',
        component: 'system/role/index',
        meta: { title: '角色管理', hidden: false, alwaysShow: false }
      },
      {
        path: '/system/user',
        name: 'user',
        component: 'system/user/index',
        meta: { title: '管理员', hidden: false, alwaysShow: false }
      }
    ]
  },
  {
    path: '/CostCenter',
    name: 'CostCenter',
    component: 'Layout',
    meta: { title: '费用中心', hidden: false, alwaysShow: true, icon: 'thunderbolt' },
    children: [
      // {
      //   path: '/CostrCenter/dexpenseAccount',
      //   name: 'expenseAccount',
      //   component: 'costCenter/expenseAccount/index',
      //   meta: { title: '数据统计', hidden: false,  alwaysShow: false }
      // },

      {
        path: '/Invoicemanagement',
        name: 'Invoicemanagement',

        meta: { title: '发票管理', hidden: false, alwaysShow: true },

        children: [
          {
            path: '/Invoicemanagement/informationManagement',
            name: 'informationManagement',
            component: 'Invoicemanagement/informationManagement/index',
            meta: { title: '抬头列表', hidden: false, alwaysShow: false, icon: '' }
          },
          {
            path: '/Invoicemanagement/invoiceRecords',
            name: 'invoiceRecords',
            component: 'Invoicemanagement/invoiceRecords/index',
            meta: { title: '发票记录', hidden: false, alwaysShow: false }
          }
        ]
      },
      {
        path: '/incomeDtails/index',
        name: 'incomeDtail',
        component: 'incomeDtails/index',
        meta: { title: '账单明细', hidden: false, alwaysShow: false }
      }
    ]
  }
  //,
  // {
  //   path: '/Invoicemanagement',
  //   name: 'Invoicemanagement',
  //   component:  "Layout",
  //   meta: { title: '发票管理', hidden: false,  alwaysShow: true, icon: 'thunderbolt' },
  //   children: [
  //     {
  //       path: '/Invoicemanagement/invoiceManagement',
  //       name: 'invoiceManagement',
  //       component: 'Invoicemanagement/invoiceManagement/index',
  //       meta: { title: '开票列表', hidden: false,  alwaysShow: false }
  //     },
  //      {
  //       path: '/Invoicemanagement/invoiceIssuance',
  //       name: 'invoiceIssuance',
  //       component: 'Invoicemanagement/invoiceIssuance/index',
  //       meta: { title: '去开票', hidden: false,  alwaysShow: false }
  //     }, {
  //       path: '/Invoicemanagement/informationManagement',
  //       name: 'informationManagement',
  //       component: 'Invoicemanagement/informationManagement/index',
  //       meta: { title: '发票信息管理', hidden: false,  alwaysShow: false }
  //     }, {
  //       path: '/Invoicemanagement/invoiceRecords',
  //       name: 'invoiceRecords',
  //       component: 'Invoicemanagement/invoiceRecords/index',
  //       meta: { title: '开票记录', hidden: false,  alwaysShow: false }
  //     }

  //   ]
  // }
]
const routes1 = [
  {
    path: '/examine',
    name: 'examine',
    component: 'Layout',
    redirect: '/examine',
    meta: { title: '审批工作台', hidden: false, alwaysShow: true, icon: 'stamp' },
    children: [
      {
        path: '/index/approval',
        name: 'apaproval',
        component: 'creditApproval/index',
        meta: { title: ' 授信审批', hidden: false, alwaysShow: false },
        children: [
          {
            path: 'add',
            name: 'look',
            meta: { title: '查看', hidden: true, alwaysShow: true, icon: 'settings' },
            permission: 'system:user:list',
            component: ''
          }
        ]
      },
    ]
  },
]
// const routes1 = [
//   {
//     path: '/examine',
//     name: 'examine',
//     component: 'Layout',
//     redirect: '/examine',
//     meta: { title: '审批工作台', hidden: false, alwaysShow: true, icon: 'stamp' },
//     children: [
//       {
//         path: '/index/approval',
//         name: 'apaproval',
//         component: 'creditApproval/index',
//         meta: { title: '授信审批', hidden: false, alwaysShow: false },
//         children: [
//           {
//             path: 'add',
//             name: 'look',
//             meta: { title: '查看', hidden: true, alwaysShow: true, icon: 'settings' },
//             permission: 'system:user:list',
//             component: ''
//           }
//         ]
//       }
//     ]
//   },

//   {
//     path: '/loanManagement',
//     name: 'loanManagement',
//     redirect: '/loanManagement',
//     component: 'Layout',
//     meta: { title: '订单管理', hidden: false, alwaysShow: true, icon: 'robot' },
//     children: [
//       {
//         path: '/loanManagement/contract',
//         name: 'contract',
//         // component: () => import('@/views/loanManagement/contract.vue'),
//         // meta: { title: '合同管理', hidden: false,  alwaysShow: false, icon: 'user' },
//         meta: { title: '合同管理', hidden: false, alwaysShow: true },
//         children: [
//           {
//             path: '/loanManagement/contract/application',
//             name: 'application',
//             component: 'loanManagement/contract/application/index',
//             meta: { title: '合同协议申领管理', showInTabs: false, icon: '' }
//           },
//           {
//             path: '/loanManagement/contract/invalidation',
//             name: 'invalidation',
//             component: 'loanManagement/contract/invalidation/index',
//             meta: { title: '合同使用登记管理', showInTabs: false, icon: '' }
//           },
//           {
//             path: '/loanManagement/contract/registration',
//             name: 'registration',
//             component: 'loanManagement/contract/registration/index',
//             meta: { title: '合同作废登记管理', showInTabs: false, icon: '' }
//           },
//           {
//             path: '/loanManagement/contract/prending',
//             name: 'prending',
//             component: 'loanManagement/contract/prending/index',
//             meta: { title: '待登记合同管理', showInTabs: false, icon: '' }
//           }
//         ]
//       },
//       {
//         path: '/loanManagement/sign',
//         name: 'sign',
//         component: 'loanManagement/sign/index',
//         meta: { title: '签约管理', hidden: false, alwaysShow: false, icon: '' }
//       },
//       {
//         path: '/loanManagement/loan',
//         name: 'loan',
//         component: 'loanManagement/loan/index',
//         meta: { title: '放款管理', hidden: false, alwaysShow: false, icon: '' }
//       },
//       {
//         path: '/loanManagement/iou',
//         name: 'iou',
//         component: 'loanManagement/iou/index',
//         meta: { title: '借据管理', hidden: false, alwaysShow: false, icon: '' }
//       },
//       {
//         path: '/loanManagement/creditRights',
//         name: 'creditRightst',
//         // component: () => import('@/views/loanManagement/contract.vue'),
//         // meta: { title: '合同管理', hidden: false,  alwaysShow: false, icon: 'user' },
//         meta: { title: '债权管理', hidden: false, alwaysShow: true },
//         children: [
//           {
//             path: '/loanManagement/creditRights/transferSuccess',
//             name: 'transferSuccess',
//             component: 'loanManagement/creditRights/transferSuccess/index',
//             meta: { title: '债转成功管理', showInTabs: false }
//           },
//           {
//             path: '/loanManagement/creditRights/contracts',
//             name: 'contracts',
//             component: 'loanManagement/creditRights/contracts/index',
//             meta: { title: '待债转合同', showInTabs: false }
//           },
//           {
//             path: '/loanManagement/creditRights/confirmation',
//             name: 'confirmation',
//             component: 'loanManagement/creditRights/confirmation/index',
//             meta: { title: '债权确认单', showInTabs: false }
//           }
//         ]
//       }
//     ]
//   }
// ]

// 生成唯一 key 的函数
let currentKey = 1000
function generateKey() {
  return currentKey++
}
// 生成唯一排序值的函数
let currentSort = 1
function generateSort() {
  return currentSort++
}
// 重组路由数据的函数
function restructureRoutes(routeConfigData: RouteRecordRaw[], depth: number = 0): any[] {
  const restructuredData = []

  routeConfigData.forEach((route) => {
    const parentSort = generateSort()
    const parent = {
      key: generateKey(),
      title: route.meta.title,
      sort: parentSort,
      path: route.path,
      component: route.component,
      isCache: false,
      icons: route.meta.icon,
      hidden: route.meta.hidden !== undefined ? route.meta.hidden : '',
      alwaysShow: route.meta.alwaysShow !== undefined ? route.meta.alwaysShow : '',
      showInTabs: route.meta.showInTabs !== undefined ? route.meta.showInTabs : '',
      ...(route.permission && { path: route.permission }),
      ...(route.children && { children: [] })
    }

    if (route.children && route.children.length > 0) {
      parent.children = restructureRoutes(route.children, parent.key)
    }

    restructuredData.push(parent)
  })

  return restructuredData
}

// 获取重组后的路由数据
const restructuredRoutes: any = restructureRoutes(routes)
const restructuredRoutes1: any = restructureRoutes(routes1)
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

/**
 * @description 重置路由
 * @description 注意：所有动态路由路由必须带有 name 属性，否则可能会不能完全重置干净
 */
export function resetRouter() {
  try {
    router.getRoutes().forEach((route) => {
      const { name } = route
      console.log('name', name)
      if (name || !['Home'].includes(name.toString())) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
export { restructuredRoutes, restructuredRoutes1 }
