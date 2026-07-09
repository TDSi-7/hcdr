import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isCompleteQuizAnswers, isValidProfile, normalizeQuizAnswers } from "../lib/quiz-validation";

const completeAnswers = {
  1: "new",
  2: "isc",
  3: "3-4",
  4: "discomfort",
  5: "happy",
  6: "work",
  7: "comfort",
  8: "home_delivery",
  9: "4"
};

describe("quiz validation", () => {
  it("accepts a complete v5.1 answer set", () => {
    assert.deepEqual(normalizeQuizAnswers(completeAnswers), completeAnswers);
    assert.equal(isCompleteQuizAnswers(completeAnswers), true);
  });

  it("rejects legacy pre-v5.1 answer sets without question 9", () => {
    const legacyAnswers = {
      1: "new",
      2: "3-4",
      3: "discomfort",
      4: "happy",
      5: "work",
      6: "comfort",
      7: "home_delivery",
      8: "4"
    };

    assert.equal(normalizeQuizAnswers(legacyAnswers), null);
    assert.equal(isCompleteQuizAnswers(legacyAnswers), false);
  });

  it("rejects answers that do not belong to their current question", () => {
    assert.equal(
      normalizeQuizAnswers({
        ...completeAnswers,
        2: "3-4"
      }),
      null
    );
  });

  it("only accepts known result profiles", () => {
    assert.equal(isValidProfile("A"), true);
    assert.equal(isValidProfile("B"), true);
    assert.equal(isValidProfile("C"), true);
    assert.equal(isValidProfile("D"), false);
    assert.equal(isValidProfile(null), false);
  });
});
