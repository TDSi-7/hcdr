import { quizQuestions } from "./quiz-data";

export type QuizAnswers = Record<number, string>;

type QuizAnswerValidation =
  | {
      ok: true;
      answers: QuizAnswers;
    }
  | {
      ok: false;
      missingQuestionIds: number[];
      invalidQuestionIds: number[];
    };

export function validateQuizAnswers(value: unknown): QuizAnswerValidation {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      ok: false,
      missingQuestionIds: quizQuestions.map((question) => question.id),
      invalidQuestionIds: []
    };
  }

  const input = value as Record<string, unknown>;
  const answers: QuizAnswers = {};
  const missingQuestionIds: number[] = [];
  const invalidQuestionIds: number[] = [];

  for (const question of quizQuestions) {
    const rawAnswer = input[String(question.id)];
    if (typeof rawAnswer !== "string" || rawAnswer.trim() === "") {
      missingQuestionIds.push(question.id);
      continue;
    }

    const answer = rawAnswer.trim();
    if (!question.options.some((option) => option.value === answer)) {
      invalidQuestionIds.push(question.id);
      continue;
    }

    answers[question.id] = answer;
  }

  if (missingQuestionIds.length > 0 || invalidQuestionIds.length > 0) {
    return { ok: false, missingQuestionIds, invalidQuestionIds };
  }

  return { ok: true, answers };
}

export function hasCompleteQuizAnswers(value: unknown): value is QuizAnswers {
  return validateQuizAnswers(value).ok;
}
