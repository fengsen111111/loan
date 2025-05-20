<template>
  <div class="gi_page">
    <a-card class="general-card">
      <div style="flex-basis: 100%">
        <a-radio-group v-model="selectedValue" @change="handleRadioChange" type="button">

          <a-radio value="1">公证中</a-radio>
          <a-radio value="2">已结束公证</a-radio>
          <a-radio value="3">已作废</a-radio>
        </a-radio-group>
      </div>
      <ChildComponent2 v-if="selectedValue === '1'" />
      <ChildComponent v-if="selectedValue === '2'" />
      <ChildComponent3 v-if="selectedValue === '3'" />
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ChildComponent from './notarialed.vue' // 导入子组件
import ChildComponent2 from './notarialcontract.vue' // 导入子组件
import ChildComponent3 from './notarialcontractThree.vue' // 导入子组件
export default defineComponent({
  components: {
    ChildComponent,
    ChildComponent2,
    ChildComponent3
  },
  setup() {
    const selectedValue = ref('1')

    const handleRadioChange = (value) => {
      // 处理单选框值的改变
      selectedValue.value = value
      // console.log('Selected value changed to:', value)
    }

    return {
      selectedValue,
      handleRadioChange
    }
  }
})
</script>
<style lang="scss" scoped>
:deep(.arco-radio-group-button) {
  background-color: transparent !important;
}

:deep(.arco-radio-button) {
  border: 1px #e1e5ee solid;
  margin-right: 10px;
  padding: 5px;
}

:deep(.arco-radio-button::before) {
  display: none !important;
}

:deep(.arco-radio-button.arco-radio-checked) {
  color: var(--color-bg-5);
  background-color: rgb(var(--primary-6));
}
</style>
