import { quizQuestions } from "@/lib/quiz-data";

export function hasCompleteQuizAnswers(value: unknown): value is Record<number, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const answers = value as Record<number, unknown>;
  return quizQuestions.every((question) => {
    const answer = answers[question.id];
    return typeof answer === "string" && question.options.some((option) => option.value === answer);
  });
}
