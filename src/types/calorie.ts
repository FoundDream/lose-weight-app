// 食物项目类型
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  unit: string;
  quantity: number;
  confidence: number; // AI分析的置信度 0-1
}

// 营养成分类型
export interface NutritionInfo {
  protein: number; // 蛋白质(g)
  carbs: number; // 碳水化合物(g)
  fat: number; // 脂肪(g)
  fiber: number; // 纤维(g)
  sugar: number; // 糖分(g)
}

// AI分析结果类型
export interface CalorieAnalysis {
  id: string;
  timestamp: Date;
  originalInput: string; // 用户原始输入
  foods: FoodItem[];
  totalCalories: number;
  nutrition: NutritionInfo;
  suggestions: string[]; // AI建议
  confidence: number; // 整体分析置信度
}

// 分析历史记录类型
export interface AnalysisHistory {
  today: CalorieAnalysis[];
  thisWeek: CalorieAnalysis[];
  thisMonth: CalorieAnalysis[];
}

// 输入模板类型
export interface InputTemplate {
  id: string;
  name: string;
  placeholder: string;
  examples: string[];
  category: "meal" | "snack" | "drink" | "fruit";
}

// API响应类型
export interface OpenAIResponse {
  foods: Array<{
    name: string;
    calories: number;
    unit: string;
    quantity: number;
    confidence: number;
  }>;
  nutrition: NutritionInfo;
  suggestions: string[];
  confidence: number;
}

// 分析状态类型
export type AnalysisStatus = "idle" | "analyzing" | "success" | "error";

// 错误类型
export interface AnalysisError {
  message: string;
  code: string;
  details?: any;
}
