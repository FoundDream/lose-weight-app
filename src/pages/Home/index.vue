<script setup lang="ts">
import { computed } from "vue";
import WeightCard from "./components/WeightCard/index.vue";
import { useWeightStore } from "../../stores/weight";
import AiClario from "./components/AiClario/index.vue";
import WeightTrendChart from "./components/WeightTrendChart/index.vue";

const weightStore = useWeightStore();

// 从store获取数据
const currentWeight = computed(() => weightStore.currentWeight);
const targetWeight = computed(() => weightStore.targetWeight);
const originalWeight = 100;
const weightUnit = computed(() => weightStore.unit);
</script>

<template>
  <div class="home-page">
    <!-- 主要内容 -->
    <div class="main-content">
      <!-- 体重卡片 -->
      <WeightCard
        :current-weight="currentWeight"
        :target-weight="targetWeight"
        :original-weight="originalWeight"
        :unit="weightUnit"
      />

      <!-- 体重趋势图表 -->
      <WeightTrendChart />

      <!-- AI热量计算卡片 -->
      <AiClario />
    </div>
  </div>
</template>

<style scoped lang="less">
.home-page {
  min-height: 100vh;
}

.main-content {
  padding: 0 @spacing-lg @spacing-lg;
  display: flex;
  flex-direction: column;
  gap: @spacing-lg;
}
</style>
