// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     if (!process.env.GEMINI_API_KEY) {
//       return NextResponse.json(
//         { error: "GEMINI_API_KEY missing" },
//         { status: 500 }
//       );
//     }

//     const { topic, score } = await req.json();

//     if (!topic || score === undefined) {
//       return NextResponse.json(
//         { error: "topic and score required" },
//         { status: 400 }
//       );
//     }

//     // 🔥 STRONG PROMPT
//     const prompt = `
// You are a senior programming mentor AI.

// Topic: ${topic}
// Student Score: ${score}%

// Give highly specific feedback only about "${topic}".

// Mention "${topic}" inside multiple points.

// Feedback must be different for each topic.

// Provide:

// 1. 6 bullet feedback points explaining strengths & weaknesses.
// 2. 6 step learning roadmap focused ONLY on "${topic}".

// Rules:
// - Beginner friendly language
// - No generic advice
// - No repeated points
// - Return ONLY JSON

// Format:

// {
//  "feedback": ["..."],
//  "roadmap": ["..."]
// }
// `;

//     const url =
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent" +
//       `?key=${process.env.GEMINI_API_KEY}`;

//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         contents: [
//           {
//             role: "user",
//             parts: [{ text: prompt }],
//           },
//         ],
//       }),
//     });

//     const data = await response.json();

//     let text =
//       data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

//     // Clean markdown if present
//     text = text.replace(/```json|```/g, "").trim();

//     let parsed;

//     try {
//       parsed = JSON.parse(text);
//     } catch {
//       parsed = {
//         feedback: [
//           `Practice ${topic} daily`,
//           `Revise ${topic} fundamentals`,
//           `Solve beginner ${topic} problems`,
//           `Understand mistakes in ${topic}`,
//           `Improve logic in ${topic}`,
//           `Attempt small ${topic} tests`
//         ],
//         roadmap: [
//           `Revise ${topic} basics`,
//           `Watch ${topic} tutorials`,
//           `Solve 10 easy ${topic} problems`,
//           `Solve 5 medium ${topic} problems`,
//           `Analyze mistakes`,
//           `Take ${topic} mock test`
//         ]
//       };
//     }

//     return NextResponse.json(parsed);

//   } catch (error) {
//     return NextResponse.json(
//       { error: "Server error" },
//       { status: 500 }
//     );
//   }
// }



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
        { status: 500 }
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
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.4,
      response_format: { type: "json_object" }   // 🔥 forces JSON
    });

    const text = completion.choices[0].message.content;

    return NextResponse.json(JSON.parse(text));

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
