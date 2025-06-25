<script setup lang="ts">
import type { WeightDisplayProps } from "./weight";

defineProps<WeightDisplayProps>();
</script>

<template>
  <div class="weight-display">
    <span class="weight-number">{{ weight }}</span>
    <span class="weight-unit">{{ unit }}</span>
  </div>
</template>

<style scoped lang="less">
.weight-display {
  display: flex;
  align-items: baseline;

  .weight-number {
    font-size: 48px;
    font-weight: 700;
    color: #fff;
    line-height: 1;
  }

  .weight-unit {
    font-size: 18px;
    color: #fff;
    margin-left: 4px;
  }
}
</style>
