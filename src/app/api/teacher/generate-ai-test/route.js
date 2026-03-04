import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, level, count } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY missing" },
        { status: 500 }
      );
    }

    const prompt = `
Generate ${count} multiple choice questions on ${topic}.
Difficulty level: ${level}.

IMPORTANT:
Return only valid JSON array format:
[
  {
    "question": "",
    "options": ["", "", "", ""],
    "correct": ""
  }
]
No explanation.
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // ✅ UPDATED MODEL
          messages: [
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return NextResponse.json(
        { error: data.error?.message || "Groq API Error" },
        { status: 500 }
      );
    }

    const aiText = data.choices[0].message.content;

    const cleaned = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const questions = JSON.parse(cleaned);

    return NextResponse.json({ questions });

  } catch (error) {
    console.error("AI ERROR:", error);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}