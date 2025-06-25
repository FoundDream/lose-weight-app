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
      "unit": "单位（如：100g, 1个, 1杯等）",
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
      unit: "100g",
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
