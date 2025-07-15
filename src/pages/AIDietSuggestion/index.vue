<template>
  <div class="ai-diet-page">
    <!-- 头部导航 -->
    <div class="header">
      <Icon
        icon="solar:arrow-left-linear"
        width="24"
        height="24"
        @click="goBack"
        class="back-btn"
      />
      <h1 class="page-title">AI 饮食建议</h1>
      <Icon
        icon="solar:refresh-linear"
        width="24"
        height="24"
        @click="regenerateSuggestions"
        class="refresh-btn"
        :class="{ loading: isLoading }"
      />
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">AI 正在分析您的饮食情况...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <Icon
        icon="solar:danger-circle-bold"
        width="48"
        height="48"
        color="#ff6b6b"
      />
      <p class="error-text">{{ error }}</p>
      <button class="retry-btn" @click="generateSuggestions">重试</button>
    </div>

    <!-- 主要内容 -->
    <div v-else-if="suggestions" class="content">
      <!-- 营养摘要卡片 -->
      <div class="summary-card">
        <div class="summary-header">
          <h2>今日营养摘要</h2>
          <div
            class="nutrition-score"
            :class="getScoreClass(suggestions.summary.nutritionScore)"
          >
            {{ suggestions.summary.nutritionScore }}分
          </div>
        </div>
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-label">已摄入</span>
            <span class="stat-value"
              >{{ suggestions.summary.currentCalories }}kcal</span
            >
          </div>
          <div class="stat-item">
            <span class="stat-label">建议总量</span>
            <span class="stat-value"
              >{{ suggestions.summary.recommendedCalories }}kcal</span
            >
          </div>
          <div class="stat-item">
            <span class="stat-label">剩余</span>
            <span
              class="stat-value"
              :class="{ negative: suggestions.summary.remainingCalories < 0 }"
            >
              {{ suggestions.summary.remainingCalories }}kcal
            </span>
          </div>
        </div>
        <div class="balance-status">
          <Icon icon="solar:info-circle-bold" width="16" height="16" />
          <span>{{ suggestions.summary.balanceStatus }}</span>
        </div>
      </div>

      <!-- 饮食建议列表 -->
      <div class="recommendations-section">
        <h2 class="section-title">个性化建议</h2>
        <div class="recommendations-list">
          <div
            v-for="(rec, index) in suggestions.recommendations"
            :key="index"
            class="recommendation-card"
            :class="{ 'high-priority': rec.priority === 'high' }"
          >
            <div class="rec-header">
              <div class="rec-category">
                <Icon
                  :icon="getCategoryIcon(rec.category)"
                  width="20"
                  height="20"
                />
                <span>{{ getCategoryName(rec.category) }}</span>
                <span v-if="rec.priority === 'high'" class="priority-badge"
                  >推荐</span
                >
              </div>
              <span class="rec-calories">{{ rec.totalCalories }}kcal</span>
            </div>
            <h3 class="rec-title">{{ rec.title }}</h3>
            <p class="rec-description">{{ rec.description }}</p>
            <div class="foods-list">
              <div
                v-for="(food, foodIndex) in rec.foods"
                :key="foodIndex"
                class="food-item"
              >
                <div class="food-main">
                  <span class="food-name">{{ food.name }}</span>
                  <span class="food-portion">{{ food.portion }}</span>
                </div>
                <div class="food-details">
                  <span class="food-calories">{{ food.calories }}kcal</span>
                  <span class="food-benefits">{{ food.benefits }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 实用小贴士 -->
      <div class="tips-section">
        <h2 class="section-title">实用小贴士</h2>
        <div class="tips-grid">
          <div
            v-for="(tip, index) in suggestions.tips"
            :key="index"
            class="tip-card"
          >
            <div class="tip-icon">{{ tip.icon }}</div>
            <h3 class="tip-title">{{ tip.title }}</h3>
            <p class="tip-content">{{ tip.content }}</p>
          </div>
        </div>
      </div>

      <!-- 下一餐建议 -->
      <div class="next-meal-section">
        <h2 class="section-title">下一餐建议</h2>
        <div class="next-meal-card">
          <div class="meal-info">
            <div class="meal-type">
              {{ suggestions.nextMealSuggestion.mealType }}
            </div>
            <div class="meal-time">
              建议时间：{{ suggestions.nextMealSuggestion.suggestedTime }}
            </div>
            <div class="meal-calories">
              目标热量：{{ suggestions.nextMealSuggestion.calorieTarget }}kcal
            </div>
          </div>
          <div class="key-nutrients">
            <span class="nutrients-label">重点补充：</span>
            <div class="nutrients-tags">
              <span
                v-for="nutrient in suggestions.nextMealSuggestion.keyNutrients"
                :key="nutrient"
                class="nutrient-tag"
              >
                {{ nutrient }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 注意事项 -->
      <div v-if="suggestions.warnings.length > 0" class="warnings-section">
        <h2 class="section-title">注意事项</h2>
        <div class="warnings-list">
          <div
            v-for="(warning, index) in suggestions.warnings"
            :key="index"
            class="warning-item"
          >
            <Icon
              icon="solar:danger-triangle-bold"
              width="16"
              height="16"
              color="#ff9500"
            />
            <span>{{ warning }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import {
  generateDietSuggestions,
  checkApiConfiguration,
} from "../../services/openai";
import { Snackbar } from "@varlet/ui";

const router = useRouter();

// 响应式数据
const isLoading = ref(false);
const error = ref("");
const suggestions = ref<any>(null);

// Mock用户数据 - 实际应用中应该从store或API获取
const mockUserData = {
  userProfile: {
    id: "1",
    age: 28,
    gender: "female",
    height: 165,
  },
  currentWeight: 68,
  targetWeight: 60,
  dailyCalories: 1200,
  todayFoods: [
    { name: "鸡胸肉", calories: 200 },
    { name: "苹果", calories: 80 },
    { name: "米饭", calories: 300 },
    { name: "西兰花", calories: 50 },
    { name: "牛奶", calories: 120 },
  ],
};

// 方法
const goBack = () => {
  router.go(-1);
};

const generateSuggestions = async () => {
  if (!checkApiConfiguration()) {
    error.value = "AI服务未配置，请先设置API密钥";
    return;
  }

  isLoading.value = true;
  error.value = "";

  try {
    const result = await generateDietSuggestions(mockUserData);
    suggestions.value = result;
  } catch (err: any) {
    error.value = err.message || "生成建议失败，请稍后重试";
    console.error("Generate suggestions error:", err);
  } finally {
    isLoading.value = false;
  }
};

const regenerateSuggestions = async () => {
  if (isLoading.value) return;

  Snackbar.info("正在重新生成建议...");
  await generateSuggestions();
};

const getScoreClass = (score: number) => {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  return "needs-improvement";
};

const getCategoryIcon = (category: string) => {
  const icons = {
    breakfast: "solar:cup-hot-bold",
    lunch: "solar:dish-bold",
    dinner: "solar:moon-bold",
    snack: "solar:apple-bold",
  };
  return icons[category as keyof typeof icons] || "solar:dish-bold";
};

const getCategoryName = (category: string) => {
  const names = {
    breakfast: "早餐",
    lunch: "午餐",
    dinner: "晚餐",
    snack: "加餐",
  };
  return names[category as keyof typeof names] || category;
};

// 生命周期
onMounted(() => {
  generateSuggestions();
});
</script>

<style scoped lang="less">
.ai-diet-page {
  min-height: 100vh;
  background: #f6f6f6;
  padding-bottom: 80px;

  .header {
    background: #fff;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;

    .back-btn,
    .refresh-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background: #f5f5f5;
      }

      &.loading {
        animation: spin 1s linear infinite;
      }
    }

    .page-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e0e0e0;
      border-top: 3px solid @color-primary;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    .loading-text {
      color: #666;
      font-size: 14px;
    }
  }

  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;

    .error-text {
      color: #666;
      text-align: center;
      margin: 16px 0;
      line-height: 1.5;
    }

    .retry-btn {
      background: @color-primary;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background: darken(@color-primary, 10%);
      }
    }
  }

  .content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .summary-card {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .summary-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;

      h2 {
        font-size: 18px;
        font-weight: 600;
        margin: 0;
      }

      .nutrition-score {
        padding: 6px 12px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;

        &.excellent {
          background: #e8f5e8;
          color: #2e7d32;
        }

        &.good {
          background: #fff3e0;
          color: #f57c00;
        }

        &.needs-improvement {
          background: #ffebee;
          color: #d32f2f;
        }
      }
    }

    .summary-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 16px;

      .stat-item {
        text-align: center;

        .stat-label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: #333;

          &.negative {
            color: #d32f2f;
          }
        }
      }
    }

    .balance-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      font-size: 14px;
      color: #666;
    }
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  }

  .recommendations-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .recommendation-card {
      background: #fff;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      border-left: 4px solid transparent;

      &.high-priority {
        border-left-color: @color-primary;
      }

      .rec-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;

        .rec-category {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #666;

          .priority-badge {
            background: @color-primary;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
          }
        }

        .rec-calories {
          font-weight: 600;
          color: @color-primary;
        }
      }

      .rec-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: #333;
      }

      .rec-description {
        color: #666;
        line-height: 1.5;
        margin-bottom: 16px;
      }

      .foods-list {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .food-item {
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;

          .food-main {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 4px;

            .food-name {
              font-weight: 500;
              color: #333;
            }

            .food-portion {
              font-size: 12px;
              color: #666;
            }
          }

          .food-details {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;

            .food-calories {
              color: @color-primary;
              font-weight: 500;
            }

            .food-benefits {
              color: #666;
            }
          }
        }
      }
    }
  }

  .tips-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;

    .tip-card {
      background: #fff;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      text-align: center;

      .tip-icon {
        font-size: 32px;
        margin-bottom: 12px;
      }

      .tip-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: #333;
      }

      .tip-content {
        color: #666;
        line-height: 1.5;
        font-size: 14px;
      }
    }
  }

  .next-meal-card {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .meal-info {
      margin-bottom: 16px;

      .meal-type {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
      }

      .meal-time,
      .meal-calories {
        font-size: 14px;
        color: #666;
        margin-bottom: 4px;
      }
    }

    .key-nutrients {
      .nutrients-label {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
        display: block;
      }

      .nutrients-tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;

        .nutrient-tag {
          background: @color-primary;
          color: white;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
        }
      }
    }
  }

  .warnings-list {
    .warning-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 12px;
      background: #fff3e0;
      border-radius: 8px;
      margin-bottom: 8px;
      font-size: 14px;
      color: #e65100;
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
