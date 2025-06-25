<script setup lang="ts">
import type { WeightUnit, WeightStats } from "../../../types/weight";

interface Props {
  currentWeight: number;
  targetWeight: number;
  unit: WeightUnit;
  stats: WeightStats;
}

defineProps<Props>();
</script>

<template>
  <div class="weight-stats">
    <div class="stats-grid">
      <div class="stat-item main">
        <div class="stat-value">{{ currentWeight }}{{ unit }}</div>
        <div class="stat-label">当前体重</div>
      </div>

      <div class="stat-item">
        <div class="stat-value">{{ targetWeight }}{{ unit }}</div>
        <div class="stat-label">目标体重</div>
      </div>

      <div class="stat-item">
        <div class="stat-value success">
          -{{ stats.totalLoss.toFixed(1) }}{{ unit }}
        </div>
        <div class="stat-label">总减重</div>
      </div>

      <div class="stat-item">
        <div class="stat-value">{{ stats.daysToGoal }}天</div>
        <div class="stat-label">预计达标</div>
      </div>
    </div>

    <div class="progress-section">
      <div class="progress-info">
        <span class="progress-text">减重进度</span>
        <span class="progress-percentage">
          {{
            (
              (stats.totalLoss /
                (currentWeight + stats.totalLoss - targetWeight)) *
              100
            ).toFixed(1)
          }}%
        </span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{
            width:
              (stats.totalLoss /
                (currentWeight + stats.totalLoss - targetWeight)) *
                100 +
              '%',
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
// 使用全局主题变量

.weight-stats {
  background: @color-bg-primary;
  border-radius: @border-radius-md;
  padding: @spacing-md;
  box-shadow: @shadow-none;

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: @spacing-md;
    margin-bottom: @spacing-md;

    .stat-item {
      text-align: center;

      &.main {
        grid-column: 1 / -1;

        .stat-value {
          font-size: @font-size-lg;
          font-weight: @font-weight-semibold;
          color: @color-primary;
        }
      }

      .stat-value {
        font-size: @font-size-lg;
        font-weight: @font-weight-semibold;
        color: @color-text-primary;
        margin-bottom: @spacing-xs;

        &.success {
          color: @color-success;
        }
      }

      .stat-label {
        font-size: @font-size-sm;
        color: @color-text-secondary;
      }
    }
  }

  .progress-section {
    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .progress-text {
        font-size: @font-size-sm;
        color: @color-text-secondary;
      }

      .progress-percentage {
        font-size: @font-size-sm;
        font-weight: @font-weight-semibold;
        color: @color-success;
      }
    }

    .progress-bar {
      height: @spacing-sm;
      background: @color-bg-secondary;
      border-radius: @border-radius-sm;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: @color-success;
        border-radius: @border-radius-sm;
        transition: width 0.3s ease;
      }
    }
  }
}
</style>
