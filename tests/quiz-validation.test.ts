import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { quizQuestions } from "../lib/quiz-data";
import { getProfile } from "../lib/result-logic";
import { normalizeQuizAnswers, validateQuizSubmission } from "../lib/quiz-validation";

function completeAnswers(overrides: Record<number, string> = {}) {
  return quizQuestions.reduce<Record<number, string>>((answers, question) => {
    answers[question.id] = overrides[question.id] ?? question.options[0].value;
    return answers;
  }, {});
}

describe("quiz validation", () => {
  it("accepts a complete current-schema answer set and computes the profile", () => {
    const answers = completeAnswers({ 5: "happy", 9: "5" });

    const result = validateQuizSubmission(answers);

    assert.deepEqual(result, {
      answers,
      profile: getProfile(answers)
    });
  });

  it("rejects stale answer sets missing the v5.1 ninth question", () => {
    const answers = completeAnswers();
    delete answers[9];

    assert.equal(normalizeQuizAnswers(answers), null);
    assert.equal(validateQuizSubmission(answers), null);
  });

  it("rejects values that are not valid for the current question", () => {
    const answers = completeAnswers({ 2: "comfort" });

    assert.equal(validateQuizSubmission(answers), null);
  });
});
