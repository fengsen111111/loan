<template>
  <div class="gi_page">
    <a-row wrap :gutter="16">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
        <LeftBox />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import LeftBox from './LeftBox.vue'

</script>

<style lang="scss" scoped>
.gi_page {
  background-color: var(--color-bg-1);
}
</style>
