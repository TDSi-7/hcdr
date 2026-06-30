import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isCompleteQuizAnswers, quizQuestions } from "../lib/quiz-data";

function currentCompleteAnswers() {
  return Object.fromEntries(quizQuestions.map((question) => [question.id, question.options[0].value]));
}

describe("isCompleteQuizAnswers", () => {
  it("accepts one valid answer for every current quiz question", () => {
    assert.equal(isCompleteQuizAnswers(currentCompleteAnswers()), true);
  });

  it("rejects pre-v5.1 eight-question answer state", () => {
    const staleAnswers = {
      1: "new",
      2: "3-4",
      3: "discomfort",
      4: "happy",
      5: "work",
      6: "comfort",
      7: "collect",
      8: "4"
    };

    assert.equal(isCompleteQuizAnswers(staleAnswers), false);
  });

  it("rejects answers that do not match the current option values", () => {
    const answers = currentCompleteAnswers();
    answers[2] = "3-4";

    assert.equal(isCompleteQuizAnswers(answers), false);
  });
});
