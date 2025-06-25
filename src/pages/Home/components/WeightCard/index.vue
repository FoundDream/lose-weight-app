<script setup lang="ts">
import type { WeightCardProps } from "./weight";
import WeightDisplay from "./WeightDisplay.vue";
import WeightTarget from "./WeightTarget.vue";
import WeightChange from "./WeightChange.vue";

defineProps<WeightCardProps>();
const emit = defineEmits(["update:targetWeight"]);

const handleTargetWeightUpdate = (value: number) => {
  emit("update:targetWeight", value);
};
</script>

<template>
  <div class="weight-card">
    <div class="weight-main">
      <WeightDisplay :weight="currentWeight" :unit="unit" />
      <WeightTarget
        :target-weight="targetWeight"
        :current-weight="currentWeight"
        :unit="unit"
        :editable="editable"
        @update:target-weight="handleTargetWeightUpdate"
      />
    </div>

    <WeightChange
      :current-weight="currentWeight"
      :yesterday-weight="yesterdayWeight"
      :unit="unit"
    />
  </div>
</template>

<style scoped lang="less">
// 样式变量
@primary-color: #6366f1;
@success-color: #10b981;
@danger-color: #ef4444;
@bg-primary: #ffffff;
@text-primary: #1e293b;
@text-secondary: #64748b;
@text-light: #94a3b8;
@shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
@border-radius-lg: 20px;

.weight-card {
  background: @bg-primary;
  border-radius: @border-radius-lg;
  padding: 24px;
  box-shadow: @shadow-md;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .weight-main {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
