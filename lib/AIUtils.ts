import { GoogleGenAI } from "@google/genai";

// Normal async function
export const  getCompetitorAnswer = async(question: string)=> {
  let answer = "";

  try {
    // Fetch data from your internal API (MongoDB)
    const dbRes = await fetch("/api/competitors", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!dbRes.ok) {
      throw new Error(`DB fetch failed: ${dbRes.status}`);
    }

    const { data } = await dbRes.json();
    const context = JSON.stringify(data, null, 2);

    const prompt = `
You are an assistant trained on competitor data.

User question:
"${question}"

Relevant data:
${context}

Answer only using the data provided above.
    `;

    // Initialize Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const parts = response.response?.parts;
    if (Array.isArray(parts) && parts.length > 0) {
      answer = parts.map((p) => p.text).join("").trim();
    } else {
      console.warn("GenAI returned no parts:", response);
      answer = "No answer returned by the model.";
    }
  } catch (err) {
    console.error("Error generating answer:", err);
    answer = "An error occurred while generating the answer.";
  }

  return answer;
}
