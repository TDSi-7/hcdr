import { quizLabelByQuestionAndValue, quizQuestions } from "@/lib/quiz-data";

export const REQUIRED_QUESTION_IDS = quizQuestions.map((question) => question.id);

export function coerceQuizAnswers(value: unknown): Record<number, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const source = value as Record<string, unknown>;
  return REQUIRED_QUESTION_IDS.reduce<Record<number, string>>((answers, questionId) => {
    const answer = source[String(questionId)];
    if (typeof answer === "string") {
      answers[questionId] = answer;
    }
    return answers;
  }, {});
}

export function hasCompleteQuizAnswers(value: unknown): boolean {
  const answers = coerceQuizAnswers(value);

  return REQUIRED_QUESTION_IDS.every((questionId) => {
    const answer = answers[questionId];
    return Boolean(answer && quizLabelByQuestionAndValue[questionId]?.[answer]);
  });
}
