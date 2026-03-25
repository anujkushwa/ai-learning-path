import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const { topic, score, missed } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not found in env" },
        { status: 500 },
      );
    }

    const prompt = `
You are a senior mentor AI.

Student scored ${score}% in ${topic}.
Weak areas: ${missed?.join(", ") || "Not specified"}.

Return ONLY JSON:

{
 "mentor_analysis": ["point1","point2","point3","point4","point5","point6"],
 "remedy_roadmap": ["step1","step2","step3","step4","step5","step6"]
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      response_format: { type: "json_object" }, // 🔥 forces JSON
    });

    const text = completion.choices[0].message.content;

    return NextResponse.json(JSON.parse(text));
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
