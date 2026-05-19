import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { quizQuestions } from "../lib/quiz-data";
import { validateQuizAnswers } from "../lib/quiz-validation";

describe("validateQuizAnswers", () => {
  it("accepts one valid answer for every current quiz question", () => {
    const answers = Object.fromEntries(
      quizQuestions.map((question) => [question.id, question.options[0]?.value])
    );

    const result = validateQuizAnswers(answers);

    assert.equal(result.ok, true);
    if (result.ok) {
      assert.deepEqual(result.answers, answers);
    }
  });

  it("rejects missing answers so submissions cannot lose quiz context", () => {
    const answers = Object.fromEntries(
      quizQuestions.slice(0, -1).map((question) => [question.id, question.options[0]?.value])
    );

    const result = validateQuizAnswers(answers);

    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.deepEqual(result.missingQuestionIds, [quizQuestions[quizQuestions.length - 1]?.id]);
      assert.deepEqual(result.invalidQuestionIds, []);
    }
  });

  it("rejects answer values that are not valid options for that question", () => {
    const answers = Object.fromEntries(
      quizQuestions.map((question) => [question.id, question.options[0]?.value])
    );
    answers[quizQuestions[0].id] = "unexpected";

    const result = validateQuizAnswers(answers);

    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.deepEqual(result.missingQuestionIds, []);
      assert.deepEqual(result.invalidQuestionIds, [quizQuestions[0].id]);
    }
  });
});
