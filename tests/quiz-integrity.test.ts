import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { NextRequest } from "next/server";
import { POST as submitPost } from "../app/api/submit/route";
import { POST as trackPost } from "../app/api/track/route";
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

test("accepts only complete answers from the current nine-question schema", () => {
  assert.deepEqual(normalizeQuizAnswers(currentAnswers), currentAnswers);
  assert.equal(hasCompleteCurrentQuizAnswers(currentAnswers), true);
  assert.equal(hasCompleteCurrentQuizAnswers(staleV4Answers), false);
  assert.equal(normalizeQuizAnswers({ ...currentAnswers, 2: "3-4" }), null);
});

test("current-schema answers produce the expected profile", () => {
  assert.equal(getProfile(currentAnswers), "C");
});

test("stale v4 answer maps are rejected instead of scored under v5.1 ids", () => {
  assert.equal(normalizeQuizAnswers(staleV4Answers), null);
  // v5.1 reads satisfaction from q9 and choice awareness from q5.
  // A pre-v5.1 map stores satisfaction on q8 and "happy" on q4, with q5 = "work".
  assert.equal(getProfile(staleV4Answers as Record<number, string>), "A");
});

test("JSON round-tripped answers still validate", () => {
  const parsed = JSON.parse(JSON.stringify(currentAnswers)) as unknown;
  assert.deepEqual(normalizeQuizAnswers(parsed), currentAnswers);
});

test("lead fallbacks keep quiz answers, profile, provider, and consent when optional columns are dropped", () => {
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

  const variants = getLeadPayloadVariants(payload);
  assert.equal(variants.length, 4);
  assert.equal("catheter_type" in variants[2], false);
  assert.equal(variants[2].q9, "answer-9");

  for (const variant of variants) {
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
  answers: currentAnswers,
  profile: "A"
};

function submitRequest(body: unknown) {
  return new NextRequest("http://localhost/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

const supabaseEnv = {
  SUPABASE_URL: "https://example-project.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "test-key"
};

function useSupabaseEnv() {
  const previous = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
  };
  process.env.SUPABASE_URL = supabaseEnv.SUPABASE_URL;
  process.env.SUPABASE_SERVICE_ROLE_KEY = supabaseEnv.SUPABASE_SERVICE_ROLE_KEY;
  return () => {
    for (const key of Object.keys(previous) as Array<keyof typeof previous>) {
      if (previous[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = previous[key];
      }
    }
  };
}

describe("submit and track routes", { concurrency: 1 }, () => {
  test("submit rejects string false referral consent before any insert", async () => {
    const response = await submitPost(submitRequest({ ...validContact, referralConsent: "false" }));
    assert.equal(response.status, 400);
    const body = (await response.json()) as { error?: string };
    assert.match(body.error ?? "", /required/i);
  });

  test("submit rejects stale v4 answers before any insert", async () => {
    const response = await submitPost(submitRequest({ ...validContact, answers: staleV4Answers }));
    assert.equal(response.status, 400);
    const body = (await response.json()) as { error?: string };
    assert.match(body.error ?? "", /complete the current quiz/i);
  });

  test("submit ignores a client-supplied profile and still requires a server insert", async () => {
    const response = await submitPost(submitRequest(validContact));
    assert.equal(response.status, 500);
    const body = (await response.json()) as { error?: string };
    assert.match(body.error ?? "", /Lead insert failed|Missing Supabase/i);
    assert.doesNotMatch(body.error ?? "", /sowufofobpspqmjviehl/);
  });

  test("a missing catheter_type column retries without dropping q9 or consent", async () => {
    const restore = useSupabaseEnv();
    const originalFetch = global.fetch;
    const attempts: Array<Record<string, unknown>> = [];
    global.fetch = async (_url, init) => {
      const payload = JSON.parse(String(init?.body)) as Record<string, unknown>;
      attempts.push(payload);
      if ("catheter_type" in payload || !("q9" in payload)) {
        return new Response(JSON.stringify({ message: "column missing" }), { status: 400 });
      }
      return new Response(null, { status: 201 });
    };

    try {
      const response = await submitPost(
        submitRequest({ ...validContact, guideConsent: "false", profile: "A" })
      );
      assert.equal(response.status, 200);
      const saved = attempts.at(-1);
      assert.ok(saved);
      assert.equal("catheter_type" in saved, false);
      assert.equal(saved.result_profile, "C");
      assert.equal(saved.guide_consent, false);
      assert.equal(saved.referral_consent, true);
      assert.match(String(saved.q9), /Very satisfied/);
      assert.match(String(saved.q5), /happy with what I use/);
    } finally {
      global.fetch = originalFetch;
      restore();
    }
  });

  test("invalid results_viewed answers do not create an answer-less completion row", async () => {
    const restore = useSupabaseEnv();
    const originalFetch = global.fetch;
    const attempts: Array<Record<string, unknown>> = [];
    global.fetch = async (_url, init) => {
      attempts.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
      return new Response(null, { status: 201 });
    };

    try {
      const response = await trackPost(
        new NextRequest("http://localhost/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "session-1",
            eventType: "results_viewed",
            profile: "C",
            answers: staleV4Answers
          })
        })
      );
      assert.equal(response.status, 200);
      assert.equal(attempts.length, 1);
      assert.equal(attempts[0].event_type, "results_viewed");
      assert.equal(attempts[0].profile, null);
      assert.equal("q1" in attempts[0], false);
      assert.equal("q9" in attempts[0], false);
    } finally {
      global.fetch = originalFetch;
      restore();
    }
  });

  test("quiz completion fallback keeps every answer", async () => {
    const restore = useSupabaseEnv();
    const originalFetch = global.fetch;
    const quizAttempts: Array<Record<string, unknown>> = [];
    global.fetch = async (url, init) => {
      const payload = JSON.parse(String(init?.body)) as Record<string, unknown>;
      const table = String(url).split("/rest/v1/")[1] ?? "";
      if (table === "quiz_events") {
        return new Response(null, { status: 201 });
      }
      quizAttempts.push(payload);
      for (let question = 1; question <= 9; question += 1) {
        if (!(`q${question}` in payload)) {
          return new Response(JSON.stringify({ message: "answers required" }), { status: 400 });
        }
      }
      return new Response(null, { status: 201 });
    };

    try {
      const response = await trackPost(
        new NextRequest("http://localhost/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "session-1",
            eventType: "results_viewed",
            profile: "A",
            answers: currentAnswers
          })
        })
      );
      assert.equal(response.status, 200);
      assert.equal(quizAttempts.length, 1);
      assert.equal(quizAttempts[0].q5, "happy");
      assert.equal(quizAttempts[0].q9, "5");
    } finally {
      global.fetch = originalFetch;
      restore();
    }
  });
});
