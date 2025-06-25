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
    font-size: @font-size-4xl;
    font-weight: @font-weight-bold;
    color: @color-text-inverse;
    line-height: @line-height-tight;
    font-family: @font-family-display;
  }

  .weight-unit {
    font-size: @font-size-lg;
    color: @color-text-inverse;
    margin-left: @spacing-xs;
  }
}
</style>
