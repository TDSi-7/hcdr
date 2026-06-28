import assert from "node:assert/strict";
import test from "node:test";
import { isCompleteQuizAnswers, isValidQuizAnswer, quizQuestions } from "../lib/quiz-data";

const completeAnswers = quizQuestions.reduce<Record<number, string>>((answers, question) => {
  answers[question.id] = question.options[0].value;
  return answers;
}, {});

test("recognizes valid current quiz answers", () => {
  assert.equal(isValidQuizAnswer(1, completeAnswers[1]), true);
  assert.equal(isValidQuizAnswer(1, "not-a-current-option"), false);
  assert.equal(isValidQuizAnswer(99, completeAnswers[1]), false);
});

test("requires a complete current-schema answer set", () => {
  assert.equal(isCompleteQuizAnswers(completeAnswers), true);
  assert.equal(isCompleteQuizAnswers({}), false);
  assert.equal(isCompleteQuizAnswers(null), false);

  const missingLastQuestion = { ...completeAnswers };
  delete missingLastQuestion[9];
  assert.equal(isCompleteQuizAnswers(missingLastQuestion), false);

  const staleEightQuestionAnswers = Object.fromEntries(Object.entries(completeAnswers).filter(([id]) => id !== "9"));
  assert.equal(isCompleteQuizAnswers(staleEightQuestionAnswers as Record<number, string>), false);

  const invalidOption = { ...completeAnswers, 2: "old-frequency-answer" };
  assert.equal(isCompleteQuizAnswers(invalidOption), false);
});
