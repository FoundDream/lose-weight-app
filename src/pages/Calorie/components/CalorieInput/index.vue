<template>
  <div class="calorie-input">
    <div class="input-card">
      <div class="input-header">
        <h3>智能录入</h3>
        <p class="input-tip">描述你吃的食物，AI会帮你分析热量</p>
      </div>

      <!-- 主要输入区域 -->
      <div class="main-input">
        <div class="input-wrapper">
          <textarea
            v-model="foodInput"
            placeholder="例如：我吃了一碗米饭、一个苹果和一杯牛奶"
            :disabled="isAnalyzing"
            class="food-textarea"
            rows="3"
          ></textarea>
          <button
            @click="analyzeFood"
            :disabled="!foodInput.trim() || isAnalyzing"
            class="analyze-btn"
          >
            <span v-if="!isAnalyzing">智能分析</span>
            <span v-else class="analyzing">
              <span class="loading-icon">⏳</span>
              分析中...
            </span>
          </button>
        </div>
      </div>

      <!-- 快速录入模板 -->
      <QuickInput
        @template-selected="onTemplateSelected"
        :disabled="isAnalyzing"
      />

      <!-- 分析结果展示和审查 -->
      <div v-if="analysisResult" class="analysis-result">
        <div class="result-header">
          <h4>分析结果</h4>
          <div class="confidence-badge" :class="confidenceLevel">
            {{ Math.round(analysisResult.confidence * 100) }}% 置信度
          </div>
        </div>

        <!-- 总热量显示 -->
        <div class="total-calories">
          <span class="calories-number">{{
            analysisResult.totalCalories
          }}</span>
          <span class="calories-unit">kcal</span>
        </div>

        <!-- 食物详情 -->
        <div class="foods-detail">
          <h5>食物明细</h5>
          <div class="foods-list">
            <div
              v-for="(food, index) in analysisResult.foods"
              :key="food.id"
              class="food-item"
            >
              <div class="food-info">
                <input
                  v-model="food.name"
                  class="food-name-input"
                  placeholder="食物名称"
                />
                <div class="food-quantity">
                  <input
                    v-model.number="food.quantity"
                    type="number"
                    class="quantity-input"
                    min="0"
                    step="0.1"
                  />
                  <select v-model="food.unit" class="unit-select">
                    <option value="g">克</option>
                    <option value="个">个</option>
                    <option value="碗">碗</option>
                    <option value="杯">杯</option>
                    <option value="片">片</option>
                    <option value="ml">毫升</option>
                  </select>
                </div>
              </div>
              <div class="food-calories">
                <input
                  v-model.number="food.calories"
                  type="number"
                  class="calories-input"
                  min="0"
                />
                <span class="calories-label">kcal</span>
              </div>
              <button @click="removeFood(index)" class="remove-btn">×</button>
            </div>
          </div>
        </div>

        <!-- 营养信息 -->
        <div class="nutrition-info">
          <h5>营养成分</h5>
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <label>蛋白质</label>
              <div class="nutrition-value">
                <input
                  v-model.number="analysisResult.nutrition.protein"
                  type="number"
                  min="0"
                  step="0.1"
                />
                <span>g</span>
              </div>
            </div>
            <div class="nutrition-item">
              <label>碳水</label>
              <div class="nutrition-value">
                <input
                  v-model.number="analysisResult.nutrition.carbs"
                  type="number"
                  min="0"
                  step="0.1"
                />
                <span>g</span>
              </div>
            </div>
            <div class="nutrition-item">
              <label>脂肪</label>
              <div class="nutrition-value">
                <input
                  v-model.number="analysisResult.nutrition.fat"
                  type="number"
                  min="0"
                  step="0.1"
                />
                <span>g</span>
              </div>
            </div>
            <div class="nutrition-item">
              <label>纤维</label>
              <div class="nutrition-value">
                <input
                  v-model.number="analysisResult.nutrition.fiber"
                  type="number"
                  min="0"
                  step="0.1"
                />
                <span>g</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="result-actions">
          <button @click="saveRecord" class="save-btn" :disabled="isSaving">
            <span v-if="!isSaving">✓ 保存记录</span>
            <span v-else>保存中...</span>
          </button>
          <button @click="clearResult" class="cancel-btn">取消</button>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="error-message">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <span class="error-text">{{ error }}</span>
          <button @click="clearError" class="error-close">×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useWeightStore } from "../../../../stores/weight";
import QuickInput from "./QuickInput.vue";
import type { CalorieAnalysis } from "../../../../types/calorie";

// Emits
const emit = defineEmits<{
  "record-saved": [];
}>();

// Store
const weightStore = useWeightStore();

// 响应式数据
const foodInput = ref("");
const isAnalyzing = ref(false);
const isSaving = ref(false);
const analysisResult = ref<CalorieAnalysis | null>(null);
const error = ref("");

// 计算属性
const confidenceLevel = computed(() => {
  if (!analysisResult.value) return "low";
  const confidence = analysisResult.value.confidence;
  if (confidence >= 0.8) return "high";
  if (confidence >= 0.6) return "medium";
  return "low";
});

// 方法
const analyzeFood = async () => {
  if (!foodInput.value.trim()) return;

  isAnalyzing.value = true;
  error.value = "";
  analysisResult.value = null;

  try {
    await weightStore.analyzeFood(foodInput.value.trim());

    // 获取最新的分析结果
    const latestAnalysis = weightStore.todayAnalyses[0];
    if (latestAnalysis) {
      analysisResult.value = { ...latestAnalysis };
    }
  } catch (err) {
    console.error("分析失败:", err);
    error.value = err instanceof Error ? err.message : "分析失败，请稍后重试";
  } finally {
    isAnalyzing.value = false;
  }
};

const onTemplateSelected = (template: string) => {
  if (isAnalyzing.value) return;

  if (foodInput.value.trim()) {
    foodInput.value += "、" + template;
  } else {
    foodInput.value = template;
  }
};

const removeFood = (index: number) => {
  if (!analysisResult.value) return;

  analysisResult.value.foods.splice(index, 1);

  // 重新计算总热量
  analysisResult.value.totalCalories = analysisResult.value.foods.reduce(
    (sum, food) => sum + food.calories,
    0
  );
};

const saveRecord = async () => {
  if (!analysisResult.value) return;

  isSaving.value = true;

  try {
    // 更新分析结果到store
    const analysisIndex = weightStore.calorieAnalyses.findIndex(
      (a) => a.id === analysisResult.value!.id
    );

    if (analysisIndex >= 0) {
      weightStore.calorieAnalyses[analysisIndex] = { ...analysisResult.value };
    }

    // 清空输入
    foodInput.value = "";
    analysisResult.value = null;

    // 通知父组件
    emit("record-saved");

    console.log("记录保存成功");
  } catch (err) {
    console.error("保存失败:", err);
    error.value = "保存失败，请稍后重试";
  } finally {
    isSaving.value = false;
  }
};

const clearResult = () => {
  analysisResult.value = null;
  error.value = "";
};

const clearError = () => {
  error.value = "";
};
</script>

<style scoped lang="less">
.calorie-input {
  .input-card {
    background: #ffffff;
    border-radius: 16px;
    padding: @spacing-lg;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .input-header {
      margin-bottom: @spacing-md;

      h3 {
        font-size: @font-size-lg;
        font-weight: @font-weight-semibold;
        color: @color-text-primary;
        margin-bottom: @spacing-xs;
      }

      .input-tip {
        font-size: @font-size-sm;
        color: @color-text-secondary;
        margin: 0;
      }
    }

    .main-input {
      margin-bottom: @spacing-md;

      .input-wrapper {
        display: flex;
        gap: @spacing-sm;

        .food-textarea {
          flex: 1;
          padding: @spacing-sm;
          border: 2px solid @color-border-light;
          border-radius: 12px;
          font-size: @font-size-base;
          resize: vertical;
          transition: border-color 0.3s ease;

          &:focus {
            outline: none;
            border-color: @color-primary;
          }

          &:disabled {
            background-color: @color-bg-secondary;
            cursor: not-allowed;
          }
        }

        .analyze-btn {
          padding: @spacing-sm @spacing-md;
          background: linear-gradient(
            135deg,
            @color-primary,
            @color-primary-dark
          );
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: @font-weight-semibold;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 100px;

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(86, 181, 199, 0.3);
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }

          .analyzing {
            display: flex;
            align-items: center;
            gap: @spacing-xs;

            .loading-icon {
              animation: spin 1s linear infinite;
            }
          }
        }
      }
    }

    .analysis-result {
      border-top: 1px solid @color-border-light;
      padding-top: @spacing-md;
      margin-top: @spacing-md;

      .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: @spacing-md;

        h4 {
          font-size: @font-size-base;
          font-weight: @font-weight-semibold;
          color: @color-text-primary;
          margin: 0;
        }

        .confidence-badge {
          padding: 4px 8px;
          border-radius: 12px;
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

      .total-calories {
        text-align: center;
        margin-bottom: @spacing-md;

        .calories-number {
          font-size: 32px;
          font-weight: @font-weight-bold;
          color: @color-primary;
        }

        .calories-unit {
          font-size: @font-size-base;
          color: @color-text-secondary;
          margin-left: @spacing-xs;
        }
      }

      .foods-detail {
        margin-bottom: @spacing-md;

        h5 {
          font-size: @font-size-sm;
          font-weight: @font-weight-semibold;
          color: @color-text-primary;
          margin-bottom: @spacing-sm;
        }

        .food-item {
          display: flex;
          align-items: center;
          gap: @spacing-sm;
          padding: @spacing-sm;
          border: 1px solid @color-border-light;
          border-radius: 8px;
          margin-bottom: @spacing-xs;

          .food-info {
            flex: 1;
            display: flex;
            gap: @spacing-sm;

            .food-name-input {
              flex: 1;
              padding: 4px 8px;
              border: 1px solid @color-border-light;
              border-radius: 4px;
              font-size: @font-size-sm;
            }

            .food-quantity {
              display: flex;
              gap: 4px;

              .quantity-input {
                width: 60px;
                padding: 4px 8px;
                border: 1px solid @color-border-light;
                border-radius: 4px;
                font-size: @font-size-sm;
              }

              .unit-select {
                padding: 4px 8px;
                border: 1px solid @color-border-light;
                border-radius: 4px;
                font-size: @font-size-sm;
              }
            }
          }

          .food-calories {
            display: flex;
            align-items: center;
            gap: 4px;

            .calories-input {
              width: 60px;
              padding: 4px 8px;
              border: 1px solid @color-border-light;
              border-radius: 4px;
              font-size: @font-size-sm;
            }

            .calories-label {
              font-size: @font-size-xs;
              color: @color-text-secondary;
            }
          }

          .remove-btn {
            width: 24px;
            height: 24px;
            border: none;
            background: @color-danger;
            color: white;
            border-radius: 50%;
            cursor: pointer;
            font-size: @font-size-sm;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
              background: darken(@color-danger, 10%);
            }
          }
        }
      }

      .nutrition-info {
        margin-bottom: @spacing-md;

        h5 {
          font-size: @font-size-sm;
          font-weight: @font-weight-semibold;
          color: @color-text-primary;
          margin-bottom: @spacing-sm;
        }

        .nutrition-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: @spacing-sm;

          .nutrition-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: @spacing-xs;
            background: @color-bg-secondary;
            border-radius: 8px;

            label {
              font-size: @font-size-sm;
              color: @color-text-secondary;
            }

            .nutrition-value {
              display: flex;
              align-items: center;
              gap: 4px;

              input {
                width: 50px;
                padding: 2px 6px;
                border: 1px solid @color-border-light;
                border-radius: 4px;
                font-size: @font-size-sm;
                text-align: right;
              }

              span {
                font-size: @font-size-xs;
                color: @color-text-secondary;
              }
            }
          }
        }
      }

      .result-actions {
        display: flex;
        gap: @spacing-sm;

        .save-btn {
          flex: 1;
          padding: @spacing-sm @spacing-md;
          background: @color-success;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: @font-weight-semibold;
          cursor: pointer;

          &:hover:not(:disabled) {
            background: darken(@color-success, 10%);
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }

        .cancel-btn {
          padding: @spacing-sm @spacing-md;
          background: @color-text-tertiary;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: @font-weight-semibold;
          cursor: pointer;

          &:hover {
            background: darken(@color-text-tertiary, 10%);
          }
        }
      }
    }

    .error-message {
      margin-top: @spacing-md;
      padding: @spacing-sm;
      background: #ffebee;
      border: 1px solid #ffcdd2;
      border-radius: 8px;

      .error-content {
        display: flex;
        align-items: center;
        gap: @spacing-sm;

        .error-icon {
          font-size: @font-size-base;
        }

        .error-text {
          flex: 1;
          font-size: @font-size-sm;
          color: #d32f2f;
        }

        .error-close {
          background: none;
          border: none;
          font-size: @font-size-lg;
          color: #d32f2f;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
