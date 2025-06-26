<template>
  <div class="weight-trend-chart">
    <div class="chart-header">
      <h3 class="chart-title">体重变化趋势</h3>
      <span class="chart-period">最近15天</span>
    </div>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useWeightStore } from "../../../../stores/weight";

// 注册Chart.js组件
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

const weightStore = useWeightStore();
const chartCanvas = ref<HTMLCanvasElement>();
let chartInstance: Chart | null = null;

// 处理数据
const processChartData = () => {
  const entries = weightStore.entries.slice().reverse(); // 按时间正序排列

  const dates = entries.map((entry: any) => {
    const date = new Date(entry.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const weights = entries.map((entry: any) => entry.weight);

  return {
    labels: dates,
    datasets: [
      {
        label: "实际体重",
        data: weights,
        borderColor: "#36c1c3",
        backgroundColor: "rgba(54, 193, 195, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };
};

// 图表配置
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: "index" as const,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(17, 24, 39, 0.9)",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      borderColor: "#36c1c3",
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        label: function (context: any) {
          return `体重: ${context.parsed.y}kg`;
        },
      },
    },
  },
  scales: {
    x: {
      display: true,
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: "#9ca3af",
        font: {
          size: 11,
        },
      },
    },
    y: {
      display: true,
      grid: {
        color: "rgba(229, 231, 235, 0.5)",
        drawBorder: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: "#9ca3af",
        font: {
          size: 10,
        },
        callback: function (value: any) {
          return value + "kg";
        },
      },
      min: Math.min(...weightStore.entries.map((e: any) => e.weight)) - 1,
    },
  },
};

// 初始化图表
const initChart = () => {
  if (!chartCanvas.value) return;

  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;

  chartInstance = new Chart(ctx, {
    type: "line",
    data: processChartData(),
    options: chartOptions,
  });
};

// 更新图表
const updateChart = () => {
  if (chartInstance) {
    chartInstance.data = processChartData();
    chartInstance.update();
  }
};

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});

// 监听数据变化
watch(() => weightStore.entries, updateChart, { deep: true });
</script>

<style scoped lang="less">
.weight-trend-chart {
  background: #ffffff;
  border-radius: @border-radius-lg;
  padding: @spacing-lg;
  margin-bottom: @spacing-md;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: @spacing-lg;

  .chart-title {
    font-size: @font-size-lg;
    font-weight: @font-weight-semibold;
    color: @color-text-primary;
    margin: 0;
  }

  .chart-period {
    font-size: @font-size-sm;
    color: @color-text-tertiary;
    font-weight: @font-weight-medium;
  }
}

.chart-container {
  position: relative;
  height: 280px;
  width: 100%;
}
</style>
