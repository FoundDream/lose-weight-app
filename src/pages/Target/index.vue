<template>
  <div class="body-profile-page">
    <div class="page-header">
      <h1 class="page-title">身体档案</h1>
      <p class="page-subtitle">
        完善您的个人信息，以获得更精准的健康建议。
      </p>
    </div>

    <div class="visualization-section">
      <div class="bmi-card">
        <div class="bmi-value">{{ bmi }}</div>
        <div class="bmi-label">BMI</div>
        <div class="bmi-status" :style="{ backgroundColor: bmiStatus.color }">
          {{ bmiStatus.text }}
        </div>
      </div>
      <div class="weight-progress-card">
        <div class="chart-container">
          <canvas ref="weightChartCanvas"></canvas>
          <div class="chart-center-text">
            <div>{{ weightProgress.toFixed(0) }}%</div>
            <span>目标进度</span>
          </div>
        </div>
        <div class="weight-details">
          <div class="weight-item">
            <span class="label">当前</span>
            <span class="value">{{ currentWeight }}kg</span>
          </div>
          <div class="weight-item">
            <span class="label">目标</span>
            <span class="value">{{ targetWeight }}kg</span>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-cards-container">
      <div
        class="profile-card"
        v-for="item in profileItems"
        :key="item.key"
        @click="openEditDialog(item)"
      >
        <div class="card-icon-wrapper">
          <Icon :icon="item.icon" class="card-icon" />
        </div>
        <div class="card-content">
          <span class="card-label">{{ item.label }}</span>
          <span class="card-value">{{ item.value }}{{ item.unit || "" }}</span>
        </div>
        <var-icon name="chevron-right" color="#888" />
      </div>
    </div>

    <var-dialog
      v-model:show="showEditDialog"
      :title="`编辑${editingItem?.label}`"
    >
      <div class="edit-form">
        <var-input
          v-if="isNumericInput(editingItem?.key)"
          v-model="editValue"
          type="number"
          :placeholder="`请输入您的${editingItem?.label}`"
        />
        <var-select
          v-else-if="editingItem?.key === 'gender'"
          v-model="editValue"
          :placeholder="`请选择您的${editingItem?.label}`"
        >
          <var-option label="男" value="男" />
          <var-option label="女" value="女" />
        </var-select>
        <var-date-picker
          v-else-if="editingItem?.key === 'birthdate'"
          v-model="editValue"
        />
        <var-select
          v-else-if="editingItem?.key === 'weeklyGoal'"
          v-model="editValue"
          placeholder="请选择每周目标"
        >
          <var-option label="减重0.25公斤" />
          <var-option label="减重0.5公斤" />
          <var-option label="减重0.75公斤" />
          <var-option label="减重1公斤" />
        </var-select>
        <var-select
          v-else-if="editingItem?.key === 'activityLevel'"
          v-model="editValue"
          placeholder="请选择活动水平"
        >
          <var-option label="久坐" />
          <var-option label="轻度活跃" />
          <var-option label="中度活跃" />
          <var-option label="非常活跃" />
        </var-select>
      </div>
      <template #actions>
        <var-button @click="showEditDialog = false">取消</var-button>
        <var-button type="primary" @click="saveItem">保存</var-button>
      </template>
    </var-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
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

type ProfileItem = {
  icon: string;
  label: string;
  value: string;
  key: string;
  unit?: string;
  options?: string[];
};

const profileItems = ref<ProfileItem[]>([
  {
    icon: "solar:user-bold-duotone",
    label: "性别",
    value: "未设置",
    key: "gender",
    options: ["男", "女"],
  },
  {
    icon: "solar:calendar-bold-duotone",
    label: "出生日期",
    value: "1995-01-01",
    key: "birthdate",
  },
  {
    icon: "solar:ruler-bold-duotone",
    label: "身高",
    value: "175",
    unit: "cm",
    key: "height",
  },
  {
    icon: "solar:weight-bold-duotone",
    label: "当前体重",
    value: "68",
    unit: "kg",
    key: "currentWeight",
  },
  {
    icon: "solar:target-bold-duotone",
    label: "目标体重",
    value: "65",
    unit: "kg",
    key: "targetWeight",
  },
  {
    icon: "solar:chart-bold-duotone",
    label: "每周目标",
    value: "减重0.5公斤",
    key: "weeklyGoal",
    options: ["减重0.25公斤", "减重0.5公斤", "减重0.75公斤", "减重1公斤"],
  },
  {
    icon: "solar:running-bold-duotone",
    label: "活动水平",
    value: "轻度活跃",
    key: "activityLevel",
    options: ["久坐", "轻度活跃", "中度活跃", "非常活跃"],
  },
]);

const showEditDialog = ref(false);
const editingItem = ref<ProfileItem | null>(null);
const editValue = ref("");

const isNumericInput = (key: string | undefined) => {
  if (!key) return false;
  return ["height", "currentWeight", "targetWeight"].includes(key);
};

const openEditDialog = (item: ProfileItem) => {
  editingItem.value = item;
  editValue.value = item.value;
  showEditDialog.value = true;
};

const saveItem = () => {
  if (editingItem.value) {
    const index = profileItems.value.findIndex(
      (i) => i.key === editingItem.value!.key
    );
    if (index !== -1) {
      profileItems.value[index].value = editValue.value;
    }
  }
  showEditDialog.value = false;
  editingItem.value = null;
};

// Chart related
const weightChartCanvas = ref<HTMLCanvasElement | null>(null);
let weightChartInstance: Chart | null = null;

const height = computed(() => {
  const item = profileItems.value.find((i) => i.key === "height");
  return item ? parseFloat(item.value) : 0;
});

const currentWeight = computed(() => {
  const item = profileItems.value.find((i) => i.key === "currentWeight");
  return item ? parseFloat(item.value) : 0;
});

const targetWeight = computed(() => {
  const item = profileItems.value.find((i) => i.key === "targetWeight");
  return item ? parseFloat(item.value) : 0;
});

const bmi = computed(() => {
  if (height.value > 0 && currentWeight.value > 0) {
    const heightInMeters = height.value / 100;
    return (currentWeight.value / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return "N/A";
});

const bmiStatus = computed(() => {
  const bmiValue = parseFloat(bmi.value as string);
  if (isNaN(bmiValue)) return { text: "未知", color: "#999" };
  if (bmiValue < 18.5) return { text: "偏瘦", color: "#3498db" };
  if (bmiValue < 24) return { text: "正常", color: "#2ecc71" };
  if (bmiValue < 28) return { text: "偏胖", color: "#f39c12" };
  return { text: "肥胖", color: "#e74c3c" };
});

const weightProgress = computed(() => {
  if (targetWeight.value > 0 && currentWeight.value > 0) {
    const initialWeight =
      parseFloat(
        profileItems.value.find((i) => i.key === "currentWeight")?.value || "0"
      ) + 5; // Simulating initial weight for progress
    const progress =
      ((initialWeight - currentWeight.value) /
        (initialWeight - targetWeight.value)) *
      100;
    return Math.max(0, Math.min(100, progress));
  }
  return 0;
});

const createOrUpdateChart = () => {
  if (weightChartInstance) {
    weightChartInstance.destroy();
  }
  if (weightChartCanvas.value) {
    const ctx = weightChartCanvas.value.getContext("2d");
    if (ctx) {
      weightChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: [weightProgress.value, 100 - weightProgress.value],
              backgroundColor: ["#667eea", "#e0e0e0"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          cutout: "80%",
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          },
        },
      });
    }
  }
};

onMounted(() => {
  createOrUpdateChart();
});

watch([currentWeight, targetWeight], () => {
  createOrUpdateChart();
});
</script>

<style scoped lang="less">
.body-profile-page {
  padding: 20px 16px 100px;
  background-color: #f7f8fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
  padding: 0 4px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e2022;
  margin: 0 0 8px;
}

.page-subtitle {
  font-size: 15px;
  color: #646566;
  margin: 0;
}

.visualization-section {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 16px;
  margin-bottom: 24px;
}

.bmi-card, .weight-progress-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.bmi-value {
  font-size: 36px;
  font-weight: 700;
  color: #1e2022;
}

.bmi-label {
  font-size: 14px;
  color: #646566;
  margin-bottom: 12px;
}

.bmi-status {
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
}

.weight-progress-card {
  flex-direction: row;
  justify-content: space-around;
}

.chart-container {
  position: relative;
  width: 100px;
  height: 100px;
}

.chart-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #1e2022;

  span {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #646566;
  }
}

.weight-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.weight-item {
  display: flex;
  flex-direction: column;
  align-items: center;

  .label {
    font-size: 14px;
    color: #646566;
  }

  .value {
    font-size: 18px;
    font-weight: 600;
    color: #1e2022;
  }
}

.profile-cards-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-card {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
}

.card-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  background-color: rgba(102, 126, 234, 0.1);
}

.card-icon {
  font-size: 24px;
  color: #667eea;
}

.card-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-label {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.card-value {
  font-size: 14px;
  color: #666;
}

.edit-form {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .var-select,
  .var-date-picker {
    width: 100%;
  }
}
</style>