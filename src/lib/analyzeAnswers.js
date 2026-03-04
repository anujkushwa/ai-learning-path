export function analyzeAnswers(questions, answers) {
  const topicMap = {};

  questions.forEach((q) => {
    const topic = q.topic;

    if (!topicMap[topic]) {
      topicMap[topic] = {
        total: 0,
        correct: 0,
        wrong: 0,
        status: "",
      };
    }

    topicMap[topic].total++;

    if (answers[q.id] === q.correctAnswer) {
      topicMap[topic].correct++;
    } else {
      topicMap[topic].wrong++;
    }
  });

  // decide topic status
  Object.keys(topicMap).forEach((topic) => {
    const { correct, total } = topicMap[topic];
    const accuracy = correct / total;

    if (accuracy >= 0.7) {
      topicMap[topic].status = "strong";
    } else if (accuracy >= 0.4) {
      topicMap[topic].status = "average";
    } else {
      topicMap[topic].status = "weak";
    }
  });

  return topicMap;
}
