import { quizQuestions } from "./quiz-data";

export type QuizAnswers = Record<number, string>;
export type ProfileKey = "A" | "B" | "C";

export function normalizeQuizAnswers(value: unknown): QuizAnswers | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const rawAnswers = value as Record<string, unknown>;
  const normalized: QuizAnswers = {};

  for (const question of quizQuestions) {
    const answer = rawAnswers[String(question.id)];
    if (typeof answer !== "string") {
      return null;
    }

    const trimmedAnswer = answer.trim();
    if (!question.options.some((option) => option.value === trimmedAnswer)) {
      return null;
    }

    normalized[question.id] = trimmedAnswer;
  }

  return normalized;
}

export function isCompleteQuizAnswers(value: unknown): value is QuizAnswers {
  return normalizeQuizAnswers(value) !== null;
}

export function isValidProfile(value: unknown): value is ProfileKey {
  return value === "A" || value === "B" || value === "C";
}
