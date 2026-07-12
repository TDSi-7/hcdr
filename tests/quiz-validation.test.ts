import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeQuizAnswers, isQuizComplete } from "../lib/quiz-validation";
import { getProfile } from "../lib/result-logic";

const completeAnswers = {
  1: "established",
  2: "isc",
  3: "5-6",
  4: "discomfort",
  5: "unaware_can_ask",
  6: "travel",
  7: "comfort",
  8: "home_delivery",
  9: "2"
};

describe("quiz validation", () => {
  it("accepts complete current-schema answers", () => {
    const normalized = normalizeQuizAnswers(completeAnswers);

    assert.deepEqual(normalized, completeAnswers);
    assert.equal(isQuizComplete(completeAnswers), true);
  });

  it("rejects pre-v5.1 answers that are missing the inserted catheter-type question", () => {
    const oldEightQuestionAnswers = {
      1: "established",
      2: "5-6",
      3: "discomfort",
      4: "happy",
      5: "travel",
      6: "comfort",
      7: "home_delivery",
      8: "5"
    };

    assert.equal(normalizeQuizAnswers(oldEightQuestionAnswers), null);
    assert.equal(isQuizComplete(oldEightQuestionAnswers), false);
  });

  it("rejects current answers with missing or invalid values", () => {
    assert.equal(normalizeQuizAnswers({ ...completeAnswers, 9: undefined }), null);
    assert.equal(normalizeQuizAnswers({ ...completeAnswers, 2: "5-6" }), null);
  });

  it("keeps profile calculation tied to validated current answer ids", () => {
    const normalized = normalizeQuizAnswers(completeAnswers);

    assert.ok(normalized);
    assert.equal(getProfile(normalized), "A");
  });
});
