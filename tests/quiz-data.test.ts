import assert from "node:assert/strict";
import test from "node:test";
import { isCompleteQuizAnswers, quizQuestions } from "../lib/quiz-data";

const completeAnswers = Object.fromEntries(
  quizQuestions.map((question) => [question.id, question.options[0].value])
) as Record<number, string>;

test("accepts a complete answer set for the current quiz schema", () => {
  assert.equal(isCompleteQuizAnswers(completeAnswers), true);
});

test("rejects stale pre-v5.1 answer sets that do not include question 9", () => {
  const staleAnswers = { ...completeAnswers };
  delete staleAnswers[9];

  assert.equal(isCompleteQuizAnswers(staleAnswers), false);
});

test("rejects shifted answers whose values no longer belong to their question", () => {
  const shiftedAnswers = {
    ...completeAnswers,
    2: "3-4"
  };

  assert.equal(isCompleteQuizAnswers(shiftedAnswers), false);
});
