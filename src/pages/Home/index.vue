<template>
  <div class="home-page">
    <!-- 顶部用户信息 -->
    <div class="user-header">
      <div class="avatar-wrap">
        <img :src="user.avatar" alt="avatar" class="avatar" />
      </div>
      <div class="welcome">首页</div>
      <var-icon name="bell" />
    </div>

    <!-- 体重卡片（环形进度+BMI） -->
    <div class="weight-card">
      <div class="weight-card-main">
        <div class="weight-info">
          <span class="weight-value-text">2500</span>
          <span class="weight-value-unit">剩余卡路里</span>
        </div>
        <div class="chart-wrap">
          <canvas ref="doughnutChart" width="120" height="120"></canvas>
          <div class="weight-center">
            <!-- 空div用于居中canvas -->
          </div>
        </div>
      </div>
    </div>

    <!-- 卡路里卡片区 -->
    <div class="calorie-cards">
      <div class="calorie-card">
        <Icon
          icon="solar:pen-line-duotone"
          width="24"
          height="24"
          color="#9fb567"
        />
        <span>记录卡路里</span>
      </div>
      <div class="calorie-card">
        <Icon
          icon="hugeicons:chat-gpt"
          width="32"
          height="32"
          color="#9fb567"
        />
        <span>AI 饮食建议</span>
      </div>
    </div>

    <!-- 今日饮食记录 -->
    <div class="food-records">
      <div class="food-records-header">
        <div class="section-title">今日饮食记录</div>
        <!-- <Icon icon="solar:pen-line-duotone" width="24" height="24" /> -->
        <div class="section-action">更多</div>
      </div>
      <div class="timeline-container">
        <div class="timeline-line"></div>
        <ul>
          <li v-for="(item, idx) in foodRecords" :key="idx" class="food-item">
            <div class="timeline-dot"></div>
            <div class="food-item-content">
              <div class="food-item-left">
                <div class="food-time">{{ item.time }}</div>
                <div class="food-name">{{ item.name }}</div>
                <div class="food-calories">+{{ item.calories }} kcal</div>
              </div>
              <div class="food-icon">
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="food-image"
                  @error="handleImageError"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

// mock 用户信息
type User = {
  name: string;
  avatar: string; // base64/svg url
};
const user = ref<User>({
  name: "Barbara Carney",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Barbara",
});

// mock 体重数据
const originalWeight = ref(72); // kg
const currentWeight = ref(70); // kg
const targetWeight = ref(65); // kg

// mock 饮食记录
type FoodRecord = {
  name: string;
  calories: number;
  time: string; // 早餐/午餐/晚餐/加餐
  icon?: string;
  image: string;
};
const foodRecords = ref<FoodRecord[]>([
  {
    name: "鸡胸肉",
    calories: 200,
    time: "早餐",
    icon: "🍗",
    image:
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=100&h=100&fit=crop&crop=center",
  },
  {
    name: "苹果",
    calories: 80,
    time: "加餐",
    icon: "🍎",
    image:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=100&h=100&fit=crop&crop=center",
  },
  {
    name: "米饭",
    calories: 300,
    time: "午餐",
    icon: "🍚",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop&crop=center",
  },
  {
    name: "西兰花",
    calories: 50,
    time: "午餐",
    icon: "🥦",
    image:
      "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=100&h=100&fit=crop&crop=center",
  },
  {
    name: "牛奶",
    calories: 120,
    time: "晚餐",
    icon: "🥛",
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&h=100&fit=crop&crop=center",
  },
]);

// Chart.js 环形进度
const doughnutChart = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

// 图片加载失败处理
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  const foodItem = foodRecords.value.find((item) => item.image === target.src);
  if (foodItem) {
    target.style.display = "none";
    target.parentElement!.innerHTML = foodItem.icon || "🍽️";
  }
};

onMounted(() => {
  if (doughnutChart.value) {
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(doughnutChart.value, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [
              currentWeight.value - targetWeight.value,
              Math.max(originalWeight.value - targetWeight.value, 0),
            ],
            backgroundColor: ["#0A400C", "#FEFAE0"],
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
});
</script>

<style scoped lang="less">
.home-page {
  min-height: 100vh;
  padding: 12px;
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  padding-bottom: 60px;

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
      background: #e3f2fd;
      display: flex;
      align-items: center;
      justify-content: center;

      .avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .welcome {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .weight-card {
    width: 100%;
    max-width: 340px;
    background: @color-primary;
    border-radius: 18px;
    box-shadow: 0 2px 12px rgba(76, 175, 255, 0.09);
    padding: 12px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .weight-card-main {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 24px;

      .weight-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 12px;

        .weight-value-text {
          font-size: 38px;
          font-weight: 600;
          color: #fff;
          line-height: 1;
        }

        .weight-value-unit {
          font-size: 14px;
          color: #fff;
        }
      }

      .chart-wrap {
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
    }
  }

  .calorie-cards {
    width: 100%;
    max-width: 340px;
    display: flex;
    gap: 16px;
    justify-content: center;

    .calorie-card {
      flex: 1;
      background: #fff;
      border-radius: 18px;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-weight: 600;
    }
  }

  .food-records {
    width: 100%;
    max-width: 340px;
    border-radius: 18px;
    box-shadow: 0 2px 8px rgba(76, 175, 255, 0.07);

    .food-records-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      .section-title {
        font-size: 18px;
        font-weight: 600;
      }

      .section-action {
        font-size: 14px;
        color: #999;
      }
    }

    .timeline-container {
      position: relative;
      padding-left: 20px;

      .timeline-line {
        position: absolute;
        left: 8px;
        top: 42px;
        bottom: 42px;
        width: 2px;
        background: repeating-linear-gradient(
          to bottom,
          #e0e0e0,
          #e0e0e0 6px,
          transparent 6px,
          transparent 12px
        );
        border-radius: 1px;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .food-item {
        position: relative;
        margin-bottom: 16px;

        .timeline-dot {
          position: absolute;
          left: -16px;
          top: 42px;
          width: 8px;
          height: 8px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 0 2px #e0e0e0;
          z-index: 1;
        }

        .food-item-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background: #fff;
          border-radius: 16px;
          margin-left: 4px;

          .food-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            background: #f0f0f0;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            padding: 0;
            overflow: hidden;

            .food-image {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 50%;
            }
          }

          .food-item-left {
            display: flex;
            align-items: flex-start;
            justify-content: space-around;
            flex-direction: column;
            gap: 6px;

            .food-time {
              color: #888;
              font-size: 12px;
            }

            .food-name {
              font-weight: 500;
              color: #333;
              font-size: 14px;
            }

            .food-calories {
              color: #43a047;
              font-weight: 500;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
