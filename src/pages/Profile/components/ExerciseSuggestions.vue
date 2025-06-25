<template>
  <div class="exercise-suggestions">
    <div class="card-header">
      <h3>🏃‍♀️ 运动建议</h3>
      <span class="suggestions-count"
        >{{ exerciseSuggestions.length }} 项运动</span
      >
    </div>

    <div class="exercises-list">
      <div
        v-for="exercise in exerciseSuggestions"
        :key="exercise.id"
        class="exercise-item"
        :class="exercise.type"
      >
        <div class="exercise-header">
          <div class="exercise-type">
            <span class="type-icon">{{ getTypeIcon(exercise.type) }}</span>
            <span class="type-name">{{ getTypeName(exercise.type) }}</span>
          </div>
          <div class="difficulty-badge" :class="exercise.difficulty">
            {{ getDifficultyText(exercise.difficulty) }}
          </div>
        </div>

        <div class="exercise-content">
          <h4 class="exercise-name">{{ exercise.name }}</h4>
          <p class="exercise-description">{{ exercise.description }}</p>

          <div class="exercise-stats">
            <div class="stat-item">
              <span class="stat-icon">⏱️</span>
              <span class="stat-value">{{ exercise.duration }}分钟</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🔥</span>
              <span class="stat-value"
                >{{ exercise.caloriesBurned }}卡路里</span
              >
            </div>
          </div>

          <!-- 所需器材 -->
          <div v-if="exercise.equipment?.length" class="equipment-section">
            <span class="equipment-label">所需器材:</span>
            <div class="equipment-list">
              <span
                v-for="item in exercise.equipment"
                :key="item"
                class="equipment-item"
              >
                {{ item }}
              </span>
            </div>
          </div>

          <!-- 动作要领 -->
          <div
            v-if="exercise.instructions?.length"
            class="instructions-section"
          >
            <div
              class="instructions-header"
              @click="toggleInstructions(exercise.id)"
            >
              <span>动作要领</span>
              <span
                class="toggle-icon"
                :class="{ open: expandedInstructions.includes(exercise.id) }"
              >
                ▼
              </span>
            </div>
            <div
              v-show="expandedInstructions.includes(exercise.id)"
              class="instructions-content"
            >
              <div
                v-for="(instruction, index) in exercise.instructions"
                :key="index"
                class="instruction-item"
              >
                <span class="instruction-number">{{ index + 1 }}</span>
                <span class="instruction-text">{{ instruction }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "../../../stores/user";

const userStore = useUserStore();

const expandedInstructions = ref<string[]>([]);

const exerciseSuggestions = computed(() => userStore.exerciseSuggestions);

const getTypeIcon = (type: string): string => {
  const icons = {
    cardio: "🏃‍♀️",
    strength: "💪",
    flexibility: "🧘‍♀️",
    mixed: "🤸‍♀️",
  };
  return icons[type as keyof typeof icons] || "🏃‍♀️";
};

const getTypeName = (type: string): string => {
  const names = {
    cardio: "有氧运动",
    strength: "力量训练",
    flexibility: "柔韧性训练",
    mixed: "综合训练",
  };
  return names[type as keyof typeof names] || "运动";
};

const getDifficultyText = (difficulty: string): string => {
  const texts = {
    beginner: "初级",
    intermediate: "中级",
    advanced: "高级",
  };
  return texts[difficulty as keyof typeof texts] || "初级";
};

const toggleInstructions = (exerciseId: string) => {
  const index = expandedInstructions.value.indexOf(exerciseId);
  if (index > -1) {
    expandedInstructions.value.splice(index, 1);
  } else {
    expandedInstructions.value.push(exerciseId);
  }
};
</script>

<style scoped lang="less">
@primary-color: #6366f1;
@bg-primary: #ffffff;
@bg-secondary: #f8fafc;
@text-primary: #1e293b;
@text-secondary: #64748b;
@text-light: #94a3b8;
@border-color: #e2e8f0;
@success-color: #10b981;
@warning-color: #f59e0b;
@cardio-color: #ef4444;
@strength-color: #8b5cf6;
@flexibility-color: #06b6d4;
@mixed-color: #f59e0b;
@shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
@border-radius: 16px;

.exercise-suggestions {
  background: @bg-primary;
  border-radius: @border-radius;
  padding: 20px;
  box-shadow: @shadow-md;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: @text-primary;
      margin: 0;
    }

    .suggestions-count {
      font-size: 12px;
      color: @text-light;
      background: @bg-secondary;
      padding: 4px 8px;
      border-radius: 8px;
    }
  }

  .exercises-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .exercise-item {
      border-radius: 12px;
      border: 1px solid @border-color;
      overflow: hidden;
      transition: all 0.2s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &.cardio {
        border-left: 4px solid @cardio-color;
      }

      &.strength {
        border-left: 4px solid @strength-color;
      }

      &.flexibility {
        border-left: 4px solid @flexibility-color;
      }

      &.mixed {
        border-left: 4px solid @mixed-color;
      }

      .exercise-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: @bg-secondary;

        .exercise-type {
          display: flex;
          align-items: center;
          gap: 8px;

          .type-icon {
            font-size: 16px;
          }

          .type-name {
            font-size: 12px;
            font-weight: 500;
            color: @text-secondary;
          }
        }

        .difficulty-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 8px;

          &.beginner {
            background: rgba(16, 185, 129, 0.1);
            color: @success-color;
          }

          &.intermediate {
            background: rgba(245, 158, 11, 0.1);
            color: @warning-color;
          }

          &.advanced {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
          }
        }
      }

      .exercise-content {
        padding: 16px;

        .exercise-name {
          font-size: 16px;
          font-weight: 600;
          color: @text-primary;
          margin: 0 0 8px 0;
        }

        .exercise-description {
          font-size: 14px;
          color: @text-secondary;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .exercise-stats {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;

          .stat-item {
            display: flex;
            align-items: center;
            gap: 4px;

            .stat-icon {
              font-size: 14px;
            }

            .stat-value {
              font-size: 13px;
              color: @text-secondary;
            }
          }
        }

        .equipment-section {
          margin-bottom: 12px;

          .equipment-label {
            font-size: 12px;
            color: @text-secondary;
            margin-right: 8px;
          }

          .equipment-list {
            display: inline-flex;
            flex-wrap: wrap;
            gap: 4px;

            .equipment-item {
              font-size: 11px;
              background: @bg-secondary;
              color: @text-secondary;
              padding: 2px 6px;
              border-radius: 4px;
            }
          }
        }

        .instructions-section {
          border-top: 1px solid @border-color;
          padding-top: 12px;

          .instructions-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 4px 0;
            user-select: none;

            font-size: 13px;
            font-weight: 500;
            color: @text-secondary;

            .toggle-icon {
              transition: transform 0.2s ease;

              &.open {
                transform: rotate(180deg);
              }
            }

            &:hover {
              color: @text-primary;
            }
          }

          .instructions-content {
            margin-top: 8px;

            .instruction-item {
              display: flex;
              align-items: flex-start;
              gap: 8px;
              margin-bottom: 6px;

              &:last-child {
                margin-bottom: 0;
              }

              .instruction-number {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
                background: @primary-color;
                color: white;
                border-radius: 50%;
                font-size: 10px;
                font-weight: 600;
                flex-shrink: 0;
                margin-top: 2px;
              }

              .instruction-text {
                font-size: 12px;
                color: @text-primary;
                line-height: 1.4;
              }
            }
          }
        }
      }
    }
  }
}
</style>
