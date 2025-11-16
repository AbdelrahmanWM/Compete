import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body?.question;

    if (!question) {
      return NextResponse.json(
        { error: "Missing required field: question" },
        { status: 400 }
      );
    }

    // Ensure server has the API key set (fail fast with a clear message)
    if (!process.env.GEMINI_API_KEY) {
      console.error(
        "GEMINI_API_KEY is not set. Set GEMINI_API_KEY in your environment."
      );
      return NextResponse.json(
        { error: "Server misconfiguration: GEMINI_API_KEY is not set" },
        { status: 500 }
      );
    }

    // Fetch competitor data from DB (server-side)
    const db = await getDb();
    const competitors = await db.collection("competitors").find({}).toArray();
    const context = JSON.stringify(competitors || [], null, 2);

    const prompt = `You are a professional competitor intelligence assistant. Your role is to provide concise, actionable insights about competitors based on the data provided.

GUIDELINES:
- Answer questions CONCISELY (2-3 sentences max unless asked for details)
- Use bullet points for lists or comparisons
- Focus on facts from the data provided
- If data is incomplete or missing, say "Data not available"
- Be objective and professional
- Highlight key metrics, trends, or anomalies when relevant

User question:
"${question}"

Competitor data:
${context}

Provide a direct, concise answer based ONLY on the data above.`;

    // Initialize Gemini on the server (api key from process.env)
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const anyResp = response as any;
    let answer = "";

    // Primary: new SDK shape -> response.response.parts
    if (anyResp?.response?.parts && Array.isArray(anyResp.response.parts)) {
      answer = anyResp.response.parts
        .map(
          (p: any) => p?.text || (p?.content && JSON.stringify(p.content)) || ""
        )
        .join("")
        .trim();
    }

    // Fallback: SDK shape -> candidates[0].content.parts (array of {text, role})
    if (
      !answer &&
      Array.isArray(anyResp?.candidates) &&
      anyResp.candidates.length
    ) {
      try {
        const cand = anyResp.candidates[0];
        if (cand?.content?.parts && Array.isArray(cand.content.parts)) {
          answer = cand.content.parts
            .map((p: any) => p?.text || "")
            .join("")
            .trim();
        } else if (Array.isArray(cand.content)) {
          answer = cand.content
            .map((c: any) => {
              if (typeof c === "string") return c;
              if (c?.text) return c.text;
              if (c?.parts && Array.isArray(c.parts))
                return c.parts.map((p: any) => p.text || "").join("");
              return "";
            })
            .join("")
            .trim();
        } else if (typeof cand.content === "string") {
          answer = cand.content.trim();
        }
      } catch (e) {
        console.warn("Failed to extract from candidates:", e);
      }
    }

    if (!answer) {
      console.warn("GenAI returned no parts or candidates content:", anyResp);
      answer = "No answer returned by the model.";
    }

    return NextResponse.json({ success: true, answer });
  } catch (err) {
    console.error("Error in AI route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
