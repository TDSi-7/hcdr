import { quizQuestions } from "./quiz-data";

export type QuizAnswers = Record<number, string>;

export const QUIZ_SCHEMA_VERSION = "5.1";

const optionValuesByQuestion = new Map(
  quizQuestions.map((question) => [question.id, new Set(question.options.map((option) => option.value))])
);

export function normalizeQuizAnswers(answers: unknown): QuizAnswers | null {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return null;
  }

  const rawAnswers = answers as Record<string, unknown>;
  const normalized: QuizAnswers = {};

  for (const question of quizQuestions) {
    const value = rawAnswers[String(question.id)];
    const allowedValues = optionValuesByQuestion.get(question.id);

    if (typeof value !== "string" || !allowedValues?.has(value)) {
      return null;
    }

    normalized[question.id] = value;
  }

  return normalized;
}

export function isQuizComplete(answers: unknown): answers is QuizAnswers {
  return normalizeQuizAnswers(answers) !== null;
}
