"use client";
import { getCompetitorAnswer } from "@/lib/AIUtils";
import { useState } from "react";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = async () => {
    if (!input.trim()) return;

    setError(null);
    setLoading(true);
    try {
      const res = await getCompetitorAnswer(input);



      setAnswer(res || "No answer returned");
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-24 p-2 border rounded"
        placeholder="Ask a question about competitors..."
      />
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={ask}
          disabled={loading || !input.trim()}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Thinking…" : "Ask"}
        </button>
        {error && <div className="text-sm text-red-500">{error}</div>}
      </div>

      <div className="mt-3 whitespace-pre-wrap">{answer}</div>
    </div>
  );
}
