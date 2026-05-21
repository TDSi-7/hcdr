import { quizQuestions } from "@/lib/quiz-data";

export type QuizAnswers = Record<number, string>;

const validAnswerValuesByQuestion = quizQuestions.reduce<Record<number, Set<string>>>((acc, question) => {
  acc[question.id] = new Set(question.options.map((option) => option.value));
  return acc;
}, {});

export function hasCompleteQuizAnswers(answers: unknown): answers is QuizAnswers {
  if (!answers || typeof answers !== "object") {
    return false;
  }

  const answerMap = answers as Record<number, unknown>;
  return quizQuestions.every((question) => {
    const answer = answerMap[question.id];
    return typeof answer === "string" && validAnswerValuesByQuestion[question.id]?.has(answer);
  });
}
