import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { POST as submitPost } from "../app/api/submit/route";
import { getLeadPayloadVariants, getQuizPayloadVariants } from "../lib/quiz-persistence";
import {
  hasCompleteCurrentQuizAnswers,
  isGrantedConsent,
  normalizeQuizAnswers
} from "../lib/quiz-validation";
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
  assert.deepEqual(normalizeQuizAnswers(currentAnswers), currentAnswers);
  assert.equal(hasCompleteCurrentQuizAnswers(currentAnswers), true);
  assert.equal(
    hasCompleteCurrentQuizAnswers({
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
  assert.equal(normalizeQuizAnswers({ ...currentAnswers, 2: "3-4" }), null);
});

test("current-schema answers produce the expected profile", () => {
  assert.equal(getProfile(currentAnswers), "C");
});

test("stale v4 answer maps are rejected instead of remapped under v5.1 ids", () => {
  const staleV4Answers = {
    1: "veteran",
    2: "3-4",
    3: "discomfort",
    4: "happy",
    5: "work",
    6: "comfort",
    7: "collect",
    8: "5"
  };

  assert.equal(normalizeQuizAnswers(staleV4Answers), null);
  // Without validation, missing q9 would collapse a satisfied/happy user into profile A.
  assert.equal(getProfile(staleV4Answers as Record<number, string>), "A");
});

test("JSON round-tripped answers (string keys from sessionStorage/fetch) still validate", () => {
  const parsed = JSON.parse(JSON.stringify(currentAnswers)) as unknown;
  assert.deepEqual(normalizeQuizAnswers(parsed), currentAnswers);
});

test("spreading answers with a stale selectedAnswer does not apply a last-click change", () => {
  const answers = { ...currentAnswers, 9: "3" };
  const selectedAnswer = answers[9];
  const lastClick = "5";
  // This is the no-op the quiz page used to do on "See My Results".
  assert.deepEqual({ ...answers, 9: selectedAnswer }, answers);
  assert.notEqual(selectedAnswer, lastClick);
  assert.equal(getProfile({ ...answers, 9: lastClick }), "C");
  assert.equal(getProfile(answers), "B");
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

test("only exact boolean true counts as granted consent", () => {
  assert.equal(isGrantedConsent(true), true);
  assert.equal(isGrantedConsent(false), false);
  assert.equal(isGrantedConsent("false"), false);
  assert.equal(isGrantedConsent("true"), false);
  assert.equal(isGrantedConsent(1), false);
  assert.equal(isGrantedConsent(null), false);
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

const validContact = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "07123456789",
  currentProvider: "Fittleworth",
  guideConsent: false,
  referralConsent: true,
  answers: currentAnswers
};

function submitRequest(body: unknown) {
  return new NextRequest("http://localhost/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

test("submit rejects string false referral consent before any insert", async () => {
  const response = await submitPost(submitRequest({ ...validContact, referralConsent: "false" }));
  assert.equal(response.status, 400);
  const body = (await response.json()) as { error?: string };
  assert.match(body.error ?? "", /required/i);
});

test("submit rejects stale v4 answers before any insert", async () => {
  const response = await submitPost(
    submitRequest({
      ...validContact,
      answers: {
        1: "veteran",
        2: "3-4",
        3: "discomfort",
        4: "happy",
        5: "work",
        6: "comfort",
        7: "collect",
        8: "5"
      }
    })
  );
  assert.equal(response.status, 400);
  const body = (await response.json()) as { error?: string };
  assert.match(body.error ?? "", /complete the current quiz/i);
});

test("submit with a complete valid payload reaches the insert path", async () => {
  const response = await submitPost(submitRequest(validContact));
  // This environment has no Supabase credentials, so insert fails after validation.
  assert.equal(response.status, 500);
  const body = (await response.json()) as { error?: string };
  assert.match(body.error ?? "", /Lead insert failed|Missing Supabase/i);
});
