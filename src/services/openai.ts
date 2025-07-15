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

// 检查API配置状态
export const checkApiConfiguration = (): boolean => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  return !!(apiKey && apiKey !== "your_openai_api_key_here");
};

// AI饮食建议的prompt模板
const createDietSuggestionPrompt = (request: any): string => {
  const {
    userProfile,
    currentWeight,
    targetWeight,
    dailyCalories,
    todayFoods,
  } = request;

  return `
作为专业的营养师和减肥专家，请根据用户的信息和今日饮食情况，提供个性化的饮食建议。

用户信息:
- 年龄: ${userProfile.age}岁
- 性别: ${userProfile.gender === "male" ? "男" : "女"}
- 身高: ${userProfile.height}cm
- 当前体重: ${currentWeight}kg
- 目标体重: ${targetWeight}kg
- 今日已摄入卡路里: ${dailyCalories}kcal
- 今日已食用: ${todayFoods
    .map((food: any) => `${food.name}(${food.calories}kcal)`)
    .join(", ")}

请严格按照以下JSON格式返回结果（不要包含任何其他文字）:

{
  "summary": {
    "currentCalories": ${dailyCalories},
    "recommendedCalories": 建议每日摄入总热量,
    "remainingCalories": 剩余可摄入热量,
    "nutritionScore": 营养评分0-100,
    "balanceStatus": "缺乏蛋白质" // 营养平衡状态描述
  },
  "recommendations": [
    {
      "category": "breakfast|lunch|dinner|snack",
      "title": "建议标题",
      "description": "详细说明",
      "foods": [
        {
          "name": "推荐食物名称",
          "calories": 卡路里,
          "portion": "分量描述",
          "benefits": "营养益处"
        }
      ],
      "totalCalories": 该类别总热量,
      "priority": "high|medium|low"
    }
  ],
  "tips": [
    {
      "category": "hydration|timing|preparation|exercise",
      "title": "小贴士标题",
      "content": "具体建议内容",
      "icon": "💧" // emoji图标
    }
  ],
  "warnings": [
    "注意事项1",
    "注意事项2"
  ],
  "nextMealSuggestion": {
    "mealType": "下一餐类型",
    "suggestedTime": "建议时间",
    "calorieTarget": 目标热量,
    "keyNutrients": ["需要补充的营养素"]
  }
}

注意事项:
1. 考虑用户的减肥目标，建议要科学合理
2. 根据已摄入食物分析营养缺口
3. 提供具体可执行的食物建议
4. 考虑一日三餐的营养平衡
5. 给出实用的饮食时间建议
6. 推荐的食物要适合减肥目标
`;
};

// AI饮食建议主要函数
export const generateDietSuggestions = async (request: any): Promise<any> => {
  try {
    const client = createOpenAIClient();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "你是一位专业的营养师和减肥专家，专门为用户提供个性化的饮食建议。请根据用户的身体状况、目标和当前饮食情况，给出科学、实用的建议。",
        },
        {
          role: "user",
          content: createDietSuggestionPrompt(request),
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
      if (!parsedResponse.summary || !parsedResponse.recommendations) {
        throw new Error("Invalid response format: missing required fields");
      }

      // 添加时间戳和用户ID
      parsedResponse.generatedAt = new Date().toISOString();
      parsedResponse.userId = request.userProfile?.id;

      return parsedResponse;
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", response);
      throw new Error("Failed to parse AI diet suggestion result");
    }
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    throw new Error(error.message || "Failed to generate diet suggestions");
  }
};
