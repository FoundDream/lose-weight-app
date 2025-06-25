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
.weight-card {
  background: @gradient-primary;
  border-radius: @border-radius-xl;
  padding: @spacing-lg;
  box-shadow: @shadow-none;
  border: @border-width solid @color-border;
  justify-content: space-between;

  .weight-main {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: @spacing-sm;
    margin-bottom: @spacing-sm;
  }
}
</style>
