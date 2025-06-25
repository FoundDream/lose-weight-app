<script setup lang="ts">
import { computed, ref } from "vue";
import WeightCard from "./components/WeightCard/index.vue";
import { useWeightStore } from "../../stores/weight";

const weightStore = useWeightStore();

// 从store获取数据
const currentWeight = computed(() => weightStore.currentWeight);
const targetWeight = computed(() => weightStore.targetWeight);
const yesterdayWeight = computed(() => weightStore.yesterdayWeight);
const weightUnit = computed(() => weightStore.unit);
const isEditable = computed(() => weightStore.isEditable);

// 处理目标体重更新
const handleTargetWeightUpdate = (newTargetWeight: number) => {
  weightStore.updateTargetWeight(newTargetWeight);
};

// 模拟其他数据（后续可以移到store）
const foodInput = ref("");
const dailyCalories = ref(1450);
const burnedCalories = ref(2200);
const calorieDeficit = computed(
  () => burnedCalories.value - dailyCalories.value
);

const handleFoodInput = () => {
  // AI热量计算逻辑预留
  console.log("分析食物:", foodInput.value);
};
</script>

<template>
  <div class="home-page">
    <!-- 头部 -->
    <div class="app-header">
      <div class="app-header-left">减肥数据分析</div>
      <div class="app-header-right">2025-01-25</div>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <!-- 体重卡片 -->
      <WeightCard
        :current-weight="currentWeight"
        :target-weight="targetWeight"
        :yesterday-weight="yesterdayWeight"
        :unit="weightUnit"
        :editable="isEditable"
        @update:target-weight="handleTargetWeightUpdate"
      />

      <!-- 图表卡片 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>体重变化趋势</h3>
          <span class="chart-period">最近7天</span>
        </div>
        <div class="chart-placeholder">
          <div class="chart-icon">📈</div>
          <p>图表组件预留位置</p>
          <small>将展示体重变化曲线</small>
        </div>
      </div>

      <!-- AI热量计算卡片 -->
      <div class="ai-card">
        <div class="ai-header">
          <div class="ai-title">
            <span class="ai-icon">🤖</span>
            <h3>AI热量助手</h3>
          </div>
          <div class="calorie-summary">
            <span
              class="deficit"
              :class="{
                positive: calorieDeficit > 0,
                negative: calorieDeficit <= 0,
              }"
            >
              {{ calorieDeficit > 0 ? "-" : "+"
              }}{{ Math.abs(calorieDeficit) }} kcal
            </span>
          </div>
        </div>

        <div class="calorie-bars">
          <div class="calorie-item">
            <div class="calorie-label">
              <span class="dot consumed"></span>
              <span>已摄入</span>
            </div>
            <div class="calorie-value">{{ dailyCalories }} kcal</div>
            <div class="calorie-bar">
              <div
                class="bar-fill consumed"
                :style="{ width: (dailyCalories / 2500) * 100 + '%' }"
              ></div>
            </div>
          </div>

          <div class="calorie-item">
            <div class="calorie-label">
              <span class="dot burned"></span>
              <span>已消耗</span>
            </div>
            <div class="calorie-value">{{ burnedCalories }} kcal</div>
            <div class="calorie-bar">
              <div
                class="bar-fill burned"
                :style="{ width: (burnedCalories / 2500) * 100 + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <div class="food-input-section">
          <div class="input-wrapper">
            <input
              v-model="foodInput"
              type="text"
              placeholder="告诉我你吃了什么，AI帮你计算热量..."
              class="food-input"
              @keyup.enter="handleFoodInput"
            />
            <button @click="handleFoodInput" class="analyze-btn">
              <span class="btn-icon">✨</span>
              分析
            </button>
          </div>
          <div class="input-hint">例如：一碗米饭、一个苹果、星巴克拿铁</div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions">
        <div class="action-item">
          <div class="action-icon">⚖️</div>
          <span>记录体重</span>
        </div>
        <div class="action-item">
          <div class="action-icon">🏃‍♂️</div>
          <span>记录运动</span>
        </div>
        <div class="action-item">
          <div class="action-icon">📊</div>
          <span>详细报告</span>
        </div>
        <div class="action-item">
          <div class="action-icon">⚙️</div>
          <span>设置目标</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
// 变量定义
@primary-color: #6366f1;
@success-color: #10b981;
@warning-color: #f59e0b;
@danger-color: #ef4444;
@bg-primary: #ffffff;
@bg-secondary: #f8fafc;
@text-primary: #1e293b;
@text-secondary: #64748b;
@text-light: #94a3b8;
@border-color: #e2e8f0;
@shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
@shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
@border-radius: 16px;
@border-radius-lg: 20px;

.home-page {
  min-height: 100vh;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  color: white;
  font-weight: 600;

  .app-header-right {
    font-size: 14px;
    opacity: 0.9;
  }
}

.main-content {
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-card {
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

  .chart-placeholder {
    height: 120px;
    background: @bg-secondary;
    border-radius: @border-radius;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px dashed @border-color;

    .chart-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }

    p {
      margin: 0;
      color: @text-secondary;
      font-weight: 500;
    }

    small {
      color: @text-light;
      margin-top: 4px;
    }
  }
}

.ai-card {
  background: @bg-primary;
  border-radius: @border-radius;
  padding: 20px;
  box-shadow: @shadow-md;

  .ai-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .ai-title {
      display: flex;
      align-items: center;
      gap: 8px;

      .ai-icon {
        font-size: 20px;
      }

      h3 {
        font-size: 18px;
        font-weight: 600;
        color: @text-primary;
        margin: 0;
      }
    }

    .calorie-summary {
      .deficit {
        font-size: 16px;
        font-weight: 700;
        padding: 6px 12px;
        border-radius: 12px;

        &.positive {
          background: rgba(16, 185, 129, 0.1);
          color: @success-color;
        }

        &.negative {
          background: rgba(239, 68, 68, 0.1);
          color: @danger-color;
        }
      }
    }
  }

  .calorie-bars {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .calorie-item {
      .calorie-label {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 6px;
        font-size: 14px;
        color: @text-secondary;

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;

          &.consumed {
            background: @warning-color;
          }

          &.burned {
            background: @success-color;
          }
        }
      }

      .calorie-value {
        font-size: 16px;
        font-weight: 600;
        color: @text-primary;
        margin-bottom: 8px;
      }

      .calorie-bar {
        height: 6px;
        background: @bg-secondary;
        border-radius: 3px;
        overflow: hidden;

        .bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;

          &.consumed {
            background: @warning-color;
          }

          &.burned {
            background: @success-color;
          }
        }
      }
    }
  }

  .food-input-section {
    .input-wrapper {
      display: flex;
      gap: 12px;
      margin-bottom: 8px;

      .food-input {
        flex: 1;
        padding: 12px 16px;
        border: 2px solid @border-color;
        border-radius: 12px;
        font-size: 14px;
        background: @bg-secondary;
        transition: all 0.2s ease;

        &:focus {
          outline: none;
          border-color: @primary-color;
          background: @bg-primary;
        }

        &::placeholder {
          color: @text-light;
        }
      }

      .analyze-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 12px 20px;
        background: @primary-color;
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: darken(@primary-color, 10%);
          transform: translateY(-1px);
        }

        .btn-icon {
          font-size: 16px;
        }
      }
    }

    .input-hint {
      font-size: 12px;
      color: @text-light;
      padding-left: 4px;
    }
  }
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  .action-item {
    background: @bg-primary;
    border-radius: @border-radius;
    padding: 16px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: @shadow-sm;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: @shadow-md;
    }

    .action-icon {
      font-size: 24px;
      margin-bottom: 8px;
    }

    span {
      font-size: 12px;
      color: @text-secondary;
      font-weight: 500;
    }
  }
}
</style>
