// 活动水平枚举
export enum ActivityLevel {
  SEDENTARY = "sedentary", // 久坐
  LIGHTLY_ACTIVE = "lightly_active", // 轻度活动
  MODERATELY_ACTIVE = "moderately_active", // 中度活动
  VERY_ACTIVE = "very_active", // 高强度活动
}

// 性别枚举
export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

// 用户基本信息接口
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  height: number; // cm
  activityLevel: ActivityLevel;
  createdAt: Date;
  updatedAt: Date;
}

// BMR计算结果
export interface BMRInfo {
  bmr: number; // 基础代谢率
  tdee: number; // 总日消耗
  bmi: number; // 身体质量指数
  idealWeightRange: {
    min: number;
    max: number;
  };
}

// AI减肥规划结果
export interface WeightLossPlan {
  id: string;
  userId: string;
  currentWeight: number;
  targetWeight: number;
  estimatedDays: number;
  estimatedWeeks: number;
  weeklyGoal: number; // kg per week
  dailyCalorieDeficit: number;
  recommendedCalorieIntake: number;
  confidence: number;
  createdAt: Date;
  suggestions: string[];
  milestones: Milestone[];
}

// 里程碑
export interface Milestone {
  weight: number;
  estimatedDate: Date;
  description: string;
}

// 运动建议
export interface ExerciseSuggestion {
  id: string;
  type: "cardio" | "strength" | "flexibility" | "mixed";
  name: string;
  description: string;
  duration: number; // minutes
  caloriesBurned: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  equipment: string[];
  instructions: string[];
}

// AI分析请求参数
export interface WeightLossAnalysisRequest {
  userProfile: UserProfile;
  currentWeight: number;
  targetWeight: number;
  weightHistory: Array<{
    weight: number;
    date: Date;
  }>;
}

// AI分析响应
export interface WeightLossAnalysisResponse {
  plan: WeightLossPlan;
  exercises: ExerciseSuggestion[];
  healthMetrics: BMRInfo;
  warnings: string[];
  recommendations: string[];
}
