import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { query } = await req.json();

    // 🟡 1. Try AI (Groq)
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: `
Return ONLY JSON:

{
  "videos": [{"title": "", "link": ""}],
  "teachers": [],
  "resources": [{"title": "", "link": ""}],
  "roadmap": []
}
              `,
            },
            {
              role: "user",
              content: `Best learning resources for ${query}`,
            },
          ],
        }),
      });

      const data = await response.json();
      let content = data?.choices?.[0]?.message?.content;

      if (content) {
        const match = content.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          return NextResponse.json(parsed);
        }
      }
    } catch (aiError) {
      console.log("AI failed, using fallback...");
    }

    // 🔴 2. FALLBACK DATA (ALWAYS WORKING)
    const fallback = {
      videos: [
        {
          title: `${query} Full Course`,
          link: "https://www.youtube.com/results?search_query=" + query + "+full+course",
        },
        {
          title: `${query} Tutorial`,
          link: "https://www.youtube.com/results?search_query=" + query + "+tutorial",
        },
      ],
      teachers: [
        "Hitesh Choudhary",
        "CodeWithHarry",
        "Apna College",
        "Traversy Media",
      ],
      resources: [
        {
          title: `${query} - MDN Docs`,
          link: "https://developer.mozilla.org/en-US/search?q=" + query,
        },
        {
          title: `${query} - W3Schools`,
          link: "https://www.w3schools.com/search/search.asp?q=" + query,
        },
        {
          title: `${query} - GeeksforGeeks`,
          link: "https://www.geeksforgeeks.org/search/?q=" + query,
        },
      ],
      roadmap: [
        `Start with basics of ${query}`,
        `Understand core concepts of ${query}`,
        `Build small projects using ${query}`,
        `Move to advanced topics`,
        `Practice and build real-world apps`,
      ],
    };

    return NextResponse.json(fallback);

  } catch (error) {
    console.error("FINAL ERROR:", error);

    return NextResponse.json({
      error: "Something went wrong",
    });
  }
}