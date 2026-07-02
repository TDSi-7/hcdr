import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isCompleteQuizAnswers, quizQuestions } from "../lib/quiz-data";

describe("isCompleteQuizAnswers", () => {
  it("accepts one valid answer for every current quiz question", () => {
    const answers = Object.fromEntries(
      quizQuestions.map((question) => [question.id, question.options[0].value])
    ) as Record<number, string>;

    assert.equal(isCompleteQuizAnswers(answers), true);
  });

  it("rejects stale 8-question answer sets from the previous schema", () => {
    const staleAnswers = {
      1: "established",
      2: "3-4",
      3: "discomfort",
      4: "happy",
      5: "home",
      6: "comfort",
      7: "home_delivery",
      8: "5"
    };

    assert.equal(isCompleteQuizAnswers(staleAnswers), false);
  });

  it("rejects current question ids with values from a different question", () => {
    const answers = Object.fromEntries(
      quizQuestions.map((question) => [question.id, question.options[0].value])
    ) as Record<number, string>;
    answers[2] = "3-4";

    assert.equal(isCompleteQuizAnswers(answers), false);
  });
});
