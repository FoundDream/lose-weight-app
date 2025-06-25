<template>
  <div class="health-metrics">
    <div class="card-header">
      <h3>健康指标</h3>
      <span class="update-time">{{ updateTimeText }}</span>
    </div>

    <div class="metrics-grid">
      <!-- BMI -->
      <div class="metric-item bmi">
        <div class="metric-value" :class="bmiColorClass">{{ bmiValue }}</div>
        <div class="metric-label">BMI</div>
        <div class="metric-status" :class="bmiColorClass">
          {{ bmiCategory }}
        </div>
      </div>

      <!-- 基础代谢率 -->
      <div class="metric-item">
        <div class="metric-value">{{ bmrValue }}</div>
        <div class="metric-label">基础代谢</div>
        <div class="metric-unit">kcal/天</div>
      </div>

      <!-- 总日消耗 -->
      <div class="metric-item">
        <div class="metric-value">{{ tdeeValue }}</div>
        <div class="metric-label">每日消耗</div>
        <div class="metric-unit">kcal/天</div>
      </div>

      <!-- 当前体重 -->
      <div class="metric-item">
        <div class="metric-value">{{ currentWeight }}</div>
        <div class="metric-label">当前体重</div>
        <div class="metric-unit">kg</div>
      </div>
    </div>

    <!-- 理想体重范围 -->
    <div class="ideal-weight-section">
      <h4>理想体重范围</h4>
      <div class="weight-range">
        <div class="range-bar">
          <div
            class="range-fill"
            :style="{
              left: rangePosition.left + '%',
              width: rangePosition.width + '%',
            }"
          ></div>
          <div
            class="current-marker"
            :style="{ left: currentPosition + '%' }"
          ></div>
        </div>
        <div class="range-labels">
          <span class="range-min">{{ idealWeightMin }}kg</span>
          <span class="range-current">{{ currentWeight }}kg</span>
          <span class="range-max">{{ idealWeightMax }}kg</span>
        </div>
      </div>
      <p class="range-note">
        <span v-if="isHealthyWeight" class="healthy"
          >✅ 您的体重在健康范围内</span
        >
        <span
          v-else-if="currentWeight < Number(idealWeightMin)"
          class="underweight"
          >⚠️ 体重偏轻，建议适当增重</span
        >
        <span v-else class="overweight">⚠️ 建议将体重控制在理想范围内</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "../../../stores/user";
import { useWeightStore } from "../../../stores/weight";

const userStore = useUserStore();
const weightStore = useWeightStore();

const healthMetrics = computed(() => userStore.healthMetrics);
const bmiCategory = computed(() => userStore.bmiCategory);
const isHealthyWeight = computed(() => userStore.isHealthyWeight);
const currentWeight = computed(() => weightStore.currentWeight);

// BMI相关计算
const bmiValue = computed(() => {
  return healthMetrics.value ? healthMetrics.value.bmi.toFixed(1) : "--";
});

const bmiColorClass = computed(() => {
  if (!healthMetrics.value) return "";
  const bmi = healthMetrics.value.bmi;
  if (bmi < 18.5) return "underweight";
  if (bmi < 24) return "normal";
  if (bmi < 28) return "overweight";
  return "obese";
});

// 代谢相关
const bmrValue = computed(() => {
  return healthMetrics.value ? Math.round(healthMetrics.value.bmr) : "--";
});

const tdeeValue = computed(() => {
  return healthMetrics.value ? Math.round(healthMetrics.value.tdee) : "--";
});

// 理想体重范围
const idealWeightMin = computed(() => {
  return healthMetrics.value
    ? healthMetrics.value.idealWeightRange.min.toFixed(1)
    : "--";
});

const idealWeightMax = computed(() => {
  return healthMetrics.value
    ? healthMetrics.value.idealWeightRange.max.toFixed(1)
    : "--";
});

// 体重范围可视化
const rangePosition = computed(() => {
  if (!healthMetrics.value) return { left: 0, width: 0 };

  const min = healthMetrics.value.idealWeightRange.min;
  const max = healthMetrics.value.idealWeightRange.max;
  const total = max - min + 10; // 留出两边的空间

  return {
    left: 10,
    width: ((max - min) / total) * 80, // 80%的宽度用于范围
  };
});

const currentPosition = computed(() => {
  if (!healthMetrics.value) return 50;

  const min = healthMetrics.value.idealWeightRange.min;
  const max = healthMetrics.value.idealWeightRange.max;
  const current = currentWeight.value;
  const total = max - min + 10;

  const position = ((current - min + 5) / total) * 100;
  return Math.max(5, Math.min(95, position)); // 限制在5%-95%之间
});

const updateTimeText = computed(() => {
  if (!userStore.profile) return "";
  return userStore.profile.updatedAt.toLocaleString();
});
</script>

<style scoped lang="less">
@primary-color: #6366f1;
@bg-primary: #ffffff;
@bg-secondary: #f8fafc;
@text-primary: #1e293b;
@text-secondary: #64748b;
@text-light: #94a3b8;
@border-color: #e2e8f0;
@success-color: #10b981;
@warning-color: #f59e0b;
@error-color: #ef4444;
@shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
@border-radius: 16px;

.health-metrics {
  background: @bg-primary;
  border-radius: @border-radius;
  padding: 20px;
  box-shadow: @shadow-md;

  .card-header {
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

    .update-time {
      font-size: 12px;
      color: @text-light;
    }
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;

    .metric-item {
      text-align: center;
      padding: 16px;
      background: @bg-secondary;
      border-radius: 12px;

      &.bmi {
        grid-column: 1 / -1;
      }

      .metric-value {
        font-size: 24px;
        font-weight: 700;
        color: @text-primary;
        margin-bottom: 4px;

        &.underweight {
          color: @warning-color;
        }

        &.normal {
          color: @success-color;
        }

        &.overweight {
          color: @warning-color;
        }

        &.obese {
          color: @error-color;
        }
      }

      .metric-label {
        font-size: 14px;
        color: @text-secondary;
        margin-bottom: 2px;
      }

      .metric-unit {
        font-size: 12px;
        color: @text-light;
      }

      .metric-status {
        font-size: 12px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 8px;
        display: inline-block;

        &.underweight {
          background: rgba(245, 158, 11, 0.1);
          color: @warning-color;
        }

        &.normal {
          background: rgba(16, 185, 129, 0.1);
          color: @success-color;
        }

        &.overweight {
          background: rgba(245, 158, 11, 0.1);
          color: @warning-color;
        }

        &.obese {
          background: rgba(239, 68, 68, 0.1);
          color: @error-color;
        }
      }
    }
  }

  .ideal-weight-section {
    h4 {
      font-size: 16px;
      font-weight: 600;
      color: @text-primary;
      margin: 0 0 16px 0;
    }

    .weight-range {
      .range-bar {
        position: relative;
        height: 8px;
        background: #e5e7eb;
        border-radius: 4px;
        margin-bottom: 12px;

        .range-fill {
          position: absolute;
          height: 100%;
          background: @success-color;
          border-radius: 4px;
        }

        .current-marker {
          position: absolute;
          top: -4px;
          width: 4px;
          height: 16px;
          background: @primary-color;
          border-radius: 2px;
          transform: translateX(-2px);
        }
      }

      .range-labels {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: @text-secondary;

        .range-current {
          color: @primary-color;
          font-weight: 600;
        }
      }
    }

    .range-note {
      margin: 12px 0 0 0;
      font-size: 14px;
      text-align: center;

      .healthy {
        color: @success-color;
      }

      .underweight,
      .overweight {
        color: @warning-color;
      }
    }
  }
}
</style>
