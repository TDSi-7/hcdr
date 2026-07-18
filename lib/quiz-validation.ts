import { quizQuestions } from "./quiz-data";

export type QuizAnswers = Record<number, string>;

export function isCompleteQuizAnswers(value: unknown): value is QuizAnswers {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const answers = value as Record<number, unknown>;
  return quizQuestions.every((question) => {
    const answer = answers[question.id];
    return typeof answer === "string" && question.options.some((option) => option.value === answer);
  });
}
