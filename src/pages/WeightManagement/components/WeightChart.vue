<script setup lang="ts">
import type { WeightRecord, WeightUnit } from "../../../types/weight";

interface Props {
  records: WeightRecord[];
  unit: WeightUnit;
}

defineProps<Props>();
</script>

<template>
  <div class="weight-chart">
    <div class="chart-header">
      <h3>📈 体重趋势</h3>
      <span class="chart-period">最近30天</span>
    </div>

    <div class="chart-container">
      <div class="chart-placeholder">
        <div class="chart-icon">📊</div>
        <p>图表功能开发中</p>
        <small>将展示体重变化趋势线</small>
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
@border-color: #e2e8f0;
@shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
@border-radius: 16px;

.weight-chart {
  background: @bg-primary;
  border-radius: @border-radius;
  padding: 20px;
  box-shadow: @shadow-md;

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: @text-primary;
      margin: 0;
    }

    .chart-period {
      font-size: 14px;
      color: @text-secondary;
      background: @bg-secondary;
      padding: 4px 12px;
      border-radius: 12px;
    }
  }

  .chart-container {
    .chart-placeholder {
      height: 180px;
      background: @bg-secondary;
      border-radius: @border-radius;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 2px dashed @border-color;
      position: relative;

      .chart-icon {
        font-size: 32px;
        margin-bottom: 8px;
      }

      p {
        margin: 0 0 4px 0;
        color: @text-secondary;
        font-weight: 500;
      }

      small {
        color: @text-light;
        margin-bottom: 16px;
      }

      .sample-data {
        display: flex;
        gap: 12px;
        margin-top: 16px;

        .data-point {
          text-align: center;
          padding: 8px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

          .point-date {
            font-size: 12px;
            color: @text-light;
            margin-bottom: 4px;
          }

          .point-weight {
            font-size: 14px;
            font-weight: 600;
            color: @primary-color;
          }
        }
      }
    }
  }
}
</style>
