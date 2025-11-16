
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
        const prompt = `Create a short and catchy social media post in Indonesian to promote a banana chip product called "Kriuké Snack - ${productName}". 
        Make it fun and engaging. 
        Include relevant hashtags like #KriukeSnack #KripikPisang #CemilanEnak #SnackLokal.`;
        
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
