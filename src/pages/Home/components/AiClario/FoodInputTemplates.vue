<template>
  <div class="food-templates">
    <div class="templates-header">
      <h4>快速输入</h4>
      <button @click="showAllTemplates = !showAllTemplates" class="toggle-btn">
        {{ showAllTemplates ? "收起" : "展开" }}
      </button>
    </div>

    <div class="template-categories" v-show="showAllTemplates">
      <div v-for="category in categories" :key="category.id" class="category">
        <h5 class="category-title">{{ category.name }}</h5>
        <div class="template-buttons">
          <button
            v-for="template in category.templates"
            :key="template.id"
            @click="selectTemplate(template)"
            class="template-btn"
          >
            {{ template.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- 快速模板按钮（始终显示） -->
    <div class="quick-templates">
      <button
        v-for="template in quickTemplates"
        :key="template.id"
        @click="selectTemplate(template)"
        class="quick-btn"
      >
        {{ template.name }}
      </button>
    </div>

    <!-- 历史输入记录 -->
    <div class="history-section" v-if="recentInputs.length > 0">
      <h4>最近输入</h4>
      <div class="history-list">
        <button
          v-for="input in recentInputs.slice(0, 5)"
          :key="input"
          @click="emit('input-selected', input)"
          class="history-btn"
        >
          {{ input }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { InputTemplate } from "../../../../types/calorie";

// Props
interface Props {
  recentInputs?: string[];
}

withDefaults(defineProps<Props>(), {
  recentInputs: () => [],
});

// Emits
const emit = defineEmits<{
  "input-selected": [value: string];
}>();

// State
const showAllTemplates = ref(false);

// 快速模板（始终显示）
const quickTemplates = ref<InputTemplate[]>([
  {
    id: "quick-1",
    name: "一碗米饭",
    placeholder: "一碗米饭",
    examples: ["一碗米饭", "半碗米饭", "一小碗米饭"],
    category: "meal",
  },
  {
    id: "quick-2",
    name: "一个苹果",
    placeholder: "一个苹果",
    examples: ["一个苹果", "半个苹果", "一个大苹果"],
    category: "fruit",
  },
  {
    id: "quick-3",
    name: "一杯咖啡",
    placeholder: "一杯咖啡",
    examples: ["一杯黑咖啡", "一杯拿铁", "一杯美式咖啡"],
    category: "drink",
  },
]);

// 所有模板分类
const categories = ref([
  {
    id: "meal",
    name: "主食",
    templates: [
      {
        id: "meal-1",
        name: "米饭",
        placeholder: "一碗米饭",
        examples: ["一碗米饭", "半碗米饭", "一小碗米饭", "一大碗米饭"],
        category: "meal" as const,
      },
      {
        id: "meal-2",
        name: "面条",
        placeholder: "一碗面条",
        examples: ["一碗面条", "一碗牛肉面", "一碗拉面", "一碗意大利面"],
        category: "meal" as const,
      },
      {
        id: "meal-3",
        name: "面包",
        placeholder: "一片面包",
        examples: ["一片面包", "两片吐司", "一个汉堡", "一个三明治"],
        category: "meal" as const,
      },
      {
        id: "meal-4",
        name: "粥",
        placeholder: "一碗粥",
        examples: ["一碗白粥", "一碗小米粥", "一碗瘦肉粥", "一碗燕麦粥"],
        category: "meal" as const,
      },
    ],
  },
  {
    id: "snack",
    name: "零食",
    templates: [
      {
        id: "snack-1",
        name: "坚果",
        placeholder: "一把坚果",
        examples: ["一把杏仁", "10颗腰果", "一小包坚果", "一把花生"],
        category: "snack" as const,
      },
      {
        id: "snack-2",
        name: "酸奶",
        placeholder: "一杯酸奶",
        examples: ["一杯酸奶", "一盒酸奶", "200ml酸奶", "一杯希腊酸奶"],
        category: "snack" as const,
      },
      {
        id: "snack-3",
        name: "饼干",
        placeholder: "几片饼干",
        examples: ["3片饼干", "一包饼干", "几片消化饼干", "5片奥利奥"],
        category: "snack" as const,
      },
    ],
  },
  {
    id: "drink",
    name: "饮品",
    templates: [
      {
        id: "drink-1",
        name: "咖啡",
        placeholder: "一杯咖啡",
        examples: ["一杯黑咖啡", "一杯拿铁", "一杯卡布奇诺", "一杯美式咖啡"],
        category: "drink" as const,
      },
      {
        id: "drink-2",
        name: "茶",
        placeholder: "一杯茶",
        examples: ["一杯绿茶", "一杯红茶", "一杯乌龙茶", "一杯奶茶"],
        category: "drink" as const,
      },
      {
        id: "drink-3",
        name: "果汁",
        placeholder: "一杯果汁",
        examples: ["一杯橙汁", "一杯苹果汁", "200ml果汁", "一杯鲜榨果汁"],
        category: "drink" as const,
      },
    ],
  },
  {
    id: "fruit",
    name: "水果",
    templates: [
      {
        id: "fruit-1",
        name: "苹果",
        placeholder: "一个苹果",
        examples: ["一个苹果", "半个苹果", "一个大苹果", "一个小苹果"],
        category: "fruit" as const,
      },
      {
        id: "fruit-2",
        name: "香蕉",
        placeholder: "一根香蕉",
        examples: ["一根香蕉", "半根香蕉", "一根大香蕉", "两根小香蕉"],
        category: "fruit" as const,
      },
      {
        id: "fruit-3",
        name: "橙子",
        placeholder: "一个橙子",
        examples: ["一个橙子", "半个橙子", "一个大橙子", "两个小橙子"],
        category: "fruit" as const,
      },
    ],
  },
]);

// 选择模板
const selectTemplate = (template: InputTemplate) => {
  emit("input-selected", template.placeholder);
};
</script>

<style scoped lang="less">
.food-templates {
  .templates-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;

    h4 {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin: 0;
    }

    .toggle-btn {
      background: none;
      border: none;
      color: @color-primary;
      font-size: 12px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.2s;

      &:hover {
        background: #f3f4f6;
      }
    }
  }

  .template-categories {
    margin-bottom: 16px;

    .category {
      margin-bottom: 16px;

      .category-title {
        font-size: 13px;
        font-weight: 500;
        color: #6b7280;
        margin: 0 0 8px 0;
      }

      .template-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;

        .template-btn {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: #f3f4f6;
            border-color: #d1d5db;
          }

          &:active {
            background: #e5e7eb;
          }
        }
      }
    }
  }

  .quick-templates {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;

    .quick-btn {
      background: @color-primary;
      border-radius: 8px;
      padding: 4px 8px;
      font-size: 12px;
      color: @color-text-inverse;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;

      &:hover {
        background: @color-primary;
        border-color: @color-primary;
      }

      &:active {
        background: @color-primary;
      }
    }
  }

  .history-section {
    h4 {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin: 0 0 8px 0;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .history-btn {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 8px 12px;
        font-size: 12px;
        color: #6b7280;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s;

        &:hover {
          background: #f9fafb;
          border-color: #d1d5db;
          color: #374151;
        }
      }
    }
  }
}
</style>
