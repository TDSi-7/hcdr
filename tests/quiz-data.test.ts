import assert from "node:assert/strict";
import { test } from "node:test";
import { isCompleteQuizAnswers, quizQuestions } from "../lib/quiz-data";

function buildCompleteAnswers(): Record<number, string> {
  return quizQuestions.reduce<Record<number, string>>((answers, question) => {
    answers[question.id] = question.options[0].value;
    return answers;
  }, {});
}

test("accepts a complete answer set for the current quiz schema", () => {
  assert.equal(isCompleteQuizAnswers(buildCompleteAnswers()), true);
});

test("rejects stale eight-question answer sets from the previous quiz schema", () => {
  const staleAnswers = {
    1: "established",
    2: "5-6",
    3: "discomfort",
    4: "happy",
    5: "work",
    6: "comfort",
    7: "home_delivery",
    8: "4"
  };

  assert.equal(isCompleteQuizAnswers(staleAnswers), false);
});

test("rejects shifted answer values that belong to a different question", () => {
  const answers = buildCompleteAnswers();
  answers[2] = "5-6";

  assert.equal(isCompleteQuizAnswers(answers), false);
});
