import assert from "node:assert/strict";
import test from "node:test";
import { isCompleteQuizAnswers, quizQuestions } from "../lib/quiz-data";

function completeAnswers(overrides: Record<number, string> = {}) {
  const answers = quizQuestions.reduce<Record<number, string>>((nextAnswers, question) => {
    nextAnswers[question.id] = question.options[0].value;
    return nextAnswers;
  }, {});

  return { ...answers, ...overrides };
}

test("accepts a complete set of current quiz answers", () => {
  assert.equal(isCompleteQuizAnswers(completeAnswers()), true);
});

test("rejects missing answers for the current quiz schema", () => {
  const answers = completeAnswers();
  delete answers[9];

  assert.equal(isCompleteQuizAnswers(answers), false);
});

test("rejects pre-v5.1 answer shapes with shifted question ids", () => {
  const oldEightQuestionAnswers = {
    1: "established",
    2: "5-6",
    3: "reorder_hassle",
    4: "happy",
    5: "home",
    6: "easy_reorder",
    7: "home_delivery",
    8: "5"
  };

  assert.equal(isCompleteQuizAnswers(oldEightQuestionAnswers), false);
});

test("rejects values that are not valid for their question", () => {
  assert.equal(isCompleteQuizAnswers(completeAnswers({ 5: "home" })), false);
});
