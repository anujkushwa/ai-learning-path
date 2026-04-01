export function calculateStatus(score) {
  const rules = [
    { min: 70, label: "Strong" },
    { min: 50, label: "Average" },
    { min: 0, label: "Weak" },
  ];

  return rules.find(rule => score >= rule.min).label;
}