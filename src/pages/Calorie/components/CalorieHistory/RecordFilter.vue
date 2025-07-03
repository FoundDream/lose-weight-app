<template>
  <div class="record-filter">
    <div class="filter-section">
      <!-- 日期范围筛选 -->
      <div class="filter-group">
        <label class="filter-label">日期范围</label>
        <div class="date-range">
          <input
            v-model="localFilter.dateRange.start"
            type="date"
            class="date-input"
            @change="handleFilterChange"
          />
          <span class="date-separator">至</span>
          <input
            v-model="localFilter.dateRange.end"
            type="date"
            class="date-input"
            @change="handleFilterChange"
          />
        </div>
        <div class="quick-dates">
          <button
            v-for="preset in datePresets"
            :key="preset.label"
            @click="applyDatePreset(preset)"
            class="preset-btn"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>

      <!-- 搜索筛选 -->
      <div class="filter-group">
        <label class="filter-label">搜索</label>
        <div class="search-wrapper">
          <input
            v-model="localFilter.searchText"
            type="text"
            placeholder="搜索食物名称或描述..."
            class="search-input"
            @input="handleFilterChange"
          />
          <button
            v-if="localFilter.searchText"
            @click="clearSearch"
            class="clear-btn"
          >
            ×
          </button>
        </div>
      </div>

      <!-- 排序选项 -->
      <div class="filter-group">
        <label class="filter-label">排序</label>
        <div class="sort-options">
          <select
            v-model="localFilter.sortBy"
            class="sort-select"
            @change="handleFilterChange"
          >
            <option value="date">按日期</option>
            <option value="calories">按热量</option>
            <option value="confidence">按置信度</option>
          </select>
          <button
            @click="toggleSortOrder"
            class="sort-order-btn"
            :title="localFilter.sortOrder === 'desc' ? '降序' : '升序'"
          >
            {{ localFilter.sortOrder === "desc" ? "↓" : "↑" }}
          </button>
        </div>
      </div>

      <!-- 重置按钮 -->
      <div class="filter-actions">
        <button @click="resetFilter" class="reset-btn">重置筛选</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { CalorieFilter } from "../../../../types/calorie";

// Props
interface Props {
  modelValue: CalorieFilter;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  "update:modelValue": [filter: CalorieFilter];
  "filter-change": [filter: CalorieFilter];
}>();

// 本地筛选状态
const localFilter = reactive<CalorieFilter>({ ...props.modelValue });

// 日期预设选项
const datePresets = [
  {
    label: "今天",
    start: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    },
    end: () => {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return today;
    },
  },
  {
    label: "昨天",
    start: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      return yesterday;
    },
    end: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(23, 59, 59, 999);
      return yesterday;
    },
  },
  {
    label: "本周",
    start: () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      monday.setHours(0, 0, 0, 0);
      return monday;
    },
    end: () => {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return today;
    },
  },
  {
    label: "本月",
    start: () => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      firstDay.setHours(0, 0, 0, 0);
      return firstDay;
    },
    end: () => {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return today;
    },
  },
];

// 监听props变化
watch(
  () => props.modelValue,
  (newValue) => {
    Object.assign(localFilter, newValue);
  },
  { deep: true }
);

// 方法
const handleFilterChange = () => {
  // 转换日期字符串为Date对象
  const filter: CalorieFilter = {
    ...localFilter,
    dateRange: {
      start: localFilter.dateRange.start
        ? new Date(localFilter.dateRange.start as any)
        : null,
      end: localFilter.dateRange.end
        ? new Date(localFilter.dateRange.end as any)
        : null,
    },
  };

  emit("update:modelValue", filter);
  emit("filter-change", filter);
};

const applyDatePreset = (preset: any) => {
  localFilter.dateRange.start = preset.start();
  localFilter.dateRange.end = preset.end();
  handleFilterChange();
};

const clearSearch = () => {
  localFilter.searchText = "";
  handleFilterChange();
};

const toggleSortOrder = () => {
  localFilter.sortOrder = localFilter.sortOrder === "desc" ? "asc" : "desc";
  handleFilterChange();
};

const resetFilter = () => {
  Object.assign(localFilter, {
    dateRange: {
      start: null,
      end: null,
    },
    searchText: "",
    sortBy: "date",
    sortOrder: "desc",
  });
  handleFilterChange();
};

// 格式化日期为输入框格式
const formatDateForInput = (date: Date | null) => {
  if (!date) return "";
  return date.toISOString().split("T")[0];
};

// 初始化时格式化日期
if (localFilter.dateRange.start) {
  localFilter.dateRange.start = formatDateForInput(
    localFilter.dateRange.start as any
  ) as any;
}
if (localFilter.dateRange.end) {
  localFilter.dateRange.end = formatDateForInput(
    localFilter.dateRange.end as any
  ) as any;
}
</script>

<style scoped lang="less">
.record-filter {
  padding: @spacing-md;
  background: @color-bg-secondary;
  border-radius: 12px;
  margin-bottom: @spacing-md;

  .filter-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: @spacing-md;

    .filter-group {
      .filter-label {
        display: block;
        font-size: @font-size-sm;
        font-weight: @font-weight-semibold;
        color: @color-text-primary;
        margin-bottom: @spacing-xs;
      }

      .date-range {
        display: flex;
        align-items: center;
        gap: @spacing-xs;
        margin-bottom: @spacing-xs;

        .date-input {
          flex: 1;
          padding: @spacing-xs;
          border: 1px solid @color-border-light;
          border-radius: 6px;
          font-size: @font-size-sm;

          &:focus {
            outline: none;
            border-color: @color-primary;
          }
        }

        .date-separator {
          font-size: @font-size-sm;
          color: @color-text-secondary;
        }
      }

      .quick-dates {
        display: flex;
        flex-wrap: wrap;
        gap: @spacing-xs;

        .preset-btn {
          padding: 4px 8px;
          background: white;
          border: 1px solid @color-border-light;
          border-radius: 12px;
          font-size: @font-size-xs;
          color: @color-text-secondary;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            border-color: @color-primary;
            color: @color-primary;
            background: lighten(@color-primary, 45%);
          }
        }
      }

      .search-wrapper {
        position: relative;

        .search-input {
          width: 100%;
          padding: @spacing-xs @spacing-sm;
          padding-right: 30px;
          border: 1px solid @color-border-light;
          border-radius: 6px;
          font-size: @font-size-sm;

          &:focus {
            outline: none;
            border-color: @color-primary;
          }
        }

        .clear-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          border: none;
          background: @color-text-tertiary;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          font-size: @font-size-sm;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            background: @color-danger;
          }
        }
      }

      .sort-options {
        display: flex;
        gap: @spacing-xs;

        .sort-select {
          flex: 1;
          padding: @spacing-xs;
          border: 1px solid @color-border-light;
          border-radius: 6px;
          font-size: @font-size-sm;

          &:focus {
            outline: none;
            border-color: @color-primary;
          }
        }

        .sort-order-btn {
          width: 32px;
          height: 32px;
          border: 1px solid @color-border-light;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: @font-size-sm;
          font-weight: @font-weight-bold;
          transition: all 0.3s ease;

          &:hover {
            border-color: @color-primary;
            color: @color-primary;
            background: lighten(@color-primary, 45%);
          }
        }
      }
    }

    .filter-actions {
      display: flex;
      align-items: flex-end;

      .reset-btn {
        padding: @spacing-xs @spacing-md;
        background: @color-text-tertiary;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: @font-size-sm;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: darken(@color-text-tertiary, 10%);
        }
      }
    }
  }
}
</style>
