<template>
  <div class="calorie-result" v-if="analysis">
    <div class="result-header">
      <div class="confidence-badge" :class="confidenceLevel">
        <span class="confidence-icon">{{ confidenceIcon }}</span>
        <span>置信度 {{ Math.round(analysis.confidence * 100) }}%</span>
      </div>
      <button @click="$emit('close')" class="close-btn">
        <span>×</span>
      </button>
    </div>

    <!-- 总卡路里显示 -->
    <div class="total-calories">
      <span class="calorie-number">{{ analysis.totalCalories }}</span>
      <span class="calorie-unit">kcal</span>
    </div>

    <!-- 食物详情列表 -->
    <div class="foods-list">
      <h4>食物详情</h4>
      <div v-for="food in analysis.foods" :key="food.id" class="food-item">
        <div class="food-info">
          <span class="food-name">{{ food.name }}</span>
          <span class="food-unit">{{ food.quantity }}{{ food.unit }}</span>
        </div>
        <div class="food-calories">
          <span class="calories">{{ food.calories }}</span>
          <span class="unit">kcal</span>
        </div>
      </div>
    </div>

    <!-- 营养成分 -->
    <div class="nutrition-info">
      <h4>营养成分</h4>
      <div class="nutrition-grid">
        <div class="nutrition-item">
          <span class="label">蛋白质</span>
          <span class="value">{{ analysis.nutrition.protein }}g</span>
        </div>
        <div class="nutrition-item">
          <span class="label">碳水</span>
          <span class="value">{{ analysis.nutrition.carbs }}g</span>
        </div>
        <div class="nutrition-item">
          <span class="label">脂肪</span>
          <span class="value">{{ analysis.nutrition.fat }}g</span>
        </div>
        <div class="nutrition-item">
          <span class="label">纤维</span>
          <span class="value">{{ analysis.nutrition.fiber }}g</span>
        </div>
      </div>
    </div>

    <!-- AI建议 -->
    <div class="suggestions" v-if="analysis.suggestions.length > 0">
      <h4>AI建议</h4>
      <div class="suggestion-list">
        <div
          v-for="(suggestion, index) in analysis.suggestions"
          :key="index"
          class="suggestion-item"
        >
          <span class="suggestion-icon">💡</span>
          <span class="suggestion-text">{{ suggestion }}</span>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="result-actions">
      <button @click="$emit('save')" class="save-btn">
        <span class="btn-icon">✓</span>
        保存记录
      </button>
      <button @click="$emit('retry')" class="retry-btn">
        <span class="btn-icon">🔄</span>
        重新分析
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CalorieAnalysis } from "../../../../types/calorie";

// Props
interface Props {
  analysis: CalorieAnalysis | null;
}

const props = defineProps<Props>();

// Emits
defineEmits<{
  close: [];
  save: [];
  retry: [];
}>();

// 计算置信度级别
const confidenceLevel = computed(() => {
  if (!props.analysis) return "low";
  const confidence = props.analysis.confidence;
  if (confidence >= 0.8) return "high";
  if (confidence >= 0.6) return "medium";
  return "low";
});

// 置信度图标
const confidenceIcon = computed(() => {
  switch (confidenceLevel.value) {
    case "high":
      return "🎯";
    case "medium":
      return "⚡";
    case "low":
      return "⚠️";
    default:
      return "❓";
  }
});
</script>

<style scoped lang="less">
.calorie-result {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;

  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .confidence-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;

      &.high {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }

      &.medium {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
      }

      &.low {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }

      .confidence-icon {
        font-size: 14px;
      }
    }

    .close-btn {
      background: #f3f4f6;
      border: none;
      border-radius: 6px;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background: #e5e7eb;
      }

      span {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }

  .total-calories {
    text-align: center;
    margin-bottom: 20px;

    .calorie-number {
      font-size: 36px;
      font-weight: 700;
      color: #111827;
    }

    .calorie-unit {
      font-size: 16px;
      color: #6b7280;
      margin-left: 4px;
    }
  }

  .foods-list {
    margin-bottom: 20px;

    h4 {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin: 0 0 12px 0;
    }

    .food-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f3f4f6;

      &:last-child {
        border-bottom: none;
      }

      .food-info {
        .food-name {
          font-size: 14px;
          color: #111827;
          font-weight: 500;
        }

        .food-unit {
          font-size: 12px;
          color: #6b7280;
          margin-left: 8px;
        }
      }

      .food-calories {
        .calories {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .unit {
          font-size: 12px;
          color: #6b7280;
          margin-left: 2px;
        }
      }
    }
  }

  .nutrition-info {
    margin-bottom: 20px;

    h4 {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin: 0 0 12px 0;
    }

    .nutrition-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;

      .nutrition-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 12px;
        background: #f9fafb;
        border-radius: 6px;

        .label {
          font-size: 12px;
          color: #6b7280;
        }

        .value {
          font-size: 12px;
          font-weight: 600;
          color: #111827;
        }
      }
    }
  }

  .suggestions {
    margin-bottom: 20px;

    h4 {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin: 0 0 12px 0;
    }

    .suggestion-list {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .suggestion-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 8px;
        background: #fef3c7;
        border-radius: 6px;
        border-left: 3px solid #f59e0b;

        .suggestion-icon {
          font-size: 14px;
          margin-top: 1px;
        }

        .suggestion-text {
          font-size: 13px;
          color: #92400e;
          line-height: 1.4;
        }
      }
    }
  }

  .result-actions {
    display: flex;
    gap: 12px;

    button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;

      .btn-icon {
        font-size: 14px;
      }
    }

    .save-btn {
      background: #10b981;
      color: white;
      border: none;

      &:hover {
        background: #059669;
      }

      &:active {
        background: #047857;
      }
    }

    .retry-btn {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;

      &:hover {
        background: #e5e7eb;
        border-color: #9ca3af;
      }

      &:active {
        background: #d1d5db;
      }
    }
  }
}
</style>
