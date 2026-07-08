import assert from "node:assert/strict";
import test from "node:test";
import { isCompleteQuizAnswers, quizQuestions } from "../lib/quiz-data";

test("accepts a complete current quiz answer set", () => {
  const answers = Object.fromEntries(
    quizQuestions.map((question) => [question.id, question.options[0].value])
  ) as Record<number, string>;

  assert.equal(isCompleteQuizAnswers(answers), true);
});

test("rejects answers missing the v5.1 satisfaction question", () => {
  const answers = Object.fromEntries(
    quizQuestions.slice(0, -1).map((question) => [question.id, question.options[0].value])
  ) as Record<number, string>;

  assert.equal(isCompleteQuizAnswers(answers), false);
});

test("rejects stale v4 answer storage after the catheter type question was inserted", () => {
  const staleV4Answers: Record<number, string> = {
    1: "established",
    2: "3-4",
    3: "discomfort",
    4: "unaware_can_ask",
    5: "work",
    6: "comfort",
    7: "collect",
    8: "2"
  };

  assert.equal(isCompleteQuizAnswers(staleV4Answers), false);
});

test("rejects unknown values for current question ids", () => {
  const answers = Object.fromEntries(
    quizQuestions.map((question) => [question.id, question.options[0].value])
  ) as Record<number, string>;
  answers[2] = "3-4";

  assert.equal(isCompleteQuizAnswers(answers), false);
});
