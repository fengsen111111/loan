import { ref, toRaw } from 'vue'
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { constantRoutes } from '@/router'
import Layout from '@/layout/index.vue'
import ParentView from '@/components/ParentView/index.vue'
import { getRoute } from '@/apis'
import { mapTree } from 'xe-utils'
import { transformPathToName } from '@/utils'
import { restructuredRoutes, restructuredRoutes1 } from '@/router'
// 匹配views里面所有的.vue文件
const modules = import.meta.glob('@/views/**/*.vue')

/** 加载模块 */
export const loadView = (view: string) => {
  let res
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === view) {
      res = () => modules[path]()
    }
  }
  return res
}

/** 将component由字符串转成真正的模块 */
const transformComponentView = (component: string) => {

  if (component === 'Layout') {
    return Layout as never
  } else if (component === 'ParentView') {
    return ParentView as never
  } else {
    return loadView(component) as never
  }
}


/**
 * @descriptio
 * @params 权限验证
 */
function filterRoutes(routes, keys) {
  // console.log('自己本地', routes);
  // console.log('接口返回路由', keys);
  return routes
    .map(node => {
      // 递归处理 children
      const matchedChildren = node.children ? filterRoutes(node.children, keys) : [];
      // 判断当前节点是否匹配或有匹配的子节点
      if (keys.includes(node.key) || matchedChildren.length > 0) {
        return {
          ...node,
          children: matchedChildren.length > 0 ? matchedChildren : undefined
        };
      }

      return null; // 不匹配则过滤掉
    })
    .filter(Boolean); // 去除 null

  // return routes.reduce((acc, route) => {
  //   // 如果当前route的key在keys中
  //   if (keys.includes(route.key)) {
  //     // 深拷贝当前route对象
  //     const newRoute = { ...route };

  //     // 如果当前route有children，递归过滤children
  //     if (newRoute.children && newRoute.children.length > 0) {
  //       newRoute.children = filterRoutes(newRoute.children, keys);
  //     }

  //     // 添加过滤后的route到结果数组中
  //     acc.push(newRoute);
  //   }
  //   return acc;
  // }, []);
}

/**
 * @description 前端来做排序、格式化
 * @params {menus} 后端返回的路由数据，已经根据当前用户角色过滤掉了没权限的路由
 * 1. 对后端返回的路由数据进行排序，格式化
 * 2. 同时将component由字符串转成真正的模块
 */
const formatAsyncRoutes = (menus: RouteItem[]) => {
  if (!menus.length) return []
  menus.sort((a, b) => (a?.sort ?? 0) - (b?.sort ?? 0)) // 排序
  const routes = mapTree(menus, (item) => {
    if (item.children && item.children.length) {
      item.children.sort((a, b) => (a?.sort ?? 0) - (b?.sort ?? 0)) // 排序
    }
    return {
      path: item.path,
      name: item.title ?? transformPathToName(item.path),
      component: transformComponentView(item.component),
      // component: item.component,
      redirect: item.redirect,
      meta: {
        title: item.title,
        hidden: item.hidden,
        keepAlive: item.isCache,
        alwaysShow: item.alwaysShow,
        icon: item.icons
      }
    }
  })
  return routes as RouteRecordRaw[]
}

const storeSetup = () => {
  // 所有路由(常驻路由 + 动态路由)
  const routes = ref<RouteRecordRaw[]>([])
  // 动态路由(异步路由)
  const asyncRoutes = ref<RouteRecordRaw[]>([])

  // 合并路由
  const setRoutes = (data: RouteRecordRaw[]) => {
    routes.value = constantRoutes.concat(data)
    asyncRoutes.value = data

  }

  // 生成路由
  const generateRoutes = (): Promise<RouteRecordRaw[]> => {
    return new Promise((resolve) => {
      //const asyncRoutes =[]
      // let arr1 = restructuredRoutes
      // const asyncRoutes = formatAsyncRoutes(arr1)
      // console.log(asyncRoutes,'33333333333333333');
      // const asyncRoutes =[]
      //  setRoutes(asyncRoutes)
      //  resolve(asyncRoutes)
      // 向后端请求路由数据 这个接口已经根据用户角色过滤了没权限的路由(后端根据用户角色过滤路由显得比较安全些)

      getRoute().then((res: any) => {
        if (res.data.is_owner == 'Y') {
          let arr1 = restructuredRoutes
          const asyncRoutes = formatAsyncRoutes(arr1)
          setRoutes(asyncRoutes)
          resolve(asyncRoutes)
        } else {
          let temp_arr = []
          const arr1 = res.data.role_rules
          temp_arr = filterRoutes(restructuredRoutes, arr1);
          // console.log('temp_arr', temp_arr);
          // console.log('restructuredRoutes1只有一个审批工作台', restructuredRoutes1);
          if (res.data.role_ids.indexOf('2') != -1) { //没有2不执行
            if (temp_arr.length > 0) {
              temp_arr = [...restructuredRoutes1, ...temp_arr]
            } else {
              temp_arr = restructuredRoutes1
            }
          }
          // console.log('temp_arr', temp_arr);

          // add-----------------------
          let number = 0
          temp_arr.map((item: any) => {
            if (item.title == '订单管理') {
              number++
              let wxsp = item.children.filter(iss => iss.title == '授信审批');
              if (wxsp.length > 0) {
                temp_arr = temp_arr
              } else {
                temp_arr = [...restructuredRoutes1, ...temp_arr]
              }
            }
            else if (item.title == '审批工作台') {
              number++
            }
          })
          // console.log('number', number, temp_arr);

          if (number > 1) {
            //方式1去除上面 说明审批工作台和订单里的微信审批重复了
            // temp_arr.map((item: any) => {
            //   if (item.title == '订单管理') {
            //     item.children = item.children.filter(iss => iss.title != '授信审批');//除去订单管理里面的微信审批
            //   }
            // })
            // 方式2去除下面
            temp_arr = temp_arr.filter(item => item.title != "审批工作台");
            // console.log('number', number, temp_arr);
          } else {
            // 没重复就不管
          }
          // add-----------------------

          const asyncRoutes = formatAsyncRoutes(temp_arr)
          setRoutes(asyncRoutes)
          resolve(asyncRoutes)
        }



        //     // const asyncRoutes = formatAsyncRoutes(res.data)
        //     if(res.data.role=='b'&&res.data.role_rules&&res.data.role_rules.length>0){
        //     const arr1=JSON.parse(res.data.role_rules) 
        //     //  console.log(arr1)
        //      const filteredRoutes = filterRoutes(restructuredRoutes, arr1);
        //      const asyncRoutes = formatAsyncRoutes(filteredRoutes)
        //     setRoutes(asyncRoutes)
        //     resolve(asyncRoutes)
        //     }else  if(res.data.role =='a'){
        //  let arr1 = restructuredRoutes
        //  const asyncRoutes = formatAsyncRoutes(arr1)
        //  setRoutes(asyncRoutes)
        //   resolve(asyncRoutes)
        // } else {

        //     let arr2 = restructuredRoutes1
        //      const asyncRoutes = formatAsyncRoutes(arr2)
        //      setRoutes(asyncRoutes)
        //       resolve(asyncRoutes)

        //     }



      })
    })
  }

  return {
    routes,
    asyncRoutes,
    generateRoutes
  }
}

export const useRouteStore = defineStore('route', storeSetup, { persist: true })
