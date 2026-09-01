import { quizQuestions } from "./quiz-data";

export type QuizAnswers = Record<number, string>;

const validAnswersByQuestion = quizQuestions.reduce<Record<number, Set<string>>>((acc, question) => {
  acc[question.id] = new Set(question.options.map((option) => option.value));
  return acc;
}, {});

export const requiredQuizQuestionIds = quizQuestions.map((question) => question.id);

export function normalizeQuizAnswers(answers: unknown): QuizAnswers | null {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return null;
  }

  const candidate = answers as Record<string | number, unknown>;
  const normalized: QuizAnswers = {};

  for (const questionId of requiredQuizQuestionIds) {
    const answer = candidate[questionId] ?? candidate[String(questionId)];
    if (typeof answer !== "string" || !validAnswersByQuestion[questionId]?.has(answer)) {
      return null;
    }
    normalized[questionId] = answer;
  }

  return normalized;
}

export function hasCompleteCurrentQuizAnswers(answers: unknown): answers is QuizAnswers {
  return normalizeQuizAnswers(answers) !== null;
}

export function isGrantedConsent(value: unknown): value is true {
  return value === true;
}
