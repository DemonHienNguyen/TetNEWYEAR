
import { GoogleGenAI, Type } from "@google/genai";
import { FortuneResult } from "../types";

const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === '' || apiKey === 'undefined') {
    throw new Error("Thiếu API_KEY. Hãy cấu hình trong Environment Variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const getFortune = async (userBirthYear: string, userQuestion: string): Promise<FortuneResult> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tôi sinh năm ${userBirthYear}. Hãy gieo cho tôi một quẻ đầu năm Bính Ngọ 2026 về: ${userQuestion}. Hãy trả lời bằng tiếng Việt một cách trang trọng, đậm chất văn hóa Việt Nam.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Tiêu đề của quẻ xăm" },
          content: { type: Type.STRING, description: "Nội dung chi tiết của quẻ xăm" },
          luckLevel: { 
            type: Type.STRING,
            enum: ['Đại Cát', 'Trung Cát', 'Tiểu Cát', 'Bình An']
          }
        },
        required: ["title", "content", "luckLevel"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI không trả về nội dung.");
  return JSON.parse(text);
};

export const generateTetGreetingCard = async (description: string, isHighQuality: boolean = false): Promise<string | null> => {
  // Tạo instance mới để đảm bảo lấy API Key mới nhất từ trình duyệt nếu người dùng vừa chọn
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Model 2.5 Flash Image có hạn mức (quota) lớn hơn nhiều so với 3.0 Pro Image
  const modelName = isHighQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  const prompt = `A breathtaking, high-quality cinematic digital art for 2026 Vietnamese Lunar New Year (Year of the Horse). Artistic style: modern mixed with traditional lacquer painting. Scene: ${description}. Vibrant red and gold theme, blooming apricot blossoms, festive atmosphere, ultra-detailed.`;
  
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          ...(isHighQuality ? { imageSize: "1K" } : {})
        }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error: any) {
    const errorStr = JSON.stringify(error);
    console.error("Image Gen Error:", error);
    
    // Phân loại lỗi chính xác
    if (errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED") || errorStr.includes("quota")) {
      throw new Error("QUOTA_EXCEEDED");
    }
    if (errorStr.includes("404") || errorStr.includes("not found")) {
      throw new Error("MODEL_NOT_FOUND");
    }
    throw new Error(error.message || "Lỗi không xác định khi tạo ảnh.");
  }
};

export const getTravelRoute = async (city: string, lat?: number, lng?: number) => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Gợi ý lộ trình du xuân 1 ngày tại ${city} vào Tết Bính Ngọ 2026. Bao gồm: Chợ hoa tiêu biểu, đền chùa linh thiêng và địa điểm check-in đẹp nhất. Trình bày bằng tiếng Việt, lịch sự.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: lat && lng ? { latLng: { latitude: lat, longitude: lng } } : undefined
      }
    },
  });
  
  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const getGiftAdvice = async (recipient: string, budget: string): Promise<string> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tư vấn chọn quà Tết 2026 cho ${recipient} với ngân sách khoảng ${budget}. Hãy gợi ý 3 phương án: truyền thống, hiện đại và tinh tế. Kèm theo ý nghĩa của mỗi món quà.`
  });
  return response.text || "Đang chuẩn bị ý tưởng...";
};

export const findFlowerMarkets = async (lat: number, lng: number) => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Tìm các chợ hoa Xuân, vườn hoa hoặc địa điểm du xuân nổi tiếng gần vị trí của tôi cho dịp Tết Bính Ngọ 2026. Hãy mô tả ngắn gọn về mỗi địa điểm.",
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      }
    },
  });
  
  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const getZodiacCompatibility = async (year: string): Promise<string> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tôi sinh năm ${year}. Trong năm Bính Ngọ 2026, hãy phân tích xem tôi nên chọn người tuổi gì để xông đất mang lại may mắn và tài lộc cho gia đình. Giải thích lý do dựa trên Thiên can, Địa chi và Ngũ hành của năm Bính Ngọ. Trả lời bằng tiếng Việt trang trọng.`
  });
  return response.text || "Đang xem xét vận trình của bạn...";
};

// Fix: Thêm hàm sáng tác thơ Tết và câu đối
export const generateTetPoetry = async (theme: string, type: 'couplet' | 'poem'): Promise<string> => {
  const ai = getAIInstance();
  const prompt = type === 'couplet' 
    ? `Hãy sáng tác một cặp câu đối Tết Bính Ngọ 2026 về chủ đề: ${theme}. Trình bày 2 dòng, mỗi dòng một vế đối xứng nhau. Trả lời bằng tiếng Việt.`
    : `Hãy sáng tác một bài thơ lục bát chúc Tết Bính Ngọ 2026 về chủ đề: ${theme}. Bài thơ mang âm hưởng vui tươi, hy vọng. Trả lời bằng tiếng Việt.`;
    
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });
  return response.text || "Bút sa gà chết, ý thơ chưa thành...";
};

// Fix: Thêm hàm phân tích món ăn ngày Tết từ hình ảnh
export const analyzeTetFood = async (base64Data: string): Promise<string> => {
  const ai = getAIInstance();
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Data,
    },
  };
  const textPart = {
    text: "Đây là món ăn gì trong mâm cỗ Tết Việt Nam? Hãy phân tích ý nghĩa, nguồn gốc và cách chế biến đặc trưng của nó cho dịp Tết Bính Ngọ 2026. Trả lời bằng tiếng Việt, súc tích và hấp dẫn."
  };
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, textPart] },
  });
  
  return response.text || "Chưa thể nhận diện được tinh hoa ẩm thực này...";
};
