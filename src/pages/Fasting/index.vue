<template>
  <div class="fasting-page">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 当前状态卡片 -->
      <div class="status-card">
        <div
          class="status-indicator"
          :class="{ fasting: isInFasting, eating: !isInFasting }"
        >
          <div class="status-dot"></div>
          <span class="status-text">{{
            isInFasting ? "断食中" : "进食时间"
          }}</span>
        </div>

        <!-- 大型倒计时显示 -->
        <div class="timer-display">
          <div class="timer-value">{{ formattedTimeLeft }}</div>
          <div class="timer-label">
            {{ isInFasting ? "距离可进食时间" : "距离断食开始" }}
          </div>
        </div>

        <!-- 环形进度 -->
        <div class="progress-ring">
          <canvas ref="progressChart" width="120" height="120"></canvas>
          <div class="progress-content">
            <div class="progress-percentage">
              {{ Math.round(progressPercentage) }}%
            </div>
            <div class="progress-label">
              {{ isInFasting ? "已断食" : "进食中" }}
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮区域 -->
      <div class="action-section">
        <div class="primary-actions">
          <button
            class="primary-btn"
            :class="{
              'start-btn': !isManualActive,
              'stop-btn': isManualActive,
            }"
            @click="isManualActive ? stopManualFasting() : startManualFasting()"
          >
            <Icon
              :icon="isManualActive ? 'solar:stop-bold' : 'solar:play-bold'"
              width="20"
              height="20"
            />
            {{ isManualActive ? "停止断食" : "立即开始断食" }}
          </button>
        </div>

        <div class="secondary-actions">
          <button class="secondary-btn" @click="showEditDialog = true">
            <Icon icon="solar:calendar-linear" width="18" height="18" />
            <span>时间表</span>
          </button>
          <button class="secondary-btn" @click="showStatsDialog = true">
            <Icon icon="solar:chart-linear" width="18" height="18" />
            <span>统计</span>
          </button>
        </div>
      </div>

      <!-- 今日时间表 -->
      <div class="schedule-card">
        <div class="schedule-header">
          <h3>今日时间表</h3>
          <button class="edit-schedule-btn" @click="showEditDialog = true">
            <Icon icon="solar:pen-linear" width="16" height="16" />
          </button>
        </div>
        <div class="schedule-timeline">
          <div class="timeline-item">
            <div class="timeline-time">{{ todaySchedule.fastingStart }}</div>
            <div class="timeline-content">
              <div class="timeline-title">开始断食</div>
              <div class="timeline-subtitle">
                直到 {{ todaySchedule.eatingStart }} 前不摄入卡路里
              </div>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-time">{{ todaySchedule.eatingStart }}</div>
            <div class="timeline-content">
              <div class="timeline-title">进食时间开始</div>
              <div class="timeline-subtitle">8小时进食期开始</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 预设时间底部弹窗 -->
    <var-dialog
      v-model:show="showPresetDialog"
      position="bottom"
      :close-on-click-overlay="true"
      class="bottom-dialog"
    >
      <template #title>
        <div class="popup-header">
          <h3>断食时间表</h3>
          <button class="close-btn" @click="showPresetDialog = false">
            <Icon icon="solar:close-linear" width="24" height="24" />
          </button>
        </div>
      </template>

      <div class="preset-popup">
        <div class="preset-list">
          <div
            v-for="preset in presetTimes"
            :key="preset.id"
            class="preset-option"
            :class="{ selected: selectedPreset === preset.id }"
            @click="selectPreset(preset.id)"
          >
            <div class="preset-main">
              <div class="preset-name">{{ preset.name }}</div>
              <div class="preset-details">
                {{ preset.fastingStart }} - {{ preset.eatingStart }}
              </div>
            </div>
            <div class="preset-check" v-if="selectedPreset === preset.id">
              <Icon
                icon="solar:check-circle-bold"
                width="24"
                height="24"
                color="#007AFF"
              />
            </div>
          </div>
        </div>
      </div>

      <template #actions>
        <button class="apply-btn" @click="applyPreset">应用时间表</button>
      </template>
    </var-dialog>

    <!-- 时间编辑底部弹窗 -->
    <var-dialog
      v-model:show="showEditDialog"
      position="bottom"
      :close-on-click-overlay="true"
      class="bottom-dialog"
    >
      <template #title>
        <div class="popup-header">
          <h3>编辑时间表</h3>
          <button class="close-btn" @click="showEditDialog = false">
            <Icon icon="solar:close-linear" width="24" height="24" />
          </button>
        </div>
      </template>

      <div class="edit-popup">
        <div class="time-picker-section">
          <div class="time-input-group">
            <label>断食开始时间</label>
            <input
              v-model="editSchedule.fastingStart"
              type="time"
              class="time-input"
            />
          </div>
          <div class="time-input-group">
            <label>进食时间开始</label>
            <input
              v-model="editSchedule.eatingStart"
              type="time"
              class="time-input"
            />
          </div>
        </div>

        <div class="duration-info">
          <div class="duration-item">
            <span class="duration-label">断食时长</span>
            <span class="duration-value">{{ calculatedFastingDuration }}h</span>
          </div>
          <div class="duration-item">
            <span class="duration-label">进食时长</span>
            <span class="duration-value">{{ calculatedEatingDuration }}h</span>
          </div>
        </div>
      </div>

      <template #actions>
        <button class="apply-btn" @click="saveTodaySchedule">
          保存更改
        </button>
      </template>
    </var-dialog>

    <!-- 统计信息弹窗 -->
    <var-dialog
      v-model:show="showStatsDialog"
      position="bottom"
      :close-on-click-overlay="true"
      class="bottom-dialog"
    >
      <template #title>
        <div class="popup-header">
          <h3>本周统计</h3>
          <button class="close-btn" @click="showStatsDialog = false">
            <Icon icon="solar:close-linear" width="24" height="24" />
          </button>
        </div>
      </template>

      <div class="stats-popup">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <Icon
                icon="solar:calendar-mark-bold"
                width="32"
                height="32"
                color="#34C759"
              />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ weeklyStats.completedDays }}</div>
              <div class="stat-label">完成天数</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <Icon
                icon="solar:clock-circle-bold"
                width="32"
                height="32"
                color="#FF9500"
              />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ weeklyStats.totalHours }}h</div>
              <div class="stat-label">总断食时长</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <Icon
                icon="solar:target-bold"
                width="32"
                height="32"
                color="#007AFF"
              />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ weeklyStats.avgDuration }}h</div>
              <div class="stat-label">平均断食时长</div>
            </div>
          </div>
        </div>
      </div>
    </var-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from "vue";
import { Icon } from "@iconify/vue";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

type PresetTime = {
  id: number;
  name: string;
  fastingStart: string;
  eatingStart: string;
  eatingEnd: string;
};

type Schedule = {
  fastingStart: string;
  eatingStart: string;
  eatingEnd: string;
};

// 当前时间和状态
const currentTime = ref(new Date());
const isInFasting = ref(false);
const timeLeft = ref(0); // 剩余秒数
const isManualActive = ref(false);
const manualStartTime = ref<Date | null>(null);

// 今日时间安排
const todaySchedule = ref<Schedule>({
  fastingStart: "20:00",
  eatingStart: "12:00",
  eatingEnd: "20:00",
});

// 预设时间
const presetTimes = ref<PresetTime[]>([
  {
    id: 1,
    name: "经典16:8",
    fastingStart: "20:00",
    eatingStart: "12:00",
    eatingEnd: "20:00",
  },
  {
    id: 2,
    name: "早起型",
    fastingStart: "18:00",
    eatingStart: "10:00",
    eatingEnd: "18:00",
  },
  {
    id: 3,
    name: "夜猫子",
    fastingStart: "22:00",
    eatingStart: "14:00",
    eatingEnd: "22:00",
  },
]);

// 对话框状态
const showPresetDialog = ref(false);
const showEditDialog = ref(false);
const showStatsDialog = ref(false);
const selectedPreset = ref(1);

// 编辑数据
const editSchedule = ref<Schedule>({
  fastingStart: todaySchedule.value.fastingStart,
  eatingStart: todaySchedule.value.eatingStart,
  eatingEnd: todaySchedule.value.eatingEnd,
});

// 统计数据
const weeklyStats = ref({
  completedDays: 5,
  totalHours: 80,
  avgDuration: 16,
});

// Chart实例
const progressChart = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;
let timer: NodeJS.Timeout | null = null;

// 计算属性
const formattedTimeLeft = computed(() => {
  const hours = Math.floor(timeLeft.value / 3600);
  const minutes = Math.floor((timeLeft.value % 3600) / 60);
  const seconds = timeLeft.value % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
});

const calculatedFastingDuration = computed(() => {
  const start = new Date(`2024-01-01 ${editSchedule.value.fastingStart}`);
  const end = new Date(`2024-01-02 ${editSchedule.value.eatingStart}`);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
});

const calculatedEatingDuration = computed(() => {
  return 24 - calculatedFastingDuration.value;
});

const progressPercentage = computed(() => {
  if (isManualActive.value && manualStartTime.value) {
    const elapsed =
      (currentTime.value.getTime() - manualStartTime.value.getTime()) / 1000;
    return Math.min((elapsed / (16 * 3600)) * 100, 100);
  } else {
    const totalSeconds = isInFasting.value ? 16 * 3600 : 8 * 3600;
    const elapsed = totalSeconds - timeLeft.value;
    return Math.min((elapsed / totalSeconds) * 100, 100);
  }
});

// 方法
const updateTime = () => {
  currentTime.value = new Date();
  updateFastingStatus();
  updateTimeLeft();
  updateChart();
};

const updateFastingStatus = () => {
  if (isManualActive.value && manualStartTime.value) {
    isInFasting.value = true;
    return;
  }

  const now = currentTime.value;
  const today = now.toDateString();

  const fastingStart = new Date(`${today} ${todaySchedule.value.fastingStart}`);
  const eatingStart = new Date(`${today} ${todaySchedule.value.eatingStart}`);

  if (fastingStart > eatingStart) {
    // 跨天情况
    if (
      now.getHours() >=
        parseInt(todaySchedule.value.fastingStart.split(":")[0]) ||
      now.getHours() < parseInt(todaySchedule.value.eatingStart.split(":")[0])
    ) {
      isInFasting.value = true;
    } else {
      isInFasting.value = false;
    }
  } else {
    // 同天情况
    isInFasting.value = now < fastingStart || now >= eatingStart;
  }
};

const updateTimeLeft = () => {
  if (isManualActive.value && manualStartTime.value) {
    const elapsed =
      (currentTime.value.getTime() - manualStartTime.value.getTime()) / 1000;
    timeLeft.value = Math.max(0, 16 * 3600 - elapsed);
    return;
  }

  const now = currentTime.value;
  const today = now.toDateString();

  let targetTime: Date;

  if (isInFasting.value) {
    targetTime = new Date(`${today} ${todaySchedule.value.eatingStart}`);
    if (targetTime <= now) {
      targetTime = new Date(targetTime.getTime() + 24 * 60 * 60 * 1000);
    }
  } else {
    targetTime = new Date(`${today} ${todaySchedule.value.fastingStart}`);
    if (targetTime <= now) {
      targetTime = new Date(targetTime.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  timeLeft.value = Math.max(
    0,
    Math.floor((targetTime.getTime() - now.getTime()) / 1000)
  );
};

const updateChart = () => {
  if (chartInstance) {
    let progress = 0;

    if (isManualActive.value && manualStartTime.value) {
      const elapsed =
        (currentTime.value.getTime() - manualStartTime.value.getTime()) / 1000;
      progress = Math.min((elapsed / (16 * 3600)) * 100, 100);
    } else {
      const totalSeconds = isInFasting.value ? 16 * 3600 : 8 * 3600;
      const elapsed = totalSeconds - timeLeft.value;
      progress = Math.min((elapsed / totalSeconds) * 100, 100);
    }

    chartInstance.data.datasets[0].data = [progress, 100 - progress];
    chartInstance.update();
  }
};

const startManualFasting = () => {
  isManualActive.value = true;
  manualStartTime.value = new Date();
  isInFasting.value = true;
};

const stopManualFasting = () => {
  isManualActive.value = false;
  manualStartTime.value = null;
  updateFastingStatus();
};

const selectPreset = (id: number) => {
  selectedPreset.value = id;
};

const applyPreset = () => {
  const preset = presetTimes.value.find((p) => p.id === selectedPreset.value);
  if (preset) {
    todaySchedule.value = {
      fastingStart: preset.fastingStart,
      eatingStart: preset.eatingStart,
      eatingEnd: preset.eatingEnd,
    };
    updateFastingStatus();
  }
  showPresetDialog.value = false;
};

const saveTodaySchedule = () => {
  todaySchedule.value = { ...editSchedule.value };
  todaySchedule.value.eatingEnd = editSchedule.value.eatingStart; // 进食结束时间等于下次断食开始时间
  updateFastingStatus();
  showEditDialog.value = false;
};

onMounted(() => {
  // 初始化图表
  if (progressChart.value) {
    chartInstance = new Chart(progressChart.value, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [0, 100],
            backgroundColor: ["#007AFF", "#F2F2F7"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "88%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    });
  }

  // 初始化时间
  updateTime();

  // 启动定时器
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped lang="less">
.fasting-page {
  margin-top: 12px;
  min-height: 100vh;
  background: #f6f6f6;
  padding-bottom: 60px; /* 为底部导航留出空间 */
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;

  .main-content {
    width: 100%;
    max-width: 340px;
    background: #ffffff;
    border-radius: 18px;
  }

  .status-card {
    width: 100%;
    max-width: 340px;
    background: @color-primary;
    border-radius: 18px;
    box-shadow: 0 2px 12px rgba(76, 175, 255, 0.09);
    padding: 24px;
    margin-bottom: 12px;
    text-align: center;

    .status-indicator {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      margin-bottom: 24px;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
      }

      .status-text {
        font-size: 14px;
        font-weight: 600;
      }
    }

    .timer-display {
      margin-bottom: 32px;

      .timer-value {
        font-size: 38px;
        font-weight: 600;
        color: #fff;
        line-height: 1;
        margin-bottom: 8px;
        font-variant-numeric: tabular-nums;
      }

      .timer-label {
        font-size: 14px;
        color: #fff;
        font-weight: 400;
      }
    }

    .progress-ring {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto;

      .progress-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;

        .progress-percentage {
          font-size: 24px;
          font-weight: 600;
          color: #fff;
          line-height: 1;
          margin-bottom: 4px;
        }

        .progress-label {
          font-size: 12px;
          color: #fff;
          font-weight: 500;
        }
      }
    }
  }

  .action-section {
    width: 100%;
    max-width: 340px;
    margin-bottom: 12px;

    .primary-actions {
      margin-bottom: 12px;

      .primary-btn {
        width: 100%;
        height: 56px;
        border-radius: 18px;
        border: none;
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        transition: all 0.2s ease;

        &.start-btn {
          background: @color-primary;
          color: #ffffff;

          &:active {
            transform: scale(0.98);
          }
        }

        &.stop-btn {
          background: #ff3b30;
          color: #ffffff;

          &:active {
            transform: scale(0.98);
          }
        }
      }
    }

    .secondary-actions {
      display: flex;
      gap: 12px;

      .secondary-btn {
        flex: 1;
        height: 56px;
        border-radius: 18px;
        border: none;
        background: #fff;
        color: #9fb567;
        font-size: 14px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(76, 175, 255, 0.07);

        &:active {
          transform: scale(0.98);
        }
      }
    }
  }

  .schedule-card {
    width: 100%;
    max-width: 340px;
    background: #ffffff;
    border-radius: 18px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(76, 175, 255, 0.07);

    .schedule-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      h3 {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }

      .edit-schedule-btn {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: #9fb567;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;

        &:active {
          transform: scale(0.95);
        }
      }
    }

    .schedule-timeline {
      .timeline-item {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .timeline-time {
          font-size: 14px;
          font-weight: 600;
          color: #9fb567;
          min-width: 50px;
          text-align: right;
        }

        .timeline-content {
          flex: 1;

          .timeline-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
          }

          .timeline-subtitle {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }
}

// 底部弹窗样式
:deep(.bottom-dialog .var-dialog__content) {
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  padding: 0;
  max-height: 80vh;
  margin: 0;
}

:deep(.bottom-dialog .var-dialog__title) {
  padding: 0;
  border-bottom: none;
}

:deep(.bottom-dialog .var-dialog__actions) {
  padding: 16px 24px 32px;
  border-top: none;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 0.5px solid #e5e5ea;

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #1c1c1e;
    margin: 0;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: #f2f2f7;
    color: #8e8e93;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.95);
      background: #e5e5ea;
    }
  }
}

.apply-btn {
  width: 100%;
  height: 50px;
  border-radius: 16px;
  border: none;
  background: #007aff;
  color: #ffffff;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
    background: #0056cc;
  }
}

.preset-popup,
.edit-popup,
.stats-popup {
  padding: 0;
}

.preset-list {
  padding: 20px 24px;

  .preset-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 8px;
    background: #f2f2f7;
    cursor: pointer;
    transition: all 0.2s ease;

    &.selected {
      background: #e8f4fd;
      border: 1px solid #007aff;
    }

    &:active {
      transform: scale(0.98);
    }

    .preset-main {
      .preset-name {
        font-size: 16px;
        font-weight: 600;
        color: #1c1c1e;
        margin-bottom: 4px;
      }

      .preset-details {
        font-size: 14px;
        color: #8e8e93;
      }
    }
  }
}

.time-picker-section {
  padding: 20px 24px;

  .time-input-group {
    margin-bottom: 20px;

    label {
      display: block;
      font-size: 16px;
      font-weight: 600;
      color: #1c1c1e;
      margin-bottom: 8px;
    }

    .time-input {
      width: 100%;
      height: 44px;
      border: 1px solid #e5e5ea;
      border-radius: 12px;
      padding: 0 16px;
      font-size: 16px;
      color: #1c1c1e;
      background: #ffffff;

      &:focus {
        outline: none;
        border-color: #007aff;
      }
    }
  }
}

.duration-info {
  padding: 0 24px 16px;

  .duration-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    margin-bottom: 8px;
    background: #f2f2f7;
    border-radius: 12px;

    .duration-label {
      font-size: 15px;
      color: #1c1c1e;
    }

    .duration-value {
      font-size: 15px;
      font-weight: 600;
      color: #007aff;
    }
  }
}

.stats-grid {
  padding: 20px 24px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: #f2f2f7;
    border-radius: 16px;

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-content {
      .stat-number {
        font-size: 24px;
        font-weight: 700;
        color: #1c1c1e;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 14px;
        color: #8e8e93;
      }
    }
  }
}
</style>
