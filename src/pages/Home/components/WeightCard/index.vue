<script setup lang="ts">
import type { WeightCardProps } from "./weight";
import WeightDisplay from "./WeightDisplay.vue";
import WeightChange from "./WeightChange.vue";
import WeightData from "./WeightData.vue";

defineProps<WeightCardProps>();
</script>

<template>
  <div class="weight-card">
    <div class="weight-main">
      <WeightDisplay :weight="currentWeight" :unit="unit" />
      <WeightChange
        :current-weight="currentWeight"
        :yesterday-weight="yesterdayWeight"
        :unit="unit"
      />
    </div>
    <WeightData />
  </div>
</template>

<style scoped lang="less">
// 样式变量
@primary-color: #6366f1;
@success-color: #10b981;
@danger-color: #ef4444;
@bg-primary: linear-gradient(
  0deg,
  rgba(86, 181, 199, 1) 0%,
  rgba(22, 194, 190, 0.72) 100%
);
@shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
@border-radius-lg: 20px;

.weight-card {
  background: @bg-primary;
  border-radius: @border-radius-lg;
  padding: 24px;
  box-shadow: @shadow-md;
  justify-content: space-between;

  .weight-main {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }
}
</style>
