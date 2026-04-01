export function analyzeAnswers(questions, answers) {
  const topicMap = {};

  // Step 1: Build topic stats
  questions.forEach(({ id, topic, correctAnswer }) => {
    if (!topicMap[topic]) {
      topicMap[topic] = {
        total: 0,
        correct: 0,
        wrong: 0,
        status: "",
      };
    }

    const isCorrect = answers[id] === correctAnswer;

    topicMap[topic].total++;
    topicMap[topic][isCorrect ? "correct" : "wrong"]++;
  });

  // Step 2: Assign status
  Object.entries(topicMap).forEach(([topic, data]) => {
    const { correct, total } = data;
    const accuracy = correct / total;

    const rules = [
      { min: 0.7, label: "strong" },
      { min: 0.4, label: "average" },
      { min: 0, label: "weak" },
    ];

    data.status = rules.find(rule => accuracy >= rule.min).label;
  });

  return topicMap;
}