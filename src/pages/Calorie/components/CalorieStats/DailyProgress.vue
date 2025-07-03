<template>
  <div class="daily-progress">
    <div class="progress-header">
      <h4>今日热量摄入</h4>
      <div class="progress-numbers">
        <span class="consumed">{{ consumedCalories }}</span>
        <span class="separator">/</span>
        <span class="goal">{{ goalCalories }}</span>
        <span class="unit">kcal</span>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-bar-container">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :class="progressClass"
          :style="{ width: `${Math.min(progressPercentage, 100)}%` }"
        ></div>
      </div>
      <div class="progress-percentage">
        {{ Math.round(progressPercentage) }}%
      </div>
    </div>

    <!-- 剩余热量 -->
    <div class="remaining-info">
      <div v-if="remainingCalories > 0" class="remaining-positive">
        <span class="remaining-icon">✨</span>
        <span class="remaining-text"
          >还可以摄入 {{ remainingCalories }} kcal</span
        >
      </div>
      <div v-else-if="remainingCalories < 0" class="remaining-negative">
        <span class="remaining-icon">⚠️</span>
        <span class="remaining-text"
          >已超出目标 {{ Math.abs(remainingCalories) }} kcal</span
        >
      </div>
      <div v-else class="remaining-perfect">
        <span class="remaining-icon">🎯</span>
        <span class="remaining-text">完美达到目标！</span>
      </div>
    </div>

    <!-- 热量来源分布 -->
    <div v-if="todayAnalyses.length > 0" class="calorie-sources">
      <h5>今日记录</h5>
      <div class="sources-list">
        <div
          v-for="(analysis, index) in todayAnalyses.slice(0, 3)"
          :key="analysis.id"
          class="source-item"
        >
          <div class="source-time">
            {{ formatTime(analysis.timestamp) }}
          </div>
          <div class="source-description">
            {{
              analysis.originalInput.length > 30
                ? analysis.originalInput.substring(0, 30) + "..."
                : analysis.originalInput
            }}
          </div>
          <div class="source-calories">{{ analysis.totalCalories }}kcal</div>
        </div>
        <div v-if="todayAnalyses.length > 3" class="more-records">
          +{{ todayAnalyses.length - 3 }} 条记录
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useWeightStore } from "../../../../stores/weight";

const weightStore = useWeightStore();

// 计算属性
const consumedCalories = computed(() => {
  return weightStore.todayTotalCalories;
});

const goalCalories = computed(() => {
  return weightStore.dailyCalorieGoal;
});

const remainingCalories = computed(() => {
  return goalCalories.value - consumedCalories.value;
});

const progressPercentage = computed(() => {
  if (goalCalories.value === 0) return 0;
  return (consumedCalories.value / goalCalories.value) * 100;
});

const progressClass = computed(() => {
  const percentage = progressPercentage.value;
  if (percentage <= 50) return "low";
  if (percentage <= 80) return "medium";
  if (percentage <= 100) return "high";
  return "over";
});

const todayAnalyses = computed(() => {
  return weightStore.todayAnalyses;
});

// 工具方法
const formatTime = (timestamp: Date) => {
  return new Date(timestamp).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped lang="less">
.daily-progress {
  margin-bottom: @spacing-lg;

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: @spacing-sm;

    h4 {
      font-size: @font-size-base;
      font-weight: @font-weight-semibold;
      color: @color-text-primary;
      margin: 0;
    }

    .progress-numbers {
      display: flex;
      align-items: baseline;
      gap: 4px;

      .consumed {
        font-size: @font-size-lg;
        font-weight: @font-weight-bold;
        color: @color-primary;
      }

      .separator {
        font-size: @font-size-base;
        color: @color-text-secondary;
      }

      .goal {
        font-size: @font-size-base;
        font-weight: @font-weight-semibold;
        color: @color-text-secondary;
      }

      .unit {
        font-size: @font-size-sm;
        color: @color-text-tertiary;
      }
    }
  }

  .progress-bar-container {
    display: flex;
    align-items: center;
    gap: @spacing-sm;
    margin-bottom: @spacing-sm;

    .progress-bar {
      flex: 1;
      height: 12px;
      background: @color-border-light;
      border-radius: 6px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        border-radius: 6px;
        transition: all 0.3s ease;

        &.low {
          background: linear-gradient(90deg, #4caf50, #66bb6a);
        }

        &.medium {
          background: linear-gradient(90deg, #2196f3, #42a5f5);
        }

        &.high {
          background: linear-gradient(90deg, #ff9800, #ffb74d);
        }

        &.over {
          background: linear-gradient(90deg, #f44336, #ef5350);
        }
      }
    }

    .progress-percentage {
      font-size: @font-size-sm;
      font-weight: @font-weight-semibold;
      color: @color-text-secondary;
      min-width: 40px;
      text-align: right;
    }
  }

  .remaining-info {
    text-align: center;
    margin-bottom: @spacing-md;

    .remaining-positive {
      color: @color-success;
    }

    .remaining-negative {
      color: @color-danger;
    }

    .remaining-perfect {
      color: @color-primary;
    }

    .remaining-icon {
      margin-right: @spacing-xs;
    }

    .remaining-text {
      font-size: @font-size-sm;
      font-weight: @font-weight-semibold;
    }
  }

  .calorie-sources {
    border-top: 1px solid @color-border-light;
    padding-top: @spacing-sm;

    h5 {
      font-size: @font-size-sm;
      font-weight: @font-weight-semibold;
      color: @color-text-primary;
      margin: 0 0 @spacing-sm 0;
    }

    .sources-list {
      .source-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: @spacing-xs 0;
        border-bottom: 1px solid lighten(@color-border-light, 50%);

        &:last-child {
          border-bottom: none;
        }

        .source-time {
          font-size: @font-size-xs;
          color: @color-text-tertiary;
          min-width: 50px;
        }

        .source-description {
          flex: 1;
          font-size: @font-size-xs;
          color: @color-text-secondary;
          margin: 0 @spacing-sm;
        }

        .source-calories {
          font-size: @font-size-xs;
          font-weight: @font-weight-semibold;
          color: @color-primary;
          min-width: 60px;
          text-align: right;
        }
      }

      .more-records {
        text-align: center;
        padding: @spacing-xs 0;
        font-size: @font-size-xs;
        color: @color-text-tertiary;
        font-style: italic;
      }
    }
  }
}
</style>
