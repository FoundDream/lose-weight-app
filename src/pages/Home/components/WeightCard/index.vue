<template>
  <div class="weight-card">
    <div class="weight-card-progress">
      <div class="weight-card-background-left" />
      <div class="weight-card-background-right" />
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
    <div class="weight-card-footer">
      <div class="weight-card-footer-item">
        Powered by ChatGPT
        <img :src="logo" alt="logo" class="weight-card-footer-item-logo" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import logo from "@/assets/openai.svg";

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
.weight-card-background-left {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 16px;
  height: 16px;
  background: #fff;
  z-index: 1;
}

.weight-card-background-right {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  background: #fff;
  z-index: 1;
}

.weight-card-progress {
  position: relative;
  z-index: 10;
  display: flex;
  overflow: hidden;
  min-height: 100px;
  background: @color-primary-light;
  border-radius: 16px 16px 0 0;
}

.weight-section {
  border-radius: 16px;
  position: relative;
  z-index: 10;
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
    background: @color-primary-light;

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

.weight-card-footer {
  z-index: 10;
  height: 40px;
  background: #fff;
  border-radius: 0 0 16px 16px;

  .weight-card-footer-item {
    font-size: 12px;
    color: @color-text-tertiary;
    text-align: center;
    line-height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;

    .weight-card-footer-item-logo {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
