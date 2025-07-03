<template>
  <div class="calorie-history">
    <div class="history-card">
      <div class="history-header">
        <h3>历史记录</h3>
        <button @click="showFilter = !showFilter" class="filter-toggle">
          <span class="filter-icon">🔍</span>
          <span>{{ showFilter ? "收起" : "筛选" }}</span>
        </button>
      </div>

      <!-- 筛选器 -->
      <RecordFilter
        v-show="showFilter"
        v-model="currentFilter"
        @filter-change="handleFilterChange"
      />

      <!-- 记录统计 -->
      <div class="records-summary">
        <div class="summary-item">
          <span class="summary-label">共找到</span>
          <span class="summary-value">{{ filteredRecords.length }}</span>
          <span class="summary-label">条记录</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">总热量</span>
          <span class="summary-value">{{ totalFilteredCalories }}</span>
          <span class="summary-label">kcal</span>
        </div>
      </div>

      <!-- 记录列表 -->
      <div class="records-list">
        <div v-if="filteredRecords.length === 0" class="no-records">
          <div class="no-records-icon">📝</div>
          <div class="no-records-text">暂无记录</div>
          <div class="no-records-subtitle">
            {{
              allRecords.length === 0
                ? "开始记录你的第一餐吧！"
                : "尝试调整筛选条件"
            }}
          </div>
        </div>

        <div v-else class="records-container">
          <!-- 按日期分组显示 -->
          <div
            v-for="(dayRecords, date) in groupedRecords"
            :key="date"
            class="day-group"
          >
            <div class="day-header">
              <span class="day-date">{{ formatDateHeader(date) }}</span>
              <span class="day-total">{{ getDayTotal(dayRecords) }}kcal</span>
            </div>

            <div class="day-records">
              <RecordItem
                v-for="record in dayRecords"
                :key="record.id"
                :record="record"
                @edit="handleEditRecord"
                @delete="handleDeleteRecord"
              />
            </div>
          </div>

          <!-- 加载更多按钮 -->
          <div v-if="hasMoreRecords" class="load-more">
            <button @click="loadMore" class="load-more-btn">
              加载更多记录
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useWeightStore } from "../../../../stores/weight";
import RecordFilter from "./RecordFilter.vue";
import RecordItem from "./RecordItem.vue";
import type { CalorieAnalysis, CalorieFilter } from "../../../../types/calorie";

// Emits
const emit = defineEmits<{
  "record-updated": [];
}>();

// Store
const weightStore = useWeightStore();

// 响应式数据
const showFilter = ref(false);
const currentFilter = ref<CalorieFilter>({
  dateRange: {
    start: null,
    end: null,
  },
  searchText: "",
  sortBy: "date",
  sortOrder: "desc",
});
const displayCount = ref(20); // 初始显示记录数

// 计算属性
const allRecords = computed(() => {
  return weightStore.calorieAnalyses;
});

const filteredRecords = computed(() => {
  let records = [...allRecords.value];
  const filter = currentFilter.value;

  // 日期筛选
  if (filter.dateRange.start) {
    records = records.filter(
      (record) => new Date(record.timestamp) >= filter.dateRange.start!
    );
  }
  if (filter.dateRange.end) {
    const endDate = new Date(filter.dateRange.end);
    endDate.setHours(23, 59, 59, 999); // 包含结束日期的全天
    records = records.filter((record) => new Date(record.timestamp) <= endDate);
  }

  // 搜索文本筛选
  if (filter.searchText.trim()) {
    const searchLower = filter.searchText.toLowerCase();
    records = records.filter(
      (record) =>
        record.originalInput.toLowerCase().includes(searchLower) ||
        record.foods.some((food) =>
          food.name.toLowerCase().includes(searchLower)
        )
    );
  }

  // 排序
  records.sort((a, b) => {
    let compareValue = 0;

    switch (filter.sortBy) {
      case "date":
        compareValue =
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        break;
      case "calories":
        compareValue = a.totalCalories - b.totalCalories;
        break;
      case "confidence":
        compareValue = a.confidence - b.confidence;
        break;
    }

    return filter.sortOrder === "asc" ? compareValue : -compareValue;
  });

  // 限制显示数量
  return records.slice(0, displayCount.value);
});

const groupedRecords = computed(() => {
  const groups: Record<string, CalorieAnalysis[]> = {};

  filteredRecords.value.forEach((record) => {
    const date = new Date(record.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
  });

  return groups;
});

const totalFilteredCalories = computed(() => {
  return filteredRecords.value.reduce(
    (total, record) => total + record.totalCalories,
    0
  );
});

const hasMoreRecords = computed(() => {
  // 检查是否还有更多记录可以加载（未被筛选和分页限制的）
  let totalAvailable = allRecords.value.length;

  // 应用筛选条件但不应用分页限制来计算实际可用记录数
  const filter = currentFilter.value;
  if (
    filter.dateRange.start ||
    filter.dateRange.end ||
    filter.searchText.trim()
  ) {
    let filtered = [...allRecords.value];

    if (filter.dateRange.start) {
      filtered = filtered.filter(
        (record) => new Date(record.timestamp) >= filter.dateRange.start!
      );
    }
    if (filter.dateRange.end) {
      const endDate = new Date(filter.dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (record) => new Date(record.timestamp) <= endDate
      );
    }
    if (filter.searchText.trim()) {
      const searchLower = filter.searchText.toLowerCase();
      filtered = filtered.filter(
        (record) =>
          record.originalInput.toLowerCase().includes(searchLower) ||
          record.foods.some((food) =>
            food.name.toLowerCase().includes(searchLower)
          )
      );
    }

    totalAvailable = filtered.length;
  }

  return displayCount.value < totalAvailable;
});

// 方法
const handleFilterChange = (newFilter: CalorieFilter) => {
  currentFilter.value = { ...newFilter };
  displayCount.value = 20; // 重置显示数量
};

const formatDateHeader = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  if (date.toDateString() === today.toDateString()) {
    return "今天";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "昨天";
  } else {
    return date.toLocaleDateString("zh-CN", {
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  }
};

const getDayTotal = (dayRecords: CalorieAnalysis[]) => {
  return dayRecords.reduce((total, record) => total + record.totalCalories, 0);
};

const handleEditRecord = (record: CalorieAnalysis) => {
  // 这里可以打开编辑对话框或跳转到编辑页面
  console.log("编辑记录:", record);
  emit("record-updated");
};

const handleDeleteRecord = (record: CalorieAnalysis) => {
  if (confirm("确定要删除这条记录吗？")) {
    weightStore.deleteAnalysis(record.id);
    emit("record-updated");
  }
};

const loadMore = () => {
  displayCount.value += 20;
};

onMounted(() => {
  // 组件挂载时可以进行一些初始化操作
  console.log("历史记录组件已挂载");
});
</script>

<style scoped lang="less">
.calorie-history {
  .history-card {
    background: #ffffff;
    border-radius: 16px;
    padding: @spacing-lg;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: @spacing-md;

      h3 {
        font-size: @font-size-lg;
        font-weight: @font-weight-semibold;
        color: @color-text-primary;
        margin: 0;
      }

      .filter-toggle {
        display: flex;
        align-items: center;
        gap: @spacing-xs;
        padding: @spacing-xs @spacing-sm;
        background: @color-bg-secondary;
        border: 1px solid @color-border-light;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: @font-size-sm;

        &:hover {
          border-color: @color-primary;
          background: lighten(@color-primary, 45%);
        }

        .filter-icon {
          font-size: @font-size-sm;
        }
      }
    }

    .records-summary {
      display: flex;
      justify-content: space-between;
      padding: @spacing-sm @spacing-md;
      background: @color-bg-secondary;
      border-radius: 12px;
      margin-bottom: @spacing-md;

      .summary-item {
        display: flex;
        align-items: center;
        gap: 4px;

        .summary-label {
          font-size: @font-size-sm;
          color: @color-text-secondary;
        }

        .summary-value {
          font-size: @font-size-sm;
          font-weight: @font-weight-semibold;
          color: @color-primary;
        }
      }
    }

    .records-list {
      .no-records {
        text-align: center;
        padding: @spacing-xl 0;

        .no-records-icon {
          font-size: 48px;
          margin-bottom: @spacing-md;
        }

        .no-records-text {
          font-size: @font-size-lg;
          color: @color-text-secondary;
          margin-bottom: @spacing-xs;
        }

        .no-records-subtitle {
          font-size: @font-size-sm;
          color: @color-text-tertiary;
        }
      }

      .records-container {
        .day-group {
          margin-bottom: @spacing-lg;

          .day-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: @spacing-sm 0;
            border-bottom: 2px solid @color-border-light;
            margin-bottom: @spacing-sm;

            .day-date {
              font-size: @font-size-base;
              font-weight: @font-weight-semibold;
              color: @color-text-primary;
            }

            .day-total {
              font-size: @font-size-sm;
              font-weight: @font-weight-semibold;
              color: @color-primary;
              background: lighten(@color-primary, 45%);
              padding: 4px 8px;
              border-radius: 12px;
            }
          }

          .day-records {
            display: flex;
            flex-direction: column;
            gap: @spacing-sm;
          }
        }

        .load-more {
          text-align: center;
          margin-top: @spacing-lg;
          padding-top: @spacing-lg;
          border-top: 1px solid @color-border-light;

          .load-more-btn {
            padding: @spacing-sm @spacing-lg;
            background: @color-bg-secondary;
            border: 1px solid @color-border-light;
            border-radius: 20px;
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
      }
    }
  }
}
</style>
