import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface GenerateCaptionParams {
  texts: string[];
  platform: string;
  tone: string;
  language: string;
  designType: string;
}

export async function generateCaption(
  params: GenerateCaptionParams,
): Promise<string> {
  const { texts, platform, tone, language, designType } = params;

  const platformGuidelines = getPlatformGuidelines(platform, designType);
  const toneGuidelines = getToneGuidelines(tone);
  const languageCode = language === "tr" ? "Türkçe" : "English";

  const systemPrompt = `Sen profesyonel bir sosyal medya içerik yazarısın. ${languageCode} dilinde, platforma uygun, etkili ve ilgi çekici gönderi açıklamaları oluşturursun.`;

  const userPrompt = `Sen bir sosyal medya içerik uzmanısın. Aşağıdaki tasarım metinlerine göre ${languageCode} dilinde bir gönderi açıklaması (caption) oluştur.

Platform: ${platform}
Tasarım Türü: ${designType}
Ton: ${tone}

${platformGuidelines}
${toneGuidelines}

Tasarım Metinleri:
${texts.map((text, i) => `${i + 1}. ${text}`).join("\n")}

KURALLAR:
- Sadece caption'ı yaz, başka açıklama ekleme
- Platform için uygun uzunlukta ol
- Ton rehberine uy
- ${languageCode} dilinde yaz
- Emojileri doğal şekilde kullan
- Gerekirse hashtag ekle (platform uygunsa)

Caption:`;

  try {
    // Gemini 2.0 Flash - Fast and reliable
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 2000, // Increased for longer captions
      },
    });

    const result = await model.generateContent([systemPrompt, userPrompt]);

    const response = await result.response;
    const caption = response.text().trim();

    console.log("Generated caption length:", caption.length);
    console.log("Generated caption:", caption);

    return caption;
  } catch (error: any) {
    console.error("Gemini API error:", error);
    throw new Error(`AI generation failed: ${error.message}`);
  }
}

function getPlatformGuidelines(platform: string, designType: string): string {
  const guidelines: Record<string, string> = {
    instagram_post:
      "📸 Instagram Post için: 2-3 paragraf, emoji kullan, 3-5 hashtag ekle, call-to-action ile bitir. Maksimum 2200 karakter.",
    instagram_story:
      "📱 Instagram Story için: Çok kısa ve çarpıcı (1-2 cümle), emoji kullan, aciliyet hissi ver. Maksimum 200 karakter.",
    linkedin:
      "💼 LinkedIn için: Profesyonel ton, 2-3 paragraf, hashtag az kullan (1-3 adet), iş değeri vurgusu yap. Maksimum 3000 karakter.",
    pinterest:
      "📌 Pinterest için: SEO odaklı, anahtar kelimeler kullan, açıklayıcı ol, hashtag ekle. Maksimum 500 karakter.",
    twitter:
      "🐦 Twitter/X için: Kısa ve öz (280 karakter), hashtag ve mention kullan, etkileşim sağla.",
    facebook:
      "👥 Facebook için: Samimi ve etkileşimli, 1-2 paragraf, emoji kullan, soru sor. Maksimum 2000 karakter.",
    tiktok:
      "🎵 TikTok için: Enerjik ve genç dil, hashtag challenge ekle, trend referansları. Maksimum 300 karakter.",
  };

  return guidelines[platform] || guidelines.instagram_post || "";
}

function getToneGuidelines(tone: string): string {
  const guidelines: Record<string, string> = {
    formal: "TON: Resmi ve profesyonel dil kullan, argondan kaçın, saygılı ol.",
    casual: "TON: Samimi ve doğal dil kullan, arkadaşça yaz, konuşur gibi ol.",
    fun: "TON: Eğlenceli ve neşeli dil kullan, espri yap, enerjik ol, bol emoji kullan.",
    professional:
      "TON: Profesyonel ama erişilebilir dil kullan, uzmanlık göster, güvenilir ol.",
    minimal:
      "TON: Minimal ve özlü dil kullan, gereksiz kelime kullanma, doğrudan ifade et.",
    inspiring:
      "TON: İlham verici ve motive edici dil kullan, pozitif mesajlar ver, umut aşıla.",
  };

  return guidelines[tone] || guidelines.casual || "";
}
