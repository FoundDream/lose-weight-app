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
@primary-color: #6366f1;
@success-color: #10b981;
@bg-primary: #ffffff;
@bg-secondary: #f8fafc;
@text-primary: #1e293b;
@text-secondary: #64748b;
@text-light: #94a3b8;
@shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
@border-radius: 16px;

.weight-stats {
  background: @bg-primary;
  border-radius: @border-radius;
  padding: 24px;
  box-shadow: @shadow-md;

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;

    .stat-item {
      text-align: center;

      &.main {
        grid-column: 1 / -1;

        .stat-value {
          font-size: 36px;
          font-weight: 700;
          color: @primary-color;
        }
      }

      .stat-value {
        font-size: 24px;
        font-weight: 600;
        color: @text-primary;
        margin-bottom: 4px;

        &.success {
          color: @success-color;
        }
      }

      .stat-label {
        font-size: 14px;
        color: @text-secondary;
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
        font-size: 14px;
        color: @text-secondary;
      }

      .progress-percentage {
        font-size: 14px;
        font-weight: 600;
        color: @success-color;
      }
    }

    .progress-bar {
      height: 8px;
      background: @bg-secondary;
      border-radius: 4px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: @success-color;
        border-radius: 4px;
        transition: width 0.3s ease;
      }
    }
  }
}
</style>
