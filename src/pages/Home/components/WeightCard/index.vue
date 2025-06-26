<template>
  <div class="weight-card-progress">
    <!-- 左侧蓝色区域 - 还需减重 -->
    <div
      class="weight-section current"
      :style="{ flex: progressGradient.completed }"
    >
      <div class="weight-content">
        <div class="weight-value">
          <span class="integer-part">{{ Math.floor(alreadyLose) }}</span>
          <span class="decimal-part"
            >.{{ (alreadyLose % 1).toFixed(2).slice(2) }}</span
          >
        </div>
        <div class="weight-label">已减重kg</div>
      </div>
    </div>

    <!-- 右侧灰色区域 - 已减重 -->
    <div
      class="weight-section target"
      :style="{ flex: progressGradient.remaining }"
    >
      <div class="weight-content">
        <div class="weight-value">
          {{ needToLose.toFixed(2) }}
        </div>
        <div class="weight-label">还需减重kg</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface WeightCardProps {
  currentWeight: number;
  targetWeight: number;
  originalWeight: number;
  unit: string;
}

const props = defineProps<WeightCardProps>();

const needToLose = computed(() => {
  return props.currentWeight - props.targetWeight;
});

const alreadyLose = computed(() => {
  return props.originalWeight - props.currentWeight;
});

// 计算减重进度梯度 (0%, 25%, 50%, 75%, 100%)
const progressGradient = computed(() => {
  const totalWeightToLose = props.originalWeight - props.targetWeight;
  if (totalWeightToLose <= 0) return { completed: 0, remaining: 100 };

  const alreadyLost = props.originalWeight - props.currentWeight;
  const progressPercentage = Math.max(
    0,
    Math.min(100, (alreadyLost / totalWeightToLose) * 100)
  );

  // 将进度映射到梯度级别 (0, 25, 50, 75, 100)
  let gradientLevel;
  if (progressPercentage >= 87.5) {
    gradientLevel = 100;
  } else if (progressPercentage >= 62.5) {
    gradientLevel = 75;
  } else if (progressPercentage >= 37.5) {
    gradientLevel = 50;
  } else if (progressPercentage >= 12.5) {
    gradientLevel = 25;
  } else {
    gradientLevel = 0;
  }

  return {
    completed: gradientLevel,
    remaining: 100 - gradientLevel,
  };
});
</script>

<style scoped lang="less">
.weight-card-progress {
  display: flex;
  border-radius: 16px;
  overflow: hidden;
  min-height: 100px;
  box-shadow: 0 4px 20px rgba(79, 124, 255, 0.15);
  background: @color-primary-light;
}

.weight-section {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 20px 18px;
  transition: all 0.5s ease;
  min-width: 20px; // 最小宽度，确保即使flex为0也有一定显示

  &.current {
    background: @color-primary;
    color: white;
    border-radius: 16px;

    .weight-content {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .weight-value {
        line-height: 1;
        margin-bottom: 4px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui,
          sans-serif;
        display: flex;
        align-items: baseline;

        .integer-part {
          font-size: 24px;
          font-weight: 700;
        }

        .decimal-part {
          font-size: 16px;
          font-weight: 600;
          margin-left: 1px;
        }
      }

      .weight-label {
        font-size: 10px;
        opacity: 0.85;
        font-weight: 500;
      }
    }
  }

  &.target {
    color: @color-text-tertiary;

    .weight-content {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .weight-value {
        font-size: 16px;
        font-weight: 600;
        line-height: 1;
        margin-bottom: 4px;
        color: @color-text-tertiary;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui,
          sans-serif;
      }

      .weight-label {
        font-size: 10px;
        font-weight: 500;
        color: @color-text-tertiary;
      }
    }
  }
}
</style>
