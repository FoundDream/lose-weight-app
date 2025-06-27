import { defineStore } from "pinia";
import type {
  UserProfile,
  BMRInfo,
  WeightLossPlan,
  ExerciseSuggestion,
  WeightLossAnalysisRequest,
  WeightLossAnalysisResponse,
} from "../types/user";
import type { AuthUser, LoginRequest, RegisterRequest } from "../types/auth";
import { Gender, ActivityLevel } from "../types/user";
import {
  analyzeWeightLossPlan,
  createMockWeightLossPlan,
  checkApiConfiguration,
} from "../services/openai";
import { authService } from "../services/auth";

interface UserState {
  // 认证相关状态
  isAuthenticated: boolean;
  token: string | null;
  authUser: AuthUser | null;
  authLoading: boolean;
  authError: string | null;

  // 用户资料相关状态
  profile: UserProfile | null;
  isProfileComplete: boolean;
  currentPlan: WeightLossPlan | null;
  exerciseSuggestions: ExerciseSuggestion[];
  healthMetrics: BMRInfo | null;
  isAnalyzing: boolean;
  analysisError: string | null;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    // 认证相关状态初始化
    isAuthenticated: false,
    token: null,
    authUser: null,
    authLoading: false,
    authError: null,

    // 用户资料相关状态初始化
    profile: null,
    isProfileComplete: false,
    currentPlan: null,
    exerciseSuggestions: [],
    healthMetrics: null,
    isAnalyzing: false,
    analysisError: null,
  }),

  getters: {
    hasCompleteProfile: (state): boolean => {
      return !!(
        state.profile &&
        state.profile.age > 0 &&
        state.profile.height > 0 &&
        state.profile.gender &&
        state.profile.activityLevel
      );
    },

    bmiCategory: (state): string => {
      if (!state.healthMetrics) return "";
      const bmi = state.healthMetrics.bmi;
      if (bmi < 18.5) return "偏瘦";
      if (bmi < 24) return "正常";
      if (bmi < 28) return "超重";
      return "肥胖";
    },

    isHealthyWeight: (state): boolean => {
      if (!state.healthMetrics) return false;
      const bmi = state.healthMetrics.bmi;
      return bmi >= 18.5 && bmi < 24;
    },
  },

  actions: {
    // 更新用户资料
    updateProfile(updates: Partial<UserProfile>) {
      if (!this.profile) {
        this.profile = {
          id: Date.now().toString(),
          name: "",
          age: 0,
          gender: Gender.FEMALE,
          height: 0,
          activityLevel: ActivityLevel.LIGHTLY_ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...updates,
        };
      } else {
        this.profile = {
          ...this.profile,
          ...updates,
          updatedAt: new Date(),
        };
      }

      this.isProfileComplete = this.hasCompleteProfile;

      // 更新健康指标
      if (this.hasCompleteProfile) {
        this.calculateHealthMetrics();
      }
    },

    // 计算健康指标
    calculateHealthMetrics() {
      if (!this.profile || !this.hasCompleteProfile) return;

      const { age, gender, height, activityLevel } = this.profile;

      // 从weight store获取当前体重
      // 这里需要动态获取，暂时使用固定值
      const currentWeight = 70;

      // 计算BMR (Mifflin-St Jeor Equation)
      let bmr: number;
      if (gender === Gender.MALE) {
        bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
      }

      // 根据活动水平计算TDEE
      const activityMultipliers = {
        [ActivityLevel.SEDENTARY]: 1.2,
        [ActivityLevel.LIGHTLY_ACTIVE]: 1.375,
        [ActivityLevel.MODERATELY_ACTIVE]: 1.55,
        [ActivityLevel.VERY_ACTIVE]: 1.725,
      };

      const tdee = bmr * activityMultipliers[activityLevel];

      // 计算BMI
      const bmi = currentWeight / Math.pow(height / 100, 2);

      // 计算理想体重范围 (BMI 18.5-23.9)
      const heightInM = height / 100;
      const idealWeightRange = {
        min: 18.5 * Math.pow(heightInM, 2),
        max: 23.9 * Math.pow(heightInM, 2),
      };

      this.healthMetrics = {
        bmr,
        tdee,
        bmi,
        idealWeightRange,
      };
    },

    // AI减肥规划分析
    async analyzeWeightLoss(
      currentWeight: number,
      targetWeight: number,
      weightHistory: Array<{ weight: number; date: Date }>
    ) {
      if (!this.hasCompleteProfile) {
        this.analysisError = "请先完善个人信息";
        return;
      }

      this.isAnalyzing = true;
      this.analysisError = null;

      try {
        const request: WeightLossAnalysisRequest = {
          userProfile: this.profile!,
          currentWeight,
          targetWeight,
          weightHistory,
        };

        let response: WeightLossAnalysisResponse;

        if (checkApiConfiguration()) {
          response = await analyzeWeightLossPlan(request);
        } else {
          // 模拟延迟
          await new Promise((resolve) => setTimeout(resolve, 2000));
          response = createMockWeightLossPlan(request);
        }

        this.currentPlan = response.plan;
        this.exerciseSuggestions = response.exercises;

        // 更新健康指标（如果AI返回了更准确的数据）
        if (response.healthMetrics) {
          this.healthMetrics = response.healthMetrics;
        }
      } catch (error: any) {
        console.error("Weight loss analysis failed:", error);
        this.analysisError = error.message || "分析失败，请稍后重试";
      } finally {
        this.isAnalyzing = false;
      }
    },

    // 清除分析错误
    clearAnalysisError() {
      this.analysisError = null;
    },

    // 重置用户数据
    resetProfile() {
      this.profile = null;
      this.isProfileComplete = false;
      this.currentPlan = null;
      this.exerciseSuggestions = [];
      this.healthMetrics = null;
      this.analysisError = null;
    },

    // === 认证相关方法 ===

    // 初始化认证状态
    initAuth() {
      const token = authService.getToken();
      if (token) {
        this.token = token;
        this.isAuthenticated = true;
        // 这里可以添加验证token有效性的逻辑
      }
    },

    // 用户登录
    async login(request: LoginRequest) {
      this.authLoading = true;
      this.authError = null;

      try {
        const response = await authService.login(request);

        // 保存认证信息
        this.token = response.data.token;
        this.authUser = response.data.user;
        this.isAuthenticated = true;

        // 存储token到localStorage
        authService.setToken(response.data.token);

        return response;
      } catch (error: any) {
        this.authError = error.message;
        throw error;
      } finally {
        this.authLoading = false;
      }
    },

    // 用户注册
    async register(request: RegisterRequest) {
      this.authLoading = true;
      this.authError = null;

      try {
        const response = await authService.register(request);

        // 保存认证信息
        this.token = response.data.token;
        this.authUser = response.data.user;
        this.isAuthenticated = true;

        // 存储token到localStorage
        authService.setToken(response.data.token);

        return response;
      } catch (error: any) {
        this.authError = error.message;
        throw error;
      } finally {
        this.authLoading = false;
      }
    },

    // 用户登出
    logout() {
      this.token = null;
      this.authUser = null;
      this.isAuthenticated = false;
      this.authError = null;

      // 清除localStorage中的token
      authService.clearToken();

      // 清除用户资料数据
      this.resetProfile();
    },

    // 清除认证错误
    clearAuthError() {
      this.authError = null;
    },
  },
});
