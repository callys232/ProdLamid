// utils/openai.ts
import OpenAI from "openai";

// Use OpenRouter's endpoint and API key
const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

/**
 * Generates fashion recommendations based on user inputs.
 * @param params Object containing user fashion preferences and context.
 * @returns AI-generated style recommendations as a string.
 */
export async function generateFashionRecommendations(params: {
    bodyType: string;
    occasion: string;
    preferences?: string[];
    colorPreferences?: string[];
    season?: string;
    requirements?: string;
}) {
    const { bodyType, occasion, preferences, colorPreferences, season, requirements } = params;

    const prompt = `
    You are a professional fashion stylist. Based on:
    - Body Type: ${bodyType}
    - Occasion: ${occasion}
    - Preferences: ${preferences?.join(", ") || "none"}
    - Color Preferences: ${colorPreferences?.join(", ") || "none"}
    - Season: ${season || "not specified"}
    - Special Requirements: ${requirements || "none"}
    
    Recommend:
    1. Suggested apparel categories (tops, bottoms, dresses, shoes).
    2. Color palette.
    3. Accessory ideas.
    4. Style tips.
    Format clearly, and suggest products with clickable links in Markdown if possible.
  `;

    const aiResponse = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini", // you can swap with any OpenRouter-supported model
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
    });

    return aiResponse.choices[0]?.message?.content || "";
}

/**
 * Estimates project budget and timeline based on project details.
 */
export async function estimateProjectDetails(params: {
    title: string;
    description?: string;
    category: string;
    skills?: string[];
}) {
    const { title, description, category, skills } = params;

    const prompt = `
    You are an AI Project Advisor. Based on the following project details, provide a budget range and typical duration.
    
    Project Title: ${title}
    Category: ${category}
    Description: ${description || "No description provided."}
    Required Skills: ${skills?.join(", ") || "None specified."}
    
    Provide your response in strict JSON format with the following keys:
    - budgetMin (number): Suggested minimum budget in USD.
    - budgetMax (number): Suggested maximum budget in USD.
    - durationMonths (number): Typical duration in months.
    - explanation (string): A very short (max 15 words) summary of why this estimation was given.
    
    Return ONLY the JSON object.
  `;

    try {
        const aiResponse = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
            response_format: { type: "json_object" },
        });

        const content = aiResponse.choices[0]?.message?.content || "{}";
        return JSON.parse(content);
    } catch (error) {
        console.error("AI Estimation Error:", error);
        return {
            budgetMin: 3000,
            budgetMax: 15000,
            durationMonths: 4,
            explanation: "Using standard market averages due to estimation error.",
        };
    }
}
