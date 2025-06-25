<template>
  <div class="weight-loss-plan">
    <div class="card-header">
      <h3>🎯 AI减肥规划</h3>
      <button
        v-if="currentPlan"
        @click="refreshPlan"
        :disabled="isAnalyzing"
        class="refresh-btn"
      >
        <span v-if="!isAnalyzing">🔄</span>
        <span v-else>⏳</span>
      </button>
    </div>

    <!-- 分析错误 -->
    <div v-if="analysisError" class="error-notice">
      <span class="error-icon">❌</span>
      <span class="error-text">{{ analysisError }}</span>
      <button @click="clearError" class="error-close">×</button>
    </div>

    <!-- 分析结果 -->
    <div v-if="currentPlan" class="plan-content">
      <!-- 主要指标 -->
      <div class="main-metrics">
        <div class="metric-card primary">
          <div class="metric-icon">⏰</div>
          <div class="metric-info">
            <div class="metric-value">{{ currentPlan.estimatedWeeks }}</div>
            <div class="metric-label">预计周数</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">📉</div>
          <div class="metric-info">
            <div class="metric-value">{{ currentPlan.weeklyGoal }}kg</div>
            <div class="metric-label">每周目标</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">🔥</div>
          <div class="metric-info">
            <div class="metric-value">
              {{ currentPlan.dailyCalorieDeficit }}
            </div>
            <div class="metric-label">日热量缺口</div>
          </div>
        </div>
      </div>

      <!-- 推荐摄入量 -->
      <div class="calorie-recommendation">
        <h4>每日推荐摄入</h4>
        <div class="calorie-info">
          <span class="calorie-value">{{
            currentPlan.recommendedCalorieIntake
          }}</span>
          <span class="calorie-unit">kcal</span>
          <span class="calorie-note">基于您的个人信息和减肥目标</span>
        </div>
      </div>

      <!-- 里程碑 -->
      <div v-if="currentPlan.milestones?.length" class="milestones-section">
        <h4>减肥里程碑</h4>
        <div class="milestones-list">
          <div
            v-for="(milestone, index) in currentPlan.milestones"
            :key="index"
            class="milestone-item"
          >
            <div class="milestone-number">{{ index + 1 }}</div>
            <div class="milestone-info">
              <div class="milestone-weight">
                {{ milestone.weight.toFixed(1) }}kg
              </div>
              <div class="milestone-date">
                {{ formatDate(milestone.estimatedDate) }}
              </div>
              <div class="milestone-desc">{{ milestone.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI建议 -->
      <div v-if="currentPlan.suggestions?.length" class="suggestions-section">
        <h4>专业建议</h4>
        <div class="suggestions-list">
          <div
            v-for="(suggestion, index) in currentPlan.suggestions"
            :key="index"
            class="suggestion-item"
          >
            <span class="suggestion-icon">💡</span>
            <span class="suggestion-text">{{ suggestion }}</span>
          </div>
        </div>
      </div>

      <!-- 置信度 -->
      <div class="confidence-section">
        <div class="confidence-bar">
          <div
            class="confidence-fill"
            :style="{ width: currentPlan.confidence * 100 + '%' }"
          ></div>
        </div>
        <div class="confidence-text">
          AI分析置信度: {{ Math.round(currentPlan.confidence * 100) }}%
        </div>
      </div>
    </div>

    <!-- 暂无计划时的提示 -->
    <div v-if="!currentPlan && !isAnalyzing && !analysisError" class="no-plan">
      <div class="no-plan-icon">🤖</div>
      <p class="no-plan-text">点击上方"生成AI减肥方案"按钮获取专属计划</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "../../../stores/user";
import { useWeightStore } from "../../../stores/weight";

const userStore = useUserStore();
const weightStore = useWeightStore();

const currentPlan = computed(() => userStore.currentPlan);
const isAnalyzing = computed(() => userStore.isAnalyzing);
const analysisError = computed(() => userStore.analysisError);

const refreshPlan = async () => {
  const currentWeight = weightStore.currentWeight;
  const targetWeight = weightStore.targetWeight;

  const weightHistory = weightStore.entries.slice(0, 10).map((entry) => ({
    weight: entry.weight,
    date: entry.date,
  }));

  await userStore.analyzeWeightLoss(currentWeight, targetWeight, weightHistory);
};

const clearError = () => {
  userStore.clearAnalysisError();
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
  });
};
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

.weight-loss-plan {
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

    .refresh-btn {
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background: @bg-secondary;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  .error-notice {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    margin-bottom: 20px;

    .error-icon {
      font-size: 16px;
    }

    .error-text {
      flex: 1;
      font-size: 14px;
      color: #991b1b;
    }

    .error-close {
      background: none;
      border: none;
      font-size: 18px;
      color: #991b1b;
      cursor: pointer;
      padding: 0;
    }
  }

  .plan-content {
    .main-metrics {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;

      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }

      .metric-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: @bg-secondary;
        border-radius: 12px;

        &.primary {
          background: linear-gradient(135deg, @primary-color 0%, #8b5cf6 100%);
          color: white;

          .metric-value,
          .metric-label {
            color: white;
          }
        }

        .metric-icon {
          font-size: 24px;
        }

        .metric-info {
          .metric-value {
            font-size: 20px;
            font-weight: 700;
            color: @text-primary;
            margin-bottom: 2px;
          }

          .metric-label {
            font-size: 12px;
            color: @text-secondary;
          }
        }
      }
    }

    .calorie-recommendation {
      margin-bottom: 24px;
      padding: 16px;
      background: linear-gradient(135deg, @success-color 0%, #059669 100%);
      border-radius: 12px;
      color: white;
      text-align: center;

      h4 {
        font-size: 14px;
        margin: 0 0 8px 0;
        opacity: 0.9;
      }

      .calorie-info {
        .calorie-value {
          font-size: 28px;
          font-weight: 700;
        }

        .calorie-unit {
          font-size: 16px;
          margin-left: 4px;
          opacity: 0.8;
        }

        .calorie-note {
          display: block;
          font-size: 12px;
          margin-top: 4px;
          opacity: 0.8;
        }
      }
    }

    .milestones-section,
    .suggestions-section {
      margin-bottom: 24px;

      h4 {
        font-size: 16px;
        font-weight: 600;
        color: @text-primary;
        margin: 0 0 12px 0;
      }
    }

    .milestones-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .milestone-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: @bg-secondary;
        border-radius: 8px;

        .milestone-number {
          width: 24px;
          height: 24px;
          background: @primary-color;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .milestone-info {
          .milestone-weight {
            font-size: 16px;
            font-weight: 600;
            color: @text-primary;
          }

          .milestone-date {
            font-size: 12px;
            color: @success-color;
            margin: 2px 0;
          }

          .milestone-desc {
            font-size: 12px;
            color: @text-secondary;
          }
        }
      }
    }

    .suggestions-list {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .suggestion-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 8px 0;

        .suggestion-icon {
          font-size: 14px;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .suggestion-text {
          font-size: 14px;
          color: @text-primary;
          line-height: 1.4;
        }
      }
    }

    .confidence-section {
      .confidence-bar {
        height: 4px;
        background: @bg-secondary;
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 8px;

        .confidence-fill {
          height: 100%;
          background: @success-color;
          border-radius: 2px;
          transition: width 0.3s ease;
        }
      }

      .confidence-text {
        font-size: 12px;
        color: @text-secondary;
        text-align: center;
      }
    }
  }

  .no-plan {
    text-align: center;
    padding: 40px 20px;

    .no-plan-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .no-plan-text {
      font-size: 14px;
      color: @text-secondary;
      margin: 0;
    }
  }
}
</style>
