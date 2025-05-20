<template>
  <div v-for="(item, i) in deptList" :key="i">
    <a-tag v-show="props.LX == item.value" color="arcoblue" size="small" class="gi_round">
      <template #icon><icon-man /></template>
      <template #default>{{ item.label }}</template>
    </a-tag>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'GiCellGender' })

const deptList = reactive([
  {
    value: 'b',
    label: '管理员'
  },
  {
    value: 'c',
    label: '业务员'
  },
  {
    value: 'd_a',
    label: '资料审核员'
  },
  {
    value: 'd_b',
    label: '风险审核员'
  },
  {
    value: 'd_c',
    label: '合同审核员'
  }
])
interface Props {
  LX: ''
}

const props = withDefaults(defineProps<Props>(), {
  LX: ''
})
</script>

<style lang="scss" scoped></style>
