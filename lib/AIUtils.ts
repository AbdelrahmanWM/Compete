// Client-side wrapper: call server API that uses Gemini with secret API key
export const getCompetitorAnswer = async (question: string) => {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || `AI request failed: ${res.status}`);
    }

    const payload = await res.json();
    return payload?.answer || "";
  } catch (e) {
    console.error("getCompetitorAnswer error:", e);
    return "An error occurred while generating the answer.";
  }
};
