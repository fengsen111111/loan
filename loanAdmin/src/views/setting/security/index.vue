<template>
  <div class="gi_page">

    <a-row wrap :gutter="24" style="margin-top: 16px">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
        <PasswordPolicy />
      </a-col>

    </a-row>
  </div>
</template>

<script setup lang="ts">
import PasswordPolicy from './PasswordPolicy.vue'


defineOptions({ name: 'SettingSecurity' })
</script>

<style lang="scss" scoped>
.gi_page {
  background-color: var(--color-bg-1);

  .flex_box {
    display: flex;
    margin-bottom: 20px;

    .flex_item_container {
      width: 100%;
      height: 100%;
    }

    & .flex_item_container:first-child {
      margin-right: 20px;
    }
  }
}
</style>
