<template>
  <div class="ai-calorie-analyzer">
    <div class="analyzer-header">
      <h3>AI 卡路里分析</h3>
      <p class="description">告诉我你今天吃了什么，我来帮你分析卡路里摄入</p>
    </div>

    <!-- 食物输入区域 -->
    <div class="food-input-section">
      <div class="input-wrapper">
        <input
          v-model="foodInput"
          placeholder="描述你今天吃的食物，例如：早餐：两个煎蛋、一片全麦面包、一杯牛奶..."
          rows="4"
          :disabled="isAnalyzing"
          class="food-input"
        />
        <button
          @click="analyzeFood"
          :disabled="!foodInput.trim() || isAnalyzing"
          class="analyze-btn"
        >
          <span v-if="!isAnalyzing">分析</span>
          <span v-else>分析中...</span>
        </button>
      </div>
    </div>

    <!-- 快速输入模板 -->
    <FoodInputTemplates
      @input-selected="onTemplateSelected"
      :disabled="isAnalyzing"
    />

    <!-- 加载状态 -->
    <LoadingAnalysis v-if="isAnalyzing" />

    <!-- 分析结果 -->
    <CalorieResult
      v-if="analysisResult"
      :analysis="analysisResult"
      @save="saveToWeightStore"
    />

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <div class="error-text">
          <p class="error-title">分析失败</p>
          <p class="error-detail">{{ error }}</p>
        </div>
        <button @click="clearError" class="error-dismiss">×</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import { useWeightStore } from "../../../../stores/weight";
import { analyzeFoodCalories as analyzeWithOpenAI } from "../../../../services/openai";
import FoodInputTemplates from "./FoodInputTemplates.vue";
import CalorieResult from "./CalorieResult.vue";
import LoadingAnalysis from "./LoadingAnalysis.vue";
import type { CalorieAnalysis } from "../../../../types/calorie";

// 响应式数据
const foodInput = ref("");
const isAnalyzing = ref(false);
const analysisResult = ref<CalorieAnalysis | null>(null);
const error = ref("");

// Stores (for future use)
// const weightStore = useWeightStore();

// 方法
const analyzeFood = async () => {
  if (!foodInput.value.trim()) return;

  isAnalyzing.value = true;
  error.value = "";
  analysisResult.value = null;

  try {
    const apiResponse = await analyzeWithOpenAI(foodInput.value.trim());

    // 转换 OpenAI 响应为 CalorieAnalysis 格式
    const totalCalories = apiResponse.foods.reduce(
      (sum, food) => sum + food.calories,
      0
    );
    const result: CalorieAnalysis = {
      id: Date.now().toString(),
      timestamp: new Date(),
      originalInput: foodInput.value.trim(),
      foods: apiResponse.foods.map((food, index) => ({
        id: `${Date.now()}-${index}`,
        name: food.name,
        calories: food.calories,
        unit: food.unit,
        quantity: food.quantity,
        confidence: food.confidence,
      })),
      totalCalories,
      nutrition: apiResponse.nutrition,
      suggestions: apiResponse.suggestions,
      confidence: apiResponse.confidence,
    };

    analysisResult.value = result;
  } catch (err) {
    console.error("Food analysis failed:", err);
    error.value =
      err instanceof Error ? err.message : "分析过程中出现未知错误，请稍后重试";
  } finally {
    isAnalyzing.value = false;
  }
};

const clearError = () => {
  error.value = "";
};

const onTemplateSelected = (template: string) => {
  if (isAnalyzing.value) return;

  if (foodInput.value.trim()) {
    foodInput.value += "\n" + template;
  } else {
    foodInput.value = template;
  }
};

const saveToWeightStore = () => {
  if (!analysisResult.value) return;

  // 将卡路里数据保存到体重管理 store
  // 这里可以扩展为保存到专门的饮食记录 store
  const today = new Date().toISOString().split("T")[0];

  // 如果 weightStore 有 addCalorieRecord 方法的话
  // weightStore.addCalorieRecord(today, analysisResult.value)

  console.log("Saving calorie data for", today, analysisResult.value);

  // 显示成功提示
  alert(`今日卡路里摄入 ${analysisResult.value.totalCalories} 卡已记录！`);
};
</script>

<style scoped lang="less">
.ai-calorie-analyzer {
  background: #ffffff;
  border-radius: 24px;
  padding: 16px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  .analyzer-header {
    margin-bottom: 12px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .description {
      font-size: 12px;
      color: #666;
      margin: 0;
      line-height: 1.5;
    }
  }

  .food-input-section {
    margin-bottom: 12px;

    .input-wrapper {
      display: flex;
      gap: 4px;

      .food-input {
        flex: 1;
        padding: 4px 6px;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        transition: border-color 0.3s ease;
        color: #333;
        font-size: 12px;

        &:focus {
          outline: none;
          border-color: linear-gradient(
            0deg,
            rgba(86, 181, 199, 1) 0%,
            rgba(22, 194, 190, 0.72) 100%
          );
        }

        &:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        &::placeholder {
          color: #999;
          font-size: 12px;
        }
      }

      .analyze-btn {
        width: 60px;
        background: linear-gradient(
          0deg,
          rgba(86, 181, 199, 1) 0%,
          rgba(22, 194, 190, 0.72) 100%
        );
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
          background: linear-gradient(
            0deg,
            rgba(86, 181, 199, 1) 0%,
            rgba(22, 194, 190, 0.72) 100%
          );
          transform: translateY(-2px);
        }

        &:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }
      }
    }
  }

  .error-message {
    margin-top: 32px;

    .error-content {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 24px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 16px;

      .error-icon {
        font-size: 32px;
        flex-shrink: 0;
      }

      .error-text {
        flex: 1;

        .error-title {
          font-size: 28px;
          font-weight: 600;
          color: #dc2626;
          margin: 0 0 8px 0;
        }

        .error-detail {
          font-size: 24px;
          color: #991b1b;
          margin: 0;
          line-height: 1.5;
        }
      }

      .error-dismiss {
        background: none;
        border: none;
        font-size: 32px;
        color: #991b1b;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: background-color 0.2s ease;

        &:hover {
          background: #fca5a5;
        }
      }
    }
  }
}
</style>
