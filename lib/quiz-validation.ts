import { quizQuestions } from "./quiz-data";
import { getProfile } from "./result-logic";

export type Profile = ReturnType<typeof getProfile>;
export type QuizAnswers = Record<number, string>;

const allowedAnswersByQuestion = quizQuestions.reduce<Record<number, Set<string>>>((acc, question) => {
  acc[question.id] = new Set(question.options.map((option) => option.value));
  return acc;
}, {});

export function normalizeQuizAnswers(value: unknown): QuizAnswers | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const rawAnswers = value as Record<string, unknown>;
  const answers: QuizAnswers = {};

  for (const question of quizQuestions) {
    const answer = rawAnswers[String(question.id)];
    if (typeof answer !== "string" || !allowedAnswersByQuestion[question.id]?.has(answer)) {
      return null;
    }
    answers[question.id] = answer;
  }

  return answers;
}

export function validateQuizSubmission(value: unknown): { answers: QuizAnswers; profile: Profile } | null {
  const answers = normalizeQuizAnswers(value);
  if (!answers) {
    return null;
  }

  return {
    answers,
    profile: getProfile(answers)
  };
}
