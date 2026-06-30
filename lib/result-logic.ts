import { QuizAnswers } from "./quiz-data";

export function getProfile(answers: QuizAnswers): "A" | "B" | "C" {
  const satisfaction = parseInt(answers[9] ?? "0", 10);
  const choiceAwareness = answers[5];

  if (satisfaction >= 4 && choiceAwareness === "happy") {
    return "C";
  }

  if (satisfaction <= 3 && choiceAwareness !== "happy") {
    return "A";
  }

  return "B";
}
