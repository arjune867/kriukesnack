
import { GoogleGenAI } from "@google/genai";

// Fix: Per coding guidelines, initialize GoogleGenAI directly and exclusively with process.env.API_KEY.
// The API key is assumed to be available in the environment, so fallbacks and warnings are removed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDescription = async (productName: string, keywords: string): Promise<string> => {
    try {
        const prompt = `Generate a persuasive and exciting product description for a banana chips snack called "Kriuké Snack - ${productName}".
        Incorporate these keywords: ${keywords}.
        The description should be in Indonesian, short (around 30-50 words), and highlight its crispiness and delicious taste. Make it sound very appealing to snack lovers.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating description:", error);
        return "Gagal membuat deskripsi. Coba lagi nanti.";
    }
};

export const generateSocialPost = async (productName: string): Promise<string> => {
    try {
        const prompt = `Buatkan satu teks promosi yang menarik dan SEO-friendly untuk media sosial dalam Bahasa Indonesia.
Produk: Kriuké Snack - ${productName}.
Gaya: Ceria, singkat, dan persuasif. Gunakan kata kunci seperti "keripik pisang", "cemilan renyah", dan nama produk secara alami.
Struktur:
1. Kalimat pembuka yang menarik perhatian.
2. Keunggulan utama produk (contoh: rasa, kerenyahan).
3. Ajakan untuk membeli (Call to Action).
4. Wajib sertakan hashtag relevan: #KriukeSnack #${productName.replace(/\s+/g, '')} #KripikPisang #CemilanEnak #SnackLokal.

Langsung berikan teks promosinya saja, tanpa judul atau embel-embel "opsi".`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error generating social post:", error);
        return `Yuk cobain Kriuké Snack - ${productName}! Renyahnya bikin nagih! #KriukeSnack`;
    }
};
