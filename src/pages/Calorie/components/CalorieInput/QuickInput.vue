<template>
  <div class="quick-input">
    <div class="quick-header">
      <h4>快速录入</h4>
      <button @click="showMore = !showMore" class="toggle-btn">
        {{ showMore ? "收起" : "更多" }}
      </button>
    </div>

    <!-- 常用模板 -->
    <div class="templates-section">
      <div class="templates-grid">
        <button
          v-for="template in displayTemplates"
          :key="template.id"
          @click="selectTemplate(template)"
          :disabled="disabled"
          class="template-btn"
        >
          <span class="template-icon">{{ template.icon }}</span>
          <span class="template-name">{{ template.name }}</span>
          <span class="template-calories"
            >{{ template.estimatedCalories }}kcal</span
          >
        </button>
      </div>
    </div>

    <!-- 分类模板（展开时显示） -->
    <div v-if="showMore" class="categories-section">
      <div
        v-for="category in categories"
        :key="category"
        class="category-group"
      >
        <h5 class="category-title">{{ getCategoryName(category) }}</h5>
        <div class="category-templates">
          <button
            v-for="template in getTemplatesByCategory(category)"
            :key="template.id"
            @click="selectTemplate(template)"
            :disabled="disabled"
            class="category-template-btn"
          >
            <span class="template-icon">{{ template.icon }}</span>
            <span class="template-info">
              <span class="template-name">{{ template.name }}</span>
              <span class="template-desc">{{ template.description }}</span>
              <span class="template-calories"
                >{{ template.estimatedCalories }}kcal</span
              >
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { QuickInputTemplate } from "../../../../types/calorie";

// Props
interface Props {
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
});

// Emits
const emit = defineEmits<{
  "template-selected": [template: string];
}>();

// 状态
const showMore = ref(false);

// 快速模板数据
const quickTemplates: QuickInputTemplate[] = [
  {
    id: "1",
    name: "白米饭",
    description: "一碗约150g",
    estimatedCalories: 206,
    category: "lunch",
    icon: "🍚",
  },
  {
    id: "2",
    name: "苹果",
    description: "一个中等大小",
    estimatedCalories: 95,
    category: "snack",
    icon: "🍎",
  },
  {
    id: "3",
    name: "鸡蛋",
    description: "一个煮蛋",
    estimatedCalories: 70,
    category: "breakfast",
    icon: "🥚",
  },
  {
    id: "4",
    name: "全麦面包",
    description: "一片约25g",
    estimatedCalories: 80,
    category: "breakfast",
    icon: "🍞",
  },
  {
    id: "5",
    name: "牛奶",
    description: "一杯250ml",
    estimatedCalories: 150,
    category: "breakfast",
    icon: "🥛",
  },
  {
    id: "6",
    name: "香蕉",
    description: "一根中等大小",
    estimatedCalories: 105,
    category: "snack",
    icon: "🍌",
  },
  {
    id: "7",
    name: "鸡胸肉",
    description: "100g无皮",
    estimatedCalories: 165,
    category: "lunch",
    icon: "🍗",
  },
  {
    id: "8",
    name: "酸奶",
    description: "一杯200g",
    estimatedCalories: 120,
    category: "snack",
    icon: "🥛",
  },
  {
    id: "9",
    name: "西蓝花",
    description: "100g水煮",
    estimatedCalories: 34,
    category: "lunch",
    icon: "🥦",
  },
  {
    id: "10",
    name: "燕麦",
    description: "50g干燕麦",
    estimatedCalories: 190,
    category: "breakfast",
    icon: "🥣",
  },
  {
    id: "11",
    name: "沙拉",
    description: "蔬菜沙拉一份",
    estimatedCalories: 120,
    category: "lunch",
    icon: "🥗",
  },
  {
    id: "12",
    name: "坚果",
    description: "一小把约30g",
    estimatedCalories: 180,
    category: "snack",
    icon: "🥜",
  },
];

// 常用模板（默认显示前6个）
const displayTemplates = computed(() =>
  showMore.value ? quickTemplates.slice(0, 6) : quickTemplates.slice(0, 6)
);

// 分类
const categories = ["breakfast", "lunch", "dinner", "snack"] as const;

// 计算属性
const getCategoryName = (category: string) => {
  const names = {
    breakfast: "早餐",
    lunch: "午餐",
    dinner: "晚餐",
    snack: "零食",
  };
  return names[category as keyof typeof names] || category;
};

const getTemplatesByCategory = (category: string) => {
  return quickTemplates.filter((t) => t.category === category);
};

// 方法
const selectTemplate = (template: QuickInputTemplate) => {
  const description = `${template.name}（${template.description}）`;
  emit("template-selected", description);
};
</script>

<style scoped lang="less">
.quick-input {
  margin-bottom: @spacing-md;

  .quick-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: @spacing-sm;

    h4 {
      font-size: @font-size-base;
      font-weight: @font-weight-semibold;
      color: @color-text-primary;
      margin: 0;
    }

    .toggle-btn {
      background: none;
      border: 1px solid @color-border-light;
      border-radius: 16px;
      padding: 4px 12px;
      font-size: @font-size-xs;
      color: @color-text-secondary;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: @color-primary;
        color: @color-primary;
      }
    }
  }

  .templates-section {
    margin-bottom: @spacing-sm;

    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: @spacing-xs;

      .template-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: @spacing-sm;
        background: @color-bg-secondary;
        border: 1px solid @color-border-light;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
          border-color: @color-primary;
          background: lighten(@color-primary, 45%);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .template-icon {
          font-size: 20px;
          margin-bottom: 4px;
        }

        .template-name {
          font-size: @font-size-xs;
          font-weight: @font-weight-semibold;
          color: @color-text-primary;
          margin-bottom: 2px;
        }

        .template-calories {
          font-size: @font-size-xs;
          color: @color-text-tertiary;
        }
      }
    }
  }

  .categories-section {
    border-top: 1px solid @color-border-light;
    padding-top: @spacing-sm;

    .category-group {
      margin-bottom: @spacing-md;

      .category-title {
        font-size: @font-size-sm;
        font-weight: @font-weight-semibold;
        color: @color-text-secondary;
        margin-bottom: @spacing-xs;
      }

      .category-templates {
        display: grid;
        gap: @spacing-xs;

        .category-template-btn {
          display: flex;
          align-items: center;
          gap: @spacing-sm;
          padding: @spacing-sm;
          background: white;
          border: 1px solid @color-border-light;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;

          &:hover:not(:disabled) {
            border-color: @color-primary;
            box-shadow: 0 2px 8px rgba(86, 181, 199, 0.2);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .template-icon {
            font-size: 18px;
            flex-shrink: 0;
          }

          .template-info {
            flex: 1;
            display: flex;
            flex-direction: column;

            .template-name {
              font-size: @font-size-sm;
              font-weight: @font-weight-semibold;
              color: @color-text-primary;
              margin-bottom: 2px;
            }

            .template-desc {
              font-size: @font-size-xs;
              color: @color-text-secondary;
              margin-bottom: 2px;
            }

            .template-calories {
              font-size: @font-size-xs;
              color: @color-primary;
              font-weight: @font-weight-semibold;
            }
          }
        }
      }
    }
  }
}
</style>
