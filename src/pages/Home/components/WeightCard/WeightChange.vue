<script setup lang="ts">
import { computed } from "vue";
import type { WeightChangeProps } from "./weight";

const props = defineProps<WeightChangeProps>();

const weightChange = computed(
  () => props.yesterdayWeight - props.currentWeight
);

const changeStatus = computed(() => {
  if (weightChange.value > 0) return "negative"; // 体重减少是好的
  if (weightChange.value < 0) return "positive"; // 体重增加
  return "neutral";
});

const changeIcon = computed(() => (weightChange.value > 0 ? "↘" : "↗"));

const changeText = computed(() => {
  const change = Math.abs(weightChange.value);
  const sign = weightChange.value > 0 ? "-" : "+";
  return `${sign}${change.toFixed(1)}${props.unit}`;
});
</script>

<template>
  <div class="weight-change">
    <div class="change-indicator" :class="changeStatus">
      <span class="change-icon">{{ changeIcon }}</span>
      <span class="change-text">{{ changeText }}</span>
    </div>
  </div>
</template>

<style scoped lang="less">
.weight-change {
  text-align: right;

  .change-indicator {
    display: flex;
    align-items: center;
    gap: @spacing-xs;
    margin-bottom: @spacing-xs;
    padding: @spacing-xs @spacing-sm;
    border-radius: @border-radius-xl;
    font-weight: @font-weight-semibold;
    font-size: @font-size-sm;

    &.positive {
      background: fade(@color-danger, 20%);
      color: @color-text-inverse;
    }

    &.negative {
      background: fade(@color-success, 20%);
      color: @color-text-inverse;
    }

    &.neutral {
      background: fade(@color-text-tertiary, 20%);
      color: @color-text-inverse;
    }

    .change-icon {
      font-size: @font-size-base;
    }
  }

  .change-label {
    font-size: @font-size-xs;
    color: @color-text-inverse;
  }
}
</style>
