export function generateFeedback(topicAnalysis) {
  return Object.entries(topicAnalysis).map(([topic, data]) => {
    const { correct, total, status } = data;

    const messages = {
      strong: `Great job in ${topic}. You have a strong understanding.`,
      average: `You are doing okay in ${topic}, but some revision is needed.`,
      weak: `You need improvement in ${topic}. Focus more on basics and practice.`,
    };

    return {
      topic,
      score: `${correct}/${total}`,
      status,
      message: messages[status] || messages.weak,
    };
  });
}