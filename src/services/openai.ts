import OpenAI from "openai";
import type { OpenAIResponse, AnalysisError } from "../types/calorie";

// 初始化OpenAI客户端
const createOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in .env file"
    );
  }

  return new OpenAI({
    apiKey,
    baseURL:
      import.meta.env.VITE_OPENAI_BASE_URL || "https://api.openai.com/v1",
    dangerouslyAllowBrowser: true, // 允许在浏览器中使用（生产环境建议通过后端代理）
  });
};

// 食物分析的prompt模板
const createFoodAnalysisPrompt = (foodInput: string): string => {
  return `
作为专业的营养师，请分析以下食物描述并返回详细的营养信息。

用户输入: "${foodInput}"

请严格按照以下JSON格式返回结果（不要包含任何其他文字）:

{
  "foods": [
    {
      "name": "食物名称",
      "calories": 卡路里数值,
      "unit": "单位（如：g, 个, 杯等）",
      "quantity": 数量,
      "confidence": 0.95
    }
  ],
  "nutrition": {
    "protein": 蛋白质克数,
    "carbs": 碳水化合物克数,
    "fat": 脂肪克数,
    "fiber": 纤维克数,
    "sugar": 糖分克数
  },
  "suggestions": [
    "针对减肥的建议1",
    "针对减肥的建议2"
  ],
  "confidence": 0.95
}

注意事项:
1. calories必须是数字，不要包含单位
2. confidence是0-1之间的小数，表示分析的置信度
3. suggestions应该针对减肥目标给出实用建议
4. 如果输入模糊，请给出最合理的估算
5. 单位要具体明确（如：一碗约200g米饭）
`;
};

// 分析食物的主要函数
export const analyzeFoodCalories = async (
  foodInput: string
): Promise<OpenAIResponse> => {
  try {
    const client = createOpenAIClient();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // 使用更经济的模型，如果需要更好的效果可以改为gpt-4
      messages: [
        {
          role: "system",
          content:
            "你是一位专业的营养师，专门帮助用户分析食物的卡路里和营养成分。请始终返回准确的JSON格式数据。",
        },
        {
          role: "user",
          content: createFoodAnalysisPrompt(foodInput),
        },
      ],
      temperature: 0.3, // 降低随机性，提高一致性
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("No response from OpenAI");
    }

    // 尝试解析JSON响应
    try {
      const parsedResponse: OpenAIResponse = JSON.parse(response);

      // 验证响应格式
      if (!parsedResponse.foods || !Array.isArray(parsedResponse.foods)) {
        throw new Error("Invalid response format: foods array missing");
      }

      if (!parsedResponse.nutrition) {
        throw new Error("Invalid response format: nutrition object missing");
      }

      return parsedResponse;
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", response);
      throw new Error("Failed to parse AI analysis result");
    }
  } catch (error: any) {
    console.error("OpenAI API Error:", error);

    const analysisError: AnalysisError = {
      message: error.message || "Failed to analyze food calories",
      code: error.code || "ANALYSIS_ERROR",
      details: error,
    };

    throw analysisError;
  }
};

// 创建模拟数据（用于开发测试，当API key未配置时使用）
export const createMockAnalysis = (foodInput: string): OpenAIResponse => {
  const mockFoods = [
    {
      name: foodInput,
      calories: Math.floor(Math.random() * 500) + 100,
      unit: "g",
      quantity: 1,
      confidence: 0.85,
    },
  ];

  return {
    foods: mockFoods,
    nutrition: {
      protein: Math.floor(Math.random() * 30) + 5,
      carbs: Math.floor(Math.random() * 50) + 10,
      fat: Math.floor(Math.random() * 20) + 2,
      fiber: Math.floor(Math.random() * 10) + 1,
      sugar: Math.floor(Math.random() * 15) + 2,
    },
    suggestions: [
      "建议控制份量，避免过量摄入",
      "可以搭配蔬菜增加饱腹感",
      "注意饮食时间，避免睡前进食",
    ],
    confidence: 0.8,
  };
};

// 检查API配置状态
export const checkApiConfiguration = (): boolean => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  return !!(apiKey && apiKey !== "your_openai_api_key_here");
};

// 减肥规划分析的prompt模板
const createWeightLossPlanPrompt = (request: any): string => {
  const { userProfile, currentWeight, targetWeight, weightHistory } = request;

  return `
作为专业的健身和营养专家，请为用户制定科学的减肥计划。

用户信息:
- 年龄: ${userProfile.age}岁
- 性别: ${userProfile.gender === "male" ? "男" : "女"}
- 身高: ${userProfile.height}cm
- 当前体重: ${currentWeight}kg
- 目标体重: ${targetWeight}kg
- 活动水平: ${userProfile.activityLevel}
- 体重历史: ${weightHistory
    .slice(0, 5)
    .map((h: any) => `${h.weight}kg (${h.date.toLocaleDateString()})`)
    .join(", ")}

请严格按照以下JSON格式返回结果（不要包含任何其他文字）:

{
  "plan": {
    "estimatedDays": 预计天数,
    "estimatedWeeks": 预计周数,
    "weeklyGoal": 每周减重目标kg,
    "dailyCalorieDeficit": 每日热量缺口,
    "recommendedCalorieIntake": 建议每日摄入热量,
    "confidence": 0.95,
    "suggestions": [
      "具体建议1",
      "具体建议2",
      "具体建议3"
    ],
    "milestones": [
      {
        "weight": 里程碑体重,
        "estimatedDate": "2024-02-15",
        "description": "第一个月目标"
      }
    ]
  },
  "exercises": [
    {
      "type": "cardio",
      "name": "运动名称",
      "description": "运动描述",
      "duration": 持续时间分钟,
      "caloriesBurned": 消耗热量,
      "difficulty": "beginner",
      "equipment": ["所需器材"],
      "instructions": ["动作要领1", "动作要领2"]
    }
  ],
  "healthMetrics": {
    "bmr": 基础代谢率,
    "tdee": 总日消耗,
    "bmi": BMI值,
    "idealWeightRange": {
      "min": 理想体重下限,
      "max": 理想体重上限
    }
  },
  "warnings": ["注意事项"],
  "recommendations": ["额外建议"]
}

注意事项:
1. 减重速度应控制在每周0.5-1kg，确保健康安全
2. 运动建议要考虑用户的活动水平和身体状况
3. 热量缺口通常为每日300-500卡路里
4. 提供3-5个不同类型的运动建议
5. 时间预估要基于科学的减重速度
6. 包含饮食和运动的综合建议
`;
};

// 分析减肥规划的主要函数
export const analyzeWeightLossPlan = async (request: any): Promise<any> => {
  try {
    const client = createOpenAIClient();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "你是一位专业的健身和营养专家，专门帮助用户制定科学、安全的减肥计划。请始终返回准确的JSON格式数据。",
        },
        {
          role: "user",
          content: createWeightLossPlanPrompt(request),
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("No response from OpenAI");
    }

    try {
      const parsedResponse = JSON.parse(response);

      // 验证响应格式
      if (!parsedResponse.plan) {
        throw new Error("Invalid response format: plan missing");
      }

      // 添加必要的ID和时间戳
      parsedResponse.plan.id = Date.now().toString();
      parsedResponse.plan.userId = request.userProfile.id;
      parsedResponse.plan.currentWeight = request.currentWeight;
      parsedResponse.plan.targetWeight = request.targetWeight;
      parsedResponse.plan.createdAt = new Date();

      // 为运动建议添加ID
      parsedResponse.exercises = parsedResponse.exercises.map(
        (exercise: any, index: number) => ({
          ...exercise,
          id: `${Date.now()}-${index}`,
        })
      );

      return parsedResponse;
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", response);
      throw new Error("Failed to parse AI analysis result");
    }
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    throw new Error(error.message || "Failed to analyze weight loss plan");
  }
};

// 创建模拟减肥规划数据
export const createMockWeightLossPlan = (request: any): any => {
  const { userProfile, currentWeight, targetWeight } = request;
  const weightToLose = currentWeight - targetWeight;
  const weeklyGoal = 0.5; // 每周0.5kg
  const estimatedWeeks = Math.ceil(weightToLose / weeklyGoal);
  const estimatedDays = estimatedWeeks * 7;

  return {
    plan: {
      id: Date.now().toString(),
      userId: userProfile.id,
      currentWeight,
      targetWeight,
      estimatedDays,
      estimatedWeeks,
      weeklyGoal,
      dailyCalorieDeficit: 400,
      recommendedCalorieIntake: 1600,
      confidence: 0.85,
      createdAt: new Date(),
      suggestions: [
        "建议采用循序渐进的减重方式",
        "结合有氧运动和力量训练",
        "保持饮食多样化，避免极端节食",
        "每天至少饮水8杯",
        "保证充足睡眠，每晚7-8小时",
      ],
      milestones: [
        {
          weight: currentWeight - weightToLose * 0.3,
          estimatedDate: new Date(
            Date.now() + estimatedDays * 0.3 * 24 * 60 * 60 * 1000
          ),
          description: "第一阶段目标",
        },
        {
          weight: currentWeight - weightToLose * 0.7,
          estimatedDate: new Date(
            Date.now() + estimatedDays * 0.7 * 24 * 60 * 60 * 1000
          ),
          description: "第二阶段目标",
        },
      ],
    },
    exercises: [
      {
        id: "1",
        type: "cardio",
        name: "快走",
        description: "适合初学者的有氧运动",
        duration: 30,
        caloriesBurned: 150,
        difficulty: "beginner",
        equipment: ["运动鞋"],
        instructions: ["保持匀速", "注意呼吸节奏", "循序渐进增加强度"],
      },
      {
        id: "2",
        type: "strength",
        name: "深蹲",
        description: "锻炼下肢肌肉力量",
        duration: 15,
        caloriesBurned: 80,
        difficulty: "beginner",
        equipment: [],
        instructions: ["保持背部挺直", "膝盖不超过脚尖", "动作要标准"],
      },
      {
        id: "3",
        type: "cardio",
        name: "游泳",
        description: "全身有氧运动",
        duration: 45,
        caloriesBurned: 300,
        difficulty: "intermediate",
        equipment: ["泳衣", "泳镜"],
        instructions: ["注意换气技巧", "保持稳定节奏", "量力而行"],
      },
    ],
    healthMetrics: {
      bmr: userProfile.gender === "male" ? 1800 : 1400,
      tdee: userProfile.gender === "male" ? 2300 : 1800,
      bmi: currentWeight / Math.pow(userProfile.height / 100, 2),
      idealWeightRange: {
        min: 18.5 * Math.pow(userProfile.height / 100, 2),
        max: 23.9 * Math.pow(userProfile.height / 100, 2),
      },
    },
    warnings: ["减重过程中如有不适请及时咨询医生", "不建议过度节食或极端运动"],
    recommendations: [
      "建议记录每日饮食和运动情况",
      "定期测量体重和体脂率",
      "保持积极心态，享受健康生活",
    ],
  };
};
