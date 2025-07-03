<template>
  <div class="nutrition-chart">
    <h4>营养分布</h4>

    <div v-if="hasNutritionData" class="chart-container">
      <!-- 简化版环形图 -->
      <div class="pie-chart">
        <div class="pie-segment protein" :style="proteinStyle"></div>
        <div class="pie-segment carbs" :style="carbsStyle"></div>
        <div class="pie-segment fat" :style="fatStyle"></div>
        <div class="pie-center">
          <div class="center-text">
            <span class="center-number">{{ Math.round(totalMacros) }}g</span>
            <span class="center-label">营养素</span>
          </div>
        </div>
      </div>

      <!-- 营养素图例 -->
      <div class="nutrition-legend">
        <div class="legend-item">
          <div class="legend-color protein-color"></div>
          <div class="legend-info">
            <span class="legend-name">蛋白质</span>
            <span class="legend-value">{{ totalNutrition.protein }}g</span>
            <span class="legend-percentage">({{ proteinPercentage }}%)</span>
          </div>
        </div>
        <div class="legend-item">
          <div class="legend-color carbs-color"></div>
          <div class="legend-info">
            <span class="legend-name">碳水化合物</span>
            <span class="legend-value">{{ totalNutrition.carbs }}g</span>
            <span class="legend-percentage">({{ carbsPercentage }}%)</span>
          </div>
        </div>
        <div class="legend-item">
          <div class="legend-color fat-color"></div>
          <div class="legend-info">
            <span class="legend-name">脂肪</span>
            <span class="legend-value">{{ totalNutrition.fat }}g</span>
            <span class="legend-percentage">({{ fatPercentage }}%)</span>
          </div>
        </div>
      </div>

      <!-- 额外营养信息 -->
      <div class="extra-nutrition">
        <div class="extra-item">
          <span class="extra-label">膳食纤维</span>
          <span class="extra-value">{{ totalNutrition.fiber }}g</span>
        </div>
        <div class="extra-item">
          <span class="extra-label">糖分</span>
          <span class="extra-value">{{ totalNutrition.sugar }}g</span>
        </div>
      </div>
    </div>

    <div v-else class="no-data">
      <div class="no-data-icon">📊</div>
      <div class="no-data-text">暂无营养数据</div>
      <div class="no-data-subtitle">添加食物记录后即可查看营养分布</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useWeightStore } from "../../../../stores/weight";
import type { NutritionInfo } from "../../../../types/calorie";

const weightStore = useWeightStore();

// 计算今日总营养
const totalNutrition = computed((): NutritionInfo => {
  const todayAnalyses = weightStore.todayAnalyses;

  return todayAnalyses.reduce(
    (total, analysis) => ({
      protein: total.protein + analysis.nutrition.protein,
      carbs: total.carbs + analysis.nutrition.carbs,
      fat: total.fat + analysis.nutrition.fat,
      fiber: total.fiber + analysis.nutrition.fiber,
      sugar: total.sugar + analysis.nutrition.sugar,
    }),
    { protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
  );
});

// 计算总宏量营养素
const totalMacros = computed(() => {
  const nutrition = totalNutrition.value;
  return nutrition.protein + nutrition.carbs + nutrition.fat;
});

// 是否有营养数据
const hasNutritionData = computed(() => {
  return totalMacros.value > 0;
});

// 百分比计算
const proteinPercentage = computed(() => {
  if (totalMacros.value === 0) return 0;
  return Math.round((totalNutrition.value.protein / totalMacros.value) * 100);
});

const carbsPercentage = computed(() => {
  if (totalMacros.value === 0) return 0;
  return Math.round((totalNutrition.value.carbs / totalMacros.value) * 100);
});

const fatPercentage = computed(() => {
  if (totalMacros.value === 0) return 0;
  return Math.round((totalNutrition.value.fat / totalMacros.value) * 100);
});

// 环形图样式计算
const proteinStyle = computed(() => {
  const percentage = proteinPercentage.value;
  const angle = (percentage / 100) * 360;
  return {
    transform: `rotate(0deg)`,
    clipPath: `conic-gradient(from 0deg, transparent 0deg, transparent ${angle}deg, transparent ${angle}deg)`,
  };
});

const carbsStyle = computed(() => {
  const proteinAngle = (proteinPercentage.value / 100) * 360;
  const carbsAngle = (carbsPercentage.value / 100) * 360;
  return {
    transform: `rotate(${proteinAngle}deg)`,
    clipPath: `conic-gradient(from 0deg, transparent 0deg, transparent ${carbsAngle}deg, transparent ${carbsAngle}deg)`,
  };
});

const fatStyle = computed(() => {
  const startAngle =
    ((proteinPercentage.value + carbsPercentage.value) / 100) * 360;
  const fatAngle = (fatPercentage.value / 100) * 360;
  return {
    transform: `rotate(${startAngle}deg)`,
    clipPath: `conic-gradient(from 0deg, transparent 0deg, transparent ${fatAngle}deg, transparent ${fatAngle}deg)`,
  };
});
</script>

<style scoped lang="less">
.nutrition-chart {
  h4 {
    font-size: @font-size-base;
    font-weight: @font-weight-semibold;
    color: @color-text-primary;
    margin: 0 0 @spacing-md 0;
  }

  .chart-container {
    .pie-chart {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto @spacing-md;
      border-radius: 50%;
      background: conic-gradient(
        from 0deg,
        #4caf50 0deg,
        #4caf50 var(--protein-angle, 120deg),
        #2196f3 var(--protein-angle, 120deg),
        #2196f3 var(--carbs-end, 240deg),
        #ff9800 var(--carbs-end, 240deg),
        #ff9800 360deg
      );

      .pie-center {
        position: absolute;
        top: 20px;
        left: 20px;
        width: 80px;
        height: 80px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        .center-text {
          text-align: center;

          .center-number {
            display: block;
            font-size: 18px;
            font-weight: @font-weight-bold;
            color: @color-text-primary;
            line-height: 1;
          }

          .center-label {
            display: block;
            font-size: @font-size-xs;
            color: @color-text-secondary;
            line-height: 1.2;
          }
        }
      }
    }

    .nutrition-legend {
      margin-bottom: @spacing-md;

      .legend-item {
        display: flex;
        align-items: center;
        gap: @spacing-sm;
        margin-bottom: @spacing-xs;

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;

          &.protein-color {
            background: #4caf50;
          }

          &.carbs-color {
            background: #2196f3;
          }

          &.fat-color {
            background: #ff9800;
          }
        }

        .legend-info {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .legend-name {
            font-size: @font-size-sm;
            color: @color-text-primary;
          }

          .legend-value {
            font-size: @font-size-sm;
            font-weight: @font-weight-semibold;
            color: @color-text-primary;
          }

          .legend-percentage {
            font-size: @font-size-xs;
            color: @color-text-secondary;
          }
        }
      }
    }

    .extra-nutrition {
      padding-top: @spacing-sm;
      border-top: 1px solid @color-border-light;
      display: flex;
      justify-content: space-between;

      .extra-item {
        text-align: center;

        .extra-label {
          display: block;
          font-size: @font-size-xs;
          color: @color-text-secondary;
          margin-bottom: 2px;
        }

        .extra-value {
          display: block;
          font-size: @font-size-sm;
          font-weight: @font-weight-semibold;
          color: @color-text-primary;
        }
      }
    }
  }

  .no-data {
    text-align: center;
    padding: @spacing-lg 0;

    .no-data-icon {
      font-size: 32px;
      margin-bottom: @spacing-sm;
    }

    .no-data-text {
      font-size: @font-size-base;
      color: @color-text-secondary;
      margin-bottom: @spacing-xs;
    }

    .no-data-subtitle {
      font-size: @font-size-sm;
      color: @color-text-tertiary;
    }
  }
}

// 动态CSS变量设置（通过内联样式实现）
.pie-chart {
  --protein-angle: v-bind('proteinPercentage + "%"');
  --carbs-end: v-bind('(proteinPercentage + carbsPercentage) + "%"');
}
</style>
