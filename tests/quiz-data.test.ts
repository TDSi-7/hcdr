import assert from "node:assert/strict";
import test from "node:test";
import { isCompleteQuizAnswers, quizQuestions } from "../lib/quiz-data";

function completeAnswers(): Record<number, string> {
  return Object.fromEntries(quizQuestions.map((question) => [question.id, question.options[0].value])) as Record<
    number,
    string
  >;
}

test("accepts one valid answer for every current quiz question", () => {
  assert.equal(isCompleteQuizAnswers(completeAnswers()), true);
});

test("rejects current quiz answers with a missing question", () => {
  const answers = completeAnswers();
  delete answers[9];

  assert.equal(isCompleteQuizAnswers(answers), false);
});

test("rejects answer values that are not valid for the current question", () => {
  const answers = completeAnswers();
  answers[2] = "1-2";

  assert.equal(isCompleteQuizAnswers(answers), false);
});

test("rejects stale pre-v5.1 answers shifted by the catheter type question", () => {
  const staleAnswers = {
    1: "new",
    2: "1-2",
    3: "discomfort",
    4: "unaware_can_ask",
    5: "work",
    6: "comfort",
    7: "collect",
    8: "1"
  };

  assert.equal(isCompleteQuizAnswers(staleAnswers), false);
});
