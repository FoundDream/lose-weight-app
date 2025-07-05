<template>
  <div class="target-page">
    <!-- 顶部用户信息 -->
    <div class="user-header">
      <div class="avatar-wrap">
        <img :src="user.avatar" alt="avatar" class="avatar" />
      </div>
      <div class="welcome">目标</div>
      <var-icon name="bell" />
    </div>

    <!-- 体重目标卡片 -->
    <div class="weight-target-card">
      <div class="card-header">
        <div class="card-title">体重目标</div>
        <var-icon
          name="edit"
          size="18"
          color="#666"
          @click="showWeightEditDialog = true"
        />
      </div>
      <div class="weight-progress">
        <div class="progress-circle">
          <canvas ref="progressChart" width="120" height="120"></canvas>
          <div class="progress-center">
            <div class="current-weight">{{ currentWeight }}</div>
            <div class="weight-unit">kg</div>
          </div>
        </div>
        <div class="weight-stats">
          <div class="stat-item">
            <div class="stat-label">起始体重</div>
            <div class="stat-value">{{ originalWeight }}kg</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">目标体重</div>
            <div class="stat-value">{{ targetWeight }}kg</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">已减重</div>
            <div class="stat-value">{{ lostWeight }}kg</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热量目标看板 -->
    <div class="calorie-dashboard">
      <div class="card-header">
        <div class="card-title">热量目标</div>
        <var-icon
          name="edit"
          size="18"
          color="#666"
          @click="showCalorieEditDialog = true"
        />
      </div>
      <div class="calorie-grid">
        <div class="calorie-card intake">
          <div class="calorie-icon">
            <Icon
              icon="solar:dish-bold"
              color="#ff6b6b"
              width="28"
              height="28"
            />
          </div>
          <div class="calorie-content">
            <div class="calorie-value">{{ currentCalories }}</div>
            <div class="calorie-label">已摄入</div>
            <div class="calorie-target">目标: {{ targetCalories }} kcal</div>
          </div>
          <div class="calorie-progress">
            <div class="progress-ring">
              <svg viewBox="0 0 36 36" class="circular-chart">
                <path
                  class="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  class="circle"
                  :stroke-dasharray="`${calorieProgress}, 100`"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div class="percentage">{{ Math.round(calorieProgress) }}%</div>
            </div>
          </div>
        </div>
        <div class="calorie-card exercise">
          <div class="calorie-icon">
            <Icon
              icon="solar:running-bold"
              color="#4ecdc4"
              width="28"
              height="28"
            />
          </div>
          <div class="calorie-content">
            <div class="calorie-value">{{ currentExercise }}</div>
            <div class="calorie-label">已消耗</div>
            <div class="calorie-target">目标: {{ targetExercise }} kcal</div>
          </div>
          <div class="calorie-progress">
            <div class="progress-ring">
              <svg viewBox="0 0 36 36" class="circular-chart exercise-chart">
                <path
                  class="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  class="circle"
                  :stroke-dasharray="`${exerciseProgress}, 100`"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div class="percentage">{{ Math.round(exerciseProgress) }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 体重变化趋势图 -->
    <div class="weight-trend-card">
      <div class="card-header">
        <div class="card-title">体重变化趋势</div>
        <div class="trend-period">
          <var-chip
            v-for="period in trendPeriods"
            :key="period.value"
            :type="selectedPeriod === period.value ? 'primary' : 'default'"
            size="small"
            @click="selectedPeriod = period.value"
          >
            {{ period.label }}
          </var-chip>
        </div>
      </div>
      <div class="trend-chart-container">
        <canvas ref="trendChart" width="300" height="200"></canvas>
      </div>
      <div class="trend-stats">
        <div class="trend-stat">
          <div class="trend-stat-value">-{{ lostWeight }}kg</div>
          <div class="trend-stat-label">已减重</div>
        </div>
        <div class="trend-stat">
          <div class="trend-stat-value">{{ remainingWeight }}kg</div>
          <div class="trend-stat-label">距离目标</div>
        </div>
        <div class="trend-stat">
          <div class="trend-stat-value">{{ estimatedDays }}天</div>
          <div class="trend-stat-label">预计达成</div>
        </div>
      </div>
    </div>

    <!-- 编辑体重目标对话框 -->
    <var-dialog v-model:show="showWeightEditDialog" title="编辑体重目标">
      <div class="edit-form">
        <var-input
          v-model="editData.targetWeight"
          type="number"
          label="目标体重 (kg)"
          placeholder="请输入目标体重"
        />
        <var-input
          v-model="editData.targetDate"
          type="number"
          label="目标日期"
          placeholder="选择目标日期"
        />
      </div>
      <template #actions>
        <var-button @click="showWeightEditDialog = false">取消</var-button>
        <var-button type="primary" @click="saveWeightTarget">保存</var-button>
      </template>
    </var-dialog>

    <!-- 编辑热量目标对话框 -->
    <var-dialog v-model:show="showCalorieEditDialog" title="编辑热量目标">
      <div class="edit-form">
        <var-input
          v-model="editData.targetCalories"
          type="number"
          label="每日摄入目标 (kcal)"
          placeholder="请输入热量目标"
        />
        <var-input
          v-model="editData.targetExercise"
          type="number"
          label="每日消耗目标 (kcal)"
          placeholder="请输入运动目标"
        />
      </div>
      <template #actions>
        <var-button @click="showCalorieEditDialog = false">取消</var-button>
        <var-button type="primary" @click="saveCalorieTarget">保存</var-button>
      </template>
    </var-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { Icon } from "@iconify/vue";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
} from "chart.js";

Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler
);

type User = {
  name: string;
  avatar: string;
};

type TrendPeriod = {
  label: string;
  value: string;
};

type WeightData = {
  date: string;
  weight: number;
};

const user = ref<User>({
  name: "Barbara Carney",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Barbara",
});

// 体重数据
const originalWeight = ref(72);
const currentWeight = ref(68);
const targetWeight = ref(65);
const lostWeight = computed(() => originalWeight.value - currentWeight.value);
const remainingWeight = computed(
  () => currentWeight.value - targetWeight.value
);
const estimatedDays = computed(() =>
  Math.ceil((remainingWeight.value / 0.1) * 7)
); // 假设每周减重0.1kg

// 每日目标数据
const targetCalories = ref(1500);
const currentCalories = ref(1200);
const targetExercise = ref(300);
const currentExercise = ref(180);

// 进度计算
const calorieProgress = computed(() =>
  Math.min((currentCalories.value / targetCalories.value) * 100, 100)
);
const exerciseProgress = computed(() =>
  Math.min((currentExercise.value / targetExercise.value) * 100, 100)
);

// 趋势图数据
const trendPeriods = ref<TrendPeriod[]>([
  { label: "7天", value: "7d" },
  { label: "30天", value: "30d" },
  { label: "90天", value: "90d" },
]);

const selectedPeriod = ref("30d");

// 模拟体重变化数据
const weightData = ref<WeightData[]>([
  { date: "2024-01-01", weight: 72 },
  { date: "2024-01-05", weight: 71.5 },
  { date: "2024-01-10", weight: 71.2 },
  { date: "2024-01-15", weight: 70.8 },
  { date: "2024-01-20", weight: 70.5 },
  { date: "2024-01-25", weight: 70.1 },
  { date: "2024-01-30", weight: 69.8 },
  { date: "2024-02-04", weight: 69.5 },
  { date: "2024-02-09", weight: 69.2 },
  { date: "2024-02-14", weight: 68.9 },
  { date: "2024-02-19", weight: 68.6 },
  { date: "2024-02-24", weight: 68.3 },
  { date: "2024-03-01", weight: 68.0 },
]);

// 编辑对话框状态
const showWeightEditDialog = ref(false);
const showCalorieEditDialog = ref(false);

// 编辑数据
const editData = ref({
  targetWeight: String(targetWeight.value),
  targetDate: "2024-12-31",
  targetCalories: String(targetCalories.value),
  targetExercise: String(targetExercise.value),
});

// Chart.js 实例
const progressChart = ref<HTMLCanvasElement | null>(null);
const trendChart = ref<HTMLCanvasElement | null>(null);
let progressChartInstance: Chart | null = null;
let trendChartInstance: Chart | null = null;

// 方法
const saveWeightTarget = () => {
  targetWeight.value = Number(editData.value.targetWeight);
  showWeightEditDialog.value = false;
  updateProgressChart();
};

const saveCalorieTarget = () => {
  targetCalories.value = Number(editData.value.targetCalories);
  targetExercise.value = Number(editData.value.targetExercise);
  showCalorieEditDialog.value = false;
};

const updateProgressChart = () => {
  if (progressChartInstance) {
    const totalLoss = originalWeight.value - targetWeight.value;
    const currentLoss = originalWeight.value - currentWeight.value;
    const progress = Math.min((currentLoss / totalLoss) * 100, 100);

    progressChartInstance.data.datasets[0].data = [progress, 100 - progress];
    progressChartInstance.update();
  }
};

const updateTrendChart = () => {
  if (trendChart.value) {
    if (trendChartInstance) trendChartInstance.destroy();

    const filteredData = weightData.value.slice(-30); // 显示最近30天的数据

    trendChartInstance = new Chart(trendChart.value, {
      type: "line",
      data: {
        labels: filteredData.map((d) =>
          new Date(d.date).toLocaleDateString("zh-CN", {
            month: "short",
            day: "numeric",
          })
        ),
        datasets: [
          {
            label: "体重变化",
            data: filteredData.map((d) => d.weight),
            borderColor: "#667eea",
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#667eea",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: "目标体重",
            data: filteredData.map(() => targetWeight.value),
            borderColor: "#f093fb",
            backgroundColor: "transparent",
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#667eea",
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (context) => `${context.parsed.y}kg`,
            },
          },
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: false,
            },
            ticks: {
              color: "#666",
              font: {
                size: 12,
              },
            },
          },
          y: {
            display: true,
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
              color: "#666",
              font: {
                size: 12,
              },
              callback: (value) => `${value}kg`,
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
      },
    });
  }
};

// 监听选择的时间段变化
watch(selectedPeriod, () => {
  updateTrendChart();
});

onMounted(() => {
  // 初始化体重进度图
  if (progressChart.value) {
    const totalLoss = originalWeight.value - targetWeight.value;
    const currentLoss = originalWeight.value - currentWeight.value;
    const progress = Math.min((currentLoss / totalLoss) * 100, 100);

    progressChartInstance = new Chart(progressChart.value, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [progress, 100 - progress],
            backgroundColor: ["#667eea", "#f0f0f0"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "75%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    });
  }

  // 初始化趋势图
  updateTrendChart();
});
</script>

<style scoped lang="less">
.target-page {
  min-height: 100vh;
  padding: 12px;
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  padding-bottom: 100px;

  .user-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 10px;

    .avatar-wrap {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);

      .avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .welcome {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
    }
  }

  .weight-target-card {
    width: 100%;
    max-width: 340px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .card-title {
        font-size: 18px;
        font-weight: 600;
        background: linear-gradient(45deg, #667eea, #764ba2);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .weight-progress {
      display: flex;
      align-items: center;
      gap: 24px;

      .progress-circle {
        position: relative;
        width: 120px;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;

        .progress-center {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .current-weight {
            font-size: 24px;
            font-weight: 700;
            background: linear-gradient(45deg, #667eea, #764ba2);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .weight-unit {
            font-size: 12px;
            color: #666;
          }
        }
      }

      .weight-stats {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border-radius: 10px;
          background: rgba(102, 126, 234, 0.05);

          .stat-label {
            font-size: 12px;
            color: #666;
          }

          .stat-value {
            font-size: 14px;
            font-weight: 600;
            color: #333;
          }
        }
      }
    }
  }

  .calorie-dashboard {
    width: 100%;
    max-width: 340px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .card-title {
        font-size: 18px;
        font-weight: 600;
        background: linear-gradient(45deg, #ff6b6b, #ffa726);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .calorie-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      .calorie-card {
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.9),
          rgba(255, 255, 255, 0.6)
        );
        border-radius: 16px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.3);

        &.intake {
          background: linear-gradient(135deg, #ff9a9e, #fecfef);
        }

        &.exercise {
          background: linear-gradient(135deg, #a8edea, #fed6e3);
        }

        .calorie-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .calorie-content {
          flex: 1;

          .calorie-value {
            font-size: 24px;
            font-weight: 700;
            color: #333;
            margin-bottom: 4px;
          }

          .calorie-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
          }

          .calorie-target {
            font-size: 10px;
            color: #888;
          }
        }

        .calorie-progress {
          position: absolute;
          top: 16px;
          right: 16px;

          .progress-ring {
            position: relative;
            width: 50px;
            height: 50px;

            .circular-chart {
              width: 100%;
              height: 100%;
              transform: rotate(-90deg);

              .circle-bg {
                fill: none;
                stroke: rgba(255, 255, 255, 0.3);
                stroke-width: 3;
              }

              .circle {
                fill: none;
                stroke: #fff;
                stroke-width: 3;
                stroke-linecap: round;
                transition: stroke-dasharray 0.3s ease;
              }

              &.exercise-chart .circle {
                stroke: #4ecdc4;
              }
            }

            .percentage {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: 10px;
              font-weight: 600;
              color: #333;
            }
          }
        }
      }
    }
  }

  .weight-trend-card {
    width: 100%;
    max-width: 340px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .card-title {
        font-size: 18px;
        font-weight: 600;
        background: linear-gradient(45deg, #667eea, #764ba2);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .trend-period {
        display: flex;
        gap: 8px;
      }
    }

    .trend-chart-container {
      height: 200px;
      margin-bottom: 20px;
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      background: linear-gradient(
        135deg,
        rgba(102, 126, 234, 0.05),
        rgba(118, 75, 162, 0.05)
      );
    }

    .trend-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;

      .trend-stat {
        text-align: center;
        padding: 16px;
        border-radius: 12px;
        background: linear-gradient(
          135deg,
          rgba(102, 126, 234, 0.1),
          rgba(118, 75, 162, 0.1)
        );

        .trend-stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #333;
          margin-bottom: 4px;
        }

        .trend-stat-label {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }

  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 8px 0;
  }
}
</style>
