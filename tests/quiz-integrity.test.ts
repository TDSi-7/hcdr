import assert from "node:assert/strict";
import test from "node:test";
import { getLeadPayloadVariants, getQuizPayloadVariants } from "../lib/quiz-persistence";
import { isCompleteQuizAnswers } from "../lib/quiz-validation";
import { getProfile } from "../lib/result-logic";

const currentAnswers = {
  1: "veteran",
  2: "isc",
  3: "3-4",
  4: "discomfort",
  5: "happy",
  6: "work",
  7: "comfort",
  8: "collect",
  9: "5"
};

test("accepts only complete answers from the current nine-question schema", () => {
  assert.equal(isCompleteQuizAnswers(currentAnswers), true);
  assert.equal(
    isCompleteQuizAnswers({
      1: "veteran",
      2: "3-4",
      3: "discomfort",
      4: "happy",
      5: "work",
      6: "comfort",
      7: "collect",
      8: "5"
    }),
    false
  );
  assert.equal(isCompleteQuizAnswers({ ...currentAnswers, 2: "3-4" }), false);
});

test("current-schema answers produce the expected profile", () => {
  assert.equal(getProfile(currentAnswers), "C");
});

test("lead fallbacks retain all required quiz and consent data", () => {
  const payload = {
    source: "results_top",
    catheter_type: "Intermittent catheter (ISC)",
    session_id: "session",
    current_provider: "Provider",
    result_profile: "C",
    guide_consent: false,
    referral_consent: true,
    ...Object.fromEntries(Array.from({ length: 9 }, (_, index) => [`q${index + 1}`, `answer-${index + 1}`]))
  };

  for (const variant of getLeadPayloadVariants(payload)) {
    for (let question = 1; question <= 9; question += 1) {
      assert.equal(variant[`q${question}`], `answer-${question}`);
    }
    assert.equal(variant.current_provider, "Provider");
    assert.equal(variant.result_profile, "C");
    assert.equal(variant.guide_consent, false);
    assert.equal(variant.referral_consent, true);
  }
});

test("quiz capture fallbacks never strip current answers", () => {
  const payload = {
    event_type: "results_viewed",
    session_id: "session",
    ...Object.fromEntries(Array.from({ length: 9 }, (_, index) => [`q${index + 1}`, `answer-${index + 1}`]))
  };

  for (const variant of getQuizPayloadVariants(payload)) {
    for (let question = 1; question <= 9; question += 1) {
      assert.equal(variant[`q${question}`], `answer-${question}`);
    }
  }
});
