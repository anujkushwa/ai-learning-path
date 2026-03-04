export async function getLearningPath(topicAnalysis) {
  const response = await fetch("/api/groq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic: topicAnalysis.topic,
      score: topicAnalysis.score,
      missed: topicAnalysis.missed || []
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Failed to generate learning path");
  }

  // Convert Groq response → UI friendly format
  return {
    feedback: data.mentor_analysis,
    roadmap: data.remedy_roadmap,
  };
}
