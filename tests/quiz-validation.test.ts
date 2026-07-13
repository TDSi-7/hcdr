import assert from "node:assert/strict";
import test from "node:test";
import { hasCompleteCurrentQuizAnswers, normalizeQuizAnswers } from "../lib/quiz-validation";

const currentAnswers = {
  1: "new",
  2: "isc",
  3: "3-4",
  4: "discomfort",
  5: "unaware_options",
  6: "work",
  7: "comfort",
  8: "home_delivery",
  9: "4"
};

test("accepts complete v5.1 quiz answers", () => {
  assert.deepEqual(normalizeQuizAnswers(currentAnswers), currentAnswers);
  assert.equal(hasCompleteCurrentQuizAnswers(currentAnswers), true);
});

test("rejects stale v4 answers after question ids changed", () => {
  const staleV4Answers = {
    1: "new",
    2: "3-4",
    3: "discomfort",
    4: "unaware_options",
    5: "work",
    6: "comfort",
    7: "home_delivery",
    8: "4"
  };

  assert.equal(normalizeQuizAnswers(staleV4Answers), null);
  assert.equal(hasCompleteCurrentQuizAnswers(staleV4Answers), false);
});

test("rejects missing and invalid current answers", () => {
  assert.equal(normalizeQuizAnswers({ ...currentAnswers, 9: undefined }), null);
  assert.equal(normalizeQuizAnswers({ ...currentAnswers, 2: "3-4" }), null);
});
