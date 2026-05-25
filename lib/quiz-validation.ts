import { quizQuestions } from "@/lib/quiz-data";

export const requiredQuizQuestionIds = quizQuestions.map((question) => question.id);

const validAnswerValuesByQuestionId = quizQuestions.reduce<Record<number, Set<string>>>((acc, question) => {
  acc[question.id] = new Set(question.options.map((option) => option.value));
  return acc;
}, {});

function answerValueFor(input: unknown, questionId: number): unknown {
  if (!input || typeof input !== "object") {
    return undefined;
  }

  return (input as Record<string, unknown>)[String(questionId)];
}

export function getValidQuizAnswers(input: unknown): Record<number, string> {
  const answers: Record<number, string> = {};

  for (const questionId of requiredQuizQuestionIds) {
    const value = answerValueFor(input, questionId);
    if (typeof value === "string" && validAnswerValuesByQuestionId[questionId]?.has(value)) {
      answers[questionId] = value;
    }
  }

  return answers;
}

export function missingOrInvalidQuizQuestionIds(input: unknown): number[] {
  return requiredQuizQuestionIds.filter((questionId) => {
    const value = answerValueFor(input, questionId);
    return typeof value !== "string" || !validAnswerValuesByQuestionId[questionId]?.has(value);
  });
}

export function hasCompleteQuizAnswers(input: unknown): input is Record<number, string> {
  return missingOrInvalidQuizQuestionIds(input).length === 0;
}
