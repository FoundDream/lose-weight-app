<template>
  <div class="record-item">
    <div class="record-main">
      <!-- 时间和置信度 -->
      <div class="record-header">
        <span class="record-time">{{ formatTime(record.timestamp) }}</span>
        <div class="confidence-badge" :class="confidenceLevel">
          {{ Math.round(record.confidence * 100) }}%
        </div>
      </div>

      <!-- 原始输入 -->
      <div class="record-input">
        <span class="input-icon">💬</span>
        <span class="input-text">{{ record.originalInput }}</span>
      </div>

      <!-- 食物详情 -->
      <div class="foods-summary">
        <div
          v-for="food in record.foods.slice(0, 3)"
          :key="food.id"
          class="food-tag"
        >
          <span class="food-name">{{ food.name }}</span>
          <span class="food-calories">{{ food.calories }}kcal</span>
        </div>
        <div v-if="record.foods.length > 3" class="more-foods">
          +{{ record.foods.length - 3 }}项
        </div>
      </div>

      <!-- 营养信息预览 -->
      <div class="nutrition-preview">
        <div class="nutrition-item">
          <span class="nutrition-label">蛋白质</span>
          <span class="nutrition-value">{{ record.nutrition.protein }}g</span>
        </div>
        <div class="nutrition-item">
          <span class="nutrition-label">碳水</span>
          <span class="nutrition-value">{{ record.nutrition.carbs }}g</span>
        </div>
        <div class="nutrition-item">
          <span class="nutrition-label">脂肪</span>
          <span class="nutrition-value">{{ record.nutrition.fat }}g</span>
        </div>
      </div>
    </div>

    <!-- 热量和操作 -->
    <div class="record-sidebar">
      <div class="total-calories">
        <span class="calories-number">{{ record.totalCalories }}</span>
        <span class="calories-unit">kcal</span>
      </div>

      <div class="record-actions">
        <button @click="handleEdit" class="action-btn edit-btn" title="编辑">
          ✏️
        </button>
        <button
          @click="handleDelete"
          class="action-btn delete-btn"
          title="删除"
        >
          🗑️
        </button>
        <button
          @click="toggleDetails"
          class="action-btn detail-btn"
          title="详情"
        >
          {{ showDetails ? "▼" : "▶" }}
        </button>
      </div>
    </div>

    <!-- 详细信息（可展开） -->
    <div v-if="showDetails" class="record-details">
      <div class="details-section">
        <h5>食物明细</h5>
        <div class="foods-detail">
          <div
            v-for="food in record.foods"
            :key="food.id"
            class="food-detail-item"
          >
            <div class="food-info">
              <span class="food-name">{{ food.name }}</span>
              <span class="food-quantity"
                >{{ food.quantity }}{{ food.unit }}</span
              >
            </div>
            <div class="food-calories">
              <span class="calories">{{ food.calories }}</span>
              <span class="unit">kcal</span>
            </div>
            <div class="food-confidence">
              置信度: {{ Math.round(food.confidence * 100) }}%
            </div>
          </div>
        </div>
      </div>

      <div class="details-section">
        <h5>营养成分</h5>
        <div class="nutrition-detail">
          <div class="nutrition-grid">
            <div class="nutrition-cell">
              <span class="nutrition-label">蛋白质</span>
              <span class="nutrition-value"
                >{{ record.nutrition.protein }}g</span
              >
            </div>
            <div class="nutrition-cell">
              <span class="nutrition-label">碳水化合物</span>
              <span class="nutrition-value">{{ record.nutrition.carbs }}g</span>
            </div>
            <div class="nutrition-cell">
              <span class="nutrition-label">脂肪</span>
              <span class="nutrition-value">{{ record.nutrition.fat }}g</span>
            </div>
            <div class="nutrition-cell">
              <span class="nutrition-label">膳食纤维</span>
              <span class="nutrition-value">{{ record.nutrition.fiber }}g</span>
            </div>
            <div class="nutrition-cell">
              <span class="nutrition-label">糖分</span>
              <span class="nutrition-value">{{ record.nutrition.sugar }}g</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="record.suggestions.length > 0" class="details-section">
        <h5>AI建议</h5>
        <div class="suggestions-list">
          <div
            v-for="(suggestion, index) in record.suggestions"
            :key="index"
            class="suggestion-item"
          >
            <span class="suggestion-icon">💡</span>
            <span class="suggestion-text">{{ suggestion }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { CalorieAnalysis } from "../../../../types/calorie";

// Props
interface Props {
  record: CalorieAnalysis;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  edit: [record: CalorieAnalysis];
  delete: [record: CalorieAnalysis];
}>();

// 状态
const showDetails = ref(false);

// 计算属性
const confidenceLevel = computed(() => {
  const confidence = props.record.confidence;
  if (confidence >= 0.8) return "high";
  if (confidence >= 0.6) return "medium";
  return "low";
});

// 方法
const formatTime = (timestamp: Date) => {
  return new Date(timestamp).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleEdit = () => {
  emit("edit", props.record);
};

const handleDelete = () => {
  emit("delete", props.record);
};

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};
</script>

<style scoped lang="less">
.record-item {
  background: #ffffff;
  border: 1px solid @color-border-light;
  border-radius: 12px;
  padding: @spacing-md;
  transition: all 0.3s ease;

  &:hover {
    border-color: @color-primary;
    box-shadow: 0 4px 12px rgba(86, 181, 199, 0.15);
  }

  .record-main {
    display: flex;
    flex-direction: column;
    gap: @spacing-sm;
    margin-bottom: @spacing-sm;

    .record-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .record-time {
        font-size: @font-size-sm;
        color: @color-text-secondary;
        font-weight: @font-weight-semibold;
      }

      .confidence-badge {
        padding: 2px 8px;
        border-radius: 10px;
        font-size: @font-size-xs;
        font-weight: @font-weight-semibold;

        &.high {
          background: #e8f5e8;
          color: #2d7d32;
        }

        &.medium {
          background: #fff3e0;
          color: #f57c00;
        }

        &.low {
          background: #ffebee;
          color: #d32f2f;
        }
      }
    }

    .record-input {
      display: flex;
      align-items: flex-start;
      gap: @spacing-xs;
      padding: @spacing-xs @spacing-sm;
      background: @color-bg-secondary;
      border-radius: 8px;

      .input-icon {
        font-size: @font-size-sm;
        margin-top: 2px;
      }

      .input-text {
        flex: 1;
        font-size: @font-size-sm;
        color: @color-text-primary;
        line-height: 1.4;
      }
    }

    .foods-summary {
      display: flex;
      flex-wrap: wrap;
      gap: @spacing-xs;

      .food-tag {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: lighten(@color-primary, 45%);
        border-radius: 12px;
        font-size: @font-size-xs;

        .food-name {
          color: @color-text-primary;
          font-weight: @font-weight-semibold;
        }

        .food-calories {
          color: @color-primary;
          font-weight: @font-weight-semibold;
        }
      }

      .more-foods {
        padding: 4px 8px;
        background: @color-text-tertiary;
        color: white;
        border-radius: 12px;
        font-size: @font-size-xs;
        font-weight: @font-weight-semibold;
      }
    }

    .nutrition-preview {
      display: flex;
      gap: @spacing-md;

      .nutrition-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .nutrition-label {
          font-size: @font-size-xs;
          color: @color-text-secondary;
          margin-bottom: 2px;
        }

        .nutrition-value {
          font-size: @font-size-sm;
          font-weight: @font-weight-semibold;
          color: @color-text-primary;
        }
      }
    }
  }

  .record-sidebar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .total-calories {
      display: flex;
      align-items: baseline;
      gap: 4px;

      .calories-number {
        font-size: @font-size-xl;
        font-weight: @font-weight-bold;
        color: @color-primary;
      }

      .calories-unit {
        font-size: @font-size-sm;
        color: @color-text-secondary;
      }
    }

    .record-actions {
      display: flex;
      gap: @spacing-xs;

      .action-btn {
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: @font-size-sm;
        transition: all 0.3s ease;

        &.edit-btn {
          background: lighten(@color-primary, 40%);

          &:hover {
            background: @color-primary;
            transform: scale(1.1);
          }
        }

        &.delete-btn {
          background: lighten(@color-danger, 40%);

          &:hover {
            background: @color-danger;
            transform: scale(1.1);
          }
        }

        &.detail-btn {
          background: @color-bg-secondary;

          &:hover {
            background: @color-text-tertiary;
            color: white;
          }
        }
      }
    }
  }

  .record-details {
    margin-top: @spacing-md;
    padding-top: @spacing-md;
    border-top: 1px solid @color-border-light;

    .details-section {
      margin-bottom: @spacing-md;

      &:last-child {
        margin-bottom: 0;
      }

      h5 {
        font-size: @font-size-sm;
        font-weight: @font-weight-semibold;
        color: @color-text-primary;
        margin: 0 0 @spacing-sm 0;
      }

      .foods-detail {
        .food-detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: @spacing-xs 0;
          border-bottom: 1px solid lighten(@color-border-light, 50%);

          &:last-child {
            border-bottom: none;
          }

          .food-info {
            flex: 1;

            .food-name {
              font-size: @font-size-sm;
              color: @color-text-primary;
              font-weight: @font-weight-semibold;
              margin-right: @spacing-sm;
            }

            .food-quantity {
              font-size: @font-size-xs;
              color: @color-text-secondary;
            }
          }

          .food-calories {
            margin: 0 @spacing-sm;

            .calories {
              font-size: @font-size-sm;
              font-weight: @font-weight-semibold;
              color: @color-primary;
            }

            .unit {
              font-size: @font-size-xs;
              color: @color-text-secondary;
              margin-left: 2px;
            }
          }

          .food-confidence {
            font-size: @font-size-xs;
            color: @color-text-tertiary;
            min-width: 80px;
            text-align: right;
          }
        }
      }

      .nutrition-detail {
        .nutrition-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: @spacing-sm;

          .nutrition-cell {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: @spacing-xs;
            background: @color-bg-secondary;
            border-radius: 6px;

            .nutrition-label {
              font-size: @font-size-xs;
              color: @color-text-secondary;
            }

            .nutrition-value {
              font-size: @font-size-sm;
              font-weight: @font-weight-semibold;
              color: @color-text-primary;
            }
          }
        }
      }

      .suggestions-list {
        .suggestion-item {
          display: flex;
          align-items: flex-start;
          gap: @spacing-xs;
          margin-bottom: @spacing-xs;

          &:last-child {
            margin-bottom: 0;
          }

          .suggestion-icon {
            font-size: @font-size-sm;
            margin-top: 2px;
          }

          .suggestion-text {
            flex: 1;
            font-size: @font-size-sm;
            color: @color-text-secondary;
            line-height: 1.4;
          }
        }
      }
    }
  }
}
</style>
