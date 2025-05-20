<template>
  <a-menu
    class="custom-menu"
    :mode="mode"
    :selected-keys="activeMenu"
    :auto-open-selected="autoOpenSelected"
    :accordion="appStore.menuAccordion"
    :breakpoint="appStore.layout === 'mix' ? 'xl' : undefined"
    :trigger-props="{ animationName: 'slide-dynamic-origin' }"
    :collapsed="!isDesktop ? false : appStore.menuCollapse"
    @menu-item-click="onMenuItemClick"
    @collapse="onCollapse"
    :style="menuStyle"
  >
    <MenuItem v-for="(route, index) in sidebarRoutes" :key="route.path + index" :item="route"></MenuItem>
  </a-menu>
</template>

<script setup lang="ts">
import { useAppStore, useRouteStore } from '@/stores'
import MenuItem from './MenuItem.vue'
import { isExternal } from '@/utils/validate'
import type { RouteRecordRaw } from 'vue-router'
import type { CSSProperties } from 'vue'
import { useDevice } from '@/hooks'

defineOptions({ name: 'Menu' })
const emit = defineEmits<{
  (e: 'menuItemClickAfter'): void
}>()

interface Props {
  menus?: RouteRecordRaw[]
  menuStyle?: CSSProperties
}

const props = withDefaults(defineProps<Props>(), {})

const { isDesktop } = useDevice()
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const routeStore = useRouteStore()
const sidebarRoutes = computed(() => (props.menus ? props.menus : routeStore.routes))
// console.log('sidebarRoutes', sidebarRoutes.value)

// 菜单垂直模式/水平模式
const mode = computed(() => {
  if (!['left', 'mix'].includes(appStore.layout)) {
    return 'horizontal'
  } else {
    return 'vertical'
  }
})

// 是否默认展开选中的菜单
const autoOpenSelected = computed(() => {
  return ['left', 'mix'].includes(appStore.layout)
})

// 当前页面激活菜单路径，先从路由里面找
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta?.activeMenu) {
    return [meta.activeMenu]
  }
  return [path]
})

// 菜单项点击事件
const onMenuItemClick = (key: string) => {
  if (isExternal(key)) {
    window.open(key)
    return
  }
  router.push({ path: key })
  emit('menuItemClickAfter')
}

// 折叠状态改变时触发
const onCollapse = (collapsed: boolean) => {
  if (appStore.layout === 'mix') {
    appStore.menuCollapse = collapsed
  }
}
</script>

<style lang="scss" scoped>
:deep(.arco-menu-inner:first-child > .arco-menu-selected) {
  background-color: #f97e39 !important; /* 将背景色改为白色 */
  color: #fff !important;
}
:deep(.arco-menu-inner:first-child > .arco-menu-selected > .arco-menu-icon) {
  color: #fff !important; /* 将背景色改为白色 */
}
:deep(.arco-menu-inner:first-child .arco-menu-icon) {
  color: #f97e39 !important; /* 将背景色改为白色 */
}
:deep(.arco-menu-inline-content > .arco-menu-inline > .arco-menu-selected) {
  background-color: var(--color-fill-2) !important;
  color: #000 !important;
}
/* 覆盖菜单项选中的背景色 */
:deep(.arco-menu-inline-header.arco-menu-selected) {
  background-color: #f97e39 !important; /* 将背景色改为白色 */
  color: #fff !important;
}
/* 如果你想要为打开的子菜单项设置背景色，可以使用以下选择器 */
:deep(.arco-menu-inline-header .arco-menu-icon) {
  color: #f97e39 !important; /* 将背景色改为白色 */
}
:deep(.arco-menu-inline-header.arco-menu-selected > .arco-menu-icon) {
  color: #fff !important; /* 将背景色改为白色 */
}

/* 如果你想要为打开的子菜单项的选中项设置背景色，可以使用以下选择器 */
:deep(.arco-menu-icon-suffix > svg) {
  color: #707070 !important; /* 将背景色改为白色 */
}
</style>
