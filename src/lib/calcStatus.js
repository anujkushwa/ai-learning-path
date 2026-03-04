export function calculateStatus(score) {
  if (score >= 70) return "Strong";
  if (score >= 50) return "Average";
  return "Weak";
}
