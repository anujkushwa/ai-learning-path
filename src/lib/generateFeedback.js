export function generateFeedback(topicAnalysis) {
  const feedback = [];

  Object.keys(topicAnalysis).forEach((topic) => {
    const { correct, total, status } = topicAnalysis[topic];

    let message = "";

    if (status === "strong") {
      message = `Great job in ${topic}. You have a strong understanding.`;
    } else if (status === "average") {
      message = `You are doing okay in ${topic}, but some revision is needed.`;
    } else {
      message = `You need improvement in ${topic}. Focus more on basics and practice.`;
    }

    feedback.push({
      topic,
      score: `${correct}/${total}`,
      status,
      message,
    });
  });

  return feedback;
}
