<template>
  <span v-if="props.status === 1">
    <icon-check-circle-fill class="success" />
    <span>启用</span>
  </span>
  <span v-if="props.status === 2">
    <icon-minus-circle-fill class="warning" />
    <span>禁用</span>
  </span>
</template>

<script lang="ts" setup>
defineOptions({ name: 'GiCellStatus' })

interface Props {
  status: 0 | 1
}

const props = withDefaults(defineProps<Props>(), {
  status: 1
})
</script>

<style lang="scss" scoped></style>
