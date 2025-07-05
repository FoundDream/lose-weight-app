import OpenAI from "openai";

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
export const analyzeFoodCalories = async (foodInput: string): Promise<any> => {
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
      const parsedResponse: any = JSON.parse(response);

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

    const analysisError: any = {
      message: error.message || "Failed to analyze food calories",
      code: error.code || "ANALYSIS_ERROR",
      details: error,
    };

    throw analysisError;
  }
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
