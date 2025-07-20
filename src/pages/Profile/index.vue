<template>
  <div class="profile-page">
    <!-- 顶部用户信息 -->
    <div class="user-header">
      <div class="avatar-wrap">
        <img :src="user.avatar" alt="avatar" class="avatar" />
      </div>
      <div class="welcome">个人资料</div>
      <var-icon name="setting" />
    </div>

    <!-- 用户信息卡片 -->
    <div class="user-info-card">
      <div class="user-profile">
        <div class="profile-avatar">
          <img :src="user.avatar" alt="avatar" class="large-avatar" />
        </div>
        <div class="user-details">
          <div class="user-name">{{ user.name }}</div>
        </div>
      </div>
    </div>

    <!-- 设置选项 -->
    <div class="settings-card">
      <div class="card-header">
        <div class="card-title">设置</div>
      </div>
      <div class="settings-list">
        <div class="setting-item" v-for="setting in settings" :key="setting.id">
          <div class="setting-left">
            <div class="setting-icon">
              <Icon
                :icon="setting.icon"
                width="20"
                height="20"
                color="#9fb567"
              />
            </div>
            <div class="setting-content">
              <div class="setting-title">{{ setting.title }}</div>
              <div class="setting-desc">{{ setting.description }}</div>
            </div>
          </div>
          <div class="setting-right">
            <Icon
              icon="solar:alt-arrow-right-linear"
              width="16"
              height="16"
              color="#ccc"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";

type User = {
  name: string;
  avatar: string;
};

type Setting = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

const user = ref<User>({
  name: "ziwen",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Barbara",
});

const settings = ref<Setting[]>([
  {
    id: 1,
    title: "数据导出",
    description: "导出健康数据",
    icon: "solar:download-linear",
  },
]);
</script>

<style scoped lang="less">
.profile-page {
  min-height: 100vh;
  background: #f6f6f6;
  padding: 12px;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;

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

  .user-info-card {
    width: 100%;
    max-width: 340px;
    background: @color-primary;
    border-radius: 18px;
    box-shadow: 0 2px 12px rgba(76, 175, 255, 0.09);
    padding: 24px;
    margin-bottom: 12px;

    .user-profile {
      display: flex;
      align-items: center;
      gap: 20px;

      .profile-avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;

        .large-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .user-details {
        flex: 1;

        .user-name {
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }
      }
    }
  }

  .settings-card {
    width: 100%;
    max-width: 340px;
    background: #ffffff;
    border-radius: 18px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(76, 175, 255, 0.07);

    .card-header {
      margin-bottom: 20px;

      .card-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }
    }

    .settings-list {
      .setting-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 0;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: all 0.2s ease;

        &:last-child {
          border-bottom: none;
        }

        &:active {
          transform: scale(0.98);
        }

        .setting-left {
          display: flex;
          align-items: center;
          gap: 12px;

          .setting-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(159, 181, 103, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .setting-content {
            .setting-title {
              font-size: 14px;
              font-weight: 600;
              color: #333;
              margin-bottom: 2px;
            }

            .setting-desc {
              font-size: 12px;
              color: #666;
            }
          }
        }

        .setting-right {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
