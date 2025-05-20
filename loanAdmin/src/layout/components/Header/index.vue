<template>
  <a-layout-header class="header" style="background: linear-gradient(90deg, #e6b980 0%, #f97e39 100%)">
    <Logo></Logo>
    <section class="fold-btn-wrapper">
      <MenuFoldBtn></MenuFoldBtn>
    </section>
    <a-row align="center" class="h-full header-right">
      <a-col :xs="0" :md="10" :lg="10" :xl="12" :xxl="12">
        <Breadcrumb></Breadcrumb>
      </a-col>
      <a-col :xs="24" :md="14" :lg="14" :xl="12" :xxl="12">
        <a-row justify="end" align="center">
          <HeaderRightBar></HeaderRightBar>
        </a-row>
      </a-col>
    </a-row>
  </a-layout-header>
</template>

<script setup lang="ts">
import HeaderRightBar from '../HeaderRightBar/index.vue'
import MenuFoldBtn from '../MenuFoldBtn.vue'
import Logo from '../Logo.vue'
import { useAppStore } from '@/stores'
const appStore = useAppStore()
defineOptions({ name: 'Header' })
</script>

<style lang="scss" scoped>
.arco-dropdown-open .arco-icon-down {
  transform: rotate(180deg);
}

.header {
  display: flex;
  align-items: center;

  .header-right {
    flex: 1;
    overflow: hidden;
    margin-left: $padding;
  }
}

.arco-layout-header {
  padding: 0 $padding;
  height: 56px;
  background: var(--color-bg-1);
  border-bottom: 1px solid var(--color-neutral-3);
}
</style>
