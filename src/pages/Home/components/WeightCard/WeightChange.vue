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
    gap: 4px;
    margin-bottom: 4px;
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 14px;

    &.positive {
      background: rgba(239, 68, 68, 0.1);
      color: #fff;
    }

    &.negative {
      background: rgba(16, 185, 129, 0.1);
      color: #fff;
    }

    &.neutral {
      background: rgba(148, 163, 184, 0.1);
      color: #fff;
    }

    .change-icon {
      font-size: 16px;
    }
  }

  .change-label {
    font-size: 12px;
    color: #fff;
  }
}
</style>
