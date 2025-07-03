<template>
  <div class="calorie-stats">
    <div class="stats-card">
      <div class="stats-header">
        <h3>今日概览</h3>
        <span class="date-info">{{ todayDate }}</span>
      </div>

      <!-- 今日进度 -->
      <DailyProgress />

      <!-- 营养分布 -->
      <NutritionChart />

      <!-- 周趋势（简化版） -->
      <div class="weekly-trend">
        <h4>本周趋势</h4>
        <div class="trend-summary">
          <div class="trend-item">
            <span class="trend-label">日均摄入</span>
            <span class="trend-value">{{ weeklyStats.average }}kcal</span>
          </div>
          <div class="trend-item">
            <span class="trend-label">总摄入</span>
            <span class="trend-value">{{ weeklyStats.total }}kcal</span>
          </div>
          <div class="trend-item">
            <span class="trend-label">记录天数</span>
            <span class="trend-value">{{ weeklyStats.days }}天</span>
          </div>
        </div>
      </div>

      <!-- 快速统计 -->
      <div class="quick-stats">
        <div class="stat-item">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <div class="stat-value">{{ calorieDeficit }}</div>
            <div class="stat-label">热量缺口</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <div class="stat-value">{{ todayRecords }}</div>
            <div class="stat-label">今日记录</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">🔥</div>
          <div class="stat-info">
            <div class="stat-value">{{ completionRate }}%</div>
            <div class="stat-label">目标完成</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useWeightStore } from "../../../../stores/weight";
import DailyProgress from "./DailyProgress.vue";
import NutritionChart from "./NutritionChart.vue";

const weightStore = useWeightStore();

// 计算属性
const todayDate = computed(() => {
  return new Date().toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
});

const todayRecords = computed(() => {
  return weightStore.todayAnalyses.length;
});

const calorieDeficit = computed(() => {
  const deficit = weightStore.calorieDeficit;
  return deficit > 0 ? `+${Math.round(deficit)}` : Math.round(deficit);
});

const completionRate = computed(() => {
  const consumed = weightStore.todayTotalCalories;
  const goal = weightStore.dailyCalorieGoal;
  if (goal === 0) return 0;
  return Math.round((consumed / goal) * 100);
});

const weeklyStats = computed(() => {
  const history = weightStore.analysisHistory;
  const weekData = history.thisWeek;

  if (weekData.length === 0) {
    return {
      average: 0,
      total: 0,
      days: 0,
    };
  }

  const totalCalories = weekData.reduce(
    (sum, analysis) => sum + analysis.totalCalories,
    0
  );
  const uniqueDays = new Set(
    weekData.map((analysis) => new Date(analysis.timestamp).toDateString())
  ).size;

  return {
    average: Math.round(totalCalories / Math.max(uniqueDays, 1)),
    total: totalCalories,
    days: uniqueDays,
  };
});
</script>

<style scoped lang="less">
.calorie-stats {
  .stats-card {
    background: #ffffff;
    border-radius: 16px;
    padding: @spacing-lg;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .stats-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: @spacing-lg;

      h3 {
        font-size: @font-size-lg;
        font-weight: @font-weight-semibold;
        color: @color-text-primary;
        margin: 0;
      }

      .date-info {
        font-size: @font-size-sm;
        color: @color-text-secondary;
      }
    }

    .weekly-trend {
      margin: @spacing-lg 0;
      padding: @spacing-md;
      background: @color-bg-secondary;
      border-radius: 12px;

      h4 {
        font-size: @font-size-base;
        font-weight: @font-weight-semibold;
        color: @color-text-primary;
        margin: 0 0 @spacing-sm 0;
      }

      .trend-summary {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: @spacing-sm;

        .trend-item {
          text-align: center;

          .trend-label {
            display: block;
            font-size: @font-size-xs;
            color: @color-text-secondary;
            margin-bottom: 4px;
          }

          .trend-value {
            display: block;
            font-size: @font-size-sm;
            font-weight: @font-weight-semibold;
            color: @color-text-primary;
          }
        }
      }
    }

    .quick-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: @spacing-sm;
      margin-top: @spacing-lg;

      .stat-item {
        display: flex;
        align-items: center;
        gap: @spacing-sm;
        padding: @spacing-sm;
        background: linear-gradient(
          135deg,
          lighten(@color-primary, 45%),
          lighten(@color-primary, 40%)
        );
        border-radius: 12px;

        .stat-icon {
          font-size: 20px;
        }

        .stat-info {
          .stat-value {
            display: block;
            font-size: @font-size-sm;
            font-weight: @font-weight-bold;
            color: @color-text-primary;
            line-height: 1.2;
          }

          .stat-label {
            display: block;
            font-size: @font-size-xs;
            color: @color-text-secondary;
            line-height: 1.2;
          }
        }
      }
    }
  }
}
</style>
